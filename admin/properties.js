function showPropertiesMessage(message, type = 'error') {
  const box = document.getElementById('propertiesMessage');
  if (!box) return;
  box.textContent = message;
  box.className = `message show ${type}`;
}

function propertyImageCount(item) {
  return Array.isArray(item.gallery) ? item.gallery.length : 0;
}

function renderPropertiesTable(items) {
  const tbody = document.getElementById('propertiesTableBody');
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">Nenhum imóvel encontrado para os filtros selecionados.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map((item) => `
    <tr>
      <td>
        <strong>${escapeHtml(item.title)}</strong><br>
        <span>${escapeHtml(item.address || '--')}</span>
      </td>
      <td>${escapeHtml(item.listing_type)}</td>
      <td>${escapeHtml(item.property_type)}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${escapeHtml(item.neighborhood || '--')}</td>
      <td>${propertyImageCount(item)}</td>
      <td class="table-actions">
        ${item.is_active ? '<span class="chip green">Ativo</span>' : '<span class="chip gray">Inativo</span>'}
        ${item.is_featured ? '<span class="chip blue">Destaque</span>' : ''}
        <a class="btn btn-secondary" href="./edit-property.html?id=${encodeURIComponent(item.id)}">Editar</a>
        <button class="btn btn-secondary" type="button" data-action="delete" data-id="${escapeHtml(item.id)}">Excluir</button>
      </td>
    </tr>
  `).join('');
}

async function loadPropertiesTable() {
  const search = document.getElementById('filterSearch')?.value || '';
  const listingType = document.getElementById('filterListingType')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';

  try {
    const items = await fetchProperties({ search, listingType, status });
    renderPropertiesTable(items);
  } catch (error) {
    showPropertiesMessage(error.message || 'Falha ao carregar imóveis.');
  }
}

function bindPropertyActions() {
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

  document.getElementById('filtersForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await loadPropertiesTable();
  });

  document.getElementById('clearFilters')?.addEventListener('click', async () => {
    document.getElementById('filtersForm')?.reset();
    await loadPropertiesTable();
  });

  document.getElementById('propertiesTableBody')?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action="delete"]');
    if (!button) return;

    const propertyId = button.dataset.id;
    if (!propertyId) return;

    const confirmed = window.confirm('Excluir este imóvel? Esta ação não pode ser desfeita.');
    if (!confirmed) return;

    button.disabled = true;
    button.textContent = 'Excluindo...';

    try {
      await deleteProperty(propertyId);
      await loadPropertiesTable();
    } catch (error) {
      showPropertiesMessage(error.message || 'Falha ao excluir imóvel.');
      button.disabled = false;
      button.textContent = 'Excluir';
    }
  });
}

async function bootstrapPropertiesPage() {
  await requireSession();
  bindPropertyActions();
  await loadPropertiesTable();
}

document.addEventListener('DOMContentLoaded', bootstrapPropertiesPage);
