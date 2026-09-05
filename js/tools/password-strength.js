ToolBox.define("password-strength", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Enter a password</label>'
      + '<input type="text" id="pw" placeholder="Type a password to test…" style="padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1.05rem;"></div>'
      + '<div class="strength-bar"><div id="bar"></div></div>'
      + '<div class="controls" style="margin-top:10px;"><span id="label" class="badge" style="background:var(--accent-soft); color:var(--accent);">—</span>'
      + '<span id="entropy" class="muted small"></span></div>'
      + '<div id="checks" class="kv" style="margin-top:14px;"></div>'
      + '<p class="note-box">Estimates are rough. Real strength depends on how your password is stored and whether it appears in breach lists.</p>'
      + "</div>";

    function score(pw) {
      var s = 0;
      if (pw.length >= 8) s++;
      if (pw.length >= 12) s++;
      if (pw.length >= 16) s++;
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
      if (/\d/.test(pw)) s++;
      if (/[^a-zA-Z0-9]/.test(pw)) s++;
      return Math.min(5, s);
    }
    function bits(pw) {
      var sets = 0;
      if (/[a-z]/.test(pw)) sets += 26;
      if (/[A-Z]/.test(pw)) sets += 26;
      if (/\d/.test(pw)) sets += 10;
      if (/[^a-zA-Z0-9]/.test(pw)) sets += 33;
      return sets ? pw.length * Math.log2(sets) : 0;
    }
    function update() {
      var pw = box.querySelector("#pw").value;
      var s = score(pw);
      var bar = box.querySelector("#bar");
      var label = box.querySelector("#label");
      var colors = ["var(--danger)", "var(--danger)", "#f97316", "#eab308", "var(--ok)", "var(--ok)"];
      var names = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
      bar.style.width = (s / 5 * 100) + "%";
      bar.style.background = s ? colors[s] : "transparent";
      label.textContent = pw ? names[s] : "—";
      label.style.color = s ? colors[s] : "var(--accent)";
      label.style.background = s ? colors[s] + "22" : "var(--accent-soft)";

      var b = Math.round(bits(pw));
      box.querySelector("#entropy").textContent = pw ? "~" + b.toLocaleString() + " bits entropy" : "";
      var checks = [
        { ok: pw.length >= 8, text: "At least 8 characters" },
        { ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw), text: "Uppercase and lowercase letters" },
        { ok: /\d/.test(pw), text: "Contains a number" },
        { ok: /[^a-zA-Z0-9]/.test(pw), text: "Contains a symbol" },
        { ok: !/(.)\1{2,}/.test(pw), text: "No repeated characters (e.g. aaa)" },
        { ok: !/^(123|password|qwerty|letmein|admin|welcome)/i.test(pw), text: "Not a common password" }
      ];
      var html = "";
      checks.forEach(function (c) {
        html += '<div class="row"><span>' + (c.ok ? "✅" : "❌") + " " + ToolBox.esc(c.text) + "</span></div>";
      });
      box.querySelector("#checks").innerHTML = html;
    }
    box.querySelector("#pw").addEventListener("input", update);
    update();
  }
});