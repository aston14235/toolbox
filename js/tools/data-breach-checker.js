ToolBox.define("data-breach-checker", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Email address</label>'
      + '<input type="email" id="email" placeholder="you@example.com" style="padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1.05rem;"></div>'
      + '<div class="controls"><button id="check" class="btn primary">🔍 Check for breaches</button></div>'
      + '<div id="result"></div>'
      + '<p class="note-box" id="status">Privacy first: your email is hashed locally and only the first 5 characters of the SHA-1 hash are sent — a technique called k-anonymity. Neither your email nor its full hash ever leaves this device.</p>'
      + "</div>";

    function sha1hex(text) {
      // synchronous SHA-1 (crypto.subtle is async; small input so this is fine)
      function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
      var msg = unescape(encodeURIComponent(text));
      var bytes = [];
      for (var i = 0; i < msg.length; i++) bytes.push(msg.charCodeAt(i));
      bytes.push(0x80);
      while (bytes.length % 64 !== 56) bytes.push(0);
      var bitLen = msg.length * 8;
      for (i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);
      var h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
      var w = new Array(80);
      for (i = 0; i < bytes.length; i += 64) {
        for (var j = 0; j < 16; j++) w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
        for (j = 16; j < 80; j++) w[j] = rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        var a = h0, b = h1, c = h2, d = h3, e = h4;
        for (j = 0; j < 80; j++) {
          var f, k;
          if (j < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
          else if (j < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
          else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
          else { f = b ^ c ^ d; k = 0xca62c1d6; }
          var tmp = (rotl(a, 5) + f + e + k + w[j]) >>> 0;
          e = d; d = c; c = rotl(b, 30); b = a; a = tmp;
        }
        h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
      }
      return [h0, h1, h2, h3, h4].map(function (x) { return ("00000000" + x.toString(16)).slice(-8); }).join("");
    }

    box.querySelector("#check").addEventListener("click", function () {
      var email = box.querySelector("#email").value.trim();
      var res = box.querySelector("#result");
      var status = box.querySelector("#status");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        res.innerHTML = '<p class="note-box" style="color:var(--danger); border-color:rgba(239,68,68,.3);">Please enter a valid email address.</p>';
        return;
      }
      status.textContent = "Checking (k-anonymity query)…";
      status.style.color = "";
      var hash = sha1hex(email).toUpperCase();
      var prefix = hash.slice(0, 5), suffix = hash.slice(5);
      fetch("https://api.pwnedpasswords.com/range/" + prefix)
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
        .then(function (body) {
          var found = 0;
          body.split("\n").forEach(function (line) {
            var parts = line.split(":");
            if (parts[0].trim().toUpperCase() === suffix) found = parseInt(parts[1], 10) || 0;
          });
          if (found > 0) {
            res.innerHTML = '<p class="note-box" style="border-color:rgba(239,68,68,.5); color:var(--danger);"><strong>🚨 Pwned!</strong> This email appears in ' + found.toLocaleString() + (found === 1 ? " known breach." : " known breaches.") + ' Change your password everywhere you used it — especially if you reused it.</p>';
          } else {
            res.innerHTML = '<p class="note-box" style="border-color:rgba(34,197,94,.4); color:var(--ok);"><strong>✅ Not found</strong> in any known breach in the Have I Been Pwned database. Keep using unique passwords anyway!</p>';
          }
          status.textContent = "Checked against the Have I Been Pwned range database.";
          status.style.color = "var(--ok)";
        })
        .catch(function (e) {
          res.innerHTML = "";
          status.textContent = "⚠️ Couldn\u2019t reach the breach database (offline or blocked?). Error: " + (e.message || e);
          status.style.color = "var(--danger)";
        });
    });
    box.querySelector("#email").addEventListener("keydown", function (e) { if (e.key === "Enter") box.querySelector("#check").click(); });
  }
});