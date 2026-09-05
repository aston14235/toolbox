ToolBox.define("password-generator", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Length <input type="range" id="len" min="8" max="64" value="20"> <span id="lenv" style="min-width:2em;">20</span></label>'
      + '<label><input type="checkbox" id="upper" checked> A–Z</label>'
      + '<label><input type="checkbox" id="lower" checked> a–z</label>'
      + '<label><input type="checkbox" id="digits" checked> 0–9</label>'
      + '<label><input type="checkbox" id="syms" checked> !@#$%</label>'
      + '<label><input type="checkbox" id="excl"> No lookalikes</label>'
      + '<button id="gen" class="btn primary">🎲 Generate</button>'
      + "</div>"
      + '<textarea id="out" readonly class="mono" style="min-height:70px;" aria-label="Generated password"></textarea>'
      + '<div class="controls" style="margin-top:12px;">'
      + '<button id="copy" class="btn">📋 Copy</button>'
      + '<span id="entropy" class="tag" style="color:var(--muted); background:none;"></span>'
      + "</div></div>";

    var lenEl = box.querySelector("#len");
    var UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var LOWER = "abcdefghijklmnopqrstuvwxyz";
    var DIGITS = "0123456789";
    var SYMS = "!@#$%^&*()-_=+[]{};:,.?/";
    var LOOKALIKES = "Il1O0o|`'\"";

    function pool() {
      var p = "";
      var n = 0;
      if (box.querySelector("#upper").checked) { p += UPPER; n += UPPER.length; }
      if (box.querySelector("#lower").checked) { p += LOWER; n += LOWER.length; }
      if (box.querySelector("#digits").checked) { p += DIGITS; n += DIGITS.length; }
      if (box.querySelector("#syms").checked) { p += SYMS; n += SYMS.length; }
      if (box.querySelector("#excl").checked) {
        p = p.split("").filter(function (c) { return LOOKALIKES.indexOf(c) === -1; }).join("");
        n = p.length;
      }
      return p;
    }
    function gen() {
      var p = pool();
      var len = Number(lenEl.value);
      if (!p) { box.querySelector("#out").value = ""; box.querySelector("#entropy").textContent = "Enable at least one character set"; return; }
      var arr = new Uint32Array(len);
      crypto.getRandomValues(arr);
      var out = "";
      for (var i = 0; i < len; i++) out += p[arr[i] % p.length];
      box.querySelector("#out").value = out;
      var bits = Math.round(len * Math.log2(p.length));
      box.querySelector("#entropy").textContent = "~" + bits.toLocaleString() + " bits of entropy";
    }
    lenEl.addEventListener("input", function () { box.querySelector("#lenv").textContent = lenEl.value; });
    box.querySelector("#gen").addEventListener("click", gen);
    box.querySelectorAll("input[type=checkbox]").forEach(function (c) { c.addEventListener("change", gen); });
    box.querySelector("#copy").addEventListener("click", function () {
      var o = box.querySelector("#out");
      if (!o.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(o.value).then(done, function () { o.select(); done(); });
      } else { o.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    gen();
  }
});