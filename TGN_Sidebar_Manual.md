<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  
  /* --- COVER PAGE --- */
  .cover-wrapper {
    position: relative;
    width: 100%;
    height: 98vh;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 20px;
  }
  .cover-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #1e293b;
    text-align: center;
    padding: 40px;
    box-sizing: border-box;
  }
  .cover-photo {
    width: 100%;
    max-width: 500px;
    border-radius: 12px;
    margin-bottom: 30px;
    border: 2px solid #f1f5f9;
  }
  .cover-title {
    color: #CC3333;
    font-size: 3.5em;
    font-weight: 800;
    margin: 0 0 15px 0;
    letter-spacing: -1px;
    border: none;
    padding: 0;
  }
  .cover-subtitle {
    color: #475569;
    font-size: 1.8em;
    font-weight: 400;
    margin: 0;
  }

  /* --- TABLE OF CONTENTS --- */
  .toc-wrapper {
    padding: 40px;
    background-color: #ffffff;
    border-radius: 16px;
    margin: 0px;
    min-height: 85vh;
  }
  .toc-header {
    font-size: 2.5em;
    color: #CC3333;
    border-bottom: 2px solid #CC3333;
    padding-bottom: 15px;
    margin-bottom: 30px;
    font-weight: bold;
  }
  .toc-list {
    list-style: none;
    padding-left: 0;
    font-size: 1.3em;
  }
  .toc-list > li {
    margin-bottom: 25px;
    font-weight: 700;
    color: #1e293b;
  }
  .toc-list ul {
    list-style: none;
    padding-left: 25px;
    margin-top: 10px;
    border-left: 3px solid #e2e8f0;
  }
  .toc-list ul li {
    font-weight: 500;
    margin-bottom: 12px;
  }
  .toc-list a {
    text-decoration: none;
    color: #3b82f6;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s;
  }
  .toc-list a:hover {
    background-color: #f1f5f9;
  }

  /* --- CONTENT PAGES --- */
  h1 {
    color: #CC3333;
    border-bottom: 2px solid #CC3333;
    padding-bottom: 10px;
  }
  h2 {
    color: #CC3333;
    margin-top: 0;
    padding-top: 0;
    font-size: 2.2em;
  }
  h3 {
    color: #1e293b;
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 1.6em;
  }
  .page-break {
    page-break-before: always;
    display: block;
    height: 1px;
    width: 100%;
  }
  .screenshot {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }
  .example-box {
    background-color: #f8fafc;
    border: 2px solid #e2e8f0;
    border-left: 5px solid #CC3333;
    padding: 20px;
    margin: 30px 0;
    border-radius: 8px;
    font-size: 1.05em;
  }
  .example-box p {
    margin-top: 0;
  }
  .section-intro {
    font-style: italic;
    color: #64748b;
    margin-bottom: 30px;
    font-size: 1.1em;
  }
  
  /* --- THREE COLUMN LAYOUT --- */
  .flex-container {
      display: flex;
      gap: 20px;
      align-items: stretch;
      margin-top: 30px;
  }
  .col-sidebar, .col-page {
      flex: 0 0 32%;
      text-align: center;
  }
  .col-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 1.1em;
      padding: 0 10px;
  }
  p.caption {
      font-size: 0.9em;
      color: #64748b;
      margin-top: 12px;
      font-weight: 500;
  }
</style>

<div class="cover-wrapper">
  <div class="cover-card">
    <img class="cover-photo" src="manual_assets/students_cover.jpg" alt="Students in Thailand">
    <h1 class="cover-title">Thai Good News</h1>
    <h2 class="cover-subtitle">Sidebar Features User Manual</h2>
  </div>
</div>

<div class="page-break"></div>

<div class="toc-wrapper">
  <div class="toc-header">Table of Contents</div>
  <ul class="toc-list">
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
    <li><a href="#section-3">3. Offline Listening & Storage</a>
      <ul>
        <li><a href="#my-library">My Library</a></li>
        <li><a href="#storage-management">Storage Management</a></li>
      </ul>
    </li>
    <li><a href="#section-4">4. Advanced Tools & App Info</a>
      <ul>
        <li><a href="#import">Import</a></li>
        <li><a href="#feedback">Feedback</a></li>
        <li><a href="#share">Share App</a></li>
      </ul>
    </li>
  </ul>
