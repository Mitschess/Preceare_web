/**
 * PRECARE - Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error('Gagal mengambil data dashboard');
    const data = await res.json();

    // Update stats
    document.getElementById('total-patients').textContent = data.total_patients || 0;
    document.getElementById('total-screenings').textContent = data.total_screenings || 0;
    document.getElementById('today-screenings').textContent = data.today_screenings || 0;

    // Risk distribution
    if (data.risk_counts) {
      document.getElementById('risk-low').textContent = data.risk_counts.rendah || 0;
      document.getElementById('risk-medium').textContent = data.risk_counts.sedang || 0;
      document.getElementById('risk-high').textContent = data.risk_counts.tinggi || 0;
    }

    // Recent screenings table
    const tbody = document.getElementById('recent-tbody');
    if (data.recent_screenings && data.recent_screenings.length > 0) {
      tbody.innerHTML = '';
      data.recent_screenings.forEach(item => {
        const tr = document.createElement('tr');
        const dt = new Date(item.screening_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        tr.innerHTML = `
          <td><strong>${item.patient_name}</strong></td>
          <td>${item.age} Thn</td>
          <td>${item.gestational_age} Mgg</td>
          <td>${item.systolic || '--'}/${item.diastolic || '--'}</td>
          <td>${item.protein_urine || '-'}</td>
          <td><span class="badge-risk ${item.risk_category}">${item.risk_category}</span></td>
          <td>${dt}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = `
        <tr class="empty-row">
          <td colspan="7">
            <div class="empty-state-mini">
              <span>Belum ada data pemeriksaan</span>
            </div>
          </td>
        </tr>
      `;
    }
  } catch (err) {
    console.error(err);
  }
}
