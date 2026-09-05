(function () {
  "use strict";

  /* ================= Categories (matches the 101-tool plan) ================= */
  var CATS = [
    { slug: "writing", name: "Writing", emoji: "✍️",
      desc: "Words are your thing? Edit, convert and count them — all in your browser, all private.",
      planned: ["Sentiment Analyzer", "Rhyme Finder", "Anagram Generator"] },
    { slug: "developer", name: "Developer", emoji: "💻",
      desc: "The little utilities every developer ends up needing — JSON, regex, generators and more.",
      planned: ["JavaScript Minifier", "Cron Expression Generator", "Meta Tag Generator", "User Agent Parser", "SQL Query Formatter"] },
    { slug: "drawing", name: "Drawing", emoji: "🎨",
      desc: "Sketch, doodle and export — no art supplies required.",
      planned: [] },
    { slug: "image", name: "Image & Design", emoji: "🖼️",
      desc: "From resizing to color picking — your images never leave your device.",
      planned: ["Image Cropper", "QR Code Generator", "Background Remover", "Image Watermarker", "Blur Image Tool", "Favicon Converter", "SVG Optimizer", "GIF Maker", "Mockup Generator"] },
    { slug: "files", name: "Files", emoji: "📁",
      desc: "Merge, convert and hash files without uploading them anywhere.",
      planned: ["PDF Merger", "PDF Splitter", "PDF to Word", "Word to PDF", "Excel to CSV", "ZIP / Unzip", "PDF to JPG", "HEIC to JPG", "Subtitle Extractor", "File Name Bulk Renamer", "MP3 to MP4", "Video to MP3"] },
    { slug: "math", name: "Math & Science", emoji: "🧮",
      desc: "Fast answers for everyday math — tips, percentages, BMI and more.",
      planned: ["Loan Calculator", "Calorie Counter (BMR)", "Fuel Cost Calculator", "Day Counter", "Time Zone Converter", "Currency Converter", "Mortgage Amortization"] },
    { slug: "productivity", name: "Productivity", emoji: "⏱️",
      desc: "Stay on track with timers, checklists and small planning helpers.",
      planned: ["Meeting Agenda Builder", "Travel Itinerary Planner", "Recipe Divider", "Baby Name Generator", "Paint Color Calculator", "Retirement Calculator"] },
    { slug: "security", name: "Security", emoji: "🔒",
      desc: "Small tools that help you lock things down and sleep easier.",
      planned: ["IP Address Lookup", "DNS Lookup", "SSL Checker", "Privacy Policy Generator", "Terms of Service Generator", "Data Breach Checker", "Secure File Shredder", "Cookie Consent Banner"] },
    { slug: "fun", name: "Fun & Misc", emoji: "🎲",
      desc: "For the not-so-serious stuff: dice, names, riddles and coin flips.",
      planned: ["Meme Maker"] }
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
    /* Drawing */
    { slug: "whiteboard", name: "Whiteboard", emoji: "🎨", cat: "drawing", desc: "Doodle with brushes and colors, erase freely, undo mistakes — save as PNG." },
    { slug: "pixel-art", name: "Pixel Art", emoji: "🧩", cat: "drawing", desc: "Channel the 8-bit era — paint pixel by pixel and download your masterpiece." },
    /* Image & Design */
    { slug: "image-compressor", name: "Image Compressor", emoji: "🗜️", cat: "image", desc: "Slim down images right in the browser — nothing ever gets uploaded." },
    { slug: "image-resizer", name: "Image Resizer", emoji: "📐", cat: "image", desc: "Scale an image to exact pixel sizes, no photo app needed." },
    { slug: "color-palette", name: "Color Palette Extractor", emoji: "🖌️", cat: "image", desc: "Upload a photo and pull out its dominant colors." },
    { slug: "contrast-checker", name: "Color Contrast Checker", emoji: "👁️", cat: "image", desc: "Make sure your text is actually readable — check contrast ratios here." },
    { slug: "color-scheme", name: "Color Scheme Generator", emoji: "🌈", cat: "image", desc: "Pick a color — wheel, slider or name — and get a smooth board of its shades." },
    { slug: "image-to-ascii", name: "Image to ASCII", emoji: "🔤", cat: "image", desc: "Turn a photo into glorious text art." },
    /* Files */
    { slug: "file-hash", name: "File Hash", emoji: "🔐", cat: "files", desc: "Check a file's integrity with SHA-1, SHA-256, SHA-384 or SHA-512 hashes." },
    { slug: "text-merge", name: "Text Merger", emoji: "📚", cat: "files", desc: "Combine several text files into one, with a separator of your choice." },
    { slug: "jpg-to-pdf", name: "JPG to PDF", emoji: "📄", cat: "files", desc: "Drop in a few photos and export them as a single PDF." },
    { slug: "csv-to-excel", name: "CSV to Excel", emoji: "📊", cat: "files", desc: "Open a CSV, peek at the data, then export it as an Excel file." },
    /* Math & Science */
    { slug: "percentage", name: "Percentage Calculator", emoji: "💯", cat: "math", desc: "What's X% of Y? What percent is X of Y? How much did it change? All answered here." },
    { slug: "bmi", name: "BMI Calculator", emoji: "⚖️", cat: "math", desc: "Your BMI in seconds, plus where it lands on the healthy scale." },
    { slug: "tip", name: "Tip Calculator", emoji: "🧾", cat: "math", desc: "Figure out the tip and how much each person owes." },
    { slug: "unit-converter", name: "Unit Converter", emoji: "📏", cat: "math", desc: "Length, weight, temperature, volume, data — convert them all." },
    { slug: "roman-numeral", name: "Roman Numeral Converter", emoji: "🏛️", cat: "math", desc: "Modern number to ancient numeral, and back again." },
    { slug: "scientific-calculator", name: "Scientific Calculator", emoji: "🧮", cat: "math", desc: "Trig, logs, roots and powers — with full keyboard support." },
    { slug: "age-calculator", name: "Age Calculator", emoji: "🎂", cat: "math", desc: "Your exact age down to the day, and when the next birthday arrives." },
    { slug: "discount-calculator", name: "Discount Calculator", emoji: "🏷️", cat: "math", desc: "See what a sale actually saves you before you hit buy." },
    { slug: "prime-checker", name: "Prime Number Checker", emoji: "🔢", cat: "math", desc: "Prime or not? Get the verdict, the factors, and the neighbors." },
    /* Productivity */
    { slug: "pomodoro", name: "Pomodoro Timer", emoji: "🍅", cat: "productivity", desc: "Classic 25-minute focus sprints with built-in breaks." },
    { slug: "todo-list", name: "To-Do List", emoji: "✅", cat: "productivity", desc: "A no-fuss checklist that remembers itself between visits." },
    /* Security */
    { slug: "password-strength", name: "Password Strength Tester", emoji: "🛡️", cat: "security", desc: "Find out how long a cracker would need — and how to make it longer." },
    { slug: "email-mask", name: "Email Mask Generator", emoji: "🎭", cat: "security", desc: "Generate throwaway email aliases so your real inbox stays private." },
    /* Fun */
    { slug: "name-picker", name: "Random Name Picker", emoji: "🎯", cat: "fun", desc: "Who's the winner? Drop in names and find out." },
    { slug: "dice-roller", name: "Dice Roller", emoji: "🎲", cat: "fun", desc: "Roll one die or ten, with any number of sides." },
    { slug: "riddle-generator", name: "Riddle Generator", emoji: "🤔", cat: "fun", desc: "Random brain teasers — spoil the answer only when you're ready." },
    { slug: "coin-flipper", name: "Coin Flipper", emoji: "🪙", cat: "fun", desc: "Settle it old-school — heads or tails, with a satisfying flip." }
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
    if (!theme) theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    function apply(t) {
      root.dataset.theme = t;
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

  /* ================= Header / footer ================= */
  function navHtml(active) {
    var b = base();
    var h = '<a href="' + b + 'index.html"' + (active === "home" ? ' class="active"' : "") + '>Home</a>';
    CATS.forEach(function (c) {
      h += '<a href="' + b + 'category.html?cat=' + c.slug + '"' + (c.slug === active ? ' class="active"' : "") + ">" + esc(c.name) + "</a>";
    });
    return h;
  }
  function headerHtml(active) {
    var b = base();
    return '<div class="container header-inner">'
      + '<a href="' + b + 'index.html" class="logo">🛠️ Tool<span>Box</span></a>'
      + '<nav class="nav">' + navHtml(active) + '</nav>'
      + '<button id="theme-toggle" class="icon-btn" aria-label="Toggle theme">🌙</button>'
      + "</div>";
  }
  function footerHtml() {
    return '<div class="container">'
      + "<p>🛠️ ToolBox — free tools that run right in your browser.</p>"
      + '<p class="small">No sign-ups · No ads · No uploads (everything stays on your device)</p>'
      + '<nav class="footer-nav">' + navHtml("") + "</nav>"
      + "</div>";
  }

  /* ================= Cards ================= */
  function toolCard(t) {
    var b = base();
    return '<a class="card" href="' + b + 'tools/tool.html?t=' + t.slug + '">'
      + '<span class="emoji">' + t.emoji + "</span>"
      + "<h3>" + esc(t.name) + "</h3>"
      + "<p>" + esc(t.desc) + "</p>"
      + '<span class="tag">' + esc(catName(t.cat)) + "</span>"
      + '<span class="card-link">Open tool</span>'
      + "</a>";
  }
  function catCard(c) {
    var b = base();
    var n = toolsOf(c.slug).length;
    return '<a class="card" href="' + b + "category.html?cat=" + c.slug + '">'
      + '<span class="emoji">' + c.emoji + "</span>"
      + "<h3>" + esc(c.name) + "</h3>"
      + "<p>" + esc(c.desc) + "</p>"
      + '<span class="tag">' + n + (n === 1 ? " tool" : " tools") + "</span>"
      + '<span class="card-link">Explore</span>'
      + "</a>";
  }

  /* ================= Pages ================= */
  function renderHome(page) {
    var b = base();
    page.innerHTML =
      '<section class="hero container">'
      + "<h1>Free tools for <span class=\"grad\">everyday tasks</span></h1>"
      + "<p>Whether you're drafting an essay, resizing a photo, or settling a debate with a coin flip — every tool here runs right in your browser. No sign-ups, no ads, and nothing you make ever leaves your device.</p>"
      + '<div class="search-wrap"><span class="search-icon">🔍</span><input type="search" id="search" placeholder="Search tools… (e.g. compress, json, pomodoro)" autocomplete="off"></div>'
      + "</section>"
      + '<section class="section container">'
      + '<h2 class="section-title">Categories</h2>'
      + '<p class="section-sub">Start with a category — or use the search box if you know what you need.</p>'
      + '<div class="grid">' + CATS.map(catCard).join("") + "</div>"
      + "</section>"
      + '<section class="section container" style="padding-bottom:72px;">'
      + '<h2 class="section-title">All tools</h2>'
      + '<p class="section-sub">Every tool we\'ve built so far — the search box above narrows them down. And yes, we\'re still adding more.</p>'
      + '<div class="grid" id="tool-grid">' + TOOLS.map(toolCard).join("") + "</div>"
      + '<p id="no-results" class="hidden" style="text-align:center; color:var(--muted); padding:20px 0;">No tools match your search. Try another keyword!</p>'
      + "</section>";

    var input = page.querySelector("#search");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      page.querySelectorAll("#tool-grid .card").forEach(function (c) {
        var ok = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      page.querySelector("#no-results").classList.toggle("hidden", shown !== 0);
    });
  }

  function renderCategory(page, slug) {
    var c = findCat(slug);
    if (!c) { page.innerHTML = '<div class="container tool-shell"><h1>Category not found</h1></div>'; return; }
    document.title = c.name + " tools · ToolBox";
    var b = base();
    var tools = toolsOf(slug);
    var planned = c.planned.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    page.innerHTML =
      '<section class="section container" style="padding-top:48px;">'
      + '<p class="crumbs"><a href="' + b + 'index.html">Home</a> / ' + esc(c.name) + "</p>"
      + '<h1 class="section-title" style="font-size:2rem;">' + c.emoji + " " + esc(c.name) + " tools</h1>"
      + '<p class="section-sub">' + esc(c.desc) + "</p>"
      + '<div class="grid">' + tools.map(toolCard).join("") + "</div>"
      + (planned.length
        ? '<div class="note-box" style="margin-top:28px;"><strong>📋 Still to come:</strong><ul>' + planned + "</ul></div>"
        : "")
      + "</section>";
  }

  function renderTool(page, slug) {
    var t = findTool(slug);
    if (!t) { page.innerHTML = '<div class="container tool-shell"><h1>Tool not found</h1></div>'; return; }
    document.title = t.name + " · ToolBox";
    var b = base();
    page.innerHTML =
      '<div class="container tool-shell">'
      + '<p class="crumbs"><a href="' + b + 'index.html">Home</a> / <a href="' + b + "category.html?cat=" + t.cat + '">' + esc(catName(t.cat)) + "</a> / " + esc(t.name) + "</p>"
      + "<h1>" + t.emoji + " " + esc(t.name) + "</h1>"
      + '<p class="desc">' + esc(t.desc) + "</p>"
      + '<div id="tool-box"></div>'
      + "</div>";

    var s = document.createElement("script");
    s.src = b + "js/tools/" + slug + ".js";
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

  /* ================= Boot ================= */
  function boot() {
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
    themeInit();

    if (route === "home") renderHome(page);
    else if (route === "category") renderCategory(page, cat || "writing");
    else if (route === "tool") renderTool(page, slug);
  }

  document.addEventListener("DOMContentLoaded", boot);

  window.ToolBox = { define: define, esc: esc };
})();