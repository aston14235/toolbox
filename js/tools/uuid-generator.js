ToolBox.define("uuid-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Count <input type="number" id="count" min="1" max="100" value="5" style="width:80px; padding:9px 10px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text);"></label>'
      + '<button id="gen" class="btn primary">✨ Generate</button>'
      + '<button id="copy" class="btn">📋 Copy all</button>'
      + "</div>"
      + '<textarea id="out" readonly class="mono" aria-label="Generated UUIDs"></textarea>'
      + "</div>";

    function uuid() {
      if (crypto.randomUUID) return crypto.randomUUID();
      var b = crypto.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var h = Array.prototype.map.call(b, function (x) { return x.toString(16).padStart(2, "0"); }).join("");
      return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
    }
    function gen() {
      var n = Math.min(100, Math.max(1, Number(box.querySelector("#count").value) || 5));
      var lines = [];
      for (var i = 0; i < n; i++) lines.push(uuid());
      box.querySelector("#out").value = lines.join("\n");
    }
    box.querySelector("#gen").addEventListener("click", gen);
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#out");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy all"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(o.value).then(done, function () { o.select(); done(); });
      } else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    gen();
  }
});