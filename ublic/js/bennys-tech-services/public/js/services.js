// Home page: the four service sections, Load More and search.
(function () {
const PAGE_SIZE = 3; // cards shown at first, and added by each "Load More"

const SECTIONS = [
  { id: 'jamb', title: 'JAMB Services', link: '/cyber-cafe',
    filter: function (s) { return s.section === 'jamb'; } },
  { id: 'exam', title: 'Exam Cards and Results', link: '/scratch-cards',
    filter: function (s) { return s.section === 'exam'; } },
  { id: 'docs', title: 'Documents and Printing', link: '/business-centre',
    filter: function (s) { return s.section === 'docs'; } },
  { id: 'trending', title: 'Trending Services', link: '/services',
    filter: function (s) { return s.trending; } }
];

const root = document.getElementById('services-root');
const searchInput = document.getElementById('search-input');
const searchBar = document.getElementById('search-bar');
const searchResults = document.getElementById('search-results');
const searchGrid = document.getElementById('search-grid');
const searchMessage = document.getElementById('search-message');

let allServices = [];

function renderSection(section) {
  const items = allServices.filter(section.filter);
  if (!items.length) return null;
  let shown = 0;

  const wrap = document.createElement('section');
  wrap.className = 'services-section';
  wrap.id = section.id;
  const container = document.createElement('div');
  container.className = 'container';

  const head = document.createElement('div');
  head.className = 'section-head';
  const h2 = document.createElement('h2');
  h2.textContent = section.title;
  const viewAll = document.createElement('a');
  viewAll.href = section.link;
  viewAll.textContent = 'View all';
  head.append(h2, viewAll);

  const grid = document.createElement('div');
  grid.className = 'service-grid';

  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'btn-more';
  more.textContent = 'Load More Services';

  function showMore() {
    items.slice(shown, shown + PAGE_SIZE).forEach(function (s) {
      grid.appendChild(createCard(s));
    });
    shown += PAGE_SIZE;
    if (shown >= items.length) more.style.display = 'none';
  }
  more.addEventListener('click', showMore);
  showMore();

  container.append(head, grid, more);
  wrap.appendChild(container);
  return wrap;
}

function runSearch() {
  const term = searchInput.value.trim().toLowerCase();
  if (term === '') {
    searchResults.hidden = true;
    root.hidden = false;
    return;
  }
  const matches = allServices.filter(function (s) {
    return (s.title + ' ' + s.description).toLowerCase().includes(term);
  });
  searchGrid.innerHTML = '';
  matches.forEach(function (s) { searchGrid.appendChild(createCard(s)); });
  searchMessage.textContent = matches.length === 0
    ? 'No service found. Please chat with us on WhatsApp and we will help you.'
    : matches.length + ' service(s) found';
  root.hidden = true;
  searchResults.hidden = false;
}

(async function start() {
  allServices = await getServices();
  root.innerHTML = '';
  SECTIONS.forEach(function (section) {
    const element = renderSection(section);
    if (element) root.appendChild(element);
  });

  searchInput.addEventListener('input', runSearch);

  // Links like /?q=waec (from the quick-link buttons) open with a search
  const q = new URLSearchParams(window.location.search).get('q');
  if (q) {
    searchInput.value = q;
    searchBar.classList.add('open');
    runSearch();
  }
})();
})();
