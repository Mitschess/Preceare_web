/**
 * PRECARE - Screening Wizard Logic
 */

let currentStep = 1;
let screeningState = {
  name: 'Ny. Ani Wijaya',
  age: 28,
  height: 158,
  weight: 68,
  gestational_age: 26,
  bmi: 27.2,
  // Risk factors
  history_preeclampsia: 0,
  family_history: 0,
  diabetes: 0,
  chronic_hypertension: 0,
  kidney_disease: 0,
  nullipara: 1,
  // BP
  systolic: 150,
  diastolic: 95,
  pulse: 78,
  map_value: 113.3,
  // 10 Urinalysis Parameters
  protein_urine: 'Trace',
  leukocytes: '70 Ca CELLS/µL',
  nitrite: 'Positif',
  urobilinogen: '1 mg/dL',
  ph: '8.0',
  blood: '25 Ca CELLS/µL (+1)',
  specific_gravity: '1.025',
  ketone: '40 mg/dL (+2)',
  bilirubin: 'Negatif',
  glucose: 'Negatif',
  // Result
  risk_score: 55,
  risk_category: 'TINGGI'
};

document.addEventListener('DOMContentLoaded', () => {
  initPatientForm();
});

function initPatientForm() {
  const heightInput = document.getElementById('patient-height');
  const weightInput = document.getElementById('patient-weight');

  if (heightInput && weightInput) {
    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
  }
}

function calculateBMI() {
  const h = parseFloat(document.getElementById('patient-height').value) || 0;
  const w = parseFloat(document.getElementById('patient-weight').value) || 0;
  const bmiValElem = document.getElementById('bmi-value');
  const bmiCatElem = document.getElementById('bmi-category');

  if (h > 0 && w > 0) {
    const heightM = h / 100;
    const bmi = (w / (heightM * heightM)).toFixed(1);
    screeningState.bmi = parseFloat(bmi);
    bmiValElem.textContent = bmi;

    let cat = '';
    if (bmi < 18.5) cat = 'Underweight';
    else if (bmi < 25) cat = 'Normal';
    else if (bmi < 30) cat = 'Overweight';
    else cat = 'Obese';

    bmiCatElem.textContent = cat;
  } else {
    screeningState.bmi = 0;
    bmiValElem.textContent = '--';
    bmiCatElem.textContent = '';
  }
}

// Risk factor toggle button
function toggleRiskFactor(btn, key) {
  const parent = btn.parentElement;
  const btns = parent.querySelectorAll('.toggle-btn');
  btns.forEach(b => b.classList.remove('active'));

  btn.classList.add('active');
  const val = parseInt(btn.dataset.value);
  screeningState[key] = val;
}

// Navigation between steps
function goToStep(stepNumber) {
  if (currentStep === 1 && stepNumber > 1) {
    const name = document.getElementById('patient-name')?.value.trim();
    const age = document.getElementById('patient-age')?.value.trim();
    const height = document.getElementById('patient-height')?.value.trim();
    const weight = document.getElementById('patient-weight')?.value.trim();
    const ga = document.getElementById('gestational-age')?.value.trim();

    if (!name || !age || !height || !weight || !ga) {
      showToast('Harap lengkapi semua data pasien sebelum melanjutkan!');
      return;
    }

    screeningState.name = name;
    screeningState.age = parseInt(age);
    screeningState.height = parseFloat(height);
    screeningState.weight = parseFloat(weight);
    screeningState.gestational_age = parseInt(ga);
  }

  // Update tabs indicator
  for (let i = 1; i <= 5; i++) {
    const tab = document.getElementById(`step-tab-${i}`);
    const content = document.getElementById(`step-${i}`);

    if (tab && content) {
      tab.classList.remove('active', 'completed');
      content.classList.remove('active');

      if (i < stepNumber) {
        tab.classList.add('completed');
      } else if (i === stepNumber) {
        tab.classList.add('active');
        content.classList.add('active');
      }
    }
  }

  currentStep = stepNumber;
}

// Hardware Simulation: Blood Pressure Measurement
function startBPMeasurement() {
  document.getElementById('bp-idle').classList.add('hidden');
  document.getElementById('bp-result').classList.add('hidden');
  document.getElementById('bp-progress').classList.remove('hidden');

  const statusText = document.getElementById('bp-status-text');
  const currPressure = document.getElementById('bp-current-pressure');
  const progressBar = document.getElementById('bp-progress-bar');
  const progressHint = document.getElementById('bp-progress-hint');

  statusText.textContent = 'Mengisi Manset...';
  progressHint.textContent = 'Menyalakan pompa...';
  let pressure = 0;
  let targetPressure = 160;

  const inflateInterval = setInterval(() => {
    pressure += 5;
    if (pressure > targetPressure) pressure = targetPressure;
    currPressure.textContent = pressure;
    progressBar.style.width = `${(pressure / targetPressure) * 50}%`;

    if (pressure >= targetPressure) {
      clearInterval(inflateInterval);
      
      setTimeout(() => {
        statusText.textContent = 'Sedang Mengukur...';
        progressHint.textContent = 'Membaca sensor ADS1115 & pulse...';

        fetch('/api/simulate/bp', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            let currentDeflate = targetPressure;
            const deflateInterval = setInterval(() => {
              currentDeflate -= 4;
              if (currentDeflate < 0) currentDeflate = 0;
              currPressure.textContent = currentDeflate;
              const progressPct = 50 + ((targetPressure - currentDeflate) / targetPressure) * 50;
              progressBar.style.width = `${progressPct}%`;

              if (currentDeflate <= 0) {
                clearInterval(deflateInterval);
                finishBPMeasurement(data);
              }
            }, 80);
          })
          .catch(err => {
            console.error(err);
            finishBPMeasurement({ systolic: 150, diastolic: 95, pulse: 78, map: 113.3 });
          });
      }, 500);
    }
  }, 60);
}

