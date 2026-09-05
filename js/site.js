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
      planned: ["PDF Merger", "PDF Splitter", "PDF to Word", "Word to PDF", "Excel to CSV", "ZIP / Unzip", "PDF to JPG", "HEIC to JPG", "Subtitle Extractor", "MP3 to MP4", "Video to MP3"] },
    { slug: "math", name: "Math & Science", emoji: "🧮",
      desc: "Fast answers for everyday math — tips, percentages, BMI and more.",
      planned: ["Loan Calculator", "Calorie Counter (BMR)", "Fuel Cost Calculator", "Day Counter", "Time Zone Converter", "Currency Converter", "Mortgage Amortization"] },
    { slug: "productivity", name: "Productivity", emoji: "⏱️",
      desc: "Stay on track with timers, checklists and small planning helpers.",
      planned: ["Meeting Agenda Builder", "Travel Itinerary Planner", "Recipe Divider", "Baby Name Generator", "Paint Color Calculator", "Retirement Calculator"] },
    { slug: "security", name: "Security", emoji: "🔒",
      desc: "Small tools that help you lock things down and sleep easier.",
      planned: ["IP Address Lookup", "DNS Lookup", "SSL Checker", "Privacy Policy Generator", "Terms of Service Generator", "Data Breach Checker", "Secure File Shredder"] },
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
    /* Files */
    { slug: "file-hash", name: "File Hash", emoji: "🔐", cat: "files", desc: "Check a file's integrity with SHA-1, SHA-256, SHA-384 or SHA-512 hashes." },
    { slug: "text-merge", name: "Text Merger", emoji: "📚", cat: "files", desc: "Combine several text files into one, with a separator of your choice." },
    { slug: "jpg-to-pdf", name: "JPG to PDF", emoji: "📄", cat: "files", desc: "Drop in a few photos and export them as a single PDF." },
    { slug: "csv-to-excel", name: "CSV to Excel", emoji: "📊", cat: "files", desc: "Open a CSV, peek at the data, then export it as an Excel file." },
    { slug: "text-file-splitter", name: "Text File Splitter", emoji: "✂️", cat: "files", desc: "Slice a big text file into parts by line count or size, then download them all." },
    { slug: "csv-json", name: "CSV ↔ JSON Converter", emoji: "🔄", cat: "files", desc: "Flip between CSV and JSON in both directions — quote-aware parsing built in." },
    { slug: "file-renamer", name: "Bulk File Renamer", emoji: "🏷️", cat: "files", desc: "Rename a whole folder of files with one pattern — index, date, name and more." },
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
    { slug: "stopwatch", name: "Stopwatch", emoji: "⏱️", cat: "productivity", desc: "Precision timing with laps and splits — for workouts, cooking or speedruns." },
    { slug: "habit-tracker", name: "Habit Tracker", emoji: "📅", cat: "productivity", desc: "Check off habits day by day and watch your streak grow — saved in your browser." },
    { slug: "typing-speed", name: "Typing Speed Test", emoji: "⌨️", cat: "productivity", desc: "Measure your words per minute and accuracy on a live typing test." },
    /* Security */
    { slug: "password-strength", name: "Password Strength Tester", emoji: "🛡️", cat: "security", desc: "Find out how long a cracker would need — and how to make it longer." },
    { slug: "email-mask", name: "Email Mask Generator", emoji: "🎭", cat: "security", desc: "Generate throwaway email aliases so your real inbox stays private." },
    { slug: "text-encryptor", name: "Text Encryptor", emoji: "🔐", cat: "security", desc: "Scramble text with AES-256-GCM and a passphrase — decrypt it right back, offline." },
    { slug: "backup-codes", name: "Backup Codes Generator", emoji: "🎟️", cat: "security", desc: "Roll one-time recovery codes for 2FA — copy them all or download as a file." },
    { slug: "cookie-banner", name: "Cookie Banner Generator", emoji: "🍪", cat: "security", desc: "Generate a ready-to-paste cookie-consent banner with your message, buttons and color." },
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
    return '<div class="mx-auto w-[min(1100px,92%)]">'
      + '<p class="font-semibold text-day-900 dark:text-night-200">🛠️ ToolBox — free tools that run right in your browser.</p>'
      + '<p class="small mt-1">No sign-ups · No ads · No uploads (everything stays on your device)</p>'
      + '<nav class="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">' + navHtml("") + "</nav>"
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
    function tick() {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      follow.style.transform = "translate(" + cx + "px, " + cy + "px) translate(-50%, -50%)";
      raf = (Math.abs(x - cx) > 0.4 || Math.abs(y - cy) > 0.4) ? requestAnimationFrame(tick) : null;
    }
    wrap.addEventListener("mousemove", function (e) {
      var r = wrap.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
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
    s.src = b + "js/tools/" + slug + ".js?v=2";
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
    document.body.classList.add("js");
    if (!document.querySelector(".bg-orbs")) {
      document.body.insertAdjacentHTML("afterbegin",
        '<div class="bg-orbs" aria-hidden="true">'
        + '<span class="bg-orb bg-orb-a"></span>'
        + '<span class="bg-orb bg-orb-b"></span>'
        + '<span class="bg-orb bg-orb-c"></span>'
        + '<span class="bg-orb bg-orb-d"></span>'
        + '<span class="bg-orb bg-orb-e"></span>'
        + "</div>");
    }
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

    initReveal(page);
  }

  document.addEventListener("DOMContentLoaded", boot);

  window.ToolBox = { define: define, esc: esc };
})();