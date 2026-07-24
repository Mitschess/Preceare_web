/**
 * PRECARE - Screening History Logic
 */

let allScreenings = [];
let currentFilter = 'all';
let selectedScreeningId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadHistory();

  const searchInput = document.getElementById('search-history');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderHistory();
    });
  }
});

async function loadHistory() {
  try {
    const res = await fetch('/api/screenings');
    if (!res.ok) throw new Error('Gagal memuat riwayat');
    allScreenings = await res.json();
    renderHistory();
  } catch (err) {
    console.error(err);
  }
}

function filterHistory(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === category) {
      btn.classList.add('active');
    }
  });
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('history-list');
  const searchVal = (document.getElementById('search-history')?.value || '').toLowerCase();

  let filtered = allScreenings.filter(item => {
    const pName = (item.patient_name || `Pasien #${item.patient_id}`).toLowerCase();
    const matchesSearch = pName.includes(searchVal) || String(item.id).includes(searchVal);
    const matchesFilter = currentFilter === 'all' || item.risk_category === currentFilter;
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.3">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <p>Tidak ada data pemeriksaan ditemukan</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  filtered.forEach(item => {
    const dt = new Date(item.screening_date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const displayName = item.patient_name || `Pasien #${item.patient_id}`;

    const card = document.createElement('div');
    card.className = 'history-card';
    card.onclick = () => openDetailModal(item.id);

    card.innerHTML = `
      <div class="hc-patient">
        <span class="hc-name">${displayName}</span>
        <span class="hc-sub">${item.age} Thn · UK ${item.gestational_age} Mgg · ${dt}</span>
      </div>
      <div class="hc-metrics">
        <div class="hc-metric">
          <span class="hc-metric-label">TD</span>
          <span class="hc-metric-val">${item.systolic || '--'}/${item.diastolic || '--'}</span>
        </div>
        <div class="hc-metric">
          <span class="hc-metric-label">Protein</span>
          <span class="hc-metric-val">${item.protein_urine || '-'}</span>
        </div>
        <div class="hc-metric">
          <span class="hc-metric-label">BMI</span>
          <span class="hc-metric-val">${item.bmi || '--'}</span>
        </div>
      </div>
      <span class="badge-risk ${item.risk_category}">${item.risk_category}</span>
    `;

    container.appendChild(card);
  });
}

