function getPropertyIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function showFormMessage(message, type = 'error') {
  const box = document.getElementById('formMessage');
  if (!box) return;
  box.textContent = message;
  box.className = `message show ${type}`;
}

function collectGalleryFromPreview() {
  const items = Array.from(document.querySelectorAll('.thumb-item'));
  return items.map((item) => ({
    name: item.dataset.name || 'imagem',
    path: item.dataset.path || '',
    url: item.dataset.url || '',
  })).filter((item) => item.url);
}

function renderGalleryPreview(images) {
  const container = document.getElementById('galleryPreview');
  if (!container) return;

  if (!images.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = images.map((image, index) => `
    <div class="thumb-item" data-name="${escapeHtml(image.name || `imagem-${index + 1}`)}" data-path="${escapeHtml(image.path || '')}" data-url="${escapeHtml(image.url || '')}">
      <img src="${escapeHtml(image.url)}" alt="Imagem do imóvel ${index + 1}">
      <button type="button" data-action="remove-image" aria-label="Remover imagem">&times;</button>
    </div>
  `).join('');
}

function collectFormPayload() {
  const form = document.getElementById('propertyForm');
  const data = new FormData(form);

  return {
    title: data.get('title'),
    property_type: data.get('property_type'),
    listing_type: data.get('listing_type'),
    price: data.get('price'),
    gross_price: data.get('gross_price'),
    punctuality_discount: data.get('punctuality_discount'),
    condo_fee: data.get('condo_fee'),
    water_notes: data.get('water_notes'),
    area_m2: data.get('area_m2'),
    bedrooms: data.get('bedrooms'),
    bathrooms: data.get('bathrooms'),
    garage_spaces: data.get('garage_spaces'),
    address: data.get('address'),
    neighborhood: data.get('neighborhood'),
    condominium_name: data.get('condominium_name'),
    description: data.get('description'),
    gradient: data.get('gradient'),
    gallery: collectGalleryFromPreview(),
    is_active: form.querySelector('[name="is_active"]').checked,
    is_featured: form.querySelector('[name="is_featured"]').checked,
  };
}

function fillForm(property) {
  const form = document.getElementById('propertyForm');
  form.title.value = property.title || '';
  form.property_type.value = property.property_type || 'apartamento';
  form.listing_type.value = property.listing_type || 'aluguel';
  form.price.value = property.price ?? '';
  if (form.gross_price) form.gross_price.value = property.gross_price ?? '';
  if (form.punctuality_discount) form.punctuality_discount.value = property.punctuality_discount ?? '';
  if (form.condo_fee) form.condo_fee.value = property.condo_fee ?? '';
  if (form.water_notes) form.water_notes.value = property.water_notes || '';
  form.area_m2.value = property.area_m2 ?? '';
  form.bedrooms.value = property.bedrooms ?? 0;
  form.bathrooms.value = property.bathrooms ?? 0;
  form.garage_spaces.value = property.garage_spaces ?? 0;
  form.address.value = property.address || '';
  form.neighborhood.value = property.neighborhood || '';
  form.condominium_name.value = property.condominium_name || '';
  form.description.value = property.description || '';
  form.gradient.value = property.gradient || '';
  form.is_active.checked = Boolean(property.is_active);
  form.is_featured.checked = Boolean(property.is_featured);
  renderGalleryPreview(Array.isArray(property.gallery) ? property.gallery : []);
}

async function maybeUploadNewImages() {
  const input = document.getElementById('imageFiles');
  const files = Array.from(input?.files || []);
  if (!files.length) return [];
  return uploadPropertyImages(files);
}

function bindFormInteractions() {
  document.querySelectorAll('[data-action="logout"]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await signOut();
      } finally {
        window.location.href = './index.html';
      }
    });
  });

  document.getElementById('galleryPreview')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="remove-image"]');
    if (!button) return;
    button.closest('.thumb-item')?.remove();
  });

  const form = document.getElementById('propertyForm');
  const grossField = form?.querySelector('[name="gross_price"]');
  const discountField = form?.querySelector('[name="punctuality_discount"]');
  const priceField = form?.querySelector('[name="price"]');
  const listingTypeField = form?.querySelector('[name="listing_type"]');

  function syncNetRent() {
    if (!grossField || !discountField || !priceField) return;
    if (listingTypeField && listingTypeField.value !== 'aluguel') return;
    const gross = Number(grossField.value || 0);
    const discount = Number(discountField.value || 0);
    if (!gross && !discount) return;
    const liquid = Math.max(gross - discount, 0);
    priceField.value = liquid ? liquid.toFixed(2) : '';
  }

  grossField?.addEventListener('input', syncNetRent);
  discountField?.addEventListener('input', syncNetRent);
  listingTypeField?.addEventListener('change', () => {
    if (listingTypeField.value === 'venda') return;
    syncNetRent();
  });
}

async function bootstrapPropertyForm() {
  await requireSession();
  bindFormInteractions();

  const isEditMode = document.body.dataset.mode === 'edit';
  const propertyId = getPropertyIdFromUrl();

  if (isEditMode) {
    if (!propertyId) {
      showFormMessage('ID do imóvel não informado para edição.');
      return;
    }

    try {
      const property = await fetchPropertyById(propertyId);
      fillForm(property);
    } catch (error) {
      showFormMessage(error.message || 'Não foi possível carregar o imóvel.');
      return;
    }
  }

  const form = document.getElementById('propertyForm');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = isEditMode ? 'Salvando...' : 'Criando...';

    try {
      const uploadedImages = await maybeUploadNewImages();
      const currentGallery = collectGalleryFromPreview();
      const payload = collectFormPayload();
      payload.gallery = [...currentGallery, ...uploadedImages];

      if (!payload.title || !payload.address || !payload.neighborhood) {
        throw new Error('Preencha pelo menos título, endereço e região.');
      }

      if (isEditMode) {
        await updateProperty(propertyId, payload);
        showFormMessage('Imóvel atualizado com sucesso.', 'success');
      } else {
        const created = await createProperty(payload);
        showFormMessage('Imóvel criado com sucesso.', 'success');
        setTimeout(() => {
          window.location.href = `./edit-property.html?id=${encodeURIComponent(created.id)}`;
        }, 800);
      }

      if (uploadedImages.length) {
        renderGalleryPreview(payload.gallery);
      }
      form.querySelector('#imageFiles').value = '';
    } catch (error) {
      showFormMessage(error.message || 'Falha ao salvar imóvel.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = isEditMode ? 'Salvar imóvel' : 'Criar imóvel';
    }
  });
}

document.addEventListener('DOMContentLoaded', bootstrapPropertyForm);
