const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const root = __dirname;

// Convert a local file to a base64 data URI
function b64(relPath, mime) {
  const abs = path.join(root, relPath);
  const data = fs.readFileSync(abs).toString('base64');
  return `data:${mime};base64,${data}`;
}

const logoB64    = b64('manual_assets/media__1772641756174.png', 'image/png');
const qrB64      = b64('manual_assets/media__1772641756111.png', 'image/png');
const iconB64    = b64('public/icons/icon-512.png', 'image/png');
const studentsB64 = b64('manual_assets/students_cover.jpg', 'image/jpeg');

function ss(name) {
  return b64(`screenshots/${name}.png`, 'image/png');
}

// ---- helpers ----
function feature(anchorId, title, description, sidebarImgB64, sidebarCaption, pageImgB64, pageCaption, exampleHtml) {
  return `
  <hr class="divider">
  <h3 class="feature-title" id="${anchorId}">${title}</h3>
  <p class="description">${description}</p>
  <div class="img-row">
    <div class="img-cell">
      <img src="${sidebarImgB64}" alt="${sidebarCaption}">
      <div class="img-caption">${sidebarCaption}</div>
    </div>
    <div class="img-cell">
      <img src="${pageImgB64}" alt="${pageCaption}">
      <div class="img-caption">${pageCaption}</div>
    </div>
  </div>
  <div class="example-box">${exampleHtml}</div>`;
}

function page(pageNum, content, isLast = false) {
  const pb = isLast ? '' : 'page-break-after: always;';
  return `
<div style="position:relative; min-height:245mm; ${pb}">
  <img src="${logoB64}" alt="GRN Logo" style="position:absolute; top:0; right:0; height:18mm; width:auto;">
  <div class="content-area">${content}</div>
  <img src="${qrB64}" alt="QR" style="position:absolute; bottom:4mm; right:0; width:22mm; height:22mm; border:1px solid #ddd; border-radius:6px;">
  <div style="position:absolute; bottom:8mm; left:50%; transform:translateX(-50%); font-size:10pt; color:#888;">${pageNum}</div>
</div>`;
}

const pages = [];

// PAGE 3 — Section 1: Search
pages.push(page(3, `
  <h2 class="section-title" id="section-1">1. Core Exploration — Finding Content</h2>
  <p class="section-intro">These tools help you find the Good News you want to share or listen to quickly.</p>
  ${feature('search', 'Search',
    'Instead of scrolling through the 100+ languages on the Home screen, type a language name, a message title, or a keyword here to find exactly what you need instantly.',
    ss('02_Search_Sidebar'), '① Select "Search" in the Sidebar',
    ss('02_Search'), '② The Search page opens',
    '<b>Example:</b> You just met someone who speaks "Isan" but can\'t find it in the long list. Open <b>Search</b>, type "Isan", and tap it instantly to load all their native messages.'
  )}`
));

// PAGE 4 — Sign Language
pages.push(page(4, `
  ${feature('sign-language', 'Sign Language Video',
    'A dedicated page that provides quick access to visual Good News content specifically tailored for the Deaf community in Thailand.',
    ss('03_Sign_Language_Sidebar'), '① Select "Sign Language Video"',
    ss('03_Sign_Language'), '② Visual content page opens',
    '<b>Example:</b> You meet someone who is deaf. Instead of writing back and forth, open the Sidebar, click <b>Sign Language Video</b>, and instantly show them the life-changing message in their own language.'
  )}`
));

// PAGE 5 — Section 2: My Favorites
pages.push(page(5, `
  <h2 class="section-title" id="section-2">2. Personalized Content — Your Dashboard</h2>
  <p class="section-intro">These pages are all about saving things for later — your personal hub.</p>
  ${feature('my-favorites', 'My Favorites',
    'A quick-bookmark page. Find a language you use often or a message you love? Tap the &ldquo;Heart&rdquo; icon and it is saved here — no more searching.',
    ss('04_My_Favorites_Sidebar'), '① Select "My Favorites"',
    ss('04_My_Favorites'), '② See your saved content',
    '<b>Example:</b> Planning a trip to the Karen community? Favorite the "Karen" language folder so it sits right at the top of <b>My Favorites</b> for instant daily access.'
  )}`
));

// PAGE 6 — My Notes
pages.push(page(6, `
  ${feature('my-notes', 'My Notes',
    'A private journaling space. Jot down thoughts, sermon notes, or personal reminders about who you want to share a specific message with.',
    ss('05_My_Notes_Sidebar'), '① Select "My Notes"',
    ss('05_My_Notes'), '② Write or view your notes',
    '<b>Example:</b> While listening to a teaching on forgiveness, a friend comes to mind. Open <b>My Notes</b> and jot: <em>"Share Words of Life track 5 with Somchai tomorrow at the coffee shop."</em>'
  )}`
));

