(function () {
  "use strict";

  /* ================= Categories (matches the 101-tool plan) ================= */
  var CATS = [
    { slug: "writing", name: "Writing", emoji: "✍️",
      desc: "Words are your thing? Edit, convert and count them — all in your browser, all private.",
      planned: [] },
    { slug: "developer", name: "Developer", emoji: "💻",
      desc: "The little utilities every developer ends up needing — JSON, regex, generators and more.",
      planned: [] },
    { slug: "drawing", name: "Drawing", emoji: "🎨",
      desc: "Sketch, doodle and export — no art supplies required.",
      planned: [] },
    { slug: "image", name: "Image & Design", emoji: "🖼️",
      desc: "From resizing to color picking — your images never leave your device.",
      planned: [] },
    { slug: "files", name: "Files", emoji: "📁",
      desc: "Merge, convert and hash files without uploading them anywhere.",
      planned: ["PDF to Word", "Word to PDF", "PDF to JPG", "HEIC to JPG", "Subtitle Extractor", "MP3 to MP4", "Video to MP3"] },
    { slug: "math", name: "Math & Science", emoji: "🧮",
      desc: "Fast answers for everyday math — tips, percentages, BMI and more.",
      planned: [] },
    { slug: "productivity", name: "Productivity", emoji: "⏱️",
      desc: "Stay on track with timers, checklists and small planning helpers.",
      planned: [] },
    { slug: "security", name: "Security", emoji: "🔒",
      desc: "Small tools that help you lock things down and sleep easier.",
      planned: ["SSL Checker", "Secure File Shredder"] },
    { slug: "fun", name: "Fun & Misc", emoji: "🎲",
      desc: "For the not-so-serious stuff: dice, names, riddles and coin flips.",
      planned: [] }
  ];

  /* ================= Built tools ================= */
  var TOOLS = [
    /* Writing */
    { slug: "word-counter", name: "Word & Character Counter", emoji: "🔢", cat: "writing", desc: "See words, characters, sentences and reading time the moment you type." },
    { slug: "case-converter", name: "Case Converter", emoji: "🔠", cat: "writing", desc: "Switch between UPPERCASE, lowercase, Title Case or sentence case in one click." },
    { slug: "notepad", name: "Notepad", emoji: "📝", cat: "writing", desc: "A clean scratchpad that autosaves as you type — export to .txt when you're done." },
    { slug: "text-reverser", name: "Text Reverser", emoji: "🔄", cat: "writing", desc: "Flip text backwards, or reverse the word order for a fun party trick." },
    { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", emoji: "📜", cat: "writing", desc: "Classic placeholder text on demand — handy for mockups and templates." },
    { slug: "keyword-density", name: "Keyword Density Analyzer", emoji: "📊", cat: "writing", desc: "Curious which words you lean on? See how often each one shows up." },
    { slug: "text-to-speech", name: "Text to Speech", emoji: "🔊", cat: "writing", desc: "Paste anything and listen — no installs, just your browser's voices." },
    { slug: "text-diff", name: "Text Diff Checker", emoji: "🔀", cat: "writing", desc: "Paste two versions side by side and spot every change in an instant." },
    { slug: "hidden-chars", name: "Hidden Character Remover", emoji: "🕵️", cat: "writing", desc: "Removes sneaky invisible characters — zero-width spaces, BOMs and friends." },
    { slug: "url-encoder", name: "URL Encoder/Decoder", emoji: "🔗", cat: "writing", desc: "Encode or decode URLs when copy-pasting starts misbehaving." },
    { slug: "slug-generator", name: "Slug Generator", emoji: "🏷️", cat: "writing", desc: "Turn any headline into a tidy, URL-safe slug." },
    { slug: "stop-word-filter", name: "Stop Word Filter", emoji: "🧹", cat: "writing", desc: "Drop filler words like \"the\", \"and\" and \"is\" from text or lists." },
    { slug: "paragraph-spacing", name: "Paragraph Spacing Adjuster", emoji: "📏", cat: "writing", desc: "Fix cramped or double-spaced paragraphs in one click." },
    { slug: "sentiment-analyzer", name: "Sentiment Analyzer", emoji: "💭", cat: "writing", desc: "Is that review happy or angry? Score any text, sentence by sentence." },
    { slug: "rhyme-finder", name: "Rhyme Finder", emoji: "🎤", cat: "writing", desc: "Find rhyming words for your lyrics, poems and puns." },
    { slug: "anagram-generator", name: "Anagram Generator", emoji: "🔀", cat: "writing", desc: "Rearrange any word or phrase into its hidden anagrams — one and two words." },
    /* Developer */
    { slug: "json-formatter", name: "JSON Formatter & Validator", emoji: "🧩", cat: "developer", desc: "Make JSON readable, compact — or confirm it's actually valid." },
    { slug: "password-generator", name: "Password Generator", emoji: "🗝️", cat: "developer", desc: "Roll your own strong passwords — length, symbols and all." },
    { slug: "uuid-generator", name: "UUID Generator", emoji: "🆔", cat: "developer", desc: "Instant UUID v4s, one click at a time." },
    { slug: "gradient-generator", name: "CSS Gradient Generator", emoji: "🌈", cat: "developer", desc: "Design gradient CSS by eye — drag, preview, copy." },
    { slug: "regex-tester", name: "Regex Tester", emoji: "🧪", cat: "developer", desc: "Test regex against real text and watch matches light up live." },
    { slug: "css-shadow", name: "CSS Shadow Generator", emoji: "🌑", cat: "developer", desc: "Play with shadows until they feel right, then copy the CSS." },
    { slug: "color-converter", name: "Color to Hex/RGB", emoji: "🖍️", cat: "developer", desc: "Translate colors between HEX, RGB, HSL and CSS color names." },
    { slug: "html-entity", name: "HTML Entity Encoder", emoji: "&amp;", cat: "developer", desc: "Turn tricky characters into HTML entities (and back) without the headache." },
    { slug: "base64-encoder", name: "Base64 Encoder/Decoder", emoji: "🔤", cat: "developer", desc: "Encode text or files to Base64 — and decode it right back." },
    { slug: "css-minifier", name: "CSS Minifier", emoji: "⚡", cat: "developer", desc: "Shrink your CSS so pages load a little faster." },
    { slug: "meta-tag-generator", name: "Meta Tag Generator", emoji: "🏷️", cat: "developer", desc: "Build SEO + social share meta tags (Open Graph, Twitter) and copy them straight into your page." },
    { slug: "js-minifier", name: "JavaScript Minifier", emoji: "⚡", cat: "developer", desc: "Shrink JS by stripping comments and whitespace — strings and templates stay safe." },
    { slug: "cron-generator", name: "Cron Expression Generator", emoji: "⏰", cat: "developer", desc: "Build cron expressions from presets, see the next 5 run times, copy the result." },
    { slug: "user-agent-parser", name: "User Agent Parser", emoji: "🤖", cat: "developer", desc: "Decode any user-agent string — browser, version, engine, OS and device." },
    { slug: "sql-formatter", name: "SQL Formatter", emoji: "🗄️", cat: "developer", desc: "Turn one-line SQL into a readable, indented query." },
    /* Drawing */
    { slug: "whiteboard", name: "Whiteboard", emoji: "🎨", cat: "drawing", desc: "Doodle with brushes and colors, erase freely, undo mistakes — save as PNG." },
    { slug: "pixel-art", name: "Pixel Art", emoji: "🧩", cat: "drawing", desc: "Channel the 8-bit era — paint pixel by pixel and download your masterpiece." },
    { slug: "symmetry-painter", name: "Symmetry Painter", emoji: "🪞", cat: "drawing", desc: "Draw once, see it mirrored 2, 4, 6 or 8 times around the center — save as PNG." },
    { slug: "spiral-art", name: "Spiral Art", emoji: "🌀", cat: "drawing", desc: "Archimedean, logarithmic or Fermat spirals drawn live — animate the draw and export." },
    { slug: "fractal-tree", name: "Fractal Tree", emoji: "🌳", cat: "drawing", desc: "Grow recursive fractal trees with adjustable depth, angle and trunk — then watch them animate." },
    /* Image & Design */
    { slug: "image-compressor", name: "Image Compressor", emoji: "🗜️", cat: "image", desc: "Slim down images right in the browser — nothing ever gets uploaded." },
    { slug: "image-resizer", name: "Image Resizer", emoji: "📐", cat: "image", desc: "Scale an image to exact pixel sizes, no photo app needed." },
    { slug: "color-palette", name: "Color Palette Extractor", emoji: "🖌️", cat: "image", desc: "Upload a photo and pull out its dominant colors." },
    { slug: "contrast-checker", name: "Color Contrast Checker", emoji: "👁️", cat: "image", desc: "Make sure your text is actually readable — check contrast ratios here." },
    { slug: "color-scheme", name: "Color Scheme Generator", emoji: "🌈", cat: "image", desc: "Pick a color — wheel, slider or name — and get a smooth board of its shades." },
    { slug: "image-to-ascii", name: "Image to ASCII", emoji: "🔤", cat: "image", desc: "Turn a photo into glorious text art." },
    { slug: "photo-editor", name: "Photo Editor", emoji: "🖌️", cat: "image", desc: "Crop, rotate, color-correct and filter photos — Photoshop-style edits right in your browser." },
    { slug: "dither-studio", name: "Dither Studio", emoji: "🎛️", cat: "image", desc: "Dither Boy-style retro dithering — error diffusion, halftones, glitch effects, palettes and SVG vector export." },
    { slug: "image-cropper", name: "Image Cropper", emoji: "✂️", cat: "image", desc: "Crop any image with aspect-ratio presets — 1:1, 4:3, 16:9, story mode." },
    { slug: "qr-generator", name: "QR Code Generator", emoji: "🔳", cat: "image", desc: "Generate scannable QR codes from any text or URL — offline, in your browser." },
    { slug: "background-remover", name: "Background Remover", emoji: "🪄", cat: "image", desc: "Magic-wand style removal — click a pixel and its region goes transparent." },
    { slug: "image-watermarker", name: "Image Watermarker", emoji: "💧", cat: "image", desc: "Stamp text on your photos — position, size, opacity and rotation." },
    { slug: "blur-image", name: "Blur Image Tool", emoji: "🌫️", cat: "image", desc: "Blur or pixelate any image — great for hiding sensitive details." },
    { slug: "favicon-converter", name: "Favicon Converter", emoji: "🌟", cat: "image", desc: "Turn any image into a full .ico with 16/32/48/64px sizes built in." },
    { slug: "svg-optimizer", name: "SVG Optimizer", emoji: "🧹", cat: "image", desc: "Strip comments and whitespace to shrink SVG files for the web." },
    { slug: "gif-maker", name: "GIF Maker", emoji: "🎞️", cat: "image", desc: "Turn several images into an animated GIF — delay, loop count, everything." },
    { slug: "mockup-generator", name: "Mockup Generator", emoji: "🖥️", cat: "image", desc: "Put your screenshot inside a phone or laptop frame for a pro presentation." },
    /* Files */
    { slug: "file-hash", name: "File Hash", emoji: "🔐", cat: "files", desc: "Check a file's integrity with SHA-1, SHA-256, SHA-384 or SHA-512 hashes." },
    { slug: "text-merge", name: "Text Merger", emoji: "📚", cat: "files", desc: "Combine several text files into one, with a separator of your choice." },
    { slug: "jpg-to-pdf", name: "JPG to PDF", emoji: "📄", cat: "files", desc: "Drop in a few photos and export them as a single PDF." },
    { slug: "csv-to-excel", name: "CSV to Excel", emoji: "📊", cat: "files", desc: "Open a CSV, peek at the data, then export it as an Excel file." },
    { slug: "text-file-splitter", name: "Text File Splitter", emoji: "✂️", cat: "files", desc: "Slice a big text file into parts by line count or size, then download them all." },
    { slug: "csv-json", name: "CSV ↔ JSON Converter", emoji: "🔄", cat: "files", desc: "Flip between CSV and JSON in both directions — quote-aware parsing built in." },
    { slug: "file-renamer", name: "Bulk File Renamer", emoji: "🏷️", cat: "files", desc: "Rename a whole folder of files with one pattern — index, date, name and more." },
    { slug: "zip-unzip", name: "ZIP / Unzip", emoji: "📦", cat: "files", desc: "Bundle files into a ZIP or extract any archive — compression happens right here." },
    { slug: "excel-to-csv", name: "Excel to CSV", emoji: "📊", cat: "files", desc: "Convert .xlsx spreadsheets to CSV without uploading them anywhere." },
    { slug: "pdf-merger", name: "PDF Merger", emoji: "🔗", cat: "files", desc: "Combine several PDFs into one document — all in your browser." },
    { slug: "pdf-splitter", name: "PDF Splitter", emoji: "✂️", cat: "files", desc: "Extract any page or split a PDF into one file per page." },
    /* Math & Science */
    { slug: "percentage", name: "Percentage Calculator", emoji: "💯", cat: "math", desc: "What's X% of Y? What percent is X of Y? How much did it change? All answered here." },
    { slug: "bmi", name: "BMI Calculator", emoji: "⚖️", cat: "math", desc: "Your BMI in seconds, plus where it lands on the healthy scale." },
    { slug: "tip", name: "Tip Calculator", emoji: "🧾", cat: "math", desc: "Figure out the tip and how much each person owes." },
    { slug: "unit-converter", name: "Unit Converter", emoji: "📏", cat: "math", desc: "Length, weight, temperature, volume, data — convert them all." },
    { slug: "roman-numeral", name: "Roman Numeral Converter", emoji: "🏛️", cat: "math", desc: "Modern number to ancient numeral, and back again." },
    { slug: "scientific-calculator", name: "Scientific Calculator", emoji: "🧮", cat: "math", desc: "Trig, logs, roots and powers — with full keyboard support." },
    { slug: "age-calculator", name: "Age Calculator", emoji: "🎂", cat: "math", desc: "Your exact age down to the day, and when the next birthday arrives." },
    { slug: "discount-calculator", name: "Discount Calculator", emoji: "🏷️", cat: "math", desc: "See what a sale actually saves you before you hit buy." },
    { slug: "day-counter", name: "Day Counter", emoji: "📆", cat: "math", desc: "Days, weeks and working days between any two dates." },
    { slug: "time-zone-converter", name: "Time Zone Converter", emoji: "🌍", cat: "math", desc: "See the same moment in two time zones at once — every zone on Earth." },
    { slug: "loan-calculator", name: "Loan Calculator", emoji: "💳", cat: "math", desc: "Monthly payments, total interest and how much an extra payment saves you." },
    { slug: "mortgage-amortization", name: "Mortgage Amortization", emoji: "🏠", cat: "math", desc: "Full payment-by-payment schedule — principal, interest and balance for every month." },
    { slug: "fuel-cost-calculator", name: "Fuel Cost Calculator", emoji: "⛽", cat: "math", desc: "How much that road trip costs — metric or imperial, at any fuel price." },
    { slug: "bmr-calculator", name: "Calorie Calculator (BMR)", emoji: "🔥", cat: "math", desc: "Your basal metabolic rate and daily calories for any activity level." },
    { slug: "currency-converter", name: "Currency Converter", emoji: "💱", cat: "math", desc: "Live exchange rates for 160+ currencies, cached for offline reuse." },
    { slug: "prime-checker", name: "Prime Number Checker", emoji: "🔢", cat: "math", desc: "Prime or not? Get the verdict, the factors, and the neighbors." },
    /* Productivity */
    { slug: "pomodoro", name: "Pomodoro Timer", emoji: "🍅", cat: "productivity", desc: "Classic 25-minute focus sprints with built-in breaks." },
    { slug: "todo-list", name: "To-Do List", emoji: "✅", cat: "productivity", desc: "A no-fuss checklist that remembers itself between visits." },
    { slug: "stopwatch", name: "Stopwatch", emoji: "⏱️", cat: "productivity", desc: "Precision timing with laps and splits — for workouts, cooking or speedruns." },
    { slug: "habit-tracker", name: "Habit Tracker", emoji: "📅", cat: "productivity", desc: "Check off habits day by day and watch your streak grow — saved in your browser." },
    { slug: "typing-speed", name: "Typing Speed Test", emoji: "⌨️", cat: "productivity", desc: "Measure your words per minute and accuracy on a live typing test." },
    { slug: "recipe-divider", name: "Recipe Divider", emoji: "🍳", cat: "productivity", desc: "Scale any recipe up or down — paste ingredients, pick a factor, done." },
    { slug: "baby-name-generator", name: "Baby Name Generator", emoji: "👶", cat: "productivity", desc: "Fresh name ideas by vibe — classic, modern, nature, strong and more." },
    { slug: "paint-color-calculator", name: "Paint Color Calculator", emoji: "🪣", cat: "productivity", desc: "Exactly how much paint that room needs — walls, ceiling, doors and coats included." },
    { slug: "retirement-calculator", name: "Retirement Calculator", emoji: "🏖️", cat: "productivity", desc: "Project your nest egg, safe withdrawal rate and whether you’ll cover your spending." },
    { slug: "meeting-agenda-builder", name: "Meeting Agenda Builder", emoji: "📋", cat: "productivity", desc: "Build a clean meeting agenda with timed items, attendees and notes — copy or download." },
    { slug: "travel-itinerary-planner", name: "Travel Itinerary Planner", emoji: "🧳", cat: "productivity", desc: "Plan day-by-day trips and export a neat itinerary." },
    /* Security */
    { slug: "password-strength", name: "Password Strength Tester", emoji: "🛡️", cat: "security", desc: "Find out how long a cracker would need — and how to make it longer." },
    { slug: "email-mask", name: "Email Mask Generator", emoji: "🎭", cat: "security", desc: "Generate throwaway email aliases so your real inbox stays private." },
    { slug: "text-encryptor", name: "Text Encryptor", emoji: "🔐", cat: "security", desc: "Scramble text with AES-256-GCM and a passphrase — decrypt it right back, offline." },
    { slug: "backup-codes", name: "Backup Codes Generator", emoji: "🎟️", cat: "security", desc: "Roll one-time recovery codes for 2FA — copy them all or download as a file." },
    { slug: "cookie-banner", name: "Cookie Banner Generator", emoji: "🍪", cat: "security", desc: "Generate a ready-to-paste cookie-consent banner with your message, buttons and color." },
    { slug: "privacy-policy-generator", name: "Privacy Policy Generator", emoji: "📜", cat: "security", desc: "A solid privacy policy for your site in seconds — GDPR section included." },
    { slug: "terms-of-service-generator", name: "Terms of Service Generator", emoji: "📄", cat: "security", desc: "Generate a clear ToS with billing, liability and jurisdiction sections." },
    { slug: "ip-lookup", name: "IP Address Lookup", emoji: "📍", cat: "security", desc: "Find your public IP and its location, ISP and timezone." },
    { slug: "dns-lookup", name: "DNS Lookup", emoji: "🌐", cat: "security", desc: "Query A, AAAA, MX, TXT, NS and CNAME records via DNS-over-HTTPS." },
    { slug: "data-breach-checker", name: "Data Breach Checker", emoji: "🕵️", cat: "security", desc: "Check if your email appears in known breaches — k-anonymity keeps it private." },
    /* Fun */
    { slug: "name-picker", name: "Random Name Picker", emoji: "🎯", cat: "fun", desc: "Who's the winner? Drop in names and find out." },
    { slug: "dice-roller", name: "Dice Roller", emoji: "🎲", cat: "fun", desc: "Roll one die or ten, with any number of sides." },
    { slug: "riddle-generator", name: "Riddle Generator", emoji: "🤔", cat: "fun", desc: "Random brain teasers — spoil the answer only when you're ready." },
    { slug: "coin-flipper", name: "Coin Flipper", emoji: "🪙", cat: "fun", desc: "Settle it old-school — heads or tails, with a satisfying flip." },
    { slug: "meme-maker", name: "Meme Maker", emoji: "😂", cat: "fun", desc: "Drop an image, add classic top &amp; bottom text, download your meme." }
  ];

  /* ================= Utilities ================= */
  var modules = {};
  function define(slug, def) { modules[slug] = def; }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function findTool(slug) { return TOOLS.find(function (t) { return t.slug === slug; }); }
  function findCat(slug) { return CATS.find(function (c) { return c.slug === slug; }); }
  function catName(slug) { var c = findCat(slug); return c ? c.name : slug; }
  function toolsOf(cat) { return TOOLS.filter(function (t) { return t.cat === cat; }); }
  function totalPlanned() { return CATS.reduce(function (n, c) { return n + c.planned.length; }, 0); }
  function base() { return location.pathname.indexOf("/tools/") !== -1 ? "../" : ""; }
  function qs(key) { return new URLSearchParams(location.search).get(key) || ""; }

  /* ================= Theme ================= */
  function themeInit() {
    var KEY = "toolbox-theme";
    var root = document.documentElement;
    var theme = localStorage.getItem(KEY);
    if (!theme) theme = "dark"; // cobalt black is the default look
    function apply(t) {
      root.dataset.theme = t;
      root.classList.toggle("dark", t === "dark");
      var btn = document.getElementById("theme-toggle");
      if (btn) {
        btn.textContent = t === "dark" ? "☀️" : "🌙";
        btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
      }
    }
    apply(theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        theme = theme === "dark" ? "light" : "dark";
        localStorage.setItem(KEY, theme);
        apply(theme);
      });
    }
  }

  /* ================= Reveal-on-scroll ================= */
  function initReveal(scope) {
    var cards = scope.querySelectorAll(".card");
    if (!cards.length) return;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduced) {
      cards.forEach(function (c) { c.classList.add("in"); });
      return;
    }
    cards.forEach(function (c, i) {
      c.classList.add("reveal");
      c.style.animationDelay = Math.min(i * 45, 500) + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ================= Header / footer ================= */
  function navHtml(active) {
    var b = base();
    function pill(href, label, isActive) {
      return '<a href="' + href + '" class="nav-pill' + (isActive ? " active" : "") + '">' + label + "</a>";
    }
    var h = pill(b + "index.html", "Home", active === "home");
    CATS.forEach(function (c) {
      h += pill(b + "category.html?cat=" + c.slug, esc(c.name), c.slug === active);
    });
    return h;
  }
  function headerHtml(active) {
    var b = base();
    return '<div class="mx-auto flex w-[min(1100px,92%)] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3.5">'
      + '<a href="' + b + 'index.html" class="group flex items-center gap-2 text-lg font-extrabold tracking-tight text-day-900 no-underline transition-transform duration-300 hover:-translate-y-0.5 sm:text-xl dark:text-night-200">'
      + '<span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cobalt-400 to-cobalt-700 text-base shadow-glow transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 sm:text-lg">🛠️</span>'
      + "Tool<span class=\"cobalt-grad\">Box</span></a>"
      + '<nav class="nav-scroll min-w-0 flex-1 flex flex-nowrap items-center gap-1 overflow-x-auto sm:flex-none sm:flex-wrap">' + navHtml(active) + "</nav>"
      + '<button id="theme-toggle" class="icon-btn" aria-label="Toggle theme">🌙</button>'
      + "</div>";
  }
  function footerHtml() {
    var replay = document.getElementById("intro-overlay")
      ? '<button id="replay-intro" type="button" style="margin-top:12px;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(139,92,246,.45);border-radius:999px;padding:6px 16px;font-size:12px;font-weight:600;color:#8b5cf6;cursor:pointer;background:transparent;transition:all .25s ease;">▶ Replay intro</button>'
      : "";
    return '<div class="mx-auto w-[min(1100px,92%)]">'
      + '<p class="font-semibold text-day-900 dark:text-night-200">🛠️ ToolBox — free tools that run right in your browser.</p>'
      + '<p class="small mt-1">No sign-ups · No ads · No uploads (everything stays on your device)</p>'
      + '<nav class="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">' + navHtml("") + "</nav>"
      + replay
      + "</div>";
  }

  /* ================= Cards ================= */
  function toolCard(t) {
    var b = base();
    return '<a class="card group flex flex-col gap-2 rounded-2xl border border-day-200 bg-white p-5 shadow-sm no-underline transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cobalt-400/70 hover:shadow-glow-soft dark:border-night-600 dark:bg-night-800 dark:shadow-card dark:hover:border-cobalt-400/50" href="' + b + 'tools/tool.html?t=' + t.slug + '">'
      + '<span class="text-3xl leading-none transition-transform duration-300 group-hover:scale-110">' + t.emoji + "</span>"
      + '<h3 class="text-base font-bold text-day-900 dark:text-night-200">' + esc(t.name) + "</h3>"
      + '<p class="flex-1 text-sm text-day-500 dark:text-night-400">' + esc(t.desc) + "</p>"
      + '<span class="tag">' + esc(catName(t.cat)) + "</span>"
      + '<span class="mt-1 flex items-center gap-1.5 text-sm font-bold text-cobalt-600 transition-all duration-300 group-hover:gap-3 dark:text-cobalt-300">Open tool <span aria-hidden="true">→</span></span>'
      + "</a>";
  }
  function catCard(c) {
    var b = base();
    var n = toolsOf(c.slug).length;
    return '<a class="card group flex flex-col gap-2 rounded-2xl border border-day-200 bg-white p-5 shadow-sm no-underline transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cobalt-400/70 hover:shadow-glow-soft dark:border-night-600 dark:bg-night-800 dark:shadow-card dark:hover:border-cobalt-400/50" href="' + b + "category.html?cat=" + c.slug + '">'
      + '<span class="text-3xl leading-none transition-transform duration-300 group-hover:scale-110">' + c.emoji + "</span>"
      + '<h3 class="text-base font-bold text-day-900 dark:text-night-200">' + esc(c.name) + "</h3>"
      + '<p class="flex-1 text-sm text-day-500 dark:text-night-400">' + esc(c.desc) + "</p>"
      + '<span class="tag">' + n + (n === 1 ? " tool" : " tools") + "</span>"
      + '<span class="mt-1 flex items-center gap-1.5 text-sm font-bold text-cobalt-600 transition-all duration-300 group-hover:gap-3 dark:text-cobalt-300">Explore <span aria-hidden="true">→</span></span>'
      + "</a>";
  }

  /* ================= Pages ================= */
  function renderHome(page) {
    page.innerHTML =
      '<section class="hero px-0 pb-10 pt-12 text-center sm:pt-16">'
      + '<div class="animate-fade-up">'
      + '<h1 class="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">Free tools for <span class="cobalt-grad animate-grad-shift bg-[length:200%]">everyday tasks</span></h1>'
      + '<p class="mx-auto mt-3 max-w-[600px] text-base text-day-500 sm:mt-4 sm:text-lg dark:text-night-400">Whether you&#39;re drafting an essay, resizing a photo, or settling a debate with a coin flip — every tool here runs right in your browser. No sign-ups, no ads, and nothing you make ever leaves your device.</p>'
      + '<div class="gooey-search relative mx-auto mt-6 max-w-[560px] animate-fade-up [animation-delay:180ms] sm:mt-8">'
      + '<div class="gooey-bg" aria-hidden="true"><span class="gooey-orb gooey-orb-1"></span><span class="gooey-orb gooey-orb-2"></span></div>'
      + '<span class="gooey-follow" aria-hidden="true"></span>'
      + '<span class="pointer-events-none absolute left-5 top-1/2 z-20 -translate-y-1/2 text-lg opacity-70">🔍</span>'
      + '<input type="search" id="search" placeholder="Search tools… (e.g. compress, json, pomodoro)" autocomplete="off" class="gooey-input w-full rounded-full border border-day-200/80 bg-white/80 py-3.5 pl-12 pr-5 text-base text-day-900 shadow-sm outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-day-500/70 hover:border-cobalt-400/60 focus:border-cobalt-400 focus:ring-4 focus:ring-cobalt-500/20 dark:border-night-600/80 dark:bg-night-900/70 dark:text-night-200 dark:placeholder:text-night-500 dark:hover:border-cobalt-400/50">'
      + "</div>"
      + "</div>"
      + "</section>"
      + '<section class="mx-auto w-[min(1100px,92%)] px-0 py-7" id="cats-section">'
      + '<h2 class="text-2xl font-extrabold tracking-tight text-day-900 dark:text-night-200">Categories</h2>'
      + '<p class="mb-5 mt-1 text-day-500 dark:text-night-400">Start with a category — or use the search box if you know what you need.</p>'
      + '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">' + CATS.map(catCard).join("") + "</div>"
      + "</section>"
      + '<section class="mx-auto w-[min(1100px,92%)] px-0 py-7 pb-[72px]">'
      + '<h2 class="text-2xl font-extrabold tracking-tight text-day-900 dark:text-night-200">All tools</h2>'
      + '<p class="mb-5 mt-1 text-day-500 dark:text-night-400">Every tool we&#39;ve built so far — the search box above narrows them down. And yes, we&#39;re still adding more.</p>'
      + '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="tool-grid">' + TOOLS.map(toolCard).join("") + "</div>"
      + '<p id="no-results" class="hidden py-5 text-center text-day-500 dark:text-night-400">No tools match your search. Try another keyword!</p>'
      + "</section>";

    var input = page.querySelector("#search");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      page.querySelectorAll("#tool-grid .card").forEach(function (c) {
        var ok = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.style.display = ok ? "" : "none";
        if (ok) {
          shown++;
          c.classList.add("in");
          c.style.animationDelay = "0ms";
        }
      });
      page.querySelector("#cats-section").classList.toggle("hidden", !!q);
      page.querySelector("#no-results").classList.toggle("hidden", shown !== 0);
    });

    initGooey(input);
  }

  /* ================= Gooey search (magicui GooeyInput style) ================= */
  function initGooey(input) {
    var wrap = input.parentElement;
    var follow = wrap.querySelector(".gooey-follow");
    if (!follow) return;
    if (window.matchMedia && (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    /* cache the rect — reading layout on every mousemove forces needless reflows */
    var rect = null;
    window.addEventListener("resize", function () { rect = null; });
    function tick() {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      follow.style.transform = "translate(" + cx + "px, " + cy + "px) translate(-50%, -50%)";
      raf = (Math.abs(x - cx) > 0.4 || Math.abs(y - cy) > 0.4) ? requestAnimationFrame(tick) : null;
    }
    wrap.addEventListener("mousemove", function (e) {
      if (!rect) rect = wrap.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      follow.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    });
    wrap.addEventListener("mouseleave", function () {
      follow.style.opacity = "0";
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    });
  }

  function renderCategory(page, slug) {
    var c = findCat(slug);
    if (!c) { page.innerHTML = '<div class="mx-auto w-[min(920px,92%)] py-8 pb-16"><h1 class="text-2xl font-extrabold">Category not found</h1></div>'; return; }
    document.title = c.name + " tools · ToolBox";
    var b = base();
    var tools = toolsOf(slug);
    var planned = c.planned.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    page.innerHTML =
      '<section class="mx-auto w-[min(1100px,92%)] px-0 pt-12">'
      + '<p class="mb-2 text-sm text-day-500 dark:text-night-400"><a class="font-semibold transition-colors hover:text-cobalt-600 dark:text-night-400 dark:hover:text-cobalt-300" href="' + b + 'index.html">Home</a> <span class="opacity-50">/</span> <span class="text-day-900 dark:text-night-200">' + esc(c.name) + "</span></p>"
      + '<h1 class="text-3xl font-extrabold tracking-tight text-day-900 sm:text-4xl dark:text-night-200">' + c.emoji + " " + esc(c.name) + " tools</h1>"
      + '<p class="mb-5 mt-1 max-w-[640px] text-day-500 dark:text-night-400">' + esc(c.desc) + "</p>"
      + '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">' + tools.map(toolCard).join("") + "</div>"
      + (planned.length
        ? '<div class="note-box mt-7"><strong>📋 Still to come:</strong><ul>' + planned + "</ul></div>"
        : "")
      + "</section>";
  }

  function renderTool(page, slug) {
    var t = findTool(slug);
    if (!t) { page.innerHTML = '<div class="mx-auto w-[min(920px,92%)] py-8 pb-16"><h1 class="text-2xl font-extrabold">Tool not found</h1></div>'; return; }
    document.title = t.name + " · ToolBox";
    var b = base();
    page.innerHTML =
      '<div class="mx-auto w-[min(920px,92%)] px-0 py-8 pb-16">'
      + '<p class="mb-2 text-sm text-day-500 dark:text-night-400">'
      + '<a class="font-semibold transition-colors hover:text-cobalt-600 dark:text-night-400 dark:hover:text-cobalt-300" href="' + b + 'index.html">Home</a> <span class="opacity-50">/</span> '
      + '<a class="font-semibold transition-colors hover:text-cobalt-600 dark:text-night-400 dark:hover:text-cobalt-300" href="' + b + "category.html?cat=" + t.cat + '">' + esc(catName(t.cat)) + "</a> <span class=\"opacity-50\">/</span> "
      + '<span class="text-day-900 dark:text-night-200">' + esc(t.name) + "</span></p>"
      + '<h1 class="text-3xl font-extrabold tracking-tight text-day-900 sm:text-4xl dark:text-night-200">' + t.emoji + " " + esc(t.name) + "</h1>"
      + '<p class="mt-1.5 text-day-500 dark:text-night-400">' + esc(t.desc) + "</p>"
      + '<div id="tool-box"></div>'
      + "</div>";

    var s = document.createElement("script");
    s.src = b + "js/tools/" + slug + ".js?v=20";
    s.onload = function () {
      var box = page.querySelector("#tool-box");
      var mod = modules[slug];
      if (mod) {
        if (mod.styles) {
          var st = document.createElement("style");
          st.textContent = mod.styles;
          document.head.appendChild(st);
        }
        mod.render(box);
      } else {
        box.innerHTML = '<div class="tool-body">⚠️ This tool registered nothing. Please reload.</div>';
      }
    };
    s.onerror = function () {
      page.querySelector("#tool-box").innerHTML = '<div class="tool-body">⚠️ Failed to load this tool.</div>';
    };
    page.appendChild(s);
  }

  /* ================= Ambient background orbs (living goo) =================
     Each orb wanders along 8 random points. Per-step translate, rotate and
     stretch are encoded as CSS vars, so the whole motion stays on the GPU
     compositor (transform-only, zero per-frame repaints). "Goo physics":
     when a step drifts downward (dragging on the floor) the blob squashes
     vertically and stretches horizontally — conservation of goo. Three
     animation personalities (smooth / springy / heavy-drip) give each orb
     its own "deciding where to go" rhythm. */
  function spawnOrbs() {
    var BLUE = { rgb: "0, 136, 255", a: 0.16 };
    var YELLOW = { rgb: "255, 198, 0", a: 0.1 };
    var COUNT = 50;
    var SIZE = 100; // uniform — every blob exactly the same size
    var ANIMS = ["orbWander", "orbWanderB", "orbWanderC"];
    var DIRS = ["alternate", "alternate-reverse", "normal", "reverse"];
    var html = '<div class="bg-orbs" aria-hidden="true">';
    for (var i = 0; i < COUNT; i++) {
      var c = (i % 2 === 0) ? BLUE : YELLOW; // exact 25 blue / 25 yellow, interleaved
      var a = (c.a * (0.55 + Math.random() * 0.9)).toFixed(3); // per-blob opacity
      var size = SIZE;
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var dur = (8 + Math.random() * 22).toFixed(1); // 8-30s each — livelier
      var delay = (-Math.random() * 40).toFixed(1);  // desync
      var m = Math.round(30 + Math.random() * 110);  // wander radius 30-140px
      var blur = Math.random() < 0.75 ? Math.round(6 + Math.random() * 8) : 0; // 75% get a soft melt blur
      // Goo points: x is symmetric, y drifts downward ~65% of the time so the
      // blob feels heavy and "drags" along the floor of the screen.
      var pts = [];
      for (var p = 0; p < 8; p++) {
        var dx = Math.round((Math.random() * 2 - 1) * m);
        var dy = Math.round((Math.random() * 1.7 - 0.35) * m); // bias: +0.35 mean down
        var rot = Math.round((Math.random() * 2 - 1) * 10);    // -10..10deg — squirmier
        var sy = 0.86 + Math.random() * 0.24;                  // base squash 0.86-1.10
        if (dy > 0) sy *= 0.9;                                 // deeper squash when dragging down
        var sx = 2.05 - sy;                                    // goo conservation: wide = short
        pts.push("--w" + (p + 1) + "x:" + dx + "px;--w" + (p + 1) + "y:" + dy + "px;"
          + "--r" + (p + 1) + ":" + rot + "deg;"
          + "--sx" + (p + 1) + ":" + sx.toFixed(3) + ";--sy" + (p + 1) + ":" + sy.toFixed(3) + ";");
      }
      var dir = DIRS[Math.floor(Math.random() * DIRS.length)];
      var anim = ANIMS[Math.floor(Math.random() * ANIMS.length)];
      // Static blob silhouette (random per orb) — organic shape without
      // animating border-radius, which would repaint every frame.
      var br = function () { return 35 + Math.round(Math.random() * 30); };
      html += '<span class="bg-orb" style="width:' + size + "px;height:" + size
        + 'px;left:' + x.toFixed(1) + "vw;top:" + y.toFixed(1) + "vh;"
        + "border-radius:" + br() + "% " + br() + "% " + br() + "% " + br() + "% / " + br() + "% " + br() + "% " + br() + "% " + br() + "%;"
        + "background:radial-gradient(circle, rgba(" + c.rgb + "," + a + "), rgba(" + c.rgb + ",0.04) 55%, transparent 72%);"
        + (blur ? "filter:blur(" + blur + "px);" : "")
        + "animation-name:" + anim + ";animation-duration:" + dur + "s;animation-delay:" + delay + "s;animation-direction:" + dir + ";"
        + pts.join("") + '"></span>';
    }
    html += "</div>";
    document.body.insertAdjacentHTML("afterbegin", html);
  }

  /* ================= Boot ================= */
  /* ================= Button sounds (Assets -> assets/button-*.mp3) ================= */
  function initSounds() {
    var hoverA = null, clickA = null, lastHoverT = 0, lastHoverEl = null;
    // Tool pages live one level deep, so assets need a ../ prefix
    var pageEl = document.getElementById("page");
    var base = (pageEl && pageEl.dataset.route === "tool" ? "../" : "") + "assets/";
    function ensure() {
      if (clickA) return;
      try {
        hoverA = new Audio(base + "button-hover.mp3");
        clickA = new Audio(base + "button-click.mp3");
        hoverA.preload = "auto"; hoverA.volume = 0.9;
        clickA.preload = "auto"; clickA.volume = 1.0;
      } catch (e) { hoverA = null; clickA = null; }
    }
    function isInteractive(el) {
      if (!el || !el.tagName) return false;
      var tag = el.tagName;
      if (tag === "BUTTON" || tag === "A" || tag === "SELECT") return true;
      if (tag === "INPUT") {
        var t = (el.type || "").toLowerCase();
        return t === "button" || t === "submit" || t === "checkbox" || t === "radio";
      }
      if (el.getAttribute && (el.getAttribute("role") === "button" || el.hasAttribute("onclick"))) return true;
      try { return getComputedStyle(el).cursor === "pointer"; } catch (e) { return false; }
    }
    function play(a) {
      if (!a) return;
      try {
        a.currentTime = 0;
        var p = a.play();
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    }
    document.addEventListener("pointerover", function (e) {
      if (e.pointerType === "touch" || !e.target || !e.target.closest) return;
      var hit = e.target.closest("button,a,[role=button],select,input,[onclick]") || e.target;
      if (!isInteractive(hit) || hit === lastHoverEl) return;
      lastHoverEl = hit;
      var now = Date.now();
      if (now - lastHoverT < 110) return;
      lastHoverT = now;
      ensure();
      play(hoverA);
    }, true);
    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      var hit = e.target.closest("button,a,[role=button],select,input,[onclick]");
      if (!hit || !isInteractive(hit)) return;
      ensure();
      play(clickA);
    }, true);
  }

  function boot() {
    document.body.classList.add("js");
    initSounds();
    if (!document.querySelector(".bg-orbs")) spawnOrbs();
    var header = document.getElementById("site-header");
    var footer = document.getElementById("site-footer");
    var page = document.getElementById("page");
    var route = page.dataset.route;
    var active = "home";
    var slug = qs("t");
    var cat = qs("cat");
    if (route === "category") active = cat || "writing";
    if (route === "tool") { var t = findTool(slug); if (t) active = t.cat; }

    header.innerHTML = headerHtml(active);
    footer.innerHTML = footerHtml();
    var replayBtn = document.getElementById("replay-intro");
    if (replayBtn) replayBtn.addEventListener("click", function () { if (window.replayIntro) window.replayIntro(); });
    themeInit();

    if (route === "home") renderHome(page);
    else if (route === "category") renderCategory(page, cat || "writing");
    else if (route === "tool") renderTool(page, slug);

    initReveal(page);
  }

  document.addEventListener("DOMContentLoaded", boot);

  window.ToolBox = { define: define, esc: esc };
})();