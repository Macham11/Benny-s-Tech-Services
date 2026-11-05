// One news post: /post?slug=my-post
(async function () {
  const box = document.getElementById('post-box');
  const slug = new URLSearchParams(window.location.search).get('slug');

  function fail(text) {
    box.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = text;
    const a = document.createElement('a');
    a.href = '/news';
    a.className = 'btn btn-green';
    a.textContent = 'Back to news';
    box.append(p, a);
  }

  if (!slug) return fail('We could not find that update.');

  try {
    const response = await fetch('/api/posts?slug=' + encodeURIComponent(slug));
    if (!response.ok) throw new Error('Request failed');
    const posts = await response.json();
    if (!posts.length) return fail('We could not find that update.');
    const post = posts[0];

    document.title = post.title + " | Benny's Tech Services";
    box.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = post.title;

    const date = document.createElement('p');
    date.className = 'muted';
    date.textContent = new Date(post.created_at).toLocaleDateString('en-NG', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    box.append(h1, date);
    post.content.split(/\n\s*\n/).forEach(function (part) {
      if (!part.trim()) return;
      const p = document.createElement('p');
      p.textContent = part.trim();
      box.appendChild(p);
    });

    const back = document.createElement('a');
    back.href = '/news';
    back.className = 'btn btn-outline-dark';
    back.textContent = 'Back to news';
    box.appendChild(back);
  } catch (error) {
    fail('This update is not available right now.');
  }
})();
