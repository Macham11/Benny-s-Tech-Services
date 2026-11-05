// Category pages (Cyber Cafe, Business Centre, Scratch Cards, Training, All Services)
(async function () {
  const category = document.body.dataset.category;
  const grid = document.getElementById('category-grid');
  const message = document.getElementById('category-message');

  const all = await getServices();
  const items = category === 'all'
    ? all
    : all.filter(function (s) { return s.category === category; });

  grid.innerHTML = '';
  if (!items.length) {
    message.textContent = 'No services are listed here yet. Please chat with us on WhatsApp.';
    return;
  }
  items.forEach(function (s) { grid.appendChild(createCard(s)); });
})();
