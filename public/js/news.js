// News and updates list
(async function () {
  const list = document.getElementById('news-list');
  const message = document.getElementById('news-message');

  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Request failed');
    const posts = await response.json();

    if (!posts.length) {
      message.textContent = 'No updates yet. Please check back soon.';
      return;
    }
    message.textContent = '';
    posts.forEach(function (post) {
      const card = document.createElement('article');
      card.className = 'news-card';

      const h2 = document.createElement('h2');
      const a = document.createElement('a');
      a.href = '/post?slug=' + encodeURIComponent(post.slug);
      a.textContent = post.title;
      h2.appendChild(a);

      const date = document.createElement('p');
      date.className = 'muted';
      date.textContent = new Date(post.created_at).toLocaleDateString('en-NG', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      const excerpt = document.createElement('p');
      const text = post.content.replace(/\s+/g, ' ').trim();
      excerpt.textContent = text.length > 160 ? text.slice(0, 160) + '...' : text;

      card.append(h2, date, excerpt);
      list.appendChild(card);
    });
  } catch (error) {
    message.textContent = 'Updates are not available right now. Please try again later.';
  }
})();
