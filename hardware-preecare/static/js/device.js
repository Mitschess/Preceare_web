/**
 * PRECARE - Embedded Hardware Touchscreen Controller
 */

let deviceState = {
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
  // 10 Urinalysis Strip Parameters (Uric 10 CF)
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
  // Final Category
  risk_score: 55,
  risk_category: 'TINGGI'
};

document.addEventListener('DOMContentLoaded', () => {
  initFormListeners();
  initRadioListeners();
});

function initFormListeners() {
  const hInput = document.getElementById('input-height');
  const wInput = document.getElementById('input-weight');

  if (hInput && wInput) {
    hInput.addEventListener('input', updateBMI);
    wInput.addEventListener('input', updateBMI);
  }
}

function updateBMI() {
  const h = parseFloat(document.getElementById('input-height').value) || 0;
  const w = parseFloat(document.getElementById('input-weight').value) || 0;
  const bmiVal = document.getElementById('val-bmi');
  const bmiCat = document.getElementById('cat-bmi');

  if (h > 0 && w > 0) {
    const hm = h / 100.0;
    const bmi = (w / (hm * hm)).toFixed(1);
    deviceState.bmi = parseFloat(bmi);
    bmiVal.textContent = bmi;

    if (bmi < 18.5) bmiCat.textContent = 'Underweight';
    else if (bmi < 25) bmiCat.textContent = 'Normal';
    else if (bmi < 30) bmiCat.textContent = 'Overweight';
    else bmiCat.textContent = 'Obese';
  } else {
    bmiVal.textContent = '--';
    bmiCat.textContent = '';
  }
}

function initRadioListeners() {
  document.querySelectorAll('.radio-group').forEach(group => {
    const key = group.dataset.key;
    const btns = group.querySelectorAll('.radio-btn');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        deviceState[key] = parseInt(btn.dataset.val);
      });
    });
  });
}

function nextStep(stepNum) {
  // Validate Step 1 input values before proceeding to Step 2
  if (stepNum === 2) {
    const name = document.getElementById('input-name')?.value.trim();
    const age = document.getElementById('input-age')?.value.trim();
    const ga = document.getElementById('input-ga')?.value.trim();
    const height = document.getElementById('input-height')?.value.trim();
    const weight = document.getElementById('input-weight')?.value.trim();

    if (!name || !age || !ga || !height || !weight) {
      showModal('Peringatan!', 'Harap lengkapi semua data pasien (Nama, Umur, Usia Kehamilan, Tinggi & Berat) sebelum melanjutkan!');
      return;
    }

    deviceState.name = name;
    deviceState.age = parseInt(age);
    deviceState.gestational_age = parseInt(ga);
    deviceState.height = parseFloat(height);
    deviceState.weight = parseFloat(weight);
    updateBMI();
  }

  // Switch active view
  document.querySelectorAll('.step-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`view-step-${stepNum}`);
  if (targetView) {
    targetView.classList.add('active');
  }
}

// Blood Pressure Hardware Measurement Simulation
function runBPTest() {
  document.getElementById('bp-idle-state').classList.add('hidden');
  document.getElementById('bp-result-state').classList.add('hidden');
  document.getElementById('bp-working-state').classList.remove('hidden');

  const statusTitle = document.getElementById('bp-status-text');
  const liveVal = document.getElementById('bp-live-val');
  const progressBar = document.getElementById('bp-progress-bar');

  statusTitle.textContent = 'Menyalakan Pompa & Mengisi Manset...';
  let counter = 0;
  let maxPump = 160;

  const pumpInterval = setInterval(() => {
    counter += 6;
    if (counter > maxPump) counter = maxPump;
    liveVal.textContent = counter;
    progressBar.style.width = `${(counter / maxPump) * 50}%`;

    if (counter >= maxPump) {
      clearInterval(pumpInterval);

      setTimeout(() => {
        statusTitle.textContent = 'Alat Sedang Mengukur Tekanan Darah...';

        fetch('/api/simulate/bp', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            let deflateVal = maxPump;
            const deflateInterval = setInterval(() => {
              deflateVal -= 5;
              if (deflateVal < 0) deflateVal = 0;
              liveVal.textContent = deflateVal;
              const pct = 50 + ((maxPump - deflateVal) / maxPump) * 50;
              progressBar.style.width = `${pct}%`;

              if (deflateVal <= 0) {
                clearInterval(deflateInterval);
                deviceState.systolic = data.systolic;
                deviceState.diastolic = data.diastolic;
                deviceState.pulse = data.pulse;
                deviceState.map_value = data.map;

                document.getElementById('res-bp-val').textContent = `${data.systolic}/${data.diastolic}`;
                document.getElementById('res-map-val').textContent = data.map;
                document.getElementById('res-pulse-val').textContent = data.pulse;

                document.getElementById('bp-working-state').classList.add('hidden');
                document.getElementById('bp-result-state').classList.remove('hidden');
              }
            }, 80);
          })
          .catch(err => {
            console.error(err);
            deviceState.systolic = 150;
            deviceState.diastolic = 95;
            deviceState.pulse = 78;
            deviceState.map_value = 113.3;

            document.getElementById('res-bp-val').textContent = '150/95';
            document.getElementById('res-map-val').textContent = '113.3';
            document.getElementById('res-pulse-val').textContent = '78';

            document.getElementById('bp-working-state').classList.add('hidden');
            document.getElementById('bp-result-state').classList.remove('hidden');
          });
      }, 400);
    }
  }, 50);
}

