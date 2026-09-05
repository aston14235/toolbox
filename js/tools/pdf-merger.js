ToolBox.define("pdf-merger", {
  styles: ".pm-list { margin-top: 14px; } .pm-list .row { display:flex; align-items:center; gap:10px; padding:9px 12px; border:1px solid var(--border); border-radius:10px; margin-bottom:6px; cursor:grab; } .pm-list .row:active { cursor:grabbing; } .pm-list .row code { flex:1; word-break:break-all; } .pm-list .row .small { white-space:nowrap; } .pm-remove { background:none; border:none; color:var(--danger); cursor:pointer; font-size:1rem; padding:2px 6px; border-radius:6px; } .pm-remove:hover { background:rgba(239,68,68,.12); } .pm-grip { cursor:grab; color:var(--muted,#64748b); user-select:none; letter-spacing:1px; font-size:.8rem; } .pm-list .row.pm-dragging { opacity:.45; } .pm-list .row.pm-over { border-color:var(--cobalt,#0088ff); box-shadow:0 0 0 1px var(--cobalt,#0088ff); }",
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
        + '<div id="drop" class="dropzone" role="button" tabindex="0">📄 <strong>Add PDFs</strong> — drop 2+ files here, or click to browse<input type="file" id="file" accept="application/pdf,.pdf" multiple class="hidden"></div>'
        + '<div id="list" class="pm-list"></div>'
        + '<div class="controls" style="margin-top:14px;"><button id="merge" class="btn primary" disabled>🔗 Merge into one PDF</button></div>'
        + '<div id="out"></div>'
        + '<p class="note-box" style="margin-top:14px;">🔒 Everything stays on your device — files are merged entirely in your browser.</p>'
        + "</div>";

      var files = [];
      var listEl = host.querySelector("#list");
      var mergeBtn = host.querySelector("#merge");
      var outEl = host.querySelector("#out");

      function refresh() {
        listEl.innerHTML = files.map(function (f, i) {
          return '<div class="row" draggable="true" data-i="' + i + '"><span class="pm-grip" title="Drag to reorder">⋮⋮</span><span class="small">' + (i + 1) + ".</span>"
            + "<code>" + ToolBox.esc(f.name) + "</code>"
            + '<span class="small">' + (f.pages > 0 ? f.pages + " page" + (f.pages === 1 ? "" : "s") : "…") + " · " + fmtSize(f.size) + "</span>"
            + '<button class="pm-remove" data-i="' + i + '" title="Remove">✕</button></div>';
        }).join("");
        mergeBtn.disabled = files.length < 2;
      }
      var dragIdx = -1;
      listEl.addEventListener("dragstart", function (e) {
        var row = e.target.closest(".row");
        if (!row) return;
        dragIdx = +row.dataset.i;
        row.classList.add("pm-dragging");
        try { e.dataTransfer.setData("text/plain", String(dragIdx)); } catch (err) {}
      });
      listEl.addEventListener("dragover", function (e) {
        if (dragIdx < 0) return;
        e.preventDefault();
        var row = e.target.closest(".row");
        listEl.querySelectorAll(".row").forEach(function (r) { r.classList.remove("pm-over"); });
        if (row) row.classList.add("pm-over");
      });
      listEl.addEventListener("drop", function (e) {
        e.preventDefault();
        var row = e.target.closest(".row");
        if (dragIdx < 0 || !row) return;
        var to = +row.dataset.i;
        if (dragIdx !== to && to >= 0 && to < files.length) {
          var moved = files.splice(dragIdx, 1)[0];
          files.splice(to, 0, moved);
        }
        dragIdx = -1;
        refresh();
      });
      listEl.addEventListener("dragend", function () {
        dragIdx = -1;
        listEl.querySelectorAll(".row").forEach(function (r) { r.classList.remove("pm-dragging", "pm-over"); });
      });
      function fmtSize(n) {
        if (n < 1024) return n + " B";
        if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
        return (n / 1048576).toFixed(1) + " MB";
      }
      function addFiles(list) {
        Array.prototype.forEach.call(list, function (f) {
          if (!f || !/pdf$/.test(f.name) && f.type !== "application/pdf") return;
          if (files.some(function (x) { return x.file === f; })) return;
          var entry = { file: f, name: f.name, size: f.size, pages: 0, buf: null };
          files.push(entry);
          refresh();
          var reader = new FileReader();
          reader.onload = function () {
            try {
              entry.buf = new Uint8Array(reader.result);
              entry.pages = PdfKit.pageCount(entry.buf);
            } catch (e) {
              entry.pages = 0;
              entry.error = "not a valid PDF";
            }
            refresh();
          };
          reader.readAsArrayBuffer(f);
        });
      }
      host.querySelector("#drop").addEventListener("click", function () { host.querySelector("#file").click(); });
      host.querySelector("#drop").addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); host.querySelector("#file").click(); }
      });
      host.querySelector("#file").addEventListener("change", function () {
        addFiles(host.querySelector("#file").files);
        host.querySelector("#file").value = "";
      });
      ["dragenter", "dragover"].forEach(function (ev) {
        host.querySelector("#drop").addEventListener(ev, function (e) { e.preventDefault(); host.querySelector("#drop").classList.add("drag"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        host.querySelector("#drop").addEventListener(ev, function (e) { e.preventDefault(); host.querySelector("#drop").classList.remove("drag"); });
      });
      host.querySelector("#drop").addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
      listEl.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-i]");
        if (!btn) return;
        files.splice(+btn.dataset.i, 1);
        refresh();
      });

      mergeBtn.addEventListener("click", function () {
        var valid = files.filter(function (f) { return f.buf && f.pages > 0; });
        if (valid.length < 2) {
          outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">Add at least 2 valid PDF files.</p>';
          return;
        }
        mergeBtn.disabled = true;
        outEl.innerHTML = '<p class="note-box">Merging…</p>';
        setTimeout(function () {
          try {
            var total = 0;
            valid.forEach(function (f) { total += f.pages; });
            var out = PdfKit.merge(valid.map(function (f) { return { bytes: f.buf }; }));
            var blob = new Blob([out], { type: "application/pdf" });
            var url = URL.createObjectURL(blob);
            outEl.innerHTML = '<p class="note-box" style="border-color:rgba(34,197,94,.35);">✅ Merged <strong>' + valid.length + " PDFs → " + total + " pages</strong> (" + fmtSize(out.length) + ').</p>'
              + '<div class="controls"><button id="pm-dl" class="btn primary">⬇️ Download merged.pdf</button></div>';
            host.querySelector("#pm-dl").addEventListener("click", function () {
              var a = document.createElement("a");
              a.href = url;
              a.download = "merged-" + Date.now() + ".pdf";
              a.click();
              setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
            });
          } catch (e) {
            outEl.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">⚠️ Merge failed: ' + ToolBox.esc(e.message || e) + "</p>";
          } finally {
            mergeBtn.disabled = files.length < 2;
          }
        }, 30);
      });
    }
  }
});