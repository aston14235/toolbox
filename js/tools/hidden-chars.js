ToolBox.define("hidden-chars", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="clean" class="btn primary">🧹 Remove invisible characters</button>'
      + '<button id="copy" class="btn">📋 Copy cleaned</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<textarea id="input" placeholder="Paste text that may contain invisible characters (zero-width spaces, BOM, RTL marks, soft hyphens…)" aria-label="Input text"></textarea>'
      + '<label class="section-sub" style="display:block; margin:16px 0 8px;"><strong>Cleaned</strong></label>'
      + '<textarea id="output" readonly aria-label="Cleaned text"></textarea>'
      + '<div id="found"></div>'
      + "</div>";

    var inputEl = box.querySelector("#input");
    var outputEl = box.querySelector("#output");
    var reportEl = box.querySelector("#report");
    var foundEl = box.querySelector("#found");

    var CHARS = [
      { name: "Zero-width space (U+200B)", re: /\u200B/g },
      { name: "Zero-width non-joiner (U+200C)", re: /\u200C/g },
      { name: "Zero-width joiner (U+200D)", re: /\u200D/g },
      { name: "Left-to-right mark (U+200E)", re: /\u200E/g },
      { name: "Right-to-left mark (U+200F)", re: /\u200F/g },
      { name: "Word joiner / invisible operators (U+2060–U+2064)", re: /[\u2060\u2061\u2062\u2063\u2064]/g },
      { name: "Soft hyphen (U+00AD)", re: /\u00AD/g },
      { name: "Byte-order mark (U+FEFF)", re: /\uFEFF/g },
      { name: "Arabic letter mark (U+061C)", re: /\u061C/g },
      { name: "Mongolian vowel separator (U+180E)", re: /\u180E/g }
    ];

    function run() {
      var v = inputEl.value;
      var total = 0;
      var found = [];
      var cleaned = v;
      CHARS.forEach(function (c) {
        var count = (c.re.test(v) ? (v.match(c.re) || []).length : 0);
        if (count) {
          total += count;
          found.push({ name: c.name, n: count });
        }
      });
      // strip everything invisible in one pass (covers any stragglers)
      cleaned = v.replace(/[\u200B-\u200F\u2060-\u2064\u00AD\uFEFF\u061C\u180E]/g, "");
      outputEl.value = cleaned;
      reportEl.textContent = total ? "Removed " + total + " invisible " + (total === 1 ? "character" : "characters") : "No invisible characters found ✓";
      reportEl.style.color = total ? "var(--danger)" : "var(--ok)";
      var html = "";
      found.forEach(function (f) {
        html += '<div class="kv" style="margin-top:10px;"><div class="row"><span>' + ToolBox.esc(f.name) + "</span><span class=\"tag\">" + f.n + "</span></div></div>";
      });
      foundEl.innerHTML = html;
    }

    box.querySelector("#clean").addEventListener("click", run);
    box.querySelector("#copy").addEventListener("click", function () {
      if (!outputEl.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy cleaned"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputEl.value).then(done, done);
      } else { outputEl.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    run();
  }
});