ToolBox.define("text-merge", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose text files">'
      + '<span class="dz-icon">📄</span><strong>Drop .txt files here</strong> or click to browse (you can pick several)'
      + '<input type="file" id="file" accept=".txt,.md,.csv,.json,.log,text/*" multiple class="hidden">'
      + "</div>"
      + '<div id="list-wrap" class="hidden" style="margin-top:18px;">'
      + '<div class="controls">'
      + '<label>Separator <select id="separator">'
      + '<option value="\\n">New line</option>'
      + '<option value="\\n\\n">Blank line</option>'
      + '<option value=",">Comma</option>'
      + '<option value=" ">Space</option>'
      + '<option value="custom">Custom…</option>'
      + "</select></label>"
      + '<input type="text" id="custom-sep" class="hidden" placeholder="e.g. ---" style="padding:9px 12px; border:1px solid var(--border); border-radius:10px; background:var(--surface); color:var(--text);">'
      + '<button id="clear-all" class="btn ghost danger">🗑️ Remove all</button>'
      + '<button id="download" class="btn primary">⬇️ Download merged</button>'
      + "</div>"
      + '<ul id="file-list" class="file-list"></ul>'
      + "</div>"
      + '<div id="preview-wrap" class="hidden" style="margin-top:18px;">'
      + '<label class="section-sub" style="margin-bottom:8px; display:block;"><strong>Preview</strong></label>'
      + '<textarea id="preview" readonly aria-label="Merged preview"></textarea>'
      + "</div></div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var listWrap = box.querySelector("#list-wrap");
    var fileListEl = box.querySelector("#file-list");
    var previewWrap = box.querySelector("#preview-wrap");
    var preview = box.querySelector("#preview");
    var separatorSel = box.querySelector("#separator");
    var customSep = box.querySelector("#custom-sep");
    var clearAllBtn = box.querySelector("#clear-all");
    var downloadBtn = box.querySelector("#download");
    var files = [];

    function separator() {
      if (separatorSel.value === "custom") return customSep.value;
      if (separatorSel.value === "\\n") return "\n";
      if (separatorSel.value === "\\n\\n") return "\n\n";
      return separatorSel.value;
    }

    function render() {
      fileListEl.innerHTML = "";
      files.forEach(function (f, i) {
        var li = document.createElement("li");
        var name = document.createElement("span");
        name.className = "fname";
        name.textContent = f.name;
        var meta = document.createElement("span");
        meta.className = "fmeta";
        meta.textContent = f.text.length.toLocaleString() + " chars";
        li.appendChild(name);
        li.appendChild(meta);
        ["▲", "▼"].forEach(function (sym, k) {
          var b = document.createElement("button");
          b.className = "mini-btn";
          b.textContent = sym;
          b.title = k === 0 ? "Move up" : "Move down";
          b.disabled = (k === 0 && i === 0) || (k === 1 && i === files.length - 1);
          b.addEventListener("click", function () {
            var j = k === 0 ? i - 1 : i + 1;
            var tmp = files[i];
            files[i] = files[j];
            files[j] = tmp;
            render();
          });
          li.appendChild(b);
        });
        var rm = document.createElement("button");
        rm.className = "mini-btn rm";
        rm.textContent = "✕";
        rm.title = "Remove";
        rm.addEventListener("click", function () {
          files.splice(i, 1);
          render();
        });
        li.appendChild(rm);
        fileListEl.appendChild(li);
      });
      var has = files.length > 0;
      listWrap.classList.toggle("hidden", !has);
      previewWrap.classList.toggle("hidden", !has);
      preview.value = has ? files.map(function (f) { return f.text; }).join(separator()) : "";
    }

    function addFiles(fileList) {
      var pending = Array.prototype.slice.call(fileList);
      pending.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function () {
          files.push({ name: file.name, text: String(reader.result) });
          render();
        };
        reader.readAsText(file);
      });
    }

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
    drop.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
    fileInput.addEventListener("change", function () {
      addFiles(fileInput.files);
      fileInput.value = "";
    });

    separatorSel.addEventListener("change", function () {
      customSep.classList.toggle("hidden", separatorSel.value !== "custom");
      render();
    });
    customSep.addEventListener("input", render);
    clearAllBtn.addEventListener("click", function () {
      if (window.confirm("Remove all files from the merge?")) {
        files = [];
        render();
      }
    });
    downloadBtn.addEventListener("click", function () {
      if (!files.length) return;
      var text = files.map(function (f) { return f.text; }).join(separator());
      var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "merged.txt";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    });
  }
});