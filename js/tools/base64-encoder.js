ToolBox.define("base64-encoder", {
  styles: ".b64-tabs { display:flex; gap:8px; margin-bottom:16px; } .b64-tabs button { flex:1; padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:var(--card); cursor:pointer; font-weight:600; color:var(--text); } .b64-tabs button.active { background:var(--accent); color:#fff; border-color:var(--accent); } .b64-modes { display:flex; gap:8px; margin-bottom:12px; } .b64-modes button { padding:8px 14px; border-radius:999px; border:1px solid var(--border); background:var(--card); cursor:pointer; font-weight:600; color:var(--text); } .b64-modes button.active { background:var(--accent-soft); border-color:var(--accent); color:var(--accent); }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="b64-tabs" role="tablist">'
      + '<button id="tab-text" class="active" role="tab">Text ↔ Base64</button>'
      + '<button id="tab-file" role="tab">File → Base64</button>'
      + "</div>"

      /* ---------- Text pane ---------- */
      + '<div id="pane-text">'
      + '<div class="b64-modes">'
      + '<button id="mode-enc" class="active">Encode →</button>'
      + '<button id="mode-dec">← Decode</button>'
      + "</div>"
      + '<textarea id="b64-in" class="mono" rows="6" placeholder="Type text to encode, or paste Base64 to decode…" aria-label="Input"></textarea>'
      + '<div class="controls" style="margin:12px 0;">'
      + '<button id="b64-run" class="btn primary">▶ Convert</button>'
      + '<button id="b64-swap" class="btn">⇅ Use output as input</button>'
      + '<button id="b64-copy" class="btn">📋 Copy result</button>'
      + "</div>"
      + '<textarea id="b64-out" class="mono" rows="6" readonly placeholder="Result appears here…" aria-label="Result"></textarea>'
      + '<p id="b64-msg" class="note-box" style="margin-top:12px;">UTF-8 safe — emojis and accents survive the round trip.</p>'
      + "</div>"

      /* ---------- File pane ---------- */
      + '<div id="pane-file" class="hidden">'
      + '<div id="drop" class="dropzone" role="button" tabindex="0" aria-label="Choose a file">'
      + '<span class="dz-icon">🗂️</span><strong>Drop a file here</strong> or click to browse'
      + '<input type="file" id="file" class="hidden">'
      + "</div>"
      + '<p id="status" class="note-box" style="margin-top:16px;">Waiting for a file…</p>'
      + '<div id="results" class="hidden" style="margin-top:16px;">'
      + '<textarea id="output" class="mono" readonly aria-label="Base64 output"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button id="copy" class="btn primary">📋 Copy</button>'
      + '<button id="download" class="btn">⬇️ Download .txt</button>'
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="orig-size">—</div><div class="label">Original size</div></div>'
      + '<div class="stat"><div class="num" id="enc-size">—</div><div class="label">Encoded size</div></div>'
      + '<div class="stat"><div class="num" id="overhead">—</div><div class="label">Overhead</div></div>'
      + "</div></div></div>"
      + "</div>";

    var $ = function (id) { return box.querySelector("#" + id); };

    /* ================= Tabs ================= */
    var tabText = $("tab-text"), tabFile = $("tab-file");
    var paneText = $("pane-text"), paneFile = $("pane-file");
    function showTab(which) {
      var text = which === "text";
      tabText.classList.toggle("active", text);
      tabFile.classList.toggle("active", !text);
      paneText.classList.toggle("hidden", !text);
      paneFile.classList.toggle("hidden", text);
    }
    tabText.addEventListener("click", function () { showTab("text"); });
    tabFile.addEventListener("click", function () { showTab("file"); });

    /* ================= Text pane ================= */
    var modeEnc = true;
    var modeEncBtn = $("mode-enc"), modeDecBtn = $("mode-dec");
    var input = $("b64-in"), outputT = $("b64-out"), msg = $("b64-msg");

    function setMode(enc) {
      modeEnc = enc;
      modeEncBtn.classList.toggle("active", enc);
      modeDecBtn.classList.toggle("active", !enc);
      input.placeholder = enc
        ? "Type text to encode…"
        : "Paste Base64 to decode…";
      msg.textContent = enc
        ? "UTF-8 safe — emojis and accents survive the round trip."
        : "Decoding a non-text file's Base64 will look like gibberish — that's expected.";
    }
    modeEncBtn.addEventListener("click", function () { setMode(true); });
    modeDecBtn.addEventListener("click", function () { setMode(false); });

    function bytesToB64(bytes) {
      var bin = "";
      for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin);
    }
    function encodeText(str) {
      return bytesToB64(new TextEncoder().encode(str));
    }
    function decodeB64(b64) {
      var clean = b64.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 === 1) {
        throw new Error("That doesn't look like valid Base64.");
      }
      var bin = atob(clean);
      var bytes = new Uint8Array(bin.length);
      for (var j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
      return new TextDecoder().decode(bytes);
    }

    $("b64-run").addEventListener("click", function () {
      var val = input.value;
      if (!val) { msg.textContent = "⚠️ Type or paste something first."; return; }
      try {
        var result = modeEnc ? encodeText(val) : decodeB64(val);
        outputT.value = result;
        msg.textContent = modeEnc
          ? "Encoded ✓ (" + result.length + " characters)"
          : "Decoded ✓ (" + new Blob([result]).size + " bytes)";
      } catch (err) {
        outputT.value = "";
        msg.textContent = "⚠️ " + err.message;
      }
    });

    $("b64-swap").addEventListener("click", function () {
      if (!outputT.value) return;
      input.value = outputT.value;
      outputT.value = "";
      setMode(!modeEnc);
      msg.textContent = "Moved the result to the input — now going the other way.";
    });

    $("b64-copy").addEventListener("click", function () {
      if (!outputT.value) return;
      function done() {
        $("b64-copy").textContent = "✅ Copied!";
        setTimeout(function () { $("b64-copy").textContent = "📋 Copy result"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputT.value).then(done, done);
      } else {
        outputT.focus(); outputT.select();
        try { document.execCommand("copy"); } catch (e) {}
        done();
      }
    });

    /* ================= File pane ================= */
    var drop = $("drop"), fileInput = $("file"), statusEl = $("status"), resultsEl = $("results");
    var outputF = $("output"), copyBtn = $("copy"), downloadBtn = $("download");
    var fileName = "file";

    function fmtSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    function encodeFile(file) {
      fileName = file.name;
      statusEl.textContent = "Encoding " + file.name + "…";
      var reader = new FileReader();
      reader.onload = function () {
        var dataUrl = reader.result;
        var b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
        outputF.value = b64;
        $("orig-size").textContent = fmtSize(file.size);
        $("enc-size").textContent = fmtSize(b64.length);
        var pct = file.size ? Math.round(((b64.length - file.size) / file.size) * 100) : 0;
        $("overhead").textContent = "+" + pct + "%";
        statusEl.textContent = "Done — " + file.name + " encoded (" + fmtSize(b64.length) + ").";
        resultsEl.classList.remove("hidden");
      };
      reader.onerror = function () { statusEl.textContent = "⚠️ Could not read that file."; };
      reader.readAsDataURL(file);
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
      if (f) encodeFile(f);
    });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0];
      if (f) encodeFile(f);
      fileInput.value = "";
    });

    copyBtn.addEventListener("click", function () {
      if (!outputF.value) return;
      function done() {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(function () { copyBtn.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputF.value).then(done, function () { outputF.select(); done(); });
      } else {
        outputF.focus(); outputF.select();
        try { document.execCommand("copy"); } catch (e) {}
        done();
      }
    });

    downloadBtn.addEventListener("click", function () {
      if (!outputF.value) return;
      var blob = new Blob([outputF.value], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName.replace(/\.[^.]+$/, "") + "-base64.txt";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    });
  }
});
