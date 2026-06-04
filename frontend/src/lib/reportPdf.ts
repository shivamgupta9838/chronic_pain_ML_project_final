import type { PainReport, User } from '@/types';
import { formatPainScore } from '@/lib/formatPainScore';

interface PdfLine {
  text: string;
  size?: number;
  bold?: boolean;
  gapAfter?: number;
  indent?: number;
}

interface PdfPage {
  commands: string[];
}

function sanitizePdfText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text: string, size: number): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return ['-'];
  }

  const maxChars = Math.max(28, Math.floor((96 * 11) / size));
  const words = normalized.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    lines.push(word.slice(0, maxChars));
    currentLine = word.slice(maxChars);
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildPdfBlob(lines: PdfLine[], fileTitle: string): Blob {
  const pageWidth = 595;
  const pageHeight = 842;
  const topMargin = 792;
  const bottomMargin = 52;
  const leftMargin = 48;

  const pages: PdfPage[] = [{ commands: [] }];
  let currentPage = pages[0];
  let y = topMargin;

  const pushLine = (line: string, size: number, bold: boolean, indent: number) => {
    const safeLine = sanitizePdfText(line);
    currentPage.commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${indent} ${y} Tm (${safeLine}) Tj ET`);
    y -= size + 5;
  };

  for (const line of lines) {
    const fontSize = line.size ?? 11;
    const indent = line.indent ?? leftMargin;
    const wrapped = wrapText(line.text, fontSize);

    for (const part of wrapped) {
      if (y < bottomMargin + fontSize + 12) {
        currentPage = { commands: [] };
        pages.push(currentPage);
        y = topMargin;
      }

      pushLine(part, fontSize, line.bold ?? false, indent);
    }

    y -= line.gapAfter ?? 2;
  }

  const objects: string[] = [];
  const encoder = new TextEncoder();

  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  const pageIds: number[] = [];
  const contentIds: number[] = [];

  for (const page of pages) {
    const stream = page.commands.join('\n');
    const streamBytes = encoder.encode(stream);
    const contentId = addObject(`<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream`);
    contentIds.push(contentId);
    pageIds.push(0);
  }

  const pagesId = addObject('');

  for (let index = 0; index < pages.length; index += 1) {
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
        `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> ` +
        `/Contents ${contentIds[index]} 0 R >>`,
    );
    pageIds[index] = pageId;
  }

  objects[pagesId - 1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`;
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${offsets[index].toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info << /Title (${sanitizePdfText(
    fileTitle,
  )}) >> >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([encoder.encode(pdf)], { type: 'application/pdf' });
}

function saveBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getSeverityLabel(score: number | null): string {
  if (score === null) {
    return 'No score available';
  }
  if (score <= 3) {
    return 'Low predicted pain';
  }
  if (score <= 6) {
    return 'Moderate predicted pain';
  }
  return 'High predicted pain';
}

function buildTrendSummary(report: PainReport, allReports: PainReport[]): string {
  const scoredReports = allReports.filter((item) => item.painScore !== null);
  if (report.painScore === null || scoredReports.length === 0) {
    return 'Trend comparison is unavailable because this upload does not include a stored pain score.';
  }

  const averageScore =
    scoredReports.reduce((sum, item) => sum + Number(item.painScore ?? 0), 0) / scoredReports.length;
  const latestScore = Number(scoredReports[0]?.painScore ?? report.painScore);
  const differenceFromAverage = report.painScore - averageScore;
  const differenceFromLatest = report.painScore - latestScore;

  const averageComparison =
    differenceFromAverage > 0.25
      ? 'above'
      : differenceFromAverage < -0.25
        ? 'below'
        : 'in line with';

  const latestComparison =
    differenceFromLatest > 0.25
      ? 'higher than'
      : differenceFromLatest < -0.25
        ? 'lower than'
        : 'similar to';

  return `This upload is ${averageComparison} the patient average and ${latestComparison} the most recent stored score.`;
}

function splitAssessment(assessmentResult: string | null): string[] {
  if (!assessmentResult) {
    return ['No model summary was stored for this upload.'];
  }

  return assessmentResult
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPatientInfo(user: User | null): PdfLine[] {
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown patient';

  return [
    { text: 'Patient Details', size: 14, bold: true, gapAfter: 4 },
    { text: `Name: ${fullName}`, bold: true },
    { text: `Email: ${user?.email ?? 'Not provided'}` },
    { text: `Phone: ${user?.phone?.trim() || 'Not provided'}` },
    { text: `Date of Birth: ${user?.dateOfBirth?.trim() || 'Not provided'}` },
    { text: `Address: ${user?.address?.trim() || 'Not provided'}`, gapAfter: 8 },
  ];
}

export function downloadSingleReportPdf(report: PainReport, allReports: PainReport[], user: User | null): void {
  const scoredReports = allReports.filter((item) => item.painScore !== null);
  const averageScore = scoredReports.length
    ? (scoredReports.reduce((sum, item) => sum + Number(item.painScore ?? 0), 0) / scoredReports.length).toFixed(1)
    : 'N/A';

  const lines: PdfLine[] = [
    { text: 'PainAI Patient Analysis Report', size: 20, bold: true, gapAfter: 6 },
    { text: `Generated on ${formatDate(new Date().toISOString())}`, size: 10, gapAfter: 10 },
    ...buildPatientInfo(user),
    { text: 'Upload Summary', size: 14, bold: true, gapAfter: 4 },
    { text: `Source file: ${report.fileName}`, bold: true },
    { text: `Uploaded at: ${formatDate(report.uploadedAt)}` },
    { text: `Predicted pain score: ${report.painScore !== null ? `${formatPainScore(report.painScore)}/8` : 'Unavailable'}` },
    { text: `Severity band: ${getSeverityLabel(report.painScore)}` },
    { text: `Patient upload count: ${allReports.length}` },
    { text: `Patient average score: ${averageScore}`, gapAfter: 8 },
    { text: 'Model Analysis', size: 14, bold: true, gapAfter: 4 },
    ...splitAssessment(report.assessmentResult).map((item) => ({
      text: `- ${item}`,
      indent: 58,
    })),
    { text: '', gapAfter: 6 },
    { text: 'Clinical Context', size: 14, bold: true, gapAfter: 4 },
    {
      text:
        report.painScore !== null
          ? `This upload indicates ${getSeverityLabel(report.painScore).toLowerCase()} for the submitted wearable dataset. ${buildTrendSummary(
              report,
              allReports,
            )}`
          : 'A numeric prediction was not stored for this upload, so only the metadata and model notes are included.',
      gapAfter: 8,
    },
    { text: 'History Snapshot', size: 14, bold: true, gapAfter: 4 },
    ...allReports.slice(0, 10).map((item, index) => ({
      text: `${index + 1}. ${formatDate(item.uploadedAt)} | ${item.fileName} | ${item.painScore !== null ? `${formatPainScore(item.painScore)}/8` : 'No score'}`,
      indent: 58,
    })),
  ];

  const blob = buildPdfBlob(lines, `PainAI Report ${report.fileName}`);
  const pdfName = report.fileName.replace(/\.csv$/i, '') || 'pain-report';
  saveBlob(blob, `${pdfName}-analysis.pdf`);
}

export function downloadAllReportsPdf(reports: PainReport[], user: User | null): void {
  const scoredReports = reports.filter((report) => report.painScore !== null);
  const averageScore = scoredReports.length
    ? (scoredReports.reduce((sum, item) => sum + Number(item.painScore ?? 0), 0) / scoredReports.length).toFixed(1)
    : 'N/A';

  const lines: PdfLine[] = [
    { text: 'PainAI Patient Upload Summary', size: 20, bold: true, gapAfter: 6 },
    { text: `Generated on ${formatDate(new Date().toISOString())}`, size: 10, gapAfter: 10 },
    ...buildPatientInfo(user),
    { text: 'Patient Overview', size: 14, bold: true, gapAfter: 4 },
    { text: `Total uploads: ${reports.length}` },
    { text: `Uploads with score: ${scoredReports.length}` },
    { text: `Average predicted score: ${averageScore}` },
    {
      text: `Latest upload: ${reports[0] ? `${reports[0].fileName} on ${formatDate(reports[0].uploadedAt)}` : 'No uploads available'}`,
      gapAfter: 8,
    },
    { text: 'Upload Analyses', size: 14, bold: true, gapAfter: 4 },
  ];

  for (const [index, report] of reports.entries()) {
    lines.push({ text: `${index + 1}. ${report.fileName}`, size: 12, bold: true, gapAfter: 2 });
    lines.push({ text: `Uploaded at: ${formatDate(report.uploadedAt)}`, indent: 58 });
    lines.push({
      text: `Predicted pain score: ${report.painScore !== null ? `${formatPainScore(report.painScore)}/8` : 'Unavailable'}`,
      indent: 58,
    });
    lines.push({ text: `Severity band: ${getSeverityLabel(report.painScore)}`, indent: 58 });

    for (const summary of splitAssessment(report.assessmentResult)) {
      lines.push({ text: `- ${summary}`, indent: 70 });
    }

    lines.push({ text: '', gapAfter: 6 });
  }

  const blob = buildPdfBlob(lines, 'PainAI Patient Upload Summary');
  saveBlob(blob, 'painai-upload-summary.pdf');
}
