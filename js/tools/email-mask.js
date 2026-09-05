ToolBox.define("email-mask", {
  render: function (box) {
    var WORDS = ["crimson", "azure", "ember", "frost", "glimmer", "hollow", "iron", "juniper", "kite", "lunar", "moss", "nebula", "onyx", "pebble", "quartz", "raven", "sable", "thorn", "umber", "velvet", "willow", "yarrow", "zephyr", "acorn", "bramble", "cedar", "dune", "echo", "falcon", "grove"];
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Prefix</label><input type="text" id="prefix" placeholder="leave blank for a random word"></div>'
      + '<div class="field"><label>Alias service</label><select id="domain">'
      + '<option value="mailto.plus">mailto.plus</option>'
      + '<option value="duck.com">duck.com</option>'
      + '<option value="simplelogin.co">simplelogin.co</option>'
      + '<option value="33mail.com">33mail.com</option>'
      + '<option value="anonaddy.me">anonaddy.me</option>'
      + "</select></div>"
      + "</div>"
      + '<div class="controls"><button id="gen" class="btn primary">🎭 Generate</button>'
      + '<button id="copy" class="btn">📋 Copy</button></div>'
      + '<textarea id="out" readonly class="mono" style="min-height:60px;" aria-label="Generated email alias"></textarea>'
      + '<p class="note-box">Alias services forward mail to your real inbox while keeping your address private. You\'ll need a free account with the service you choose — this tool just creates the address format.</p>'
      + "</div>";

    function gen() {
      var prefix = box.querySelector("#prefix").value.trim() || WORDS[Math.floor(Math.random() * WORDS.length)] + Math.floor(Math.random() * 90 + 10);
      var domain = box.querySelector("#domain").value;
      box.querySelector("#out").value = prefix + "@" + domain;
    }
    box.querySelector("#gen").addEventListener("click", gen);
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