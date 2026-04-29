# Flask Backend

This backend provides:

- email/password registration and login
- Google login using a Google `id_token`
- MySQL persistence with two tables: `users` and `reports`
- CSV upload and report storage grouped by user and upload date
- model-driven pain-score prediction from `pain_prediction_model.joblib`
- JWT-protected API routes for profile and report actions

## Folder structure

- `app/` Flask application package
- `storage/uploads/` uploaded CSV files
- `run.py` local entry point

Uploaded files are stored like this:

`storage/uploads/user_<user_id>/YYYY/MM/DD/<generated-file>.csv`

## Setup

1. Create a MySQL database named `pain_assessment`.
2. Create a virtual environment and install dependencies.
3. Copy `.env.example` values into your environment.
4. Install all requirements from `requirements.txt`.
5. Run `flask --app run.py init-db`
6. Run `python run.py`

## Model inference

The upload endpoint loads the trained model bundle from:

`prediction model/pain_prediction_model.joblib`

It applies the same feature engineering used in `Chronic_pain_prediction.ipynb`:

- `acc_magnitude`
- `stress_index`
- `temp_delta`

Then it predicts pain on each row and stores the average predicted pain score in the `reports` table.

## API summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/change-password`

### Reports

- `POST /api/reports`
- `GET /api/reports`
- `GET /api/reports/<id>`
- `GET /api/reports/<id>/download`
- `DELETE /api/reports/<id>`

## Sample requests

### Register

```json
{
  "first_name": "Asha",
  "last_name": "Patel",
  "email": "asha@example.com",
  "password": "StrongPass123"
}
```

### Email login

```json
{
  "email": "asha@example.com",
  "password": "StrongPass123"
}
```

### Google login

Send the Google Identity Services `credential` token to:

```json
{
  "id_token": "<google-id-token>"
}
```

### Upload report

Use `multipart/form-data` with only:

- `file`: CSV file

Required CSV columns:

- `person_ID`
- `acc_x`
- `acc_y`
- `acc_z`
- `eda`
- `bvp`
- `hr`
- `temp`

If `pain_scale` is present in the uploaded file, it is ignored for prediction but may be included in the stored assessment summary for comparison.
