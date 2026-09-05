ToolBox.define("text-file-splitter", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose a text file">'
      + '<span class="dz-icon">📄</span><strong>Drop a text file here</strong> or click to browse'
      + '<input type="file" id="file" class="hidden" accept=".txt,.csv,.md,.json,.log,text/plain">'
      + "</div>"
      + '<div class="controls" style="margin-top:16px;">'
      + '<label>Split by <select id="mode"><option value="lines" selected>Lines per part</option><option value="size">Size (KB, approx)</option></select></label>'
      + '<label id="lines-label">Lines <input type="number" id="lines" min="1" value="500" style="width:80px; padding:9px 10px;"></label>'
      + '<label id="size-label" class="hidden">KB per part <input type="number" id="kb" min="1" value="100" style="width:80px; padding:9px 10px;"></label>'
      + '<button id="split" class="btn primary" disabled>✂️ Split</button>'
      + '<button id="dl" class="btn" disabled>⬇️ Download all parts</button>'
      + "</div>"
      + '<p id="status" class="note-box">Choose a file, pick how to cut it, and download the parts. Files never leave your device.</p>'
      + '<ul id="parts" class="file-list"></ul>'
      + "</div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var splitBtn = box.querySelector("#split");
    var dlBtn = box.querySelector("#dl");
    var statusEl = box.querySelector("#status");
    var partsEl = box.querySelector("#parts");
    var fileName = "";
    var parts = [];

    box.querySelector("#mode").addEventListener("change", function () {
      var bySize = box.querySelector("#mode").value === "size";
      box.querySelector("#lines-label").classList.toggle("hidden", bySize);
      box.querySelector("#size-label").classList.toggle("hidden", !bySize);
    });

    function splitText(text) {
      var bySize = box.querySelector("#mode").value === "size";
      if (bySize) {
        var kb = Math.max(1, +box.querySelector("#kb").value || 100);
        var chars = Math.floor(kb * 512); // ~2 bytes per char
        parts = [];
        for (var i = 0; i < text.length; i += chars) {
          parts.push(text.slice(i, i + chars));
        }
      } else {
        var n = Math.max(1, +box.querySelector("#lines").value || 500);
        var lines = text.split(/\r?\n/);
        parts = [];
        for (var j = 0; j < lines.length; j += n) {
          parts.push(lines.slice(j, j + n).join("\n"));
        }
      }
    }
    function split() {
      if (!fileName) return;
      statusEl.textContent = "Splitting " + fileName + "…";
      fileInput.files[0].text().then(function (text) {
        splitText(text);
        statusEl.textContent = "Split " + fileName + " into " + parts.length + " part" + (parts.length === 1 ? "" : "s") + ".";
        partsEl.innerHTML = parts.map(function (p, i) {
          var preview = p.slice(0, 90).replace(/\n/g, " ↵ ");
          return '<li><span class="fname">' + ToolBox.esc(fileName) + ".part" + (i + 1) + ".txt</span><span class=\"fmeta\">" + p.length.toLocaleString() + " chars</span><code style=\"font-size:0.72rem; color:var(--muted);\">" + ToolBox.esc(preview) + (p.length > 90 ? "…" : "") + "</code></li>";
        }).join("");
        dlBtn.disabled = parts.length === 0;
      });
    }
    dlBtn.addEventListener("click", function () {
      parts.forEach(function (p, i) {
        var blob = new Blob([p], { type: "text/plain" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName.replace(/\.[^.]+$/, "") + ".part" + (i + 1) + ".txt";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      });
    });

    drop.addEventListener("click", function () { fileInput.click(); });
    drop.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); });
    });
    drop.addEventListener("drop", function (e) {
      var f = e.dataTransfer.files[0];
      if (f) { fileName = f.name; splitBtn.disabled = false; }
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) { fileName = f.name; splitBtn.disabled = false; }
      fileInput.value = "";
    });
    splitBtn.addEventListener("click", split);
  }
});