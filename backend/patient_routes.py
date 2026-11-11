
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import date
import sqlite3
import uuid
import os

router = APIRouter(prefix="/patients", tags=["Patients"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "mediscan.db")


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


class PatientCreate(BaseModel):
    patient_name: str
    date_of_birth: date
    gender: str


def calculate_age(date_of_birth):
    today = date.today()

    return (
        today.year
        - date_of_birth.year
        - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
    )


@router.post("/register")
def register_patient(patient: PatientCreate):
    name = patient.patient_name.strip()
    gender = patient.gender.strip().capitalize()

    if not name:
        raise HTTPException(status_code=400, detail="Patient name is required.")

    if patient.date_of_birth > date.today():
        raise HTTPException(
            status_code=400,
            detail="Date of birth cannot be in the future."
        )

    if gender not in ["Male", "Female", "Other"]:
        raise HTTPException(status_code=400, detail="Invalid gender.")

    conn = get_connection()

    try:
        # Generate a unique permanent ID.
        while True:
            patient_id = "MSP-" + uuid.uuid4().hex[:10].upper()

            existing = conn.execute(
                "SELECT id FROM patients WHERE patient_id = ?",
                (patient_id,)
            ).fetchone()

            if existing is None:
                break

        conn.execute("""
            INSERT INTO patients (
                patient_id,
                patient_name,
                date_of_birth,
                gender
            )
            VALUES (?, ?, ?, ?)
        """, (
            patient_id,
            name,
            patient.date_of_birth.isoformat(),
            gender
        ))

        conn.commit()

        return {
            "message": "Patient registered successfully.",
            "patient_id": patient_id,
            "patient_name": name,
            "date_of_birth": patient.date_of_birth.isoformat(),
            "gender": gender,
            "age": calculate_age(patient.date_of_birth)
        }

    except sqlite3.IntegrityError:
        conn.rollback()
        raise HTTPException(
            status_code=409,
            detail="Patient ID conflict. Please try again."
        )

    finally:
        conn.close()


@router.get("/{patient_id}")
def get_patient(patient_id: str):
    conn = get_connection()

    try:
        patient = conn.execute("""
            SELECT patient_id, patient_name, date_of_birth, gender
            FROM patients
            WHERE patient_id = ?
        """, (patient_id.strip().upper(),)).fetchone()

        if patient is None:
            raise HTTPException(
                status_code=404,
                detail="Patient ID not found."
            )

        dob = date.fromisoformat(patient["date_of_birth"])

        return {
            "patient_id": patient["patient_id"],
            "patient_name": patient["patient_name"],
            "date_of_birth": patient["date_of_birth"],
            "gender": patient["gender"],
            "age": calculate_age(dob)
        }

    finally:
        conn.close()