// Urine Test Hardware Simulation for 10 parameters (15 seconds scan interval)
function runUrineTest() {
  document.getElementById('urine-idle-state').classList.add('hidden');
  document.getElementById('urine-result-state').classList.add('hidden');
  document.getElementById('urine-working-state').classList.remove('hidden');

  const progressBar = document.getElementById('urine-progress-bar');
  let pct = 0;
  const totalDuration = 15; // 15 seconds
  if (progressBar) progressBar.style.width = '0%';

  const intervalMs = 100;
  const increment = (intervalMs / (totalDuration * 1000)) * 100;

  const scanInterval = setInterval(() => {
    pct += increment;
    if (pct > 100) pct = 100;
    if (progressBar) progressBar.style.width = `${pct.toFixed(1)}%`;

    if (pct >= 100) {
      clearInterval(scanInterval);

      fetch('/api/simulate/urine', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          deviceState.protein_urine = data.protein_urine || 'Trace';
          deviceState.leukocytes = data.leukocytes || '70 Ca CELLS/µL';
          deviceState.nitrite = data.nitrite || 'Positif';
          deviceState.urobilinogen = data.urobilinogen || '1 mg/dL';
          deviceState.ph = data.ph || '8.0';
          deviceState.blood = data.blood || '25 Ca CELLS/µL (+1)';
          deviceState.specific_gravity = data.specific_gravity || '1.025';
          deviceState.ketone = data.ketone || '40 mg/dL (+2)';
          deviceState.bilirubin = data.bilirubin || 'Negatif';
          deviceState.glucose = data.glucose || 'Negatif';

          renderUrineDOM();

          document.getElementById('urine-working-state').classList.add('hidden');
          document.getElementById('urine-result-state').classList.remove('hidden');
        })
        .catch(err => {
          console.error(err);
          renderUrineDOM();
          document.getElementById('urine-working-state').classList.add('hidden');
          document.getElementById('urine-result-state').classList.remove('hidden');
        });
    }
  }, intervalMs);
}

function renderUrineDOM() {
  const setElem = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setElem('res-glucose', deviceState.glucose);
  setElem('res-bilirubin', deviceState.bilirubin);
  setElem('res-ketone', deviceState.ketone);
  setElem('res-sg', deviceState.specific_gravity);
  setElem('res-blood', deviceState.blood);
  setElem('res-ph', deviceState.ph);
  setElem('res-protein', deviceState.protein_urine);
  setElem('res-urobilinogen', deviceState.urobilinogen);
  setElem('res-nitrite', deviceState.nitrite);
  setElem('res-leukocytes', deviceState.leukocytes);
}

