ToolBox.define("backup-codes", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<label>Codes <input type="number" id="count" min="5" max="40" value="10" style="width:70px; padding:9px 10px;"></label>'
      + '<button id="gen" class="btn primary">🎲 Generate</button>'
      + '<button id="copy" class="btn">📋 Copy all</button>'
      + '<button id="dl" class="btn">⬇️ Download .txt</button>'
      + "</div>"
      + '<div id="codes" class="file-list"></div>'
      + '<p class="note-box">Single-use recovery codes — like the ones 2FA services hand you when you sign up. Store them somewhere safe (password manager, printed, offline) and never share them.</p>'
      + "</div>";

    var ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I, L, O, 0, 1
    var codesEl = box.querySelector("#codes");
    var current = [];

    function makeCode() {
      var out = "";
      for (var i = 0; i < 8; i++) {
        if (i === 4) out += "-";
        out += ALPHA[Math.floor(Math.random() * ALPHA.length)];
      }
      return out;
    }
    function generate() {
      var n = Math.min(40, Math.max(5, +box.querySelector("#count").value || 10));
      current = [];
      var used = {};
      while (current.length < n) {
        var c = makeCode();
        if (!used[c]) { used[c] = true; current.push(c); }
      }
      codesEl.innerHTML = current.map(function (c, i) {
        return '<li style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; letter-spacing:0.06em; font-weight:700;"><span class="fname">' + String(i + 1).padStart(2, "0") + "</span><code style=\"color:var(--accent);\">" + c + "</code></li>";
      }).join("");
    }
    function copyAll() {
      if (!current.length) return;
      var text = "ToolBox backup codes — save these somewhere safe:\n\n" + current.join("\n");
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied";
        setTimeout(function () { b.textContent = "📋 Copy all"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    }
    function download() {
      if (!current.length) return;
      var text = "ToolBox backup codes\nGenerated " + new Date().toLocaleString() + "\n\n" + current.join("\n") + "\n";
      var blob = new Blob([text], { type: "text/plain" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "toolbox-backup-codes.txt";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }
    box.querySelector("#gen").addEventListener("click", generate);
    box.querySelector("#copy").addEventListener("click", copyAll);
    box.querySelector("#dl").addEventListener("click", download);
    box.querySelector("#count").addEventListener("keydown", function (e) {
      if (e.key === "Enter") generate();
    });
    generate();
  }
});