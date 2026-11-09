# Benny's Tech Services

**Your Trusted Digital Partner**

Website for Benny's Tech Services, a freelance and cyber cafe business in Jos, Plateau State, Nigeria.

- CEO: Macham Bwehbensen Peter
- CAC Registration: 9278046
- Phones: 09039953015, 08126406643
- Email: machambwehb@gmail.com

## How the 3 tools work together

| Tool | What it does here |
|------|-------------------|
| **GitHub** | Stores all the code |
| **Vercel** | Hosts the website and runs the backend (`/api` folder) |
| **Supabase** | Database for services, news posts and customer enquiries |
| **Claude** (optional) | Powers the "Ask Benny's Assistant" chat box |

## What is inside

```
public/            the website (pages, css, js)
  js/              scripts (services, search, contact form, admin, chat box)
api/               Vercel backend functions
supabase/schema.sql   database tables, security rules and your starting services
vercel.json        Vercel settings
.env.example       the secret settings the site needs (template only)
```

## SETUP: do these steps in order

### Step 1: Supabase (the database)
1. Create a free project at supabase.com (name it `bennys-tech-services`). Save the database password.
2. Open **SQL Editor > New query**. Paste everything from `supabase/schema.sql`. Click **Run**.
   This creates the tables, the security rules and your 19 starting services.
3. Create your admin login: **Authentication > Users > Add user > Create new user**.
   Use the email `machambwehb@gmail.com`, choose a strong password, and tick **Auto Confirm User**.
   (Only this email can change data. To use another email, change it in the 4 places in `schema.sql` that say `machambwehb@gmail.com`.)
4. Stop strangers from signing up: **Authentication > Sign In / Providers** and turn **off** "Allow new users to sign up".
5. Copy two values from **Project Settings > API**: the **Project URL** and the **anon public key**.

### Step 2: GitHub (store the code)
1. Create an account at github.com and click **New repository**. Name it `bennys-tech-services`. Keep it **Private** if you like. Click **Create repository**.
2. Unzip this download. Open a terminal inside the unzipped folder and run:
   ```
   git init
   git add .
   git commit -m "First version of Benny's Tech Services website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/bennys-tech-services.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME`.) Do not upload any `.env` file. The `.gitignore` already blocks it.

### Step 3: Vercel (put it online)
1. Create an account at vercel.com (sign in with GitHub).
2. **Add New > Project**, pick `bennys-tech-services`, and click **Import**.
3. Leave the build settings as they are (Framework: **Other**). Open **Environment Variables** and add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_ANON_KEY` = your anon public key
   - `ANTHROPIC_API_KEY` = *(optional, see below)*
4. Click **Deploy**. Your site will be live at a `.vercel.app` address.
5. Your own domain: **Project > Settings > Domains > Add**, then follow the steps Vercel shows.

From now on, every time you push a change to GitHub, Vercel updates the site by itself.

### Step 4: Use the admin page
Go to `your-site/admin`, log in, and you can add, edit and delete **services** and **news posts**, and read **enquiries** from customers. Changes show on the website within about a minute.

### Optional: the Claude chat box
1. Create an API key at console.anthropic.com and add it in Vercel as `ANTHROPIC_API_KEY`. Redeploy.
2. A button "Ask Benny's Assistant" then appears on every page. It answers only from your business information and service list, and sends people to WhatsApp for prices.
3. Each message costs a small amount on your Anthropic account. If you do not add the key, the chat box does not appear at all.

## Testing on your own computer
- Quick look (no database, uses the built-in backup list of services): `npx serve public`
- Full test with the database: copy `.env.example` to `.env`, fill it in, then run `npx vercel dev`

## Things to add later
- **Facebook link:** open `public/index.html` (and the other pages) and find the Facebook comment in the footer, or ask Claude to add it to every page once you have the full page link.
- **Prices:** none are shown, because none were given. Add them to a service description in the admin page if you want them shown.
- **Privacy Policy and Terms of Use:** these are simple starting versions. Read them and change anything that does not match how you work.

## Spam note
The contact form has a hidden trap field and length limits. If you ever get a lot of fake enquiries, tell Claude and we will add a stronger check.
