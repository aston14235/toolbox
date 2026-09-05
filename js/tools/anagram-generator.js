ToolBox.define("anagram-generator", {
  render: function (box) {
    var WORDS = ("act art ate care cart cast cat cite city coat code core cost crate create data date deal deep deer desk dice die diet door each ear earth east eat echo edit era fair far farm fast fate fear feat feed felt file fine fire fish fit five flat flow food foot force form fort four free full fun game gate gave gear get gift girl give glad glass goat gold gone good grab grand grass gray great green grew grid grow guard half hand hard harm hat hate have head hear heart heat held help hen her here hero hide high hill hint hire hit hold hole home hope horse hour house huge hunt ice idea inch iron item jar job join joke joy jump just keep kept key kick kid kind king knee knew knife knot know lake land lane large last late laugh lay lead leaf leak lean leap left lend length less let lie life lift light like limb lime line link lip list live load loaf loan lock log long look lose loss lost loud love low luck made mail main make male man many map mark mask match mate may meal mean meat meet melt men mere mile milk mill mind mine mint miss mix mode moon more most move much mud music must nail name near neat neck need nest net new nice night nine node noise none nor north nose note noun now oak oat odd off often oil old once one only open order other our out oven over own pack page paid pain paint pair pan park part pass past path pay pea peak pen pet pick pie pile pin pine pipe pitch place plan plane plant plate play plot plus point pole pool poor port post pot pour pull pure push put quick quiet quit race rain raise range rank rare rate reach read ready real rear red rest rice rich ride right ring rise risk road roar rock rod role roof room root rope rose round row rub rule run rush sad safe said sail sale salt same sand save scale scar score sea seat seed seek seem seen sell send sense set shade shake shall shape share sharp she sheep sheet shelf shell shift shine ship shoe shoot shop shore short shot show shut side sign silk silver since sing sink sir sit six size skill skin sky sleep slide slow small smart smell smile smoke snow so soap soft soil sold sole some son song soon sore sort soul sound soup south space spare speak speed spell spend spin spite spot spread spring square stage stair stand star start state stay steel steep stem step stick still stone stood stop store storm story stove straight strange stream street stretch strike string strong stuck study stuff style such sugar suit summer sun sure sweet swift swing sword took talk tall taste teach team tear tell ten tend tent test than thank that them then there these they thick thin thing think third this those though thought three threw throw thumb tide tie tight till time tin tiny tip tire toe together told tone tongue took tool top total touch tough tour toward town toy trace trade trail train trap tree trial tribe trick trim trip troop true trunk trust truth try tube tune turn twice twin type uncle under unit until upon upper us use used useful usual valley value vast verb very view visit voice vote wage wait wake walk wall want war warm wash waste watch water wave way weak wear weather week weigh weight well west wet wheel when where which while whip white who whole whom whose wide wife wild will win wind wine wing winter wire wise wish with woman wonder wood word wore work world worm worry worse worst worth would wound wrap write wrong wrote yard year yellow yes yet you young your zone".split(" "));
    var sig = function (w) { return w.split("").sort().join(""); };

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="field"><label>Letters / word</label>'
      + '<input type="text" id="input" placeholder="e.g. listen, or any letters like s t i l e n" style="padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--bg); color:var(--text); font-size:1.05rem;"></div>'
      + '<div class="controls"><label><input type="checkbox" id="twoword" checked> Also find 2-word anagrams</label></div>'
      + '<div id="out"></div>'
      + "</div>";

    function multiset(w) {
      var m = {};
      w.split("").forEach(function (c) { m[c] = (m[c] || 0) + 1; });
      return m;
    }
    function contains(big, small) {
      var m = multiset(big);
      for (var c in small) if ((m[c] || 0) < small[c]) return false;
      return true;
    }
    function subtract(big, small) {
      var m = multiset(big);
      for (var c in small) m[c] = (m[c] || 0) - small[c];
      return Object.keys(m).filter(function (c) { return m[c] > 0; }).map(function (c) { return c.repeat(m[c]); }).join("");
    }

    function update() {
      var raw = box.querySelector("#input").value.toLowerCase().replace(/[^a-z]/g, "");
      var out = box.querySelector("#out");
      if (!raw) { out.innerHTML = ""; return; }
      var s = sig(raw);
      var singles = WORDS.filter(function (w) { return w.length > 1 && sig(w) === s && w !== raw; });
      var html = "";
      if (singles.length) {
        html += '<h3 style="font-size:.95rem; margin:6px 0 10px;">Single-word anagrams</h3><div class="rhyme-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">'
          + singles.map(function (w) { return '<span class="rhyme-chip" style="padding:7px 14px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-soft);font-weight:700;">' + w + "</span>"; }).join("") + "</div>";
      }
      if (box.querySelector("#twoword").checked) {
        var pairs = [];
        var seen = {};
        for (var i = 0; i < WORDS.length; i++) {
          var a = WORDS[i];
          if (a.length < 2 || !contains(raw, multiset(a))) continue;
          var rest = subtract(raw, multiset(a));
          if (rest.length < 2) continue;
          var rs = sig(rest);
          for (var j = 0; j < WORDS.length; j++) {
            var c = WORDS[j];
            if (c.length > 1 && sig(c) === rs) {
              var key = [a, c].sort().join("|");
              if (!seen[key]) { seen[key] = 1; pairs.push([a, c]); }
            }
          }
        }
        pairs = pairs.slice(0, 40);
        if (pairs.length) {
          html += '<h3 style="font-size:.95rem; margin:6px 0 10px;">Two-word anagrams</h3><div class="rhyme-list" style="display:flex;flex-wrap:wrap;gap:8px;">'
            + pairs.map(function (p) { return '<span class="rhyme-chip" style="padding:7px 14px;border-radius:999px;border:1px solid var(--border);background:var(--bg);font-weight:600;">' + p[0] + " + " + p[1] + "</span>"; }).join("") + "</div>";
        }
      }
      if (!html) html = '<p class="note-box">No anagrams found for \u201C' + ToolBox.esc(raw) + "\u201D in the built-in dictionary.</p>";
      out.innerHTML = html;
    }

    box.querySelector("#input").addEventListener("input", update);
    box.querySelector("#twoword").addEventListener("change", update);
    box.querySelector("#input").value = "listen";
    update();
  }
});