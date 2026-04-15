function renderStats(counts) {
  document.getElementById('statTotal').textContent = counts.total;
  document.getElementById('statActive').textContent = counts.active;
  document.getElementById('statFeatured').textContent = counts.featured;
  document.getElementById('statRentSale').textContent = `${counts.rent}/${counts.sale}`;
}

function renderRecentProperties(items) {
  const tbody = document.getElementById('recentPropertiesBody');
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">Nenhum imóvel cadastrado ainda.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map((item) => `
    <tr>
      <td>
        <strong>${escapeHtml(item.title)}</strong><br>
        <span>${escapeHtml(item.condominium_name || item.neighborhood || '--')}</span>
      </td>
      <td>${escapeHtml(item.listing_type)}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.is_active ? '<span class="chip green">Ativo</span>' : '<span class="chip gray">Inativo</span>'}</td>
      <td class="table-actions">
        <a class="btn btn-secondary" href="./edit-property.html?id=${encodeURIComponent(item.id)}">Editar</a>
      </td>
    </tr>
  `).join('');
}

function bindDashboardActions() {
  const logoutButtons = document.querySelectorAll('[data-action="logout"]');
  logoutButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await signOut();
      } finally {
        window.location.href = './index.html';
      }
    });
  });
}

async function bootstrapDashboard() {
  await requireSession();
  bindDashboardActions();

  try {
    const [counts, recent] = await Promise.all([
      fetchDashboardCounts(),
      fetchRecentProperties(8),
    ]);
    renderStats(counts);
    renderRecentProperties(recent);
  } catch (error) {
    const box = document.getElementById('dashboardMessage');
    if (box) {
      box.textContent = error.message || 'Não foi possível carregar o dashboard.';
      box.className = 'message show error';
    }
  }
}

document.addEventListener('DOMContentLoaded', bootstrapDashboard);