</div>

<div class="page-break"></div>

<a id="section-1"></a>
## 1. Core Exploration (Finding Content)
<div class="section-intro">These tools help you find the Good News you want to share or listen to quickly.</div>

<a id="search"></a>
### Search

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/02_Search_Sidebar.png" alt="Search Sidebar Highlighted">
    <p class="caption">1. Select "Search" in Sidebar</p>
  </div>
  <div class="col-text">
    Instead of scrolling through the 100+ languages on the Home screen, you can just type a language name, a message title, or even a keyword here to find exactly what you need instantly.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      You just met someone who speaks "Isan," but you can't remember if it's spelled with a specific character or where it is on the long list. Open <b>Search</b>, type "Isan", and tap on it instantly to load all their native messages.
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/02_Search.png" alt="Search Page">
    <p class="caption">2. See the Search screen</p>
  </div>
</div>

---

<div class="page-break"></div>

<a id="sign-language"></a>
### Sign Language Video

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/03_Sign_Language_Sidebar.png" alt="Sign Language Sidebar Highlighted">
    <p class="caption">1. Select "Sign Language Video"</p>
  </div>
  <div class="col-text">
    A dedicated page that provides quick access to visual Good News content specifically tailored for the Deaf community in Thailand.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      You meet someone who is deaf. Instead of trying to type or write back and forth, you can quickly open the Sidebar, click <b>Sign Language Video</b>, and instantly show them the life-changing message in a format that speaks directly to them.
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/03_Sign_Language.png" alt="Sign Language Page">
    <p class="caption">2. See the Visual content</p>
  </div>
</div>

<div class="page-break"></div>

<a id="section-2"></a>
## 2. Personalized Content (Your Dashboard)
<div class="section-intro">These pages are all about saving things for later. Think of these as your "Personal Dashboard."</div>

<a id="my-favorites"></a>
### My Favorites

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/04_My_Favorites_Sidebar.png" alt="My Favorites Sidebar Highlighted">
    <p class="caption">1. Select "My Favorites"</p>
  </div>
  <div class="col-text">
    A quick-bookmark page. If you find a language you use often or a specific message you love, you can tap the "Heart" icon. It gets saved here so you don't have to search for it again.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      You are planning to go on a short mission trip to the Karen community next month. Rather than looking for the Karen language folder every single day, you can favorite the "Karen" language. Now it sits right at the top of <b>My Favorites</b> for instant access!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/04_My_Favorites.png" alt="My Favorites">
    <p class="caption">2. See your saved content</p>
  </div>
</div>

---

<div class="page-break"></div>

<a id="my-notes"></a>
### My Notes

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/05_My_Notes_Sidebar.png" alt="My Notes Sidebar Highlighted">
    <p class="caption">1. Select "My Notes"</p>
  </div>
  <div class="col-text">
    A private journaling space. You can jot down thoughts, sermon notes, or reminders about who you want to share a specific message with.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      While listening to a teaching on forgiveness, a specific friend comes to your mind. You can open <b>My Notes</b> and jot down: <i>"Share 'Words of Life' track 5 with Somchai tomorrow at the coffee shop."</i>
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/05_My_Notes.png" alt="My Notes">
    <p class="caption">2. View and write notes</p>
  </div>
</div>

---

<div class="page-break"></div>

<a id="selected-messages"></a>
### Selected Messages

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/06_Selected_Messages_Sidebar.png" alt="Selected Messages Sidebar Highlighted">
    <p class="caption">1. Select "Selected Messages"</p>
  </div>
  <div class="col-text">
    Think of this page like a <b>"Shopping Cart" for Sharing</b>. As you browse the app, you can check the little boxes next to different messages across multiple languages. This page gathers all those checked items into one clean list.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      You are hosting an event and want to give attendees a few specific messages to listen to. You browse the app and check standard Thai, Isan, and English messages. You go to <b>Selected Messages</b>, tap "Print", and generating QR cards for all those messages at once to hand out!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/06_Selected_Messages.png" alt="Selected Messages">
    <p class="caption">2. See your grouped messages</p>
  </div>
</div>

<div class="page-break"></div>

<a id="section-3"></a>
## 3. Offline Listening & Storage
<div class="section-intro">These two pages work together closely to help you manage downloaded audio files.</div>

<a id="my-library"></a>
### My Library

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/07_My_Library_Sidebar.png" alt="My Library Sidebar Highlighted">
    <p class="caption">1. Select "My Library"</p>
  </div>
  <div class="col-text">
    This is where offline audio lives. When you tap "Download" on an audio track, it saves the file directly to your phone. 
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      You know you are traveling to a remote village without cellular data connectivity. Before leaving WiFi, you go to the app and click the download button on 10 various tracks. When you get to the village, you open <b>My Library</b> to play them perfectly even with no signal!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/07_My_Library.png" alt="My Library">
    <p class="caption">2. Play downloaded audio</p>
  </div>
</div>

---

<div class="page-break"></div>

<a id="storage-management"></a>
### Storage Management

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/08_Storage_Management_Sidebar.png" alt="Storage Management Sidebar Highlighted">
    <p class="caption">1. Select "Storage Management"</p>
  </div>
  <div class="col-text">
    Audio files take up space on your phone. This page lets you see how much space your downloads are using and gives you a quick way to delete old tracks to free up storage.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      Your phone pops up saying "Storage Almost Full". Instead of deleting apps, you open <b>Storage Management</b> and see you have 50 messages downloaded from a trip last year. You can click "Delete All" to instantly empty your storage footprint!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/08_Storage_Management.png" alt="Storage Management">
    <p class="caption">2. Free up app storage</p>
  </div>
</div>

<div class="page-break"></div>

<a id="section-4"></a>
## 4. Advanced Tools & App Info
<div class="section-intro">These are utility pages for interacting with the app itself.</div>

<a id="import"></a>
### Import

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/09_Import_Sidebar.png" alt="Import Sidebar Highlighted">
    <p class="caption">1. Select "Import"</p>
  </div>
  <div class="col-text">
    A "Power User" tool. The app contains a curated list of messages, but Global Recordings Network has thousands more on their website. 
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      Someone asks you for a rare dialect that isn't on the app's main list. You go to the main GRN website, find the message ID (e.g. 62808), and type it into the <b>Import</b> page. The app will pull it in so you can listen to it and share it seamlessly!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/09_Import.png" alt="Import Page">
    <p class="caption">2. Load hidden content</p>
  </div>
</div>

---

<div class="page-break"></div>

<a id="feedback"></a>
### Feedback

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/10_Feedback_Sidebar.png" alt="Feedback Sidebar Highlighted">
    <p class="caption">1. Select "Feedback"</p>
  </div>
  <div class="col-text">
    A simple contact form page. It pre-fills an email so you can easily send bugs, questions, or feature requests to the development team.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      You notice that a translation phrase seems grammatically awkward, or you have a great idea for a new feature. Open <b>Feedback</b>, type out your thoughts, and hit send!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/10_Feedback.png" alt="Feedback Page">
    <p class="caption">2. Message the creators</p>
  </div>
</div>

---

<div class="page-break"></div>

<a id="share"></a>
### Share App

<div class="flex-container">
  <div class="col-sidebar">
    <img class="screenshot" src="screenshots/11_Share_Sidebar.png" alt="Share Sidebar Highlighted">
    <p class="caption">1. Select "Share"</p>
  </div>
  <div class="col-text">
    While the individual message pages let you share *one* specific audio track, <b>this page is for sharing the actual App itself</b>. It provides quick buttons to send the app link via Email, LINE, or your device's native sharing prompt.
    
    <div class="example-box">
      <p><b>Example Usage:</b></p>
      A friend sees you using the app and asks, "How do I get that on my phone?" You open the Sidebar, click <b>Share</b>, click the LINE button, and ping it directly to them!
    </div>
  </div>
  <div class="col-page">
    <img class="screenshot" src="screenshots/11_Share.png" alt="Share Page">
    <p class="caption">2. Send the App link</p>
  </div>
</div>
