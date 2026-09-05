ToolBox.define("text-encryptor", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<label class="field"><span class="flabel">Passphrase</span><input type="password" id="pass" placeholder="A strong passphrase — don\'t forget it!" autocomplete="off"></label>'
      + '<label class="field"><span class="flabel">Input</span><textarea id="input" placeholder="Text to encrypt, or ciphertext to decrypt…" aria-label="Input text"></textarea></label>'
      + '<div class="controls">'
      + '<button id="enc" class="btn primary">🔒 Encrypt</button>'
      + '<button id="dec" class="btn">🔓 Decrypt</button>'
      + '<button id="copy" class="btn ghost" disabled>📋 Copy result</button>'
      + "</div>"
      + '<label class="field"><span class="flabel">Output</span><textarea id="output" readonly placeholder="Result appears here…" aria-label="Output text"></textarea></label>'
      + '<p id="msg" class="note-box">🔐 AES-256-GCM with a key derived from your passphrase (PBKDF2, 100k iterations). Everything happens locally — the ciphertext embeds its salt and IV. Works on https / localhost.</p>'
      + "</div>";

    var encBtn = box.querySelector("#enc");
    var decBtn = box.querySelector("#dec");
    var copyBtn = box.querySelector("#copy");
    var outputEl = box.querySelector("#output");
    var msgEl = box.querySelector("#msg");

    function setMsg(text, ok) {
      msgEl.textContent = text;
      msgEl.style.color = ok ? "var(--ok)" : "var(--danger)";
    }
    function b64(bytes) {
      var bin = "";
      var CH = 0x8000;
      for (var i = 0; i < bytes.length; i += CH) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
      }
      return btoa(bin);
    }
    function unb64(str) {
      var bin = atob(str);
      var out = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }
    function deriveKey(pass, salt) {
      var enc = new TextEncoder();
      return crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]).then(function (key) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
          key,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );
      });
    }
    function busy(on) {
      encBtn.disabled = on;
      decBtn.disabled = on;
    }
    function run(encrypt) {
      var pass = box.querySelector("#pass").value;
      var text = box.querySelector("#input").value;
      if (!pass) { setMsg("⚠️ Enter a passphrase first.", false); return; }
      if (!text) { setMsg("⚠️ Enter some input first.", false); return; }
      if (!window.crypto || !crypto.subtle) {
        setMsg("⚠️ Web Crypto needs a secure context (https or localhost) to run.", false);
        return;
      }
      busy(true);
      var enc = new TextEncoder();
      if (encrypt) {
        var salt = crypto.getRandomValues(new Uint8Array(16));
        var iv = crypto.getRandomValues(new Uint8Array(12));
        deriveKey(pass, salt).then(function (key) {
          return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, enc.encode(text));
        }).then(function (buf) {
          var data = new Uint8Array(buf);
          var all = new Uint8Array(1 + salt.length + iv.length + data.length);
          all[0] = 1;
          all.set(salt, 1);
          all.set(iv, 17);
          all.set(data, 29);
          outputEl.value = b64(all);
          setMsg("🔒 Encrypted " + text.length + " characters → " + outputEl.value.length + " characters of ciphertext.", true);
          copyBtn.disabled = false;
          busy(false);
        }).catch(function () { setMsg("⚠️ Encryption failed.", false); busy(false); });
      } else {
        try {
          var all = unb64(text.trim());
        } catch (e) { setMsg("⚠️ That doesn\'t look like valid ciphertext from this tool.", false); busy(false); return; }
        if (all[0] !== 1 || all.length < 30) {
          setMsg("⚠️ Unrecognized ciphertext format.", false);
          busy(false);
          return;
        }
        var salt = all.subarray(1, 17);
        var iv = all.subarray(17, 29);
        var data = all.subarray(29);
        deriveKey(pass, salt).then(function (key) {
          return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
        }).then(function (buf) {
          outputEl.value = new TextDecoder().decode(buf);
          setMsg("🔓 Decrypted successfully — was the passphrase right?", true);
          copyBtn.disabled = false;
          busy(false);
        }).catch(function () {
          setMsg("❌ Decryption failed. Wrong passphrase or corrupted ciphertext.", false);
          busy(false);
        });
      }
    }
    encBtn.addEventListener("click", function () { run(true); });
    decBtn.addEventListener("click", function () { run(false); });
    copyBtn.addEventListener("click", function () {
      if (!outputEl.value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputEl.value).then(function () {
          copyBtn.textContent = "✅ Copied";
          setTimeout(function () { copyBtn.textContent = "📋 Copy result"; }, 1500);
        });
      } else {
        outputEl.select();
        try { document.execCommand("copy"); } catch (e) {}
      }
    });
  }
});