// Admin page: log in, then add / edit / delete services, news posts, and see enquiries.
// Only the admin email set in supabase/schema.sql can change data.
(async function () {
  const loginBox = document.getElementById('login-box');
  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');
  const panel = document.getElementById('admin-panel');
  let db; // Supabase client

  // ---------- small helpers ----------
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function flash(id, text, good) {
    const box = document.getElementById(id);
    box.textContent = text;
    box.className = 'form-status ' + (good ? 'good' : 'bad');
  }
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  const CATEGORY_LABELS = {
    'cyber-cafe': 'Cyber Cafe', 'business-centre': 'Business Centre',
    'scratch-cards': 'Scratch Cards', 'training': 'Computer Training'
  };
  const SECTION_LABELS = {
    jamb: 'JAMB Services', exam: 'Exam Cards and Results', docs: 'Documents and Printing'
  };

  // ---------- connect to Supabase ----------
  try {
    const response = await fetch('/api/config');
    if (!response.ok) throw new Error('No config');
    const cfg = await response.json();
    db = window.supabase.createClient(cfg.url, cfg.anonKey);
  } catch (error) {
    loginMessage.textContent =
      'Admin is not available. Check that SUPABASE_URL and SUPABASE_ANON_KEY are set on Vercel (or in your .env file).';
    loginMessage.className = 'form-status bad';
    loginForm.hidden = true;
    return;
  }

  // ---------- login and logout ----------
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const result = await db.auth.signInWithPassword({
      email: loginForm.elements.email.value.trim(),
      password: loginForm.elements.password.value
    });
    if (result.error) {
      loginMessage.textContent = 'Wrong email or password.';
      loginMessage.className = 'form-status bad';
      return;
    }
    loginForm.reset();
    showPanel();
  });

  document.getElementById('logout').addEventListener('click', async function () {
    await db.auth.signOut();
    panel.hidden = true;
    loginBox.hidden = false;
  });

  function showPanel() {
    loginBox.hidden = true;
    panel.hidden = false;
    loadServices();
    loadPosts();
    loadEnquiries();
  }

  const session = await db.auth.getSession();
  if (session.data && session.data.session) showPanel();

  // ---------- tabs ----------
  document.querySelectorAll('[data-tab]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-tab]').forEach(function (b) {
        b.classList.toggle('active', b === button);
      });
      document.querySelectorAll('.tab').forEach(function (tab) {
        tab.hidden = tab.id !== 'tab-' + button.dataset.tab;
      });
    });
  });

  // =====================================================
  // SERVICES
  // =====================================================
  const svcForm = document.getElementById('svc-form');

  function resetServiceForm() {
    svcForm.reset();
    svcForm.elements.id.value = '';
    svcForm.elements.active.checked = true;
    document.getElementById('svc-form-title').textContent = 'Add a service';
  }
  document.getElementById('svc-cancel').addEventListener('click', resetServiceForm);

  async function loadServices() {
    const result = await db.from('services').select('*').order('id');
    const body = document.getElementById('svc-rows');
    body.innerHTML = '';
    if (result.error) return flash('svc-status', 'Could not load services.', false);

    result.data.forEach(function (s) {
      const row = el('tr');
      row.append(
        el('td', s.title),
        el('td', CATEGORY_LABELS[s.category] || s.category),
        el('td', SECTION_LABELS[s.section] || '-'),
        el('td', s.trending ? 'Yes' : 'No'),
        el('td', s.active ? 'Yes' : 'Hidden')
      );
      const actions = el('td');
      const edit = el('button', 'Edit', 'small-btn');
      edit.type = 'button';
      edit.addEventListener('click', function () {
        svcForm.elements.id.value = s.id;
        svcForm.elements.title.value = s.title;
        svcForm.elements.category.value = s.category;
        svcForm.elements.section.value = s.section || '';
        svcForm.elements.description.value = s.description;
        svcForm.elements.trending.checked = s.trending;
        svcForm.elements.active.checked = s.active;
        document.getElementById('svc-form-title').textContent = 'Edit service';
        svcForm.scrollIntoView({ behavior: 'smooth' });
      });
      const del = el('button', 'Delete', 'small-btn danger');
      del.type = 'button';
      del.addEventListener('click', async function () {
        if (!confirm('Delete "' + s.title + '"? This cannot be undone.')) return;
        const r = await db.from('services').delete().eq('id', s.id);
        if (r.error) return flash('svc-status', 'Could not delete. Are you logged in as the admin?', false);
        flash('svc-status', 'Service deleted.', true);
        loadServices();
      });
      actions.append(edit, del);
      row.appendChild(actions);
      body.appendChild(row);
    });
  }

  svcForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const f = svcForm.elements;
    const payload = {
      title: f.title.value.trim(),
      category: f.category.value,
      section: f.section.value || null,
      description: f.description.value.trim(),
      trending: f.trending.checked,
      active: f.active.checked
    };
    const id = f.id.value;
    const result = id
      ? await db.from('services').update(payload).eq('id', id)
      : await db.from('services').insert(payload);
    if (result.error) {
      return flash('svc-status', 'Could not save. Are you logged in as the admin?', false);
    }
    flash('svc-status', 'Service saved.', true);
    resetServiceForm();
    loadServices();
  });

  // =====================================================
  // NEWS POSTS
  // =====================================================
  const postForm = document.getElementById('post-form');

  function resetPostForm() {
    postForm.reset();
    postForm.elements.id.value = '';
    postForm.elements.published.checked = true;
    document.getElementById('post-form-title').textContent = 'Add a news post';
  }
  document.getElementById('post-cancel').addEventListener('click', resetPostForm);

  async function loadPosts() {
    const result = await db.from('posts').select('*').order('created_at', { ascending: false });
    const body = document.getElementById('post-rows');
    body.innerHTML = '';
    if (result.error) return flash('post-status', 'Could not load posts.', false);

    result.data.forEach(function (p) {
      const row = el('tr');
      row.append(
        el('td', p.title),
        el('td', new Date(p.created_at).toLocaleDateString('en-NG')),
        el('td', p.published ? 'Yes' : 'Hidden')
      );
      const actions = el('td');
      const edit = el('button', 'Edit', 'small-btn');
      edit.type = 'button';
      edit.addEventListener('click', function () {
        postForm.elements.id.value = p.id;
        postForm.elements.title.value = p.title;
        postForm.elements.slug.value = p.slug;
        postForm.elements.content.value = p.content;
        postForm.elements.published.checked = p.published;
        document.getElementById('post-form-title').textContent = 'Edit news post';
        postForm.scrollIntoView({ behavior: 'smooth' });
      });
      const del = el('button', 'Delete', 'small-btn danger');
      del.type = 'button';
      del.addEventListener('click', async function () {
        if (!confirm('Delete "' + p.title + '"? This cannot be undone.')) return;
        const r = await db.from('posts').delete().eq('id', p.id);
        if (r.error) return flash('post-status', 'Could not delete. Are you logged in as the admin?', false);
        flash('post-status', 'Post deleted.', true);
        loadPosts();
      });
      actions.append(edit, del);
      row.appendChild(actions);
      body.appendChild(row);
    });
  }

  postForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const f = postForm.elements;
    const title = f.title.value.trim();
    const payload = {
      title: title,
      slug: slugify(f.slug.value.trim() || title),
      content: f.content.value.trim(),
      published: f.published.checked
    };
    if (!payload.slug) return flash('post-status', 'Please enter a title.', false);
    const id = f.id.value;
    const result = id
      ? await db.from('posts').update(payload).eq('id', id)
      : await db.from('posts').insert(payload);
    if (result.error) {
      return flash('post-status',
        'Could not save. The web address name may already be used, or you are not logged in as the admin.', false);
    }
    flash('post-status', 'Post saved.', true);
    resetPostForm();
    loadPosts();
  });

  // =====================================================
  // ENQUIRIES (read and delete only)
  // =====================================================
  async function loadEnquiries() {
    const result = await db.from('enquiries').select('*')
      .order('created_at', { ascending: false }).limit(100);
    const list = document.getElementById('enquiry-list');
    list.innerHTML = '';
    if (result.error) return flash('enq-status', 'Could not load enquiries.', false);
    if (!result.data.length) {
      list.appendChild(el('p', 'No enquiries yet.', 'muted'));
      return;
    }
    result.data.forEach(function (q) {
      const card = el('article', null, 'enquiry');
      const when = new Date(q.created_at).toLocaleString('en-NG');
      card.append(
        el('h3', q.service || 'General message'),
        el('p', when, 'muted'),
        el('p', 'Name: ' + (q.name || '-')),
        el('p', 'Phone: ' + (q.phone || '-')),
        el('p', q.message || '')
      );
      const del = el('button', 'Delete', 'small-btn danger');
      del.type = 'button';
      del.addEventListener('click', async function () {
        if (!confirm('Delete this enquiry?')) return;
        const r = await db.from('enquiries').delete().eq('id', q.id);
        if (r.error) return flash('enq-status', 'Could not delete.', false);
        loadEnquiries();
      });
      card.appendChild(del);
      list.appendChild(card);
    });
  }
  document.getElementById('enq-refresh').addEventListener('click', loadEnquiries);
})();