function finishBPMeasurement(data) {
  screeningState.systolic = data.systolic;
  screeningState.diastolic = data.diastolic;
  screeningState.pulse = data.pulse;
  screeningState.map_value = data.map;

  document.getElementById('bp-systolic-result').textContent = data.systolic;
  document.getElementById('bp-diastolic-result').textContent = data.diastolic;
  document.getElementById('bp-map-result').textContent = data.map;
  document.getElementById('bp-pulse-result').textContent = data.pulse;

  document.getElementById('bp-progress').classList.add('hidden');
  document.getElementById('bp-result').classList.remove('hidden');
}

// Hardware Simulation: 10 Urinalysis Parameters
function startUrineReading() {
  document.getElementById('urine-idle').classList.add('hidden');
  document.getElementById('urine-result').classList.add('hidden');
  document.getElementById('urine-progress').classList.remove('hidden');

  const progressBar = document.getElementById('urine-progress-bar');
  let pct = 0;

  const readInterval = setInterval(() => {
    pct += 10;
    progressBar.style.width = `${pct}%`;

    if (pct >= 100) {
      clearInterval(readInterval);

      fetch('/api/simulate/urine', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          screeningState.protein_urine = data.protein_urine || 'Trace';
          screeningState.leukocytes = data.leukocytes || '70 Ca CELLS/µL';
          screeningState.nitrite = data.nitrite || 'Positif';
          screeningState.urobilinogen = data.urobilinogen || '1 mg/dL';
          screeningState.ph = data.ph || '8.0';
          screeningState.blood = data.blood || '25 Ca CELLS/µL (+1)';
          screeningState.specific_gravity = data.specific_gravity || '1.025';
          screeningState.ketone = data.ketone || '40 mg/dL (+2)';
          screeningState.bilirubin = data.bilirubin || 'Negatif';
          screeningState.glucose = data.glucose || 'Negatif';

          renderWebUrineDOM();

          document.getElementById('urine-progress').classList.add('hidden');
          document.getElementById('urine-result').classList.remove('hidden');
        })
        .catch(err => {
          console.error(err);
          renderWebUrineDOM();
          document.getElementById('urine-progress').classList.add('hidden');
          document.getElementById('urine-result').classList.remove('hidden');
        });
    }
  }, 150);
}

function renderWebUrineDOM() {
  const setElem = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setElem('web-res-glucose', screeningState.glucose);
  setElem('web-res-bilirubin', screeningState.bilirubin);
  setElem('web-res-ketone', screeningState.ketone);
  setElem('web-res-sg', screeningState.specific_gravity);
  setElem('web-res-blood', screeningState.blood);
  setElem('web-res-ph', screeningState.ph);
  setElem('web-res-protein', screeningState.protein_urine);
  setElem('web-res-urobilinogen', screeningState.urobilinogen);
  setElem('web-res-nitrite', screeningState.nitrite);
  setElem('web-res-leukocytes', screeningState.leukocytes);
}

// Calculate final risk score and show results
async function showResults() {
  try {
    const res = await fetch('/api/calculate-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(screeningState)
    });
    
    if (res.ok) {
      const data = await res.json();
      screeningState.risk_score = data.risk_score;
      screeningState.risk_category = data.risk_category;
    }
  } catch (err) {
    console.error(err);
  }

  // Update UI Elements in Step 5
  const badge = document.getElementById('result-risk-badge');
  badge.className = `result-risk-badge ${screeningState.risk_category}`;
  document.getElementById('result-risk-category').textContent = screeningState.risk_category.toUpperCase();
  document.getElementById('result-risk-score').textContent = `Skor Risiko: ${screeningState.risk_score}`;

  document.getElementById('result-bp').textContent = `${screeningState.systolic || '--'} / ${screeningState.diastolic || '--'}`;
  document.getElementById('result-map').textContent = `MAP: ${screeningState.map_value || '--'}`;
  document.getElementById('result-protein').textContent = screeningState.protein_urine || '-';
  document.getElementById('result-bmi').textContent = screeningState.bmi || '--';
  document.getElementById('result-pulse').textContent = `${screeningState.pulse || '--'} bpm`;

  const setElem = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setElem('w-f-ph', screeningState.ph);
  setElem('w-f-protein', screeningState.protein_urine);
  setElem('w-f-glucose', screeningState.glucose);
  setElem('w-f-bilirubin', screeningState.bilirubin);
  setElem('w-f-ketone', screeningState.ketone);
  setElem('w-f-sg', screeningState.specific_gravity);
  setElem('w-f-blood', screeningState.blood);
  setElem('w-f-urobilinogen', screeningState.urobilinogen);
  setElem('w-f-nitrite', screeningState.nitrite);
  setElem('w-f-leukocytes', screeningState.leukocytes);

  document.getElementById('result-patient-name').textContent = screeningState.name || 'Ny. Ani Wijaya';
  document.getElementById('result-patient-info').textContent = `${screeningState.age} Tahun · Usia Kehamilan ${screeningState.gestational_age} Minggu`;

  goToStep(5);
}

// Save screening data
async function saveScreening() {
  try {
    const sRes = await fetch('/api/save-screening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(screeningState)
    });

    if (sRes.ok) {
      const d = await sRes.json();
      showToast(d.message || 'Data skrining berhasil disimpan!');
    } else {
      showToast('Gagal menyimpan data');
    }
  } catch (err) {
    console.error(err);
    showToast('Terjadi kesalahan saat menyimpan');
  }
}

// Thermal Printer Simulation
function printResult() {
  showToast('Mencetak hasil ke USB Thermal Printer...');
}
