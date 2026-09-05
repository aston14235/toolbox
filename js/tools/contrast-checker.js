ToolBox.define("contrast-checker", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Text color <input type="color" id="fg" value="#111827"></label>'
      + '<label>Background <input type="color" id="bg" value="#ffffff"></label>'
      + "</div>"
      + '<div id="sample" style="border:1px solid var(--border); border-radius:14px; padding:28px; text-align:center;">'
      + '<p style="font-size:1.3rem; font-weight:700;">Sample text — the quick brown fox</p>'
      + '<p class="muted">This is secondary text.</p>'
      + "</div>"
      + '<div class="stats" style="margin-top:16px;">'
      + '<div class="stat"><div class="num" id="ratio">—</div><div class="label">Contrast ratio</div></div>'
      + '<div class="stat"><div class="num" id="normal" style="font-size:1.1rem;">—</div><div class="label">Normal text</div></div>'
      + '<div class="stat"><div class="num" id="large" style="font-size:1.1rem;">—</div><div class="label">Large text</div></div>'
      + '<div class="stat"><div class="num" id="ui" style="font-size:1.1rem;">—</div><div class="label">UI components</div></div>'
      + "</div>"
      + '<p class="note-box">WCAG 2.1 guidance: normal text needs ≥ 4.5:1, large text (18px+ / 14px bold) ≥ 3:1, UI components ≥ 3:1.</p>'
      + "</div>";

    function lum(hex) {
      var c = hex.match(/[0-9a-f]{2}/gi).map(function (x) { return parseInt(x, 16) / 255; })
        .map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    }
    function ratio(a, b) {
      var l1 = lum(a), l2 = lum(b);
      var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
      return ((hi + 0.05) / (lo + 0.05)).toFixed(2);
    }
    function badge(r) {
      var ok = Number(r) >= 4.5, largeOk = Number(r) >= 3;
      return '<span class="badge" style="background:' + (ok ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)") + ';color:' + (ok ? "var(--ok)" : "var(--danger)") + ';">' + (ok ? "✅ AA" : "❌ AA") + "</span> "
        + '<span class="badge" style="background:' + (largeOk ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)") + ';color:' + (largeOk ? "var(--ok)" : "var(--danger)") + ';">' + (largeOk ? "✅ AAA" : "❌ AAA") + "</span>";
    }

    function update() {
      var fg = box.querySelector("#fg").value;
      var bg = box.querySelector("#bg").value;
      var sample = box.querySelector("#sample");
      sample.style.color = fg;
      sample.style.background = bg;
      var r = ratio(fg, bg);
      box.querySelector("#ratio").textContent = r + ":1";
      box.querySelector("#normal").innerHTML = badge(r);
      var rl = Number(r) >= 3;
      box.querySelector("#large").innerHTML = '<span class="badge" style="background:' + (rl ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)") + ';color:' + (rl ? "var(--ok)" : "var(--danger)") + ';">' + (rl ? "✅ Pass" : "❌ Fail") + "</span>";
      box.querySelector("#ui").innerHTML = '<span class="badge" style="background:' + (rl ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)") + ';color:' + (rl ? "var(--ok)" : "var(--danger)") + ';">' + (rl ? "✅ Pass" : "❌ Fail") + "</span>";
    }
    box.querySelector("#fg").addEventListener("input", update);
    box.querySelector("#bg").addEventListener("input", update);
    update();
  }
});