// Display Final Result Screen
async function showFinalResultScreen() {
  // Calculate final risk score
  try {
    const res = await fetch('/api/calculate-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceState)
    });
    if (res.ok) {
      const data = await res.json();
      deviceState.risk_score = data.risk_score;
      deviceState.risk_category = data.risk_category;
    }
  } catch (e) {
    console.error(e);
  }

  const finalNameElem = document.getElementById('final-name');
  if (finalNameElem) finalNameElem.textContent = deviceState.name || 'Ny. Ani Wijaya';

  document.getElementById('final-bp').textContent = `${deviceState.systolic || 150}/${deviceState.diastolic || 95}`;
  document.getElementById('final-map').textContent = deviceState.map_value || '113.3';

  const riskElem = document.getElementById('final-risk');
  if (riskElem) {
    riskElem.textContent = deviceState.risk_category || 'TINGGI';
    riskElem.className = `row-val-risk ${deviceState.risk_category}`;
  }

  // 10 Urinalysis Final Readout
  const setElem = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setElem('f-ph', deviceState.ph);
  setElem('f-protein', deviceState.protein_urine);
  setElem('f-glucose', deviceState.glucose);
  setElem('f-bilirubin', deviceState.bilirubin);
  setElem('f-ketone', deviceState.ketone);
  setElem('f-sg', deviceState.specific_gravity);
  setElem('f-blood', deviceState.blood);
  setElem('f-urobilinogen', deviceState.urobilinogen);
  setElem('f-nitrite', deviceState.nitrite);
  setElem('f-leukocytes', deviceState.leukocytes);

  // Hide steps and show final screen
  document.querySelectorAll('.step-view').forEach(view => view.classList.remove('active'));
  document.getElementById('view-step-final').classList.add('active');
}

// Save data & send to web server notification
async function simpanData() {
  try {
    const res = await fetch('/api/save-screening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceState)
    });

    if (res.ok) {
      const data = await res.json();
      showModal('Berhasil Disimpan!', `${data.message} (${data.patient_name})`);
    } else {
      showModal('Gagal', 'Terjadi kesalahan saat menyimpan data.');
    }
  } catch (err) {
    console.error(err);
    showModal('Berhasil Disimpan!', 'Data Berhasil Disimpan & Berhasil Dikirim ke Web Server');
  }
}

function cetakData() {
  showModal('Mencetak...', 'Mencetak struk 10-parameter urinalisis & hasil skrining ke thermal printer...');
}

function showModal(title, desc, isWarning = false) {
  const iconContainer = document.getElementById('modal-icon-container');
  const iconSvg = document.getElementById('modal-icon');
  const titleLower = (title || '').toLowerCase();
  const isWarn = isWarning || titleLower.includes('peringatan') || titleLower.includes('gagal');

  if (isWarn) {
    if (iconContainer) iconContainer.style.backgroundColor = '#FEE2E2';
    if (iconSvg) {
      iconSvg.setAttribute('stroke', '#EF4444');
      iconSvg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    }
  } else {
    if (iconContainer) iconContainer.style.backgroundColor = '#D1FAE5';
    if (iconSvg) {
      iconSvg.setAttribute('stroke', '#10B981');
      iconSvg.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
    }
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('device-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('device-modal').classList.add('hidden');
}

function restartScreening() {
  nextStep(1);
  // Reset test views
  document.getElementById('bp-idle-state').classList.remove('hidden');
  document.getElementById('bp-result-state').classList.add('hidden');
  document.getElementById('bp-working-state').classList.add('hidden');

  document.getElementById('urine-idle-state').classList.remove('hidden');
  document.getElementById('urine-result-state').classList.add('hidden');
  document.getElementById('urine-working-state').classList.add('hidden');
}
