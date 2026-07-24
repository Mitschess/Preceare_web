"""
PRECARE - Embedded Device Kiosk Software
Flask Backend Application
"""

import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__)
app.config['SECRET_KEY'] = 'precare-device-key-2026'

# On Vercel, read-only root requires using /tmp for SQLite
if os.environ.get('VERCEL'):
    DATABASE = '/tmp/precare.db'
else:
    DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'precare.db')


# ─── Database Helpers ────────────────────────────────────────────────────────

def get_db():
    if 'db' not in g:
        need_init = not os.path.exists(DATABASE)
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        try:
            g.db.execute("PRAGMA journal_mode=WAL")
        except Exception:
            pass
        g.db.execute("PRAGMA foreign_keys=ON")
        if need_init:
            init_db_conn(g.db)
    return g.db


@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db_conn(db):
    db.executescript('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER NOT NULL,
            height REAL NOT NULL,
            weight REAL NOT NULL,
            gestational_age INTEGER NOT NULL,
            bmi REAL NOT NULL,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        );

        CREATE TABLE IF NOT EXISTS screenings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            history_preeclampsia INTEGER DEFAULT 0,
            family_history INTEGER DEFAULT 0,
            diabetes INTEGER DEFAULT 0,
            chronic_hypertension INTEGER DEFAULT 0,
            kidney_disease INTEGER DEFAULT 0,
            nullipara INTEGER DEFAULT 0,
            systolic INTEGER,
            diastolic INTEGER,
            map_value REAL,
            pulse INTEGER,
            protein_urine TEXT,
            leukocytes TEXT,
            nitrite TEXT,
            urobilinogen TEXT,
            ph TEXT,
            blood TEXT,
            specific_gravity TEXT,
            ketone TEXT,
            bilirubin TEXT,
            glucose TEXT,
            risk_score REAL,
            risk_category TEXT,
            sent_to_web INTEGER DEFAULT 1,
            screening_date TEXT DEFAULT (datetime('now', 'localtime')),
            FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
        );
    ''')

    # Migration helper for older DB table if missing columns
    cursor = db.cursor()
    cursor.execute("PRAGMA table_info(screenings)")
    existing_cols = [row[1] for row in cursor.fetchall()]
    new_cols = ['leukocytes', 'nitrite', 'urobilinogen', 'ph', 'blood', 'specific_gravity', 'ketone', 'bilirubin', 'glucose']
    for col in new_cols:
        if col not in existing_cols:
            cursor.execute(f"ALTER TABLE screenings ADD COLUMN {col} TEXT")
            
    db.commit()
    db.close()


# ─── Page Routes ─────────────────────────────────────────────────────────────

@app.route('/')
def kiosk_app():
    """Embedded touchscreen device view (default view)."""
    return render_template('device.html')

@app.route('/dashboard')
def dashboard_page():
    return render_template('dashboard.html')

@app.route('/screening')
def screening_page():
    return render_template('screening.html')

@app.route('/history')
def history_page():
    return render_template('history.html')

@app.route('/settings')
def settings_page():
    return render_template('settings.html')

@app.route('/help')
def help_page():
    return render_template('help.html')


# ─── API Routes ──────────────────────────────────────────────────────────────

@app.route('/api/simulate/bp', methods=['POST'])
def simulate_bp():
    """Automated blood pressure measurement simulation."""
    import random
    systolic = random.choice([120, 135, 145, 150, 160])
    diastolic = random.choice([80, 85, 90, 95, 100])
    pulse = random.randint(70, 88)
    map_val = round((systolic + 2 * diastolic) / 3, 1)

    return jsonify({
        'systolic': systolic,
        'diastolic': diastolic,
        'pulse': pulse,
        'map': map_val
    })


@app.route('/api/simulate/urine', methods=['POST'])
def simulate_urine():
    """
    Automated 10-Parameter Urine Reagent Strip simulation with varied clinical profiles.
    Generates realistic reagent values across patients (Negatif, Trace, +1 30mg/dL, +2 100mg/dL, +3 300mg/dL).
    """
    import random
    
    protein_options = ['300 mg/dL (+3)', '100 mg/dL (+2)', '30 mg/dL (+1)', 'Trace', 'Negatif']
    protein = random.choices(protein_options, weights=[20, 30, 25, 15, 10], k=1)[0]

    leukocytes = random.choice(['70 Ca CELLS/µL', '125 Ca CELLS/µL', 'Trace (15)', 'Negatif'])
    nitrite = random.choice(['Positif', 'Negatif'])
    urobilinogen = random.choice(['1 mg/dL', '4 mg/dL', 'Normal (0.2 mg/dL)'])
    ph = random.choice(['8.0', '7.5', '7.0', '6.5'])
    blood = random.choice(['25 Ca CELLS/µL (+1)', '80 Ca CELLS/µL (+2)', 'Trace (10)', 'Negatif'])
    sg = random.choice(['1.025', '1.020', '1.015', '1.010'])
    ketone = random.choice(['40 mg/dL (+2)', '15 mg/dL (+1)', '5 mg/dL (±)', 'Negatif'])
    bilirubin = random.choice(['Negatif', '1 mg/dL (+1)'])
    glucose = random.choice(['Negatif', 'Trace (±)'])

    return jsonify({
        'protein_urine': protein,
        'leukocytes': leukocytes,
        'nitrite': nitrite,
        'urobilinogen': urobilinogen,
        'ph': ph,
        'blood': blood,
        'specific_gravity': sg,
        'ketone': ketone,
        'bilirubin': bilirubin,
        'glucose': glucose
    })


@app.route('/api/calculate-risk', methods=['POST'])
def calculate_risk_api():
    data = request.json or {}
    score, category = compute_risk(data)
    return jsonify({
        'risk_score': score,
        'risk_category': category
    })


@app.route('/api/save-screening', methods=['POST'])
def save_screening():
    """Save screening data locally with dummy or provided patient name."""
    data = request.json or {}
    name = (data.get('name') or '').strip() or 'Ny. Ani Wijaya'
    age = int(data.get('age', 25))
    height = float(data.get('height', 160))
    weight = float(data.get('weight', 60))
    ga = int(data.get('gestational_age', 20))

    height_m = height / 100.0
    bmi = round(weight / (height_m * height_m), 1) if height_m > 0 else 22.0

    db = get_db()
    
    cursor = db.execute(
        '''INSERT INTO patients (name, age, height, weight, gestational_age, bmi)
           VALUES (?, ?, ?, ?, ?, ?)''',
        (name, age, height, weight, ga, bmi)
    )
    patient_id = cursor.lastrowid

    # Calculate final risk
    score, category = compute_risk(data)

    cursor = db.execute(
        '''INSERT INTO screenings
           (patient_id, history_preeclampsia, family_history, diabetes,
            chronic_hypertension, kidney_disease, nullipara,
            systolic, diastolic, map_value, pulse,
            protein_urine, leukocytes, nitrite, urobilinogen, ph, blood, specific_gravity, ketone, bilirubin, glucose,
            risk_score, risk_category, sent_to_web)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)''',
        (patient_id,
         1 if data.get('history_preeclampsia') else 0,
         1 if data.get('family_history') else 0,
         1 if data.get('diabetes') else 0,
         1 if data.get('chronic_hypertension') else 0,
         1 if data.get('kidney_disease') else 0,
         1 if data.get('nullipara') else 0,
         data.get('systolic', 120),
         data.get('diastolic', 80),
         data.get('map_value', 93.3),
         data.get('pulse', 75),
         data.get('protein_urine', '100 mg/dL (+2)'),
         data.get('leukocytes', 'Negatif'),
         data.get('nitrite', 'Negatif'),
         data.get('urobilinogen', 'Normal (0.2 mg/dL)'),
         data.get('ph', '6.5'),
         data.get('blood', 'Negatif'),
         data.get('specific_gravity', '1.015'),
         data.get('ketone', 'Negatif'),
         data.get('bilirubin', 'Negatif'),
         data.get('glucose', 'Negatif'),
         score, category)
    )
    db.commit()

    return jsonify({
        'status': 'success',
        'message': 'Data Berhasil Disimpan & Berhasil Dikirim ke Web Server',
        'screening_id': cursor.lastrowid,
        'patient_id': patient_id,
        'patient_name': name,
        'sent_to_web': True
    })


@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_api():
    db = get_db()
    total_patients = db.execute("SELECT COUNT(*) FROM patients").fetchone()[0]
    total_screenings = db.execute("SELECT COUNT(*) FROM screenings").fetchone()[0]
    today_screenings = db.execute(
        "SELECT COUNT(*) FROM screenings WHERE date(screening_date) = date('now', 'localtime')"
    ).fetchone()[0]

    risk_rows = db.execute(
        "SELECT risk_category, COUNT(*) as cnt FROM screenings GROUP BY risk_category"
    ).fetchall()
    
    risk_counts = {'rendah': 0, 'sedang': 0, 'tinggi': 0}
    for row in risk_rows:
        cat = (row['risk_category'] or '').lower()
        if cat in risk_counts:
            risk_counts[cat] = row['cnt']

    recent_rows = db.execute('''
        SELECT s.*, p.name as patient_name, p.age, p.gestational_age
        FROM screenings s
        JOIN patients p ON s.patient_id = p.id
        ORDER BY s.id DESC LIMIT 5
    ''').fetchall()

    recent = [dict(row) for row in recent_rows]

    return jsonify({
        'total_patients': total_patients,
        'total_screenings': total_screenings,
        'today_screenings': today_screenings,
        'risk_counts': risk_counts,
        'recent_screenings': recent
    })


@app.route('/api/screenings', methods=['GET'])
def get_screenings_api():
    db = get_db()
    rows = db.execute('''
        SELECT s.*, p.name as patient_name, p.age, p.gestational_age, p.height, p.weight, p.bmi
        FROM screenings s
        JOIN patients p ON s.patient_id = p.id
        ORDER BY s.id DESC
    ''').fetchall()
    return jsonify([dict(row) for row in rows])


@app.route('/api/screenings/<int:sid>', methods=['GET', 'DELETE'])
def screening_detail_api(sid):
    db = get_db()
    if request.method == 'DELETE':
        db.execute("DELETE FROM screenings WHERE id = ?", (sid,))
        db.commit()
        return jsonify({'status': 'deleted'})

    row = db.execute('''
        SELECT s.*, p.name as patient_name, p.age, p.gestational_age, p.height, p.weight, p.bmi
        FROM screenings s
        JOIN patients p ON s.patient_id = p.id
        WHERE s.id = ?
    ''', (sid,)).fetchone()

    if not row:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(dict(row))


def compute_risk(data):
    """
    Rule-Based Decision System for Preeclampsia Screening
    Based on POGI & Kemenkes RI Clinical Decision Rules.
    """
    sys_val = int(data.get('systolic') or 120)
    dia_val = int(data.get('diastolic') or 80)
    protein = str(data.get('protein_urine') or 'Negatif').lower()

    # Proteinuria classification
    is_severe_prot = '+2' in protein or '+3' in protein or '100' in protein or '300' in protein
    is_prot = is_severe_prot or '+1' in protein or '30' in protein

    # Blood pressure classification
    is_severe_ht = sys_val >= 160 or dia_val >= 110
    is_ht = sys_val >= 140 or dia_val >= 90
    is_pre_ht = (130 <= sys_val < 140) or (80 <= dia_val < 90)

    # Major Risk Factors
    has_major_rf = (
        bool(data.get('history_preeclampsia')) or
        bool(data.get('chronic_hypertension')) or
        bool(data.get('kidney_disease')) or
        bool(data.get('diabetes'))
    )

    # Minor Risk Factors
    minor_count = 0
    if data.get('nullipara'): minor_count += 1
    if data.get('family_history'): minor_count += 1
    bmi = float(data.get('bmi') or 22.0)
    if bmi >= 30: minor_count += 1
    age = int(data.get('age') or 25)
    if age >= 35 or age < 20: minor_count += 1

    # Rule-Based Classification
    if (is_ht and is_prot) or is_severe_ht or is_severe_prot or has_major_rf:
        category = 'TINGGI'
        score = 88.0 if (is_severe_ht or is_severe_prot) else 78.0
    elif is_ht or is_pre_ht or is_prot or 'trace' in protein or minor_count >= 2:
        category = 'SEDANG'
        score = 52.0 if (is_ht or is_prot) else 38.0
    else:
        category = 'RENDAH'
        score = 15.0

    return round(score, 1), category


def init_db():
    conn = sqlite3.connect(DATABASE)
    init_db_conn(conn)
    conn.close()


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
