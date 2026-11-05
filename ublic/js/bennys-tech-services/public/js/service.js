// Service details page: /service?id=5
(async function () {
  const box = document.getElementById('service-detail');
  const id = new URLSearchParams(window.location.search).get('id');
  const all = await getServices();
  const service = all.find(function (s) { return String(s.id) === String(id); });

  box.innerHTML = '';
  if (!service) {
    const p = document.createElement('p');
    p.textContent = 'We could not find that service.';
    const a = document.createElement('a');
    a.href = '/services';
    a.className = 'btn btn-green';
    a.textContent = 'See all services';
    box.append(p, a);
    return;
  }

  document.title = service.title + " | Benny's Tech Services";

  const tag = document.createElement('p');
  tag.className = 'detail-tag';
  tag.textContent = CATEGORY_NAMES[service.category] || 'Service';

  const h1 = document.createElement('h1');
  h1.textContent = service.title;

  const text = document.createElement('p');
  text.className = 'detail-text';
  text.textContent = service.description;

  const note = document.createElement('p');
  note.className = 'muted';
  note.textContent = 'For the price and what you need to bring, chat with us on WhatsApp.';

  const actions = document.createElement('div');
  actions.className = 'detail-actions';

  const request = document.createElement('button');
  request.type = 'button';
  request.className = 'btn btn-green';
  request.textContent = 'Request this service';
  request.addEventListener('click', function () { requestService(service); });

  const back = document.createElement('a');
  back.className = 'btn btn-outline-dark';
  back.href = '/services';
  back.textContent = 'See all services';

  actions.append(request, back);
  box.append(tag, h1, text, note, actions);
})();
