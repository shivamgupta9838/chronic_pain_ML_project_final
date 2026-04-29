from __future__ import annotations

from collections import Counter
from functools import lru_cache

import joblib
import numpy as np
import pandas as pd
from flask import current_app


RAW_FEATURE_COLUMNS = ["acc_x", "acc_y", "acc_z", "eda", "bvp", "hr", "temp"]


class PredictionError(Exception):
    pass


def engineer_features(data: pd.DataFrame) -> pd.DataFrame:
    df_fe = data.copy()
    df_fe["acc_magnitude"] = np.sqrt(df_fe["acc_x"] ** 2 + df_fe["acc_y"] ** 2 + df_fe["acc_z"] ** 2)
    df_fe["stress_index"] = df_fe["eda"] * df_fe["hr"]
    df_fe["temp_delta"] = np.abs(df_fe["temp"] - df_fe["temp"].mean())
    return df_fe


@lru_cache(maxsize=1)
def load_model_bundle(model_path: str):
    return joblib.load(model_path)


def predict_pain_from_csv(file_path: str) -> dict:
    df = pd.read_csv(file_path)

    missing_columns = [column for column in RAW_FEATURE_COLUMNS if column not in df.columns]
    if missing_columns:
        raise PredictionError(
            f"CSV is missing required columns: {', '.join(missing_columns)}"
        )

    processed_df = engineer_features(df)
    if "person_ID" in processed_df.columns:
        processed_df = processed_df.drop(columns=["person_ID"])
    actual_scores = processed_df["pain_scale"].copy() if "pain_scale" in processed_df.columns else None
    if "pain_scale" in processed_df.columns:
        processed_df = processed_df.drop(columns=["pain_scale"])

    bundle = load_model_bundle(str(current_app.config["MODEL_BUNDLE_PATH"]))
    model = bundle["model"]
    scaler = bundle["scaler"]

    scaled_features = scaler.transform(processed_df)
    predictions = model.predict(scaled_features)

    average_prediction = float(np.mean(predictions))
    prediction_counts = Counter(int(value) for value in predictions.tolist())
    dominant_prediction = prediction_counts.most_common(1)[0][0]
    actual_average = float(actual_scores.mean()) if actual_scores is not None else None

    summary_lines = [
        f"Predicted from {len(predictions)} rows.",
        f"Average predicted pain score: {average_prediction:.2f}",
        f"Dominant predicted pain class: {dominant_prediction}",
    ]

    if actual_average is not None:
        summary_lines.append(f"Actual pain_scale average in file: {actual_average:.2f}")

    return {
        "pain_score": average_prediction,
        "assessment_result": " | ".join(summary_lines),
        "dominant_prediction": dominant_prediction,
        "prediction_counts": dict(sorted(prediction_counts.items())),
        "rows_processed": int(len(predictions)),
        "actual_average": actual_average,
    }
