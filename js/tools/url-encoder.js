ToolBox.define("url-encoder", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<textarea id="input" placeholder="Paste a URL or text to encode / decode…" aria-label="Input"></textarea>'
      + '<div class="controls" style="margin-top:16px;">'
      + '<button class="btn" data-mode="enc-comp">🔒 Encode (component)</button>'
      + '<button class="btn" data-mode="enc-url">🔒 Encode (full URL)</button>'
      + '<button class="btn" data-mode="dec">🔓 Decode</button>'
      + "</div>"
      + '<textarea id="output" readonly placeholder="Result appears here…" aria-label="Output" style="margin-top:12px;"></textarea>'
      + '<div class="controls" style="margin-top:16px;"><button id="copy" class="btn primary">📋 Copy result</button>'
      + '<span id="note" class="muted small"></span></div>'
      + '<p class="note-box">Component encoding encodes every reserved character (good for query values); full-URL encoding leaves structural characters like : / ? &amp; = alone.</p>'
      + "</div>";

    var inputEl = box.querySelector("#input");
    var outputEl = box.querySelector("#output");
    var noteEl = box.querySelector("#note");

    function run(mode) {
      var v = inputEl.value;
      if (!v) { outputEl.value = ""; noteEl.textContent = ""; return; }
      try {
        if (mode === "enc-comp") { outputEl.value = encodeURIComponent(v); noteEl.textContent = "Encoded " + v.length + " → " + outputEl.value.length + " characters"; }
        else if (mode === "enc-url") { outputEl.value = encodeURI(v); noteEl.textContent = "Encoded " + v.length + " → " + outputEl.value.length + " characters"; }
        else { outputEl.value = decodeURIComponent(v); noteEl.textContent = "Decoded"; }
      } catch (e) {
        outputEl.value = "";
        noteEl.textContent = "❌ Invalid input: " + e.message;
        noteEl.style.color = "var(--danger)";
      }
    }

    box.querySelectorAll("[data-mode]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        noteEl.style.color = "var(--muted)";
        run(btn.dataset.mode);
      });
    });
    box.querySelector("#copy").addEventListener("click", function () {
      if (!outputEl.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy result"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputEl.value).then(done, done);
      } else { outputEl.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
  }
});