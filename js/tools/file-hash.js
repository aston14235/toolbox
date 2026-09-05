ToolBox.define("file-hash", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose a file">'
      + '<span class="dz-icon">📄</span><strong>Drop a file here</strong> or click to browse'
      + '<input type="file" id="file" class="hidden">'
      + "</div>"
      + '<p id="status" class="note-box" style="margin-top:16px;">Waiting for a file…</p>'
      + '<ul id="results" class="file-list" style="margin-top:12px;"></ul>'
      + '<p class="note-box">🔒 Hashing happens locally via your browser\'s Web Crypto API — the file is never uploaded. Works on https / localhost.</p>'
      + "</div>";

    var drop = box.querySelector("#drop");
    var fileInput = box.querySelector("#file");
    var statusEl = box.querySelector("#status");
    var resultsEl = box.querySelector("#results");
    var ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

    function hex(buf) {
      var bytes = new Uint8Array(buf);
      var out = "";
      for (var i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
      return out;
    }

    function compute(file) {
      resultsEl.innerHTML = "";
      statusEl.textContent = "Hashing " + file.name + " (" + file.size.toLocaleString() + " bytes)…";
      file.arrayBuffer().then(function (buffer) {
        return Promise.all(ALGOS.map(function (algo) {
          return crypto.subtle.digest(algo, buffer).then(function (digest) {
            return { algo: algo, hash: hex(digest) };
          });
        }));
      }).then(function (all) {
        statusEl.textContent = "Done — here are the checksums for " + file.name + ":";
        all.forEach(function (item) {
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.className = "fname";
          name.textContent = item.algo;
          var code = document.createElement("code");
          code.style.cssText = "font-size:0.78rem; word-break:break-all; flex:1; color:var(--muted);";
          code.textContent = item.hash;
          var copy = document.createElement("button");
          copy.className = "mini-btn";
          copy.textContent = "📋 Copy";
          copy.addEventListener("click", function () {
            navigator.clipboard.writeText(item.hash).then(function () {
              copy.textContent = "✅ Copied";
              setTimeout(function () { copy.textContent = "📋 Copy"; }, 1500);
            });
          });
          li.appendChild(name);
          li.appendChild(code);
          li.appendChild(copy);
          resultsEl.appendChild(li);
        });
      }).catch(function () {
        statusEl.textContent = "⚠️ Hashing failed. This tool needs a secure context (https or localhost).";
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
    drop.addEventListener("drop", function (e) {
      var f = e.dataTransfer.files[0];
      if (f) compute(f);
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) compute(f);
      fileInput.value = "";
    });
  }
});