// PAGE 7 — Selected Messages
pages.push(page(7, `
  ${feature('selected-messages', 'Selected Messages',
    'Think of this as your <strong>&ldquo;Shopping Cart&rdquo; for Sharing</strong>. Check the boxes next to messages across multiple languages as you browse. This page gathers them all into one clean list for copying, sharing, or printing QR cards.',
    ss('06_Selected_Messages_Sidebar'), '① Select "Selected Messages"',
    ss('06_Selected_Messages'), '② See your grouped messages',
    '<b>Example:</b> Hosting an event? Browse the app and check Thai, Isan, and English messages. Go to <b>Selected Messages</b>, tap "Print", and generate QR cards to hand out to every attendee.'
  )}`
));

// PAGE 8 — Section 3: My Library
pages.push(page(8, `
  <h2 class="section-title" id="section-3">3. Offline Listening &amp; Storage</h2>
  <p class="section-intro">These two pages work together. Storage Management is the settings companion for My Library.</p>
  ${feature('my-library', 'My Library',
    'This is where offline audio lives. When you tap "Download" on any audio track, it is saved directly to your phone. Open My Library anytime — even with no internet connection.',
    ss('07_My_Library_Sidebar'), '① Select "My Library"',
    ss('07_My_Library'), '② Play your downloaded audio',
    '<b>Example:</b> Traveling to a remote village with no cellular data? Before leaving WiFi, download 10 audio tracks. At the village, open <b>My Library</b> and play them with zero signal.'
  )}`
));

// PAGE 9 — Storage Management
pages.push(page(9, `
  ${feature('storage-management', 'Storage Management',
    'Audio files take up space on your phone. This page shows how much space your downloads are using and lets you quickly delete old tracks to free up storage.',
    ss('08_Storage_Management_Sidebar'), '① Select "Storage Management"',
    ss('08_Storage_Management'), '② Free up app storage',
    '<b>Example:</b> Your phone says "Storage Almost Full." Open <b>Storage Management</b>, see 50 old messages from a trip last year, and click "Delete All" to instantly reclaim that space.'
  )}`
));

// PAGE 10 — Section 4: Import
pages.push(page(10, `
  <h2 class="section-title" id="section-4">4. Advanced Tools &amp; App Info</h2>
  <p class="section-intro">Utility pages for power users and for connecting with the development team.</p>
  ${feature('import', 'Import',
    'A "Power User" tool. The app contains a curated list of messages, but Global Recordings Network (GRN) has thousands more. Find a Program ID on the GRN website and type it here to import it.',
    ss('09_Import_Sidebar'), '① Select "Import"',
    ss('09_Import'), '② Load GRN content by ID',
    '<b>Example:</b> Someone asks for a rare dialect not in the main list. Search the GRN website, find Program ID 62808, type it into <b>Import</b>. The app pulls it in for both listening and sharing.'
  )}`
));

// PAGE 11 — Feedback
pages.push(page(11, `
  ${feature('feedback', 'Feedback',
    'A simple contact form. It pre-fills an email to the development team so you can easily send bug reports, questions, or feature requests with just a few taps.',
    ss('10_Feedback_Sidebar'), '① Select "Feedback"',
    ss('10_Feedback'), '② Send a message to the creators',
    '<b>Example:</b> You notice a translation phrase sounds awkward, or you have a great new feature idea. Open <b>Feedback</b>, type your thoughts, and hit send!'
  )}`
));

// PAGE 12 — Share (last = no page break after)
pages.push(page(12, `
  ${feature('share', 'Share App',
    'While individual message pages let you share <em>one audio track</em>, <strong>this page shares the App itself</strong>. Send the install link via Email, LINE, LinkTree, or your device\'s native share sheet.',
    ss('11_Share_Sidebar'), '① Select "Share"',
    ss('11_Share'), '② Send the app link',
    '<b>Example:</b> A friend asks "How do I get that app?" You open the Sidebar, click <b>Share</b>, tap the LINE button, and instantly ping them the install link.'
  )}`, true
));

// Build TOC page (page 2)
const tocPage = page(2, `
  <h2 class="toc-title">Table of Contents</h2>
  <ul class="toc">
    <li><a href="#section-1">1. Core Exploration (Finding Content)</a>
      <ul>
        <li><a href="#search">Search</a></li>
        <li><a href="#sign-language">Sign Language Video</a></li>
      </ul>
    </li>
    <li><a href="#section-2">2. Personalized Content (Your Dashboard)</a>
      <ul>
        <li><a href="#my-favorites">My Favorites</a></li>
        <li><a href="#my-notes">My Notes</a></li>
        <li><a href="#selected-messages">Selected Messages</a></li>
      </ul>
    </li>
    <li><a href="#section-3">3. Offline Listening &amp; Storage</a>
      <ul>
        <li><a href="#my-library">My Library</a></li>
        <li><a href="#storage-management">Storage Management</a></li>
      </ul>
    </li>
    <li><a href="#section-4">4. Advanced Tools &amp; App Info</a>
      <ul>
        <li><a href="#import">Import</a></li>
        <li><a href="#feedback">Feedback</a></li>
        <li><a href="#share">Share App</a></li>
      </ul>
    </li>
  </ul>
`);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Thai Good News – Sidebar User Manual</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 14pt;
    color: #222;
    background: white;
  }
  a { color: #1a56db; text-decoration: none; }

  /* COVER */
  .cover-page {
    position: relative;
    page-break-after: always;
    padding: 16mm 16mm 16mm 16mm;
    min-height: 245mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .cover-logo {
    position: absolute;
    top: 8mm; right: 8mm;
    height: 25.4mm; width: auto;
  }
  .cover-qr {
    position: absolute;
    bottom: 8mm; right: 8mm;
    width: 28mm; height: 28mm;
    border: 1px solid #ccc; border-radius: 8px;
  }
  .cover-title {
    font-size: 34pt; font-weight: 900; color: #CC3333;
    margin: 10px 0 4px 0; letter-spacing: -1px;
  }
  .cover-subtitle {
    font-size: 17pt; color: #555; font-weight: 400; margin: 0 0 24px 0;
  }
  .cover-photo {
    width: 100%; max-width: 165mm;
    border-radius: 14px; border: 1px solid #ddd;
  }

  /* RUNNING PAGE WRAPPER */
  .content-area {
    padding: 22mm 4mm 30mm 4mm;
  }

  /* TOC */
  .toc-title {
    font-size: 24pt; font-weight: 800; color: #CC3333;
    border-bottom: 2.5px solid #CC3333;
    padding-bottom: 8px; margin: 0 0 16px 0;
  }
  ul.toc          { list-style: none; padding: 0; margin: 0; }
  ul.toc > li     { font-size: 15pt; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; }
  ul.toc ul       { list-style: none; padding-left: 18px; margin-top: 4px; border-left: 3px solid #e2e8f0; }
  ul.toc ul li    { font-size: 13pt; font-weight: 500; margin-bottom: 6px; }
  ul.toc a        { color: #1a56db; }

  /* SECTION / FEATURE TITLES */
  .section-title  { font-size: 21pt; font-weight: 800; color: #CC3333; border-bottom: 2px solid #CC3333; padding-bottom: 5px; margin: 0 0 4px 0; }
  .section-intro  { font-size: 12.5pt; font-style: italic; color: #666; margin-bottom: 12px; }
  .feature-title  { font-size: 18pt; font-weight: 700; color: #1a1a2e; margin: 16px 0 6px 0; }
  .description    { font-size: 14pt; margin-bottom: 10px; line-height: 1.6; }

  /* IMAGES */
  .img-row        { display: flex; gap: 12px; margin: 10px 0; justify-content: center; }
  .img-cell       { flex: 1; display: flex; flex-direction: column; align-items: center; max-width: 50%; }
  .img-cell img   { width: 100%; border-radius: 10px; border: 1px solid #bdc3cc; }
  .img-caption    { font-size: 10pt; color: #666; margin-top: 5px; text-align: center; }

  /* EXAMPLE */
  .example-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 5px solid #CC3333;
    padding: 13px 16px;
    border-radius: 8px;
    font-size: 14pt;
    line-height: 1.6;
    margin: 10px 0 6px 0;
  }
  .example-box b { color: #CC3333; }
  hr.divider { border: none; border-top: 1px solid #e2e8f0; margin: 14px 0; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover-page">
  <img class="cover-logo" src="${iconB64}" alt="App Logo">
  <h1 class="cover-title">Thai Good News</h1>
  <h2 class="cover-subtitle">Sidebar Features — User Manual</h2>
  <img class="cover-photo" src="${studentsB64}" alt="Students sharing the Good News app">
  <img class="cover-qr" src="${qrB64}" alt="QR code — scan to install the app">
</div>

<!-- TOC (page 2) -->
${tocPage}

<!-- CONTENT PAGES -->
${pages.join('\n')}

</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const pg = await browser.newPage();

  await pg.setContent(html, { waitUntil: 'load' });

  await pg.pdf({
    path: path.join(root, 'TGN_Sidebar_Manual.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '16mm', right: '16mm' }
  });

  await browser.close();
  console.log('PDF generated successfully: TGN_Sidebar_Manual.pdf');
})();
