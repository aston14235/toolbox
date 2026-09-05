ToolBox.define("user-agent-parser", {
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls">'
      + '<button id="mine" class="btn">📱 Use my browser\u2019s UA</button>'
      + "</div>"
      + '<div class="field"><label>User-Agent string</label>'
      + '<textarea id="ua" rows="3" class="mono" spellcheck="false" placeholder="Paste a user-agent string here…"></textarea></div>'
      + '<div class="kv">'
      + '<div class="row"><span>Browser</span><code id="r-browser" style="color:var(--text);font-weight:700;">—</code></div>'
      + '<div class="row"><span>Browser version</span><code id="r-ver" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Engine</span><code id="r-engine" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>OS</span><code id="r-os" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Device</span><code id="r-device" style="color:var(--text);">—</code></div>'
      + '<div class="row"><span>Bot?</span><code id="r-bot" style="color:var(--text);">—</code></div>'
      + "</div>"
      + "</div>";

    function parse(ua) {
      var r = { browser: "Unknown", version: "—", engine: "—", os: "—", device: "Desktop", bot: "No" };
      if (!ua) return r;
      var low = ua.toLowerCase();
      var m;
      // bots
      if (/bot|crawl|spider|slurp|bingpreview|googlebot|facebot|twitterbot/i.test(ua)) r.bot = "Yes";
      // engine
      if (/webkit/i.test(ua)) r.engine = "WebKit";
      if (/gecko\//i.test(ua) && !/like gecko/i.test(ua)) r.engine = "Gecko";
      if (/trident/i.test(ua)) r.engine = "Trident";
      if (/blink/i.test(ua) || (/chrome\//i.test(low) && /safari\//i.test(low) && /gecko/i.test(low) && !/edg|opr/i.test(low))) r.engine = "Blink";
      // browser
      if (m = /Edg\/([\d.]+)/.exec(ua)) { r.browser = "Edge (Chromium)"; r.version = m[1]; }
      else if (m = /OPR\/([\d.]+)/.exec(ua)) { r.browser = "Opera"; r.version = m[1]; }
      else if (m = /SamsungBrowser\/([\d.]+)/.exec(ua)) { r.browser = "Samsung Internet"; r.version = m[1]; }
      else if (m = /Firefox\/([\d.]+)/.exec(ua)) { r.browser = "Firefox"; r.version = m[1]; }
      else if (m = /Chrome\/([\d.]+)/.exec(ua)) { r.browser = "Chrome"; r.version = m[1]; }
      else if (m = /Version\/([\d.]+)/.exec(ua) && /Safari\//.test(ua)) { r.browser = "Safari"; r.version = m[1]; }
      else if (/MSIE/.test(ua) || /Trident/.test(ua)) { r.browser = "Internet Explorer"; r.version = /MSIE ([\d.]+)/.exec(ua) ? /MSIE ([\d.]+)/.exec(ua)[1] : "11 (Trident)"; }
      // os
      if (/windows nt 10/i.test(ua)) r.os = "Windows 10/11";
      else if (/windows nt 6\.3/i.test(ua)) r.os = "Windows 8.1";
      else if (/windows nt 6\.1/i.test(ua)) r.os = "Windows 7";
      else if (m = /mac os x ([\d_]+)/.exec(ua)) r.os = "macOS " + m[1].replace(/_/g, ".");
      else if (/iphone|ipad|ipod/i.test(ua)) r.os = "iOS";
      else if (m = /android ([\d.]+)/.exec(ua)) r.os = "Android " + m[1];
      else if (/linux/i.test(ua)) r.os = "Linux";
      else if (/cros/i.test(ua)) r.os = "Chrome OS";
      // device
      if (/iphone|ipod/i.test(ua)) r.device = "iPhone/iPod";
      else if (/ipad/i.test(ua)) r.device = "iPad";
      else if (/android/i.test(ua) && /mobile/i.test(ua)) r.device = "Android phone";
      else if (/android/i.test(ua)) r.device = "Android tablet";
      else if (/windows phone/i.test(ua)) r.device = "Windows Phone";
      else if (/smarttv/i.test(ua)) r.device = "Smart TV";
      else if (r.bot === "Yes") r.device = "Crawler";
      return r;
    }

    function show() {
      var r = parse(box.querySelector("#ua").value);
      box.querySelector("#r-browser").textContent = r.browser;
      box.querySelector("#r-ver").textContent = r.version;
      box.querySelector("#r-engine").textContent = r.engine;
      box.querySelector("#r-os").textContent = r.os;
      box.querySelector("#r-device").textContent = r.device;
      box.querySelector("#r-bot").textContent = r.bot;
    }

    box.querySelector("#mine").addEventListener("click", function () {
      box.querySelector("#ua").value = navigator.userAgent;
      show();
    });
    box.querySelector("#ua").addEventListener("input", show);
    box.querySelector("#ua").value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
    show();
  }
});