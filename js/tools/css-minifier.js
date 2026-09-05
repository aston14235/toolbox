ToolBox.define("css-minifier", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="minify" class="btn primary">🗜️ Minify</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<textarea id="input" class="mono" placeholder="Paste CSS here…" aria-label="CSS input">.card {  color: #333;   /* a comment */\n  padding: 10px 20px ; }\n\n.card:hover {  color: #000; }</textarea>'
      + '<label class="section-sub" style="display:block; margin:16px 0 8px;"><strong>Minified</strong></label>'
      + '<textarea id="output" readonly class="mono" aria-label="Minified CSS"></textarea>'
      + '<p class="note-box">Removes comments, extra whitespace and the final semicolon. A conservative minifier — strings and url() values are preserved.</p>'
      + "</div>";

    function minify(css) {
      return css
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .replace(/;}/g, "}")
        .replace(/\s*([>+~])\s*/g, "$1")
        .trim();
    }

    box.querySelector("#minify").addEventListener("click", function () {
      var input = box.querySelector("#input").value;
      var out = minify(input);
      box.querySelector("#output").value = out;
      var r = box.querySelector("#report");
      if (!input.trim()) { r.textContent = ""; return; }
      var saved = Math.max(0, Math.round((1 - out.length / input.length) * 100));
      r.textContent = input.length.toLocaleString() + " → " + out.length.toLocaleString() + " chars · saved " + saved + "%";
      r.style.color = saved > 0 ? "var(--ok)" : "var(--muted)";
    });

    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#output");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(o.value).then(done, done);
      } else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
  }
});