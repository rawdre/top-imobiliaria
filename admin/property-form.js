const AMENITY_OPTIONS = [
  'Cozinha com armários',
  'Salão de festas',
  'Piscina',
  'Área de lazer',
  'Academia',
  'Churrasqueira',
  'Sauna',
  'Área de serviço',
  'Varanda',
  'Playground',
  'Aceita pet',
  'Vista livre',
  'Elevador',
  'Portaria 24h',
];

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
  return items
    .map((item) => ({
      name: item.dataset.name || 'imagem',
      path: item.dataset.path || '',
      url: item.dataset.url || '',
      is_cover: item.dataset.isCover === 'true',
    }))
    .filter((item) => item.url)
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover));
}

function renderGalleryPreview(images) {
  const container = document.getElementById('galleryPreview');
  if (!container) return;

  if (!images.length) {
    container.innerHTML = '';
    return;
  }

  const normalized = images.map((image, index) => ({
    ...image,
    is_cover: image.is_cover === true || (index === 0 && !images.some((item) => item.is_cover)),
  }));

  container.innerHTML = normalized.map((image, index) => `
    <div class="thumb-item ${image.is_cover ? 'cover' : ''}" data-name="${escapeHtml(image.name || `imagem-${index + 1}`)}" data-path="${escapeHtml(image.path || '')}" data-url="${escapeHtml(image.url || '')}" data-is-cover="${image.is_cover ? 'true' : 'false'}">
      <img src="${escapeHtml(image.url)}" alt="Imagem do imóvel ${index + 1}">
      <button type="button" data-action="set-cover" aria-label="Definir como foto principal">★</button>
      <button type="button" data-action="remove-image" aria-label="Remover imagem">&times;</button>
      ${image.is_cover ? '<div class="thumb-cover-badge">Foto principal</div>' : ''}
    </div>
  `).join('');
}

function renderAmenityChecklist(selectedAmenities = []) {
  const container = document.getElementById('amenitiesChecklist');
  if (!container) return;

  container.innerHTML = AMENITY_OPTIONS.map((label, index) => `
    <label class="check-item" for="amenity-${index}">
      <input id="amenity-${index}" type="checkbox" name="amenities" value="${escapeHtml(label)}" ${selectedAmenities.includes(label) ? 'checked' : ''}>
      <span>${escapeHtml(label)}</span>
    </label>
  `).join('');
}

function collectFormPayload() {
  const form = document.getElementById('propertyForm');
  const data = new FormData(form);

  return {
    title: data.get('title'),
    property_type: data.get('property_type'),
    listing_type: data.get('listing_type'),
    registration_status: data.get('registration_status'),
    price: data.get('price'),
    gross_price: data.get('gross_price'),
    punctuality_discount: data.get('punctuality_discount'),
    condo_fee: data.get('condo_fee'),
    water_notes: data.get('water_notes'),
    area_m2: data.get('area_m2'),
    bedrooms: data.get('bedrooms'),
    suites: data.get('suites'),
    bathrooms: data.get('bathrooms'),
    has_dce: form.querySelector('[name="has_dce"]').checked,
    garage_spaces: data.get('garage_spaces'),
    address: data.get('address'),
    neighborhood: data.get('neighborhood'),
    condominium_name: data.get('condominium_name'),
    description: data.get('description'),
    gradient: data.get('gradient'),
    gallery: collectGalleryFromPreview(),
    amenities: Array.from(form.querySelectorAll('[name="amenities"]:checked')).map((item) => item.value),
    is_active: form.querySelector('[name="is_active"]').checked,
    is_featured: form.querySelector('[name="is_featured"]').checked,
  };
}

function fillForm(property) {
  const form = document.getElementById('propertyForm');
  form.title.value = property.title || '';
  form.property_type.value = property.property_type || 'apartamento';
  form.listing_type.value = property.listing_type || 'aluguel';
  if (form.registration_status) form.registration_status.value = property.registration_status || (property.is_active ? 'ativo' : 'inativo');
  form.price.value = property.price ?? '';
  if (form.gross_price) form.gross_price.value = property.gross_price ?? '';
  if (form.punctuality_discount) form.punctuality_discount.value = property.punctuality_discount ?? '';
  if (form.condo_fee) form.condo_fee.value = property.condo_fee ?? '';
  if (form.water_notes) form.water_notes.value = property.water_notes || '';
  form.area_m2.value = property.area_m2 ?? '';
  form.bedrooms.value = property.bedrooms ?? 0;
  if (form.suites) form.suites.value = property.suites ?? 0;
  form.bathrooms.value = property.bathrooms ?? 0;
  if (form.has_dce) form.has_dce.checked = Boolean(property.has_dce);
  form.garage_spaces.value = property.garage_spaces ?? 0;
  form.address.value = property.address || '';
  form.neighborhood.value = property.neighborhood || '';
  form.condominium_name.value = property.condominium_name || '';
  form.description.value = property.description || '';
  form.gradient.value = property.gradient || '';
  form.is_active.checked = Boolean(property.is_active);
  form.is_featured.checked = Boolean(property.is_featured);
  renderAmenityChecklist(Array.isArray(property.amenities) ? property.amenities : []);
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
    const removeButton = event.target.closest('[data-action="remove-image"]');
    const coverButton = event.target.closest('[data-action="set-cover"]');

    if (coverButton) {
      const target = coverButton.closest('.thumb-item');
      if (!target) return;
      document.querySelectorAll('.thumb-item').forEach((item) => {
        item.dataset.isCover = 'false';
        item.classList.remove('cover');
      });
      target.dataset.isCover = 'true';
      target.classList.add('cover');
      renderGalleryPreview(collectGalleryFromPreview());
      return;
    }

    if (!removeButton) return;
    const removedItem = removeButton.closest('.thumb-item');
    if (!removedItem) return;
    const wasCover = removedItem.dataset.isCover === 'true';
    removedItem.remove();
    if (wasCover) {
      const first = document.querySelector('.thumb-item');
      if (first) {
        first.dataset.isCover = 'true';
        first.classList.add('cover');
        renderGalleryPreview(collectGalleryFromPreview());
      }
    }
  });

  const form = document.getElementById('propertyForm');
  const grossField = form?.querySelector('[name="gross_price"]');
  const discountField = form?.querySelector('[name="punctuality_discount"]');
  const priceField = form?.querySelector('[name="price"]');
  const listingTypeField = form?.querySelector('[name="listing_type"]');
  const registrationStatusField = form?.querySelector('[name="registration_status"]');
  const isActiveField = form?.querySelector('[name="is_active"]');

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

  registrationStatusField?.addEventListener('change', () => {
    if (!isActiveField) return;
    isActiveField.checked = registrationStatusField.value === 'ativo';
  });
}

async function bootstrapPropertyForm() {
  await requireSession();
  renderAmenityChecklist();
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
