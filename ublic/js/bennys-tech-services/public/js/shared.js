// Helpers used by many pages.
const WHATSAPP_NUMBER = '2349039953015';

const CATEGORY_NAMES = {
  'cyber-cafe': 'Cyber Cafe',
  'business-centre': 'Business Centre',
  'scratch-cards': 'Scratch Cards',
  'training': 'Computer Training'
};

function whatsappLink(message) {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
}

// Load services from the database. If that fails, use the backup list.
async function getServices() {
  try {
    const response = await fetch('/api/services');
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
    if (Array.isArray(data)) return data;
  } catch (error) { /* use the backup list below */ }
  return FALLBACK_SERVICES;
}

// Save an enquiry in the database (errors are ignored here: WhatsApp still opens)
function sendEnquiry(data) {
  return fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    keepalive: true
  }).then(function (response) { return response.ok; })
    .catch(function () { return false; });
}

// "Request this service": save the enquiry and open WhatsApp
function requestService(service) {
  sendEnquiry({ service: service.title, message: 'Requested using the website button' });
  const message = "Hello Benny's Tech Services, I want to request: " + service.title;
  window.open(whatsappLink(message), '_blank', 'noopener');
}

// Build one service card
function createCard(service) {
  const card = document.createElement('article');
  card.className = 'service-card';

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = '/service?id=' + encodeURIComponent(service.id);
  link.textContent = service.title;
  title.appendChild(link);

  const text = document.createElement('p');
  text.textContent = service.description;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-request';
  button.textContent = 'Request this service';
  button.addEventListener('click', function () { requestService(service); });

  card.append(title, text, button);
  return card;
}
