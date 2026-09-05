ToolBox.define("svg-optimizer", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="run" class="btn primary">✨ Optimize</button>'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<button id="dl" class="btn">⬇️ Download .svg</button>'
      + '<span id="report" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div>"
      + '<div class="field"><label>SVG code</label>'
      + '<textarea id="input" class="mono" rows="10" spellcheck="false"><svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <!-- a red circle -->\n  <circle cx="50" cy="50" r="40" fill="#ff0000" />\n  <rect x="0" y="0" width="20" height="20" fill="blue"></rect>\n</svg></textarea></div>'
      + '<div class="field"><label>Optimized</label>'
      + '<textarea id="output" class="mono" rows="10" readonly></textarea></div>'
      + "</div>";

    function optimize(svg) {
      var out = svg
        // strip XML comments
        .replace(/<!--[\s\S]*?-->/g, "")
        // collapse whitespace between tags
        .replace(/>\s+</g, "><")
        // trim whitespace inside tags
        .replace(/\s{2,}/g, " ")
        // remove whitespace around = signs
        .replace(/\s*=\s*/g, "=")
        // simplify quotes
        .replace(/="([^"]*)"/g, "='$1'")
        // drop the default namespace if present and redundant
        .replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"\s?/, "")
        // trim trailing whitespace on self-closing tags: <rect ... /> -> <rect .../>
        .replace(/\s+\/>/g, "/>")
        .trim();
      return out;
    }

    function run() {
      var src = box.querySelector("#input").value;
      var out = optimize(src);
      box.querySelector("#output").value = out;
      var before = new Blob([src]).size, after = new Blob([out]).size;
      box.querySelector("#report").textContent = before + " → " + after + " bytes · saved " + (before ? Math.round((1 - after / before) * 100) : 0) + "%";
    }
    box.querySelector("#run").addEventListener("click", run);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#output");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.value).then(done, done);
      else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    box.querySelector("#dl").addEventListener("click", function () {
      var blob = new Blob([box.querySelector("#output").value], { type: "image/svg+xml" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "optimized.svg";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
    run();
  }
});