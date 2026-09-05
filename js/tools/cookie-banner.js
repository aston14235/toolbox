ToolBox.define("cookie-banner", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Site name</label><input type="text" id="site" placeholder="e.g. MySite" value="MySite"></div>'
      + '<div class="field"><label>Accent color</label><input type="color" id="color" value="#0088ff" style="width:100%; height:38px;"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Accept button</label><input type="text" id="accept" value="Accept all"></div>'
      + '<div class="field"><label>Decline button</label><input type="text" id="decline" value="Only essential"></div>'
      + "</div>"
      + '<div class="field"><label>Message</label><textarea id="msg" style="min-height:80px;">We use cookies to make this site work well and to understand how it\'s used. By continuing you agree — or you can decline non-essential cookies.</textarea></div>'
      + '<div class="controls"><button id="gen" class="btn primary">⚙️ Generate snippet</button><button id="copy" class="btn">📋 Copy code</button></div>'
      + '<pre class="code-out" id="out" style="max-height:420px;"></pre>'
      + '<p class="note-box">Builds a self-contained cookie-consent banner: HTML + CSS + a tiny script that remembers the visitor\'s choice in localStorage. Paste it anywhere.</p>'
      + "</div>";

    var out = box.querySelector("#out");

    function escAttr(s) { return ToolBox.esc(s).replace(/"/g, "&quot;"); }
    function generate() {
      var site = box.querySelector("#site").value.trim() || "MySite";
      var accept = box.querySelector("#accept").value.trim() || "Accept all";
      var decline = box.querySelector("#decline").value.trim() || "Only essential";
      var msg = box.querySelector("#msg").value.trim() || "We use cookies to improve your experience.";
      var color = box.querySelector("#color").value;
      var html = '<div id="cookie-banner">'
        + "<p>" + ToolBox.esc(msg) + "</p>"
        + '<button data-c="1">' + ToolBox.esc(accept) + "</button>"
        + '<button data-c="0" class="ghost">' + ToolBox.esc(decline) + "</button>"
        + "</div>";
      var css = "#cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;display:flex;flex-wrap:wrap;align-items:center;gap:12px;max-width:640px;padding:16px 18px;border-radius:14px;background:#0d1520;color:#dbe7f3;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;box-shadow:0 10px 40px rgba(0,0,0,.45);border:1px solid #22334a}"
        + "#cookie-banner p{flex:1;min-width:220px;margin:0}"
        + "#cookie-banner button{background:" + color + ";border:none;color:#fff;font-weight:700;font-size:13px;padding:9px 16px;border-radius:10px;cursor:pointer}"
        + "#cookie-banner button.ghost{background:transparent;border:1px solid #22334a;color:#8ea3b8}"
        + "#cookie-banner button:hover{opacity:.85}";
      var js = "if(!localStorage.getItem('cookie-choice')){var b=document.getElementById('cookie-banner');b.style.display='flex';b.querySelectorAll('[data-c]').forEach(function(btn){btn.onclick=function(){localStorage.setItem('cookie-choice',btn.getAttribute('data-c'));b.remove();}});}";
      var full = "<!-- " + site + " cookie banner -->\n<div id=\"cookie-banner\" style=\"display:none\">\n"
        + "  <p>" + ToolBox.esc(msg) + "</p>\n"
        + "  <button data-c=\"1\" onclick=\"acceptCookies(1)\">" + ToolBox.esc(accept) + "</button>\n"
        + "  <button data-c=\"0\" class=\"ghost\" onclick=\"acceptCookies(0)\">" + ToolBox.esc(decline) + "</button>\n"
        + "</div>\n<style>\n" + css.replace(/\}/g, "}\n") + "\n</style>\n<script>\n"
        + "function acceptCookies(c){localStorage.setItem('cookie-choice',c);document.getElementById('cookie-banner').remove();}\n"
        + "window.addEventListener('DOMContentLoaded',function(){if(!localStorage.getItem('cookie-choice'))document.getElementById('cookie-banner').style.display='flex';});\n"
        + "<\/script>";
      out.textContent = full;
      return full;
    }
    box.querySelector("#gen").addEventListener("click", generate);
    box.querySelector("#copy").addEventListener("click", function () {
      var code = out.textContent;
      if (!code) { generate(); code = out.textContent; }
      function done() {
        var b = box.querySelector("#copy");
        b.textContent = "✅ Copied";
        setTimeout(function () { b.textContent = "📋 Copy code"; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
    generate();
  }
});