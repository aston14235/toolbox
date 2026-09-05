ToolBox.define("pdf-splitter", {
  styles: ".ps-pages { margin-top: 14px; } .ps-pages .row { display:flex; align-items:center; gap:10px; padding:8px 12px; border:1px solid var(--border); border-radius:10px; margin-bottom:6px; } .ps-pages .row .num { font-weight:700; min-width:64px; } .ps-pages .row code { flex:1; word-break:break-all; } .ps-dl { background:var(--bg2,#0f1d2b); border:1px solid var(--border); color:var(--text); border-radius:8px; padding:5px 10px; cursor:pointer; font-size:.85rem; } .ps-dl:hover { border-color:var(--cobalt,#0088ff); } .ps-pick { display:flex; gap:10px; align-items:end; flex-wrap:wrap; } .ps-pick .field { flex:1; min-width:110px; }",
  render: function (box) {
    var B = location.pathname.indexOf("/tools/") !== -1 ? "../" : "";
    box.innerHTML = '<div class="tool-body"><p class="note-box">Loading PDF engine…</p></div>';
    var s = document.createElement("script");
    s.src = B + "js/tools/pdf-core.js?v=14";
    s.onload = function () { ui(box); };
    s.onerror = function () {
      box.innerHTML = '<div class="tool-body"><p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">Failed to load the PDF engine — please reload the page.</p></div>';
    };
    document.head.appendChild(s);

    function ui(host) {
      host.innerHTML =
        '<div class="tool-body">'
        + '<div id="drop" class="dropzone" role="button" tabindex="0">📄 <strong>Choose a PDF</strong> — drop it here, or click to browse<input type="file" id="file" accept="application/pdf,.pdf" class="hidden"></div>'
        + '<div id="ready" class="hidden" style="margin-top:14px;">'
        + '<p class="note-box" id="summary">—</p>'
        + '<div class="ps-pick" style="margin-top:12px;">'
        + '<div class="field"><label>From page</label><input type="number" id="from" min="1" value="1" style="padding:10px 12px;"></div>'
        + '<div class="field"><label>To page</label><input type="number" id="to" min="1" value="1" style="padding:10px 12px;"></div>'
        + '<button id="pick" class="btn primary">⬇️ Download pages</button>'
        + "</div>"
        + '<div class="controls" style="margin-top:10px;"><button id="all" class="btn">📦 Split into one file per page</button></div>'
        + '<div id="pages" class="ps-pages"></div>'
        + '<div id="out"></div>'
        + "</div>"
        + '<p class="note-box" style="margin-top:14px;">🔒 Private: your PDF never leaves your device.</p>'
        + "</div>";

      var buf = null;
      var pageCount = 0;
      var drop = host.querySelector("#drop");
      var fileInput = host.querySelector("#file");
      var ready = host.querySelector("#ready");
      var fromEl = host.querySelector("#from"), toEl = host.querySelector("#to");
      var outEl = host.querySelector("#out");

      function load(file) {
        if (!file || file.type !== "application/pdf" && !/pdf$/.test(file.name)) {
          outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">Please choose a PDF file.</p>';
          return;
        }
        outEl.innerHTML = '<p class="note-box">Reading PDF…</p>';
        var reader = new FileReader();
        reader.onload = function () {
          try {
            buf = new Uint8Array(reader.result);
            pageCount = PdfKit.pageCount(buf);
            if (!pageCount) throw new Error("no pages found");
            ready.classList.remove("hidden");
            drop.style.display = "none";
            fromEl.max = pageCount;
            toEl.max = pageCount;
            fromEl.value = 1;
            toEl.value = pageCount;
            host.querySelector("#summary").innerHTML = "✅ <strong>" + ToolBox.esc(file.name) + "</strong> — " + pageCount + " page" + (pageCount === 1 ? "" : "s") + ".";
            renderPages();
            outEl.innerHTML = "";
          } catch (e) {
            outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">⚠️ Could not read this file as a PDF: ' + ToolBox.esc(e.message || e) + "</p>";
          }
        };
        reader.readAsArrayBuffer(file);
      }

      function renderPages() {
        var html = "";
        for (var i = 1; i <= pageCount; i++) {
          html += '<div class="row"><span class="num">Page ' + i + "</span><code></code>"
            + '<button class="ps-dl" data-p="' + i + '">⬇️ This page</button></div>';
        }
        host.querySelector("#pages").innerHTML = html;
      }

      function downloadPage(p, cb) {
        var out = PdfKit.split(buf, p - 1);
        var blob = new Blob([out], { type: "application/pdf" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "page-" + p + ".pdf";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 4000);
        if (cb) setTimeout(cb, 350);
      }

      drop.addEventListener("click", function () { fileInput.click(); });
      drop.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
      });
      fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
      ["dragenter", "dragover"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); });
      });
      drop.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });

      host.querySelector("#pages").addEventListener("click", function (e) {
        var btn = e.target.closest("[data-p]");
        if (!btn || !buf) return;
        try {
          outEl.innerHTML = '<p class="note-box">Extracting page ' + btn.dataset.p + "…</p>";
          downloadPage(+btn.dataset.p, function () {
            outEl.innerHTML = '<p class="note-box" style="border-color:rgba(34,197,94,.35);">✅ Downloaded page ' + btn.dataset.p + ".</p>";
          });
        } catch (err) {
          outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">⚠️ ' + ToolBox.esc(err.message || err) + "</p>";
        }
      });

      host.querySelector("#pick").addEventListener("click", function () {
        var a = parseInt(fromEl.value, 10), b = parseInt(toEl.value, 10);
        if (isNaN(a) || isNaN(b)) return;
        a = Math.max(1, Math.min(pageCount, a));
        b = Math.max(1, Math.min(pageCount, b));
        if (a > b) { var t = a; a = b; b = t; }
        fromEl.value = a; toEl.value = b;
        var n = b - a + 1;
        outEl.innerHTML = '<p class="note-box">Extracting pages ' + a + "–" + b + "…</p>";
        var i = a;
        function step() {
          if (i > b) {
            outEl.innerHTML = '<p class="note-box" style="border-color:rgba(34,197,94,.35);">✅ Downloaded ' + n + " file" + (n === 1 ? "" : "s") + " (pages " + a + "–" + b + ").</p>";
            return;
          }
          try { downloadPage(i, step); } catch (e) {
            outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">⚠️ ' + ToolBox.esc(e.message || e) + "</p>";
            return;
          }
          i++;
        }
        step();
      });

      host.querySelector("#all").addEventListener("click", function () {
        outEl.innerHTML = '<p class="note-box">Splitting ' + pageCount + " pages…</p>";
        var i = 1;
        function step() {
          if (i > pageCount) {
            outEl.innerHTML = '<p class="note-box" style="border-color:rgba(34,197,94,.35);">✅ Downloaded ' + pageCount + " files (one PDF per page).</p>";
            return;
          }
          try { downloadPage(i, step); } catch (e) {
            outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">⚠️ ' + ToolBox.esc(e.message || e) + "</p>";
            return;
          }
          i++;
        }
        step();
      });
    }
  }
});