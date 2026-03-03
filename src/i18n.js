export const i18n = {
  // --- ENGLISH TRANSLATIONS ---
  en: {
    // App Basics
    app_name: "Thai Good News",
    menu: "Menu",
    qr_code: "QR Code",
    back: "Back",
    forward: "Forward",
    forward: "Forward",
    share_app: "Share App",
    light_mode: "Light Mode",
    dark_mode: "Dark Mode",

    // Navigation
    contents: "Contents",
    search: "Search",
    favorites: "Favorites",
    notes: "Notes",
    settings: "Settings",
    language_label: "Language",
    back_to_languages: "Back to Languages",
    languages: "Languages",
    language_finder: "Language Finder",
    messages: "messages",
    message_label: "Message",
    selected_messages: "Selected Messages",

    // Status / Authentication
    loading: "Loading...",
    loading_auth: "Loading authentication...",
    error: "Error",
    app_status: "App Status",
    user_id: "User ID",
    status: "Status",
    guest: "Guest (Anonymous)",
    registered_user: "Registered User",
    email_auth: "Email Authentication",
    email: "Email",
    password: "Password",
    sign_in: "Sign In",
    sign_up: "Sign Up",
    log_out: "Log Out",
    sign_up_success: "Sign up successful! You are now logged in.",
    sign_up_fail:
      "Sign up failed. Please check the error message in the console.",
    sign_in_success: "Sign in successful!",
    sign_in_fail: "Sign in failed. Check your email/password.",

    // Content & Search
    listen_offline: "Listen (Offline Enabled)",
    program_number: "Message #",
    no_verse_content: "No message content available.",
    read_more_at: "Read more at",
    open_language_on_grn: "Open this language on GRN / 5fish",
    open_message_on_grn: "Open this message on 5fish / GRN",
    search_languages:
      "หาภาษาในภาษาไทยหรืออังกฤษ | Find a language in Thai or English...",
    no_languages_found: "No languages found",
    try_different_search: "Try a different search term",
    result: "Result",
    results: "Results",
    found: "found",
    no_results_for: "No results found for",
    search_tip: "Try searching by title, language, or a verse snippet.",
    start_typing_to_search: "Start typing to search all",
    search_prompt: "Please use the Search box above to find any one of our",
    items: "items",
    recent_searches: "Recent Searches", // NEW
    clear_history: "Clear History", // NEW
    no_recent_searches: "No recent searches", // NEW

    // Favorites
    no_favorites: "You haven't added any favorites yet.",
    favorite_tip: "Tap the heart icon on a message detail page to save it.",

    // Share & Export
    share_this_message: "Share This Message",
    share_copy: "Share/Copy",
    download: "Download",
    downloaded: "Downloaded",
    downloading: "Downloading...",
    download_audio: "Download Audio",
    qr_card: "QR Card",
    in_app_qr_tip: "In-app QR code (download above for print-ready)",
    scan_qr_tip: "Scan the QR code or visit the link to access this content.",
    playing: "Playing",
    controls: "Audio Player",

    // Settings & Notes
    text_size: "Text Size",
    my_library: "My Library",
    import: "Import",
    library_empty: "Your library is empty",
    library_empty_tip:
      "Download messages to listen offline. Look for the download button on message pages.",
    my_notes: "My Notes",
    notes_feature_tip:
      "Notes feature coming soon! You can view all saved notes on the Notes page.",
    selected_count_label: "Selected",
    clear_all: "Clear all",
    selected_programs: "Selected Messages",
    font_size: "Font size",
    language: "Language",
    tools_panel: "Tools",
    font_size_label: "Font Size", // NEW
    font_size_small: "Small", // NEW
    font_size_medium: "Medium", // NEW
    font_size_large: "Large", // NEW
    pro_tip_button: "Pro Tip",
    
    // Storage Management
    storage_management: "Storage Management",
    manage_downloads: "Manage Downloads",
    no_downloads: "No downloaded messages found",
    delete_all: "Delete All",
    delete_confirm: "Are you sure you want to delete all downloads?",
    storage_used: "Storage Used",
    confirm_delete_track: "Delete this track?",

    sign_language: "Sign Language Video", // UPDATED
    feedback: "Feedback", // NEW
    feedback_intro:
      "We value your feedback! Please let us know if you have any suggestions, questions, or issues.", // NEW
    feedback_placeholder: "Type your message here...", // NEW
    send_feedback: "Send Feedback", // NEW

    // Import Page
    import_content_title: "Import Content",
    import_new_content_title: "Import New Content",
    import_content_title: "Import Content",
    import_new_content_title: "Import New Content",
    find_content_label: "Find Content", // NEW
    full_message_length_label: "Full Message Length", // NEW
    program_id_label: "Program ID",
    message_id_label: "Message ID",
    find_message_id_label: "Find Message ID",
    program_id_hint: "Enter the GRN Program ID number (e.g., 62808)",
    message_id_hint: "Enter the GRN Message ID number (e.g., 63629)",
    find_message_id_hint:
      "Enter the GRN Program Message ID number (e.g., 63629)",
    program_id_error: "Please enter a valid Program ID (e.g., 62808)",
    track_number_label: "Track #",
    fetch_generate_btn: "Fetch & Generate",
    url_pattern_info: "Auto-Generated URL Pattern",
    download_url_label: "Download URL Format:",
    url_pattern_note:
      "The app automatically generates the download URL using your Program ID and Track Number. In production, this is proxied through Netlify (/api/proxy-audio/*) to avoid CORS issues.",
    review_edit_title: "Review & Edit",
    lang_en_label: "Language (EN)",
    lang_th_label: "Language (TH)",
    title_en_label: "Title (EN)",
    title_th_label: "Title (TH)",
    title_label: "Title",
    generated_urls_label: "Generated URLs (Read-only)",
    add_to_list_btn: "Add to Import List",
    ready_to_export_title: "Ready to Export",
    copy_json_btn: "Copy JSON",
    json_copied_alert:
      "JSON copied to clipboard! You can now paste it into src/data/staticContent.js",
    clear_data_confirm: "Are you sure you want to clear all imported data?",
    find_program_id: "Find Program ID",
    select_language: "Select Language",
    select_message: "Select Message",
    select_track: "Select Track",
    iso3_code_label: "ISO3 Code", // NEW
    language_id_label: "Language ID", // NEW
    verse_en_label: "Verse (EN)", // NEW
    verse_th_label: "Verse (TH)", // NEW
    preview_audio_label: "Preview Audio", // NEW
    find_message_btn: "Find Message",
    review_message_title: "Review This Message",
    review_message_hint:
      "Check the details below, then click 'Add This Message' to add it to your list.",
    print: "Print/Download",
    print_word: "Print", // NEW
    no_content_selected:
      "It looks like you haven't selected any messages yet. To get started, click here to go back to the Language Finder and check the messages you want to use. Once you return, we can help you with sharing, copying, or printing your selections.",
    no_content_selected:
      "It looks like you haven't selected any messages yet. To get started, click here to go back to the Language Finder and check the messages you want to use. Once you return, we can help you with sharing, copying, or printing your selections.",
    go_back: "Go Back",
    already_added: "Already Added",
    duplicate_warning: "This track is already in your Import List.",

    // Share App
    // Share App
    share_app: "Share App",
    copy_for_email: "Copy for Email", // NEW
    install: "Install", // NEW
    install_instructions:
      "To install, tap 'Share' then 'Add to Home Screen' (iOS) or use the browser menu (Android).", // NEW
    share_app_text:
      "Looking for a way to reach your neighbors for Christ? 🌏 The Thai Good News app is a great tool for sharing Jesus with people from different backgrounds. Even if you don't speak their language, you can use this app to let them hear the Good News clearly. Check out the over 100 languages available and start sharing today!",
    link_copied: "Link copied to clipboard!",
    copy_failed: "Could not copy link",
    please_select_messages:
      "📋 Please select some messages first!\n\nTap the checkboxes next to messages to add them to your selection.",
    "5fish website": "5fish Website",
    watch_video: "Watch Video",
    watch_on_youtube: "Watch on YouTube",

    // Import Page
    import_content_title: "Import Content",
    grn_url_label: "GRN Program URL",
    track_number_label: "Track #",
    fetch_generate_btn: "Fetch & Generate",
    review_edit_title: "Review & Edit",
    lang_en_label: "Language (EN)",
    lang_th_label: "Language (TH)",
    title_en_label: "Title (EN)",
    title_th_label: "Title (TH)",
    generated_urls_label: "Generated URLs (Read-only)",
    add_to_list_btn: "Add to List",
    ready_to_export_title: "Ready to Export",
    copy_json_btn: "Copy JSON",
    duplicate_warning_text: "You have already downloaded this track. Click to view in My Library.",
    static_warning_title: "View in Main Collection",
    static_warning_text: "This program is already listed in the app's Language List. Click to view.",
    clear_data_confirm: "Are you sure you want to clear all imported data?",
    import_success_title: "Import Successful",
    import_success_text: "Successfully added {{count}} messages to your library.",
    go_to_library: "Go to My Library",
    ok_close: "OK (Stay Here)",
    external_lookup_title: "Looking for Something Else?",
    external_lookup_desc: "If you can't find your message above, try searching these websites to find the Program ID:",
  },

  // --- THAI TRANSLATIONS ---
  th: {
    // App Basics
    app_name: "ไทยข่าวดี",
    menu: "เมนู",
    qr_code: "คิวอาร์โค้ด",
    back: "ย้อนกลับ",
    forward: "ถัดไป",
    share_app: "แชร์แอป",
    controls: "ควบคุม",
    playing: "กำลังเล่น",
    light_mode: "โหมดสว่าง",
    dark_mode: "โหมดมืด",

    // Navigation
    contents: "สารบัญ",
    search: "ค้นหา",
    favorites: "รายการโปรด",
    notes: "บันทึก",
    settings: "ตั้งค่า",
    language_label: "ภาษา",
    back_to_languages: "กลับไปหน้าภาษา",
    languages: "ภาษา",
    language_finder: "ค้นหาภาษา",
    messages: "ข้อความ",
    message_label: "ข้อความ",
    selected_messages: "ข้อความที่เลือก",

    // Status / Authentication
    loading: "กำลังโหลด...",
    loading_auth: "กำลังโหลดการยืนยันตัวตน...",
    error: "ข้อผิดพลาด",
    app_status: "สถานะแอป",
    user_id: "รหัสผู้ใช้",
    status: "สถานะ",
    guest: "ผู้เยี่ยมชม (ไม่ระบุชื่อ)",
    registered_user: "ผู้ใช้ที่ลงทะเบียน",
    email_auth: "การยืนยันตัวตนผ่านอีเมล",
    email: "อีเมล",
    password: "รหัสผ่าน",
    sign_in: "เข้าสู่ระบบ",
    sign_up: "ลงทะเบียน",
    log_out: "ออกจากระบบ",
    sign_up_success: "ลงทะเบียนสำเร็จ! คุณเข้าสู่ระบบแล้ว",
    sign_up_fail: "ลงทะเบียนล้มเหลว โปรดตรวจสอบข้อความแสดงข้อผิดพลาด",
    sign_in_success: "เข้าสู่ระบบสำเร็จ!",
    sign_in_fail: "เข้าสู่ระบบล้มเหลว ตรวจสอบอีเมล/รหัสผ่านของคุณ",

    // Auth & PWA
    auth_status: "สถานะ",
    auth_ready: "พร้อมใช้งาน",
    auth_pending: "รอดำเนินการ",
    auth_pending: "รอดำเนินการ",
    install_app: "ติดตั้งแอป",
    install: "ติดตั้ง", // NEW
    install_instructions:
      "ในการติดตั้ง ให้แตะ 'แชร์' แล้วเลือก 'เพิ่มไปยังหน้าจอหลัก' (iOS) หรือใช้เมนูเบราว์เซอร์ (Android)", // NEW
    share_pwa: "แชร์แอปนี้",
    scan_to_share: "สแกนเพื่อแชร์แอปนี้",

    // Content & Search
    listen_offline: "ฟัง (ออฟไลน์)",
    program_number: "ข้อความ #",
    no_verse_content: "ไม่มีเนื้อหาข้อความ",
    read_more_at: "อ่านเพิ่มเติมที่",
    open_language_on_grn: "เปิดภาษานี้ใน GRN / 5fish",
    open_message_on_grn: "เปิดข้อความนี้ใน 5fish / GRN",
    search_languages:
      "หาภาษาในภาษาไทยหรืออังกฤษ | Find a language in Thai or English...",
    result: "ผลลัพธ์",
    results: "ผลลัพธ์",
    found: "พบ",
    no_results_for: "ไม่พบผลลัพธ์สำหรับ",
    search_tip: "ลองค้นหาด้วยชื่อเรื่อง ภาษา หรือข้อความบางส่วน",
    start_typing_to_search: "เริ่มพิมพ์เพื่อค้นหาทั้งหมด",
    search_prompt: "โปรดใช้ช่องค้นหาด้านบนเพื่อค้นหาข้อความใดข้อความหนึ่งจาก",
    items: "รายการ",
    recent_searches: "การค้นหาล่าสุด", // NEW
    clear_history: "ล้างประวัติ", // NEW
    no_recent_searches: "ไม่มีประวัติการค้นหา", // NEW

    // Favorites
    no_favorites: "คุณยังไม่ได้เพิ่มรายการโปรด",
    favorite_tip: "แตะไอคอนหัวใจในหน้ารายละเอียดข้อความเพื่อบันทึก",

    // Share & Export
    share_this_message: "แชร์ข้อความนี้",
    share_copy: "แชร์/คัดลอก",
    download: "ดาวน์โหลด",
    downloaded: "ดาวน์โหลดแล้ว",
    downloading: "กำลังดาวน์โหลด...",
    download_audio: "ดาวน์โหลดเสียง",
    qr_card: "การ์ด QR",
    in_app_qr_tip: "QR Code ในแอป (ดาวน์โหลดด้านบนเพื่อพิมพ์)",
    scan_qr_tip: "สแกน QR Code หรือไปที่ลิงก์เพื่อเข้าถึงเนื้อหานี้",
    playing: "กำลังเล่น",
    controls: "เครื่องเล่นเสียง",

    // Settings & Notes
    text_size: "ขนาดตัวอักษร",
    my_library: "คลังของฉัน",
    import: "นำเข้า",
    library_empty: "คลังของคุณว่างเปล่า",
    library_empty_tip:
      "ดาวน์โหลดข้อความเพื่อฟังแบบออฟไลน์ มองหาปุ่มดาวน์โหลดในหน้าข้อความ",
    my_notes: "บันทึกของฉัน",
    notes_feature_tip:
      "ฟีเจอร์บันทึกกำลังจะมาเร็วๆ นี้! คุณสามารถดูบันทึกที่บันทึกไว้ทั้งหมดได้ที่หน้าบันทึก",
    notes_page_tip: "หน้านี้พร้อมที่จะสร้างแล้ว!",
    pro_tip_button: "ทิปดี ๆ",
    sign_language: "วิดีโอภาษามือ", // UPDATED
    feedback: "ข้อเสนอแนะ", // NEW
    feedback_intro:
      "เราให้ความสำคัญกับความคิดเห็นของคุณ! โปรดแจ้งให้เราทราบหากคุณมีข้อเสนอแนะ คำถาม หรือปัญหาใดๆ", // NEW
    feedback_placeholder: "พิมพ์ข้อความของคุณที่นี่...", // NEW
    send_feedback: "ส่งอีเมลข้อเสนอแนะ", // NEW

    // Import Page
    import_content_title: "นำเข้าเนื้อหา",
    import_new_content_title: "นำเข้าเนื้อหาใหม่",
    import_content_title: "นำเข้าเนื้อหา",
    import_new_content_title: "นำเข้าเนื้อหาใหม่",
    find_content_label: "ค้นหาเนื้อหา", // NEW
    full_message_length_label: "ความยาวข้อความเต็ม", // NEW
    program_id_label: "รหัสโปรแกรม",
    message_id_label: "รหัสข้อความ",
    find_message_id_label: "ค้นหารหัสข้อความ",
    program_id_hint: "กรอกหมายเลข Program ID ของ GRN (เช่น 62808)",
    message_id_hint: "กรอกหมายเลข Message ID ของ GRN (เช่น 63629)",
    find_message_id_hint: "กรอกหมายเลข Program Message ID ของ GRN (เช่น 63629)",
    program_id_error: "กรุณากรอก Program ID ให้ถูกต้อง (เช่น 62808)",
    track_number_label: "แทร็ก #",
    fetch_generate_btn: "ดึงข้อมูล & สร้าง",
    url_pattern_info: "รูปแบบ URL ที่สร้างอัตโนมัติ",
    download_url_label: "รูปแบบ URL สำหรับดาวน์โหลด:",
    iso3_code_label: "รหัส ISO3", // NEW
    language_id_label: "รหัสภาษา", // NEW
    verse_en_label: "ข้อพระคัมภีร์ (อังกฤษ)", // NEW
    verse_th_label: "ข้อพระคัมภีร์ (ไทย)", // NEW
    preview_audio_label: "ตัวอย่างเสียง", // NEW
    url_pattern_note:
      "แอปจะสร้าง URL สำหรับดาวน์โหลดให้อัตโนมัติจาก Program ID และหมายเลขแทร็กของคุณ ในการใช้งานจริงจะเรียกผ่าน Netlify (/api/proxy-audio/*) เพื่อหลีกเลี่ยงปัญหา CORS",
    review_edit_title: "ตรวจสอบ & แก้ไข",
    lang_en_label: "ภาษา (อังกฤษ)",
    lang_th_label: "ภาษา (ไทย)",
    title_en_label: "ชื่อเรื่อง (อังกฤษ)",
    title_th_label: "ชื่อเรื่อง (ไทย)",
    title_label: "ชื่อเรื่อง",
    generated_urls_label: "URL ที่สร้างขึ้น (อ่านอย่างเดียว)",
    add_to_list_btn: "เพิ่มลงในรายการที่นำเข้า",
    ready_to_export_title: "พร้อมส่งออก",
    copy_json_btn: "คัดลอก JSON",
    json_copied_alert:
      "✅ คัดลอกแล้ว! ข้อมูลข้อความของคุณอยู่ในคลิปบอร์ดแล้ว คุณสามารถวางได้ทุกที่ที่ต้องการ",
    clear_data_confirm: "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลที่นำเข้าทั้งหมด?",
    find_program_id: "ค้นหารหัสโปรแกรม",
    select_language: "เลือกภาษา",
    select_message: "เลือกข้อความ",
    select_track: "เลือกแทร็ก",
    find_message_btn: "ค้นหาข้อความ",
    review_message_title: "ตรวจสอบข้อความนี้",
    review_message_hint:
      "ตรวจสอบรายละเอียดด้านล่าง จากนั้นคลิก 'เพิ่มข้อความนี้' เพื่อเพิ่มลงในรายการของคุณ",
    add_message_btn: "เพิ่มลงในรายการที่นำเข้า",
    import_list_title: "รายการนำเข้าของฉัน",
    import_list_hint:
      "ข้อความเหล่านี้พร้อมที่จะเพิ่มลงในคลังของฉัน คลิก 'เพิ่มลงในคลังของฉัน' เพื่อดาวน์โหลดสำหรับใช้งานแบบออฟไลน์",
    add_to_library_btn: "เพิ่มลงในคลังของฉัน",
    added_to_library: "✅ เพิ่มลงในคลังของคุณแล้ว! ค้นหาได้ในหน้าคลังของฉัน",
    export_json_link: "ส่งออก JSON (สำหรับนักพัฒนา)",
    no_languages_found: "ไม่พบภาษา",
    try_different_search: "ลองใช้คำค้นหาอื่น",
    no_languages_found: "ไม่พบภาษา",
    try_different_search: "ลองใช้คำค้นหาอื่น",
    pro_tip_button: "เคล็ดลับมืออาชีพ",

    // Storage Management
    storage_management: "จัดการพื้นที่จัดเก็บ",
    manage_downloads: "จัดการการดาวน์โหลด",
    no_downloads: "ไม่พบข้อความที่ดาวน์โหลด",
    delete_all: "ลบทั้งหมด",
    delete_confirm: "คุณแน่ใจหรือไม่ว่าต้องการลบการดาวน์โหลดทั้งหมด?",
    storage_used: "พื้นที่ที่ใช้",
    confirm_delete_track: "ลบแทร็กนี้?",

    already_added: "เพิ่มแล้ว",
    duplicate_warning_text: "คุณได้ดาวน์โหลดแทร็กนี้แล้ว คลิกเพื่อดูในคลังของฉัน",
    clear_data_confirm: "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลที่นำเข้าทั้งหมด?",

    // UI Helpers
    select_message_to_listen: "เลือกข้อความเพื่อฟัง",
    tap_to_enlarge: "แตะเพื่อขยาย",
    tap_to_shrink: "แตะเพื่อย่อ",
    jump_to_letter: "ไปที่ตัวอักษร",

    // FloatingUtilityBar
    selected_count_label: "เลือกแล้ว",
    clear_all: "ล้างทั้งหมด",
    selected_programs: "โปรแกรมที่เลือก",
    font_size: "ขนาดตัวอักษร",
    font_size_label: "ขนาดตัวอักษร", // NEW
    font_size_small: "เล็ก", // NEW
    font_size_medium: "กลาง", // NEW
    font_size_large: "ใหญ่", // NEW
    language: "ภาษา",
    tools_panel: "เครื่องมือ",

    // SelectedContentPage
    messages_selected: "ข้อความที่เลือก",
    selected_messages: "ข้อความที่เลือก",
    selected_content: "โปรแกรมที่เลือก",
    share: "แชร์",
    copy: "คัดลอก",
    print: "พิมพ์/ดาวน์โหลด",
    print_word: "พิมพ์", // NEW
    no_content_selected:
      "ดูเหมือนว่าคุณยังไม่ได้เลือกข้อความใดๆ เลย ในการเริ่มต้น ให้คลิกที่นี่เพื่อกลับไปที่หน้าค้นหาภาษา (Language Finder) และทำเครื่องหมายข้อความที่คุณต้องการใช้ เมื่อคุณกลับมา เราจะสามารถช่วยคุณในการแชร์ คัดลอก หรือพิมพ์รายการที่คุณเลือกได้",
    go_back: "กลับไป",

    // Share App
    // Share App
    share_app: "แชร์แอป",
    copy_for_email: "คัดลอกสำหรับอีเมล", // NEW
    share_app_text: "กำลังมองหาวิธีนำพระคริสต์มาสู่เพื่อนบ้านของคุณอยู่หรือเปล่า? 🌏 แอป Thai Good News เป็นเครื่องมือที่ยอดเยี่ยมสำหรับการแบ่งปันเรื่องราวของพระเยซูกับผู้คนจากหลากหลายภูมิหลัง แม้ว่าคุณจะไม่พูดภาษาของพวกเขา คุณก็สามารถใช้แอปนี้เพื่อให้พวกเขาได้ยินข่าวดีได้อย่างชัดเจน ลองดูภาษาที่มีให้เลือกมากกว่า 100 ภาษา และเริ่มแบ่งปันได้เลยวันนี้!",
    link_copied: "คัดลอกลิงก์แล้ว!",
    copy_failed: "ไม่สามารถคัดลอกลิงก์ได้",
    please_select_messages:
      "📋 กรุณาเลือกข้อความก่อน!\n\nแตะช่องทำเครื่องหมายข้างข้อความเพื่อเพิ่มลงในรายการที่เลือก",
    "5fish website": "เว็บไซต์ 5fish",
    watch_video: "ดูวิดีโอ",
    watch_on_youtube: "ดูบน YouTube",

    // Notes
    note_title_placeholder: "หัวข้อ",
    note_content_placeholder: "เขียนบันทึกของคุณที่นี่...",
    save: "บันทึก",
    cancel: "ยกเลิก",
    confirm_delete_note: "ลบบันทึกนี้?",
    no_notes: "ยังไม่มีบันทึก แตะ + เพื่อสร้างใหม่!",
    untitled: "ไม่มีหัวข้อ",

    // Import Page
    import_content_title: "นำเข้าเนื้อหา",
    grn_url_label: "URL รายการ GRN",
    track_number_label: "แทร็ก #",
    fetch_generate_btn: "ดึงข้อมูล & สร้าง",
    review_edit_title: "ตรวจสอบ & แก้ไข",
    lang_en_label: "ภาษา (อังกฤษ)",
    lang_th_label: "ภาษา (ไทย)",
    title_en_label: "ชื่อเรื่อง (อังกฤษ)",
    title_th_label: "ชื่อเรื่อง (ไทย)",
    generated_urls_label: "URL ที่สร้างขึ้น (อ่านอย่างเดียว)",
    add_to_list_btn: "เพิ่มลงในรายการ",
    ready_to_export_title: "พร้อมส่งออก",
    copy_json_btn: "คัดลอก JSON",
    json_copied_alert:
      "✅ คัดลอกแล้ว! ข้อมูลข้อความของคุณอยู่ในคลิปบอร์ดแล้ว คุณสามารถวางได้ทุกที่ที่ต้องการ",
    clear_data_confirm: "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลที่นำเข้าทั้งหมด?",
    static_warning_title: "อยู่ในรายการภาษาหลัก",
    static_warning_text: "รายการนี้มีอยู่ในรายการหลักของแอป คลิกเพื่อดู",
    duplicate_warning_text: "คุณได้ดาวน์โหลดแทร็กนี้แล้ว คลิกเพื่อดูในคลังของฉัน",
    import_success_title: "นำเข้าสำเร็จ",
    import_success_text: "เพิ่มข้อความ {{count}} รายการไปยังคลังของคุณแล้ว",
    go_to_library: "ไปที่คลังของฉัน",
    ok_close: "ตกลง (อยู่ที่นี่)",
    external_lookup_title: "มองหาอย่างอื่นอยู่ใช่ไหม?",
    external_lookup_desc: "หากไม่พบข้อความที่ต้องการด้านบน ลองค้นหาจากเว็บไซต์เหล่านี้เพื่อหารหัสรายการ (Program ID):",
  },
};
