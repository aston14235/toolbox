ToolBox.define("file-renamer", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose files">'
      + '<span class="dz-icon">📁</span><strong>Drop files here</strong> or click to browse (multi-select works)'
      + '<input type="file" id="file" class="hidden" multiple>'
      + "</div>"
      + '<div class="controls" style="margin-top:16px;">'
      + '<label style="flex:1; min-width:260px;">Pattern <input type="text" id="pattern" value="{name}-{i}{ext}" style="flex:1; width:100%; padding:10px 12px; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;"></label>'
      + '<button id="preview" class="btn primary" disabled>👁️ Preview names</button>'
      + '<button id="dl" class="btn" disabled>⬇️ Download renamed</button>'
      + "</div>"
      + '<p class="note-box">Placeholders: <code>{name}</code> original name · <code>{ext}</code> extension (with dot) · <code>{i}</code> 1-based index · <code>{n}</code> total · <code>{date}</code> today. If your pattern has no <code>{ext}</code>, the original extension is kept. Renamed copies download locally — your originals are untouched.</p>'
      + '<ul id="list" class="file-list"></ul>'
      + "</div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var previewBtn = box.querySelector("#preview");
    var dlBtn = box.querySelector("#dl");
    var listEl = box.querySelector("#list");
    var files = [];
    var names = [];

    function extOf(name) {
      var i = name.lastIndexOf(".");
      return i > 0 ? name.slice(i) : "";
    }
    function baseOf(name) {
      var i = name.lastIndexOf(".");
      return i > 0 ? name.slice(0, i) : name;
    }
    function dateStr() {
      var d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function renderNames() {
      var pattern = box.querySelector("#pattern").value;
      var hasExt = pattern.indexOf("{ext}") !== -1;
      names = files.map(function (f, i) {
        var ext = extOf(f.name);
        var n = pattern
          .split("{name}").join(baseOf(f.name))
          .split("{ext}").join(ext)
          .split("{i}").join(String(i + 1))
          .split("{n}").join(String(files.length))
          .split("{date}").join(dateStr());
        n = n.replace(/[<>:"/\\|?*]/g, "").trim();
        if (!n) n = "renamed-" + (i + 1);
        if (!hasExt && ext && n.slice(-ext.length) !== ext) n += ext;
        return n;
      });
      listEl.innerHTML = files.map(function (f, i) {
        return '<li><span class="fname" style="color:var(--muted); text-decoration:line-through;">' + ToolBox.esc(f.name) + '</span><span aria-hidden="true">→</span><span class="fname">' + ToolBox.esc(names[i]) + "</span></li>";
      }).join("");
      dlBtn.disabled = !files.length;
    }
    function setFiles(list) {
      files = Array.prototype.slice.call(list);
      previewBtn.disabled = !files.length;
      if (!files.length) {
        listEl.innerHTML = "";
        dlBtn.disabled = true;
        return;
      }
      renderNames();
    }
    dlBtn.addEventListener("click", function () {
      files.forEach(function (f, i) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(f);
        a.download = names[i];
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      });
    });
    box.querySelector("#pattern").addEventListener("input", function () {
      if (files.length) renderNames();
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
    drop.addEventListener("drop", function (e) { setFiles(e.dataTransfer.files); });
    fileInput.addEventListener("change", function () {
      setFiles(fileInput.files);
      fileInput.value = "";
    });
    previewBtn.addEventListener("click", renderNames);
  }
});