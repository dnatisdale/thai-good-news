const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const root = __dirname;

function b64(relPath, mime) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    return '';
  }
  const data = fs.readFileSync(abs).toString('base64');
  return `data:${mime};base64,${data}`;
}

const tgnLogoB64  = b64('manual_assets/tgn_logo.jpg', 'image/jpeg');
const newQrB64    = b64('manual_assets/new_qr.png', 'image/png');
const studentsB64 = b64('manual_assets/students_cover.jpg', 'image/jpeg');

function ss(name) {
  return b64(`screenshots/${name}.png`, 'image/png');
}

function feature(pageNum, id, title, description, sidebarImg, sidebarCaption, pageImg, pageCaption, exampleText) {
  return `
<div class="page-container" id="${id}">
  
  <h2 class="feature-title">${title}</h2>
  
  <p class="description">
    ${description}
  </p>
  
  <div class="images-container">
    <div class="img-cell">
      <img src="${ss(sidebarImg)}" alt="${sidebarCaption}">
      <div class="img-caption">${sidebarCaption}</div>
    </div>
    <div class="img-cell">
      <img src="${ss(pageImg)}" alt="${pageCaption}">
      <div class="img-caption">${pageCaption}</div>
    </div>
  </div>
  
  <div class="flex-spacer"></div>
  
  <div class="example-box">
    <strong style="color: #CC3333; font-size: 16pt;">Example Usage:</strong><br><br>
    ${exampleText}
  </div>
</div>
`;
}

const pagesHtml = [];

// 3. Search
pagesHtml.push(feature(3, 'search', '1. Search', 
  'Instead of scrolling through the 100+ languages on the Home screen, type a language name, a message title, or a keyword here to find exactly what you need instantly.',
  '02_Search_Sidebar', '① Select "Search" in Sidebar',
  '02_Search', '② Search Page Opens',
  'You just met someone who speaks "Isan" but can\'t find it in the long list. Open <b>Search</b>, type "Isan", and tap it instantly to load all their native messages.'
));

// 4. Sign Language Video
pagesHtml.push(feature(4, 'sign-language', '2. Sign Language Video',
  'A dedicated page that provides quick access to visual Good News content specifically tailored for the Deaf community in Thailand.',
  '03_Sign_Language_Sidebar', '① Select "Sign Language Video"',
  '03_Sign_Language', '② View Visual Content',
  'You meet someone who is deaf. Instead of writing back and forth, open the Sidebar, click <b>Sign Language Video</b>, and instantly show them the life-changing message in their own language.'
));

// 5. My Favorites
pagesHtml.push(feature(5, 'my-favorites', '3. My Favorites',
  'A quick-bookmark page. Find a language you use often or a message you love? Tap the &ldquo;Heart&rdquo; icon and it is saved here &mdash; no more searching.',
  '04_My_Favorites_Sidebar', '① Select "My Favorites"',
  '04_My_Favorites', '② Saved Content Library',
  'Planning a trip to the Karen community? Favorite the "Karen" language folder so it sits right at the top of <b>My Favorites</b> for instant daily access.'
));

// 6. My Notes
pagesHtml.push(feature(6, 'my-notes', '4. My Notes',
  'A private journaling space. Jot down thoughts, sermon notes, or personal reminders about who you want to share a specific message with.',
  '05_My_Notes_Sidebar', '① Select "My Notes"',
  '05_My_Notes', '② Read & Write Notes',
  'While listening to a teaching on forgiveness, a friend comes to mind. Open <b>My Notes</b> and jot down: <em>"Share Words of Life track 5 with Somchai tomorrow at the coffee shop."</em>'
));

// 7. Selected Messages
pagesHtml.push(feature(7, 'selected-messages', '5. Selected Messages',
  'Think of this as your <strong>"Shopping Cart" for Sharing</strong>. Check the boxes next to messages across multiple languages as you browse. This page gathers them all into one clean list for copying, sharing, or printing QR cards.',
  '06_Selected_Messages_Sidebar', '① Select "Selected Messages"',
  '06_Selected_Messages', '② Review Selected Messages',
  'Hosting an event? Browse the app and check Thai, Isan, and English messages. Go to <b>Selected Messages</b>, tap "Print", and generate QR cards to hand out to every attendee.'
));

// 8. My Library
pagesHtml.push(feature(8, 'my-library', '6. My Library',
  'This is where offline audio lives. When you tap "Download" on any audio track, it is saved directly to your phone. Open My Library anytime &mdash; even with no internet connection.',
  '07_My_Library_Sidebar', '① Select "My Library"',
  '07_My_Library', '② Play Offline Audio',
  'Traveling to a remote village with no cellular data? Before leaving WiFi, download 10 audio tracks. At the village, open <b>My Library</b> and play them with zero signal.'
));

// 9. Storage Management
pagesHtml.push(feature(9, 'storage-management', '7. Storage Management',
  'Audio files take up space on your phone. This page shows how much space your downloads are using and lets you quickly delete old tracks to free up storage.',
  '08_Storage_Management_Sidebar', '① Select "Storage Management"',
  '08_Storage_Management', '② Free Up Space',
  'Your phone says "Storage Almost Full." Open <b>Storage Management</b>, see 50 old messages from a trip last year, and click "Delete All" to instantly reclaim that space.'
));

// 10. Import
pagesHtml.push(feature(10, 'import', '8. Import',
  'A "Power User" tool. The app contains a curated list of messages, but Global Recordings Network (GRN) has thousands more. Find a Program ID on the GRN website and type it here to import it.',
  '09_Import_Sidebar', '① Select "Import"',
  '09_Import', '② Import New Content',
  'Someone asks for a rare dialect not in the main list. Search the GRN website, find Program ID 62808, and type it into <b>Import</b>. The app pulls it in for both listening and sharing.'
));

// 11. Feedback
pagesHtml.push(feature(11, 'feedback', '9. Feedback',
  'A simple contact form. It pre-fills an email to the development team so you can easily send bug reports, questions, or feature requests with just a few taps.',
  '10_Feedback_Sidebar', '① Select "Feedback"',
  '10_Feedback', '② Contact Developers',
  'You notice a translation phrase sounds awkward, or you have a great new feature idea. Open <b>Feedback</b>, type your thoughts, and hit send!'
));

// 12. Share App
pagesHtml.push(`
<div class="page-container" id="share">
  
  <h2 class="feature-title">10. Share App</h2>
  
  <p class="description">
    While individual message pages let you share <em>one audio track</em>, <strong>this page shares the App itself</strong>. Send the install link via Email, LINE, LinkTree, or your device's native share sheet.
  </p>
  
  <div class="images-container">
    <div class="img-cell">
      <img src="${ss('11_Share_Sidebar')}" alt="Select Share">
      <div class="img-caption">① Select "Share" App</div>
    </div>
    <div class="img-cell">
      <img src="${ss('11_Share')}" alt="Share Options">
      <div class="img-caption">② App Share Links</div>
    </div>
  </div>
  
  <div class="flex-spacer"></div>
  
  <div class="example-box">
    <strong style="color: #CC3333; font-size: 16pt;">Example Usage:</strong><br><br>
    A friend asks "How do I get that app?" You open the Sidebar, click <b>Share</b>, tap the LINE button, and instantly ping them the install link.
  </div>
</div>
`);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .page-container {
    position: relative;
    page-break-after: always;
    min-height: 8.5in;
    display: flex;
    flex-direction: column;
  }

  /* ABSOLUTE ELEMENTS */
  .logo-top-right {
    position: absolute;
    top: -0.2in;
    right: -0.25in;
    width: 1in;
    height: 1in;
    border-radius: 50%;
  }
  .qr-bottom-right {
    position: absolute;
    bottom: -0.2in;
    right: -0.25in;
    width: 0.85in;
    height: 0.85in;
    border-radius: 8px;
  }
  .page-number {
    position: absolute;
    bottom: -0.1in;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14pt;
    color: #000;
    font-weight: 500;
  }

  /* COVER STYLES */
  .cover-title {
    font-size: 42pt; 
    font-weight: 900; 
    color: #CC3333; 
    margin: 0 0 10px 0;
  }
  .cover-subtitle {
    font-size: 24pt; 
    color: #444; 
    margin: 0 0 40px 0;
  }
  .cover-photo {
    width: 100%; 
    max-width: 6.8in; 
    border-radius: 12px;
  }

  /* TOC STYLES */
  .toc-title {
    font-size: 32pt; 
    font-weight: 800; 
    color: #CC3333; 
    border-bottom: 3px solid #CC3333; 
    margin: 0 0 20px 0; 
    padding-bottom: 15px;
  }
  ul.toc {
    list-style: none; 
    padding: 0; 
    margin: 0;
  }
  ul.toc li {
    font-size: 18pt; 
    font-weight: 700; 
    margin-bottom: 16px; 
  }
  ul.toc a {
    color: #000; 
    text-decoration: none; 
  }

  /* FEATURE STYLES */
  .feature-title {
    font-size: 28pt; 
    font-weight: 800; 
    color: #CC3333; 
    margin: 0 0 10px 0; 
    border-bottom: 2px solid #CC3333;
    padding-bottom: 8px;
  }
  .description {
    font-size: 16pt; 
    line-height: 1.4; 
    margin: 0 0 15px 0;
    color: #222;
  }
  .images-container {
    display: flex; 
    gap: 30px; 
    align-items: flex-start; 
    justify-content: center;
  }
  .img-cell {
    flex: 1; 
    text-align: center;
  }
  .img-cell img {
    width: 100%; 
    max-width: 2.5in; 
    border: 1px solid #ddd; 
    border-radius: 8px;
    box-shadow: none;
  }
  .img-caption {
    font-size: 14pt; 
    color: #444; 
    margin-top: 8px; 
    font-weight: bold;
  }
  
  .flex-spacer {
    flex-grow: 1;
  }

  .example-box {
    background: #f8fafc; 
    border: 1px solid #cbd5e1; 
    border-left: 6px solid #CC3333; 
    padding: 12px 18px; 
    border-radius: 10px; 
    font-size: 16pt; 
    line-height: 1.4;
    margin-bottom: 0.1in;
  }

</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page-container" style="justify-content: center; align-items: center; text-align: center;">
  
  <h1 class="cover-title">Thai Good News</h1>
  <h2 class="cover-subtitle">Sidebar Features &mdash; User Manual</h2>
  
  <img class="cover-photo" src="${studentsB64}" alt="Students">
  
</div>

<!-- PAGE 2: TOC -->
<div class="page-container">
  
  <h2 class="toc-title">Table of Contents</h2>
  <ul class="toc">
    <li><a href="#search">1. Search</a></li>
    <li><a href="#sign-language">2. Sign Language Video</a></li>
    <li><a href="#my-favorites">3. My Favorites</a></li>
    <li><a href="#my-notes">4. My Notes</a></li>
    <li><a href="#selected-messages">5. Selected Messages</a></li>
    <li><a href="#my-library">6. My Library</a></li>
    <li><a href="#storage-management">7. Storage Management</a></li>
    <li><a href="#import">8. Import</a></li>
    <li><a href="#feedback">9. Feedback</a></li>
    <li><a href="#share">10. Share App</a></li>
  </ul>
</div>

<!-- FEATURE PAGES -->
${pagesHtml.join('\n')}

</body>
</html>
`;


(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const pg = await browser.newPage();

  await pg.setContent(html, { waitUntil: 'load' });

  await pg.pdf({
    path: path.join(root, 'TGN_User_Manual.pdf'),
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 0.5in; box-sizing: border-box; height: 100%; padding-bottom: 0.25in;">
        <img src="${tgnLogoB64}" style="height: 0.65in; width: 0.65in; border-radius: 50%;">
        <img src="${newQrB64}" style="height: 0.65in; width: 0.65in; border-radius: 8px;">
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; display: flex; justify-content: center; align-items: flex-end; padding: 0 0.5in; box-sizing: border-box; font-family: sans-serif; font-size: 14pt; color: #000; height: 100%; padding-bottom: 0.15in;">
        <span class="pageNumber"></span>
      </div>
    `,
    margin: { 
      top: '1.0in', 
      bottom: '0.8in', 
      left: '0.5in', 
      right: '0.5in' 
    }
  });

  await browser.close();
  console.log('PDF generated successfully: TGN_Sidebar_Manual.pdf');
})();