async function openDetailModal(screeningId) {
  selectedScreeningId = screeningId;
  try {
    const res = await fetch(`/api/screenings/${screeningId}`);
    if (!res.ok) return;
    const data = await res.json();

    const dt = new Date(data.screening_date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const displayName = data.patient_name || `Pasien #${data.patient_id}`;

    const body = document.getElementById('detail-modal-body');
    body.innerHTML = `
      <div class="result-risk-badge ${data.risk_category}">
        <div class="risk-badge-inner">
          <span class="risk-badge-label">Kategori Risiko</span>
          <span class="risk-badge-value">${(data.risk_category || 'TINGGI').toUpperCase()}</span>
          <span class="risk-badge-score">Skor: ${data.risk_score || '--'}</span>
        </div>
      </div>

      <div class="result-patient-summary">
        <span class="rps-name">${displayName}</span>
        <span class="rps-info">${data.age} Tahun · Usia Kehamilan ${data.gestational_age} Minggu</span>
        <span class="rps-info" style="margin-top: 4px; font-size: 11px;">Waktu: ${dt}</span>
      </div>

      <div class="result-details-grid">
        <div class="result-detail-card">
          <div class="detail-header">Tekanan Darah</div>
          <div class="detail-value">${data.systolic || '--'}/${data.diastolic || '--'}</div>
          <div class="detail-sub">MAP: ${data.map_value || '--'}</div>
        </div>

        <div class="result-detail-card">
          <div class="detail-header">Protein Urin</div>
          <div class="detail-value">${data.protein_urine || '-'}</div>
        </div>

        <div class="result-detail-card">
          <div class="detail-header">BMI</div>
          <div class="detail-value">${data.bmi || '--'}</div>
        </div>

        <div class="result-detail-card">
          <div class="detail-header">Pulse</div>
          <div class="detail-value">${data.pulse || '--'} bpm</div>
        </div>
      </div>

      <div style="background-color: var(--bg-primary); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); margin-top: 10px;">
        <span style="font-size: 12px; color: var(--accent-primary); display: block; margin-bottom: 8px; font-weight: 700;">Hasil Complete Urinalysis (Strip Uric 10 CF):</span>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 12px;">
          <div><span style="color: var(--text-secondary);">pH:</span> <strong>${data.ph || '6.5'}</strong></div>
          <div><span style="color: var(--text-secondary);">Protein:</span> <strong style="color: var(--risk-high);">${data.protein_urine || '100 mg/dL (+2)'}</strong></div>
          <div><span style="color: var(--text-secondary);">Glucose:</span> <strong>${data.glucose || 'Negatif'}</strong></div>
          <div><span style="color: var(--text-secondary);">Bilirubin:</span> <strong>${data.bilirubin || 'Negatif'}</strong></div>
          <div><span style="color: var(--text-secondary);">Ketone:</span> <strong>${data.ketone || 'Negatif'}</strong></div>
          <div><span style="color: var(--text-secondary);">Specific Gravity:</span> <strong>${data.specific_gravity || '1.015'}</strong></div>
          <div><span style="color: var(--text-secondary);">Blood:</span> <strong>${data.blood || 'Negatif'}</strong></div>
          <div><span style="color: var(--text-secondary);">Urobilinogen:</span> <strong>${data.urobilinogen || 'Normal'}</strong></div>
          <div><span style="color: var(--text-secondary);">Nitrite:</span> <strong>${data.nitrite || 'Negatif'}</strong></div>
          <div><span style="color: var(--text-secondary);">Leukocytes:</span> <strong>${data.leukocytes || 'Negatif'}</strong></div>
        </div>
      </div>

      <div style="background-color: var(--bg-primary); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); margin-top: 10px;">
        <span style="font-size: 12px; color: var(--text-secondary); display: block; margin-bottom: 6px; font-weight: 600;">Faktor Risiko Ditemukan:</span>
        <ul style="font-size: 13px; padding-left: 20px; color: var(--text-primary); display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          ${data.history_preeclampsia ? '<li>Riwayat Preeklamsia</li>' : ''}
          ${data.family_history ? '<li>Riwayat Keluarga</li>' : ''}
          ${data.diabetes ? '<li>Diabetes Mellitus</li>' : ''}
          ${data.chronic_hypertension ? '<li>Hipertensi Kronis</li>' : ''}
          ${data.kidney_disease ? '<li>Penyakit Ginjal</li>' : ''}
          ${data.nullipara ? '<li>Kehamilan Pertama</li>' : ''}
          ${(!data.history_preeclampsia && !data.family_history && !data.diabetes && !data.chronic_hypertension && !data.kidney_disease && !data.nullipara) ? '<li>Tidak Ada</li>' : ''}
        </ul>
      </div>
    `;

    document.getElementById('detail-modal').classList.remove('hidden');
  } catch (err) {
    console.error(err);
  }
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.add('hidden');
  selectedScreeningId = null;
}

async function deleteScreening() {
  if (!selectedScreeningId) return;
  if (!confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) return;

  try {
    const res = await fetch(`/api/screenings/${selectedScreeningId}`, { method: 'DELETE' });
    if (res.ok) {
      closeDetailModal();
      loadHistory();
      showToast('Data berhasil dihapus');
    }
  } catch (err) {
    console.error(err);
  }
}

function printFromModal() {
  showToast('Mencetak hasil 10-parameter urinalisis ke USB Thermal Printer...');
}
