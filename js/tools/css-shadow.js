ToolBox.define("css-shadow", {
  styles: ".shadow-stage { height: 170px; border-radius: 14px; border: 1px solid var(--border); background: repeating-conic-gradient(#e2e8f0 0 25%, #fff 0 50%) 0 0 / 22px 22px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; } .shadow-box { width: 130px; height: 130px; border-radius: 14px; background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 2.4rem; font-weight: 800; color: var(--accent); transition: box-shadow .05s linear; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="shadow-stage"><div class="shadow-box" id="box">Aa</div></div>'
      + '<div class="split">'
      + '<div class="field"><label>X offset <span id="x-label" class="muted"></span></label><input type="range" id="x" min="-50" max="50" value="4"></div>'
      + '<div class="field"><label>Y offset <span id="y-label" class="muted"></span></label><input type="range" id="y" min="-50" max="50" value="8"></div>'
      + '<div class="field"><label>Blur <span id="blur-label" class="muted"></span></label><input type="range" id="blur" min="0" max="120" value="20"></div>'
      + '<div class="field"><label>Spread <span id="spread-label" class="muted"></span></label><input type="range" id="spread" min="-40" max="60" value="0"></div>'
      + "</div>"
      + '<div class="controls" style="margin-top:6px;">'
      + '<label>Color <input type="color" id="color" value="#111827"></label>'
      + '<label>Opacity <input type="range" id="opacity" min="0" max="100" value="35"> <span id="opacity-label">35%</span></label>'
      + '<label><input type="checkbox" id="inset"> Inset shadow</label>'
      + "</div>"
      + '<label class="section-sub" style="display:block; margin:6px 0 8px;"><strong>CSS</strong></label>'
      + '<textarea id="css" readonly class="mono" style="min-height:80px;" aria-label="Generated CSS"></textarea>'
      + '<div class="controls" style="margin-top:12px;"><button id="copy" class="btn primary">📋 Copy CSS</button></div>'
      + "</div>";

    var boxEl = box.querySelector("#box");
    var cssEl = box.querySelector("#css");

    function update() {
      var x = Number(box.querySelector("#x").value);
      var y = Number(box.querySelector("#y").value);
      var blur = Number(box.querySelector("#blur").value);
      var spread = Number(box.querySelector("#spread").value);
      var color = box.querySelector("#color").value;
      var opacity = Number(box.querySelector("#opacity").value) / 100;
      var inset = box.querySelector("#inset").checked;
      box.querySelector("#x-label").textContent = x + "px";
      box.querySelector("#y-label").textContent = y + "px";
      box.querySelector("#blur-label").textContent = blur + "px";
      box.querySelector("#spread-label").textContent = spread + "px";
      box.querySelector("#opacity-label").textContent = Math.round(opacity * 100) + "%";

      // build rgba color
      var r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
      var rgba = "rgba(" + r + ", " + g + ", " + b + ", " + opacity.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") + ")";
      var shadowValue = (inset ? "inset " : "") + x + "px " + y + "px " + blur + "px " + spread + "px " + rgba;
      boxEl.style.boxShadow = shadowValue;
      cssEl.value = "box-shadow: " + shadowValue + ";";
    }

    ["#x", "#y", "#blur", "#spread", "#opacity", "#color", "#inset"].forEach(function (id) {
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
        navigator.clipboard.writeText(cssEl.value).then(done, done);
      } else { cssEl.select(); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
    update();
  }
});