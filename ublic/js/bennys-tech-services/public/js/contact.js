// Contact form: saves the enquiry, or sends it on WhatsApp
(function () {
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const whatsappButton = document.getElementById('whatsapp-send');

function formData() {
  return {
    name: form.elements.name.value.trim(),
    phone: form.elements.phone.value.trim(),
    service: form.elements.service.value.trim(),
    message: form.elements.message.value.trim(),
    website: form.elements.website.value
  };
}

function showStatus(text, good) {
  status.textContent = text;
  status.className = 'form-status ' + (good ? 'good' : 'bad');
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  const data = formData();
  if (!data.name || !data.message) {
    return showStatus('Please enter your name and your message.', false);
  }
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  showStatus('Sending...', true);

  const ok = await sendEnquiry(data);
  button.disabled = false;
  if (ok) {
    form.reset();
    showStatus('Thank you. We have received your message and will reply soon.', true);
  } else {
    showStatus('We could not send it. Please use the WhatsApp button instead.', false);
  }
});

whatsappButton.addEventListener('click', function () {
  const data = formData();
  const lines = ["Hello Benny's Tech Services,"];
  if (data.name) lines.push('My name is ' + data.name + '.');
  if (data.service) lines.push('Service: ' + data.service);
  if (data.message) lines.push(data.message);
  if (data.phone) lines.push('My phone: ' + data.phone);
  if (data.name || data.message) {
    sendEnquiry(Object.assign({}, data, { website: '' }));
  }
  window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener');
});
})();
