
import sqlite3

DATABASE = "mediscan.db"


def migrate_database():
    conn = sqlite3.connect(DATABASE)

    try:
        cursor = conn.cursor()

        # Create the permanent patient registry.
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id TEXT UNIQUE,
                patient_name TEXT NOT NULL,
                date_of_birth TEXT NOT NULL,
                gender TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Add patient_id to existing tables.
        # Existing records remain unassigned.
        tables = ["scans", "history", "reports"]

        for table in tables:
            columns = [
                row[1]
                for row in cursor.execute(
                    f"PRAGMA table_info({table})"
                ).fetchall()
            ]

            if "patient_id" not in columns:
                cursor.execute(
                    f"ALTER TABLE {table} ADD COLUMN patient_id TEXT"
                )
                print(f"Added patient_id to {table}")

        # Make patient lookups faster.
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_scans_patient_id
            ON scans(patient_id)
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_history_patient_id
            ON history(patient_id)
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_reports_patient_id
            ON reports(patient_id)
        """)

        conn.commit()

        print("\nPatient database migration completed.")

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


if __name__ == "__main__":
    migrate_database()
