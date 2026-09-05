ToolBox.define("gradient-generator", {
  styles: ".grad-preview { height: 130px; border-radius: 14px; border: 1px solid var(--border); margin-bottom: 16px; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div id="preview" class="grad-preview"></div>'
      + '<div class="controls">'
      + '<label>Type <select id="type"><option value="linear">Linear</option><option value="radial">Radial</option></select></label>'
      + '<label>Color 1 <input type="color" id="c1" value="#6366f1"></label>'
      + '<label>Color 2 <input type="color" id="c2" value="#ec4899"></label>'
      + '<label>Angle <input type="range" id="angle" min="0" max="360" value="135"> <span id="angle-label">135°</span></label>'
      + "</div>"
      + '<label class="section-sub" style="margin-bottom:8px; display:block;"><strong>CSS</strong></label>'
      + '<textarea id="css" readonly class="mono" style="min-height:80px;" aria-label="Generated CSS"></textarea>'
      + '<div class="controls" style="margin-top:12px;"><button id="copy" class="btn primary">📋 Copy CSS</button></div>'
      + "</div>";

    var preview = box.querySelector("#preview");
    var cssEl = box.querySelector("#css");
    var angleEl = box.querySelector("#angle");

    function update() {
      var t = box.querySelector("#type").value;
      var c1 = box.querySelector("#c1").value;
      var c2 = box.querySelector("#c2").value;
      var a = Number(angleEl.value);
      box.querySelector("#angle-label").textContent = a + "°";
      var css = t === "linear"
        ? "background: linear-gradient(" + a + "deg, " + c1 + ", " + c2 + ");"
        : "background: radial-gradient(circle, " + c1 + ", " + c2 + ");";
      // preview needs the raw gradient value, not the full CSS declaration
      preview.style.background = t === "linear"
        ? "linear-gradient(" + a + "deg, " + c1 + ", " + c2 + ")"
        : "radial-gradient(circle, " + c1 + ", " + c2 + ")";
      cssEl.value = css;
    }
    ["#type", "#c1", "#c2", "#angle"].forEach(function (id) {
      box.querySelector(id).addEventListener("input", update);
    });
    box.querySelector("#copy").addEventListener("click", function () {
      if (!cssEl.value) return;
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied!";
        setTimeout(function () { b.textContent = "📋 Copy CSS"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cssEl.value).then(done, function () { cssEl.select(); done(); });
      } else { cssEl.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    update();
  }
});