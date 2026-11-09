// Runs on every page: menu, search icon, cookie notice.
(function () {

// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', function () {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Search bar
const searchToggle = document.getElementById('search-toggle');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');

if (searchToggle && searchBar && searchInput) {
  searchToggle.addEventListener('click', function () {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) searchInput.focus();
  });
}

// On pages other than Home, pressing Enter opens Home with the search
if (searchForm) {
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (document.getElementById('services-root')) return; // Home searches live
    const term = searchInput.value.trim();
    window.location.href = '/?q=' + encodeURIComponent(term);
  });
}

// Cookie notice
(function () {
  let accepted = false;
  try { accepted = localStorage.getItem('cookies-ok') === 'yes'; } catch (e) {}
  if (accepted) return;

  const box = document.createElement('div');
  box.className = 'cookie-notice';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Cookie notice');

  const text = document.createElement('p');
  text.append('This website uses cookies and similar browser storage to work properly. ');
  const more = document.createElement('a');
  more.href = '/privacy-policy';
  more.textContent = 'Learn more';
  text.appendChild(more);

  const ok = document.createElement('button');
  ok.type = 'button';
  ok.textContent = 'Ok';
  ok.addEventListener('click', function () {
    try { localStorage.setItem('cookies-ok', 'yes'); } catch (e) {}
    box.remove();
  });

  box.append(text, ok);
  document.body.appendChild(box);
})();
})();
