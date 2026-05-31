# Namecheap Hosting Guide for Madrid TV Live
# নেমচিপ সার্ভার হোস্টিং গাইড - MADRID TV LIVE

This guide explains how to host your modern React/Firebase sport streaming portal on standard Namecheap Shared Hosting (cPanel) using HTML/CSS/JavaScript and optional PHP. 

যেহেতু আপনার সাইটটি React, Tailwind CSS এবং Firebase ব্যবহার করে তৈরি, তাই এটি অত্যন্ত দ্রুত এবং রিয়েল-টাইম কাজ করে। আপনি সহজেই এটিকে Namecheap (cPanel) শেয়ার্ড হোস্টিং-এ হোস্ট করতে পারবেন। নিচে বাংলায় এবং ইংরেজিতে বিস্তারিত নিয়মাবলী দেওয়া হলো:

---

## Method 1: Host as a Static React Application (Highly Recommended)
React compiles down to standard static **HTML, CSS, and JS** files which execute directly in the client browser, while Firestore securely handles the database backend. This is the absolute best and fastest way to host your site.

### Step 1: Build the Project
1. Open your terminal in this workspace.
2. Run the build script to compile the site compile:
   ```bash
   npm run build
   ```
3. This creates a newly generated `/dist` folder containing optimized HTML, CSS, and JS files.

### Step 2: Configure cPanel `.htaccess`
To prevent `404 Not Found` errors when users reload a sub-page (like `/live-score` or `/football`), create an `.htaccess` file inside Namecheap cPanel.

Create a file named `.htaccess` in your primary `public_html` folder with the following configuration:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 3: Upload to cPanel
1. Compress all files **inside** the `dist/` directory into a `.zip` archive.
2. Log into your Namecheap cPanel account.
3. Open **File Manager** and select **public_html**.
4. Upload your `.zip` archive and extract it.
5. Upload the `.htaccess` file inside `public_html` alongside the files.
Your site is now fully live on Namecheap!

---

## Method 2: Traditional PHP Hybrid Integration (PHP Wrapper)
If you want standard PHP scripts (e.g., to handle contact emails, log queries, or authenticate custom endpoints) running on your Node-less Namecheap server, you can use PHP wrappers.

We have created companion files in `/namecheap-php/` including:
1. `index.php` - A PHP router that loads the compiled main application layout.
2. `contact-endpoint.php` - A PHP mail dispatcher script that uses PHP standard `mail()` to send support tickets to your email.

### How to use PHP wrappers:
1. Run `npm run build`.
2. Move your static assets (`dist/assets/*`) into Namecheap's `public_html/assets/` folder.
3. Upload `/namecheap-php/index.php` and `contact-endpoint.php` files into `public_html/`.
4. Now, Namecheap will serve your web elements directly through PHP scripts!

---

## Firebase Whitelist & Configuration
Remember to add your Namecheap custom domain to your Firebase Authorized Domains to enable secure sign-ins:
1. Go to **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized Domains**.
2. Click **Add Domain** and type your newly bought domain name (e.g. `madridtvlive.com`).

---

### আপনার যেকোনো সহায়তার প্রয়োজন হলে আমাদের জানাতে পারেন! শুভকামনা! 🚀
