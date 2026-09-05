ToolBox.define("baby-name-generator", {
  styles: ".chips { display: flex; gap: 6px; flex-wrap: wrap; } .chip { padding: 6px 13px; border-radius: 999px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: .8rem; font-weight: 600; cursor: pointer; } .chip:hover { border-color: var(--accent); background: var(--accent-soft); } .chip.active { background: linear-gradient(135deg, #0088ff, #38b6ff); border-color: transparent; color: #fff; } .name-card { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; text-align: center; } .name-card .nm { font-size: 1.15rem; font-weight: 800; }",
  render: function (box) {
    var DATA = {
      girls: [
        ["Emma", "Classic"], ["Olivia", "Classic"], ["Charlotte", "Classic"], ["Amelia", "Classic"], ["Eleanor", "Vintage"],
        ["Hazel", "Nature"], ["Ivy", "Nature"], ["Lily", "Nature"], ["Willow", "Nature"], ["Rose", "Nature"],
        ["Nova", "Modern"], ["Aria", "Modern"], ["Mila", "Modern"], ["Luna", "Modern"], ["Zoe", "Modern"],
        ["Sage", "Unique"], ["Juniper", "Unique"], ["Marlowe", "Unique"], ["Wren", "Unique"], ["Ottilie", "Unique"],
        ["Freya", "Strong"], ["Briar", "Strong"], ["Astrid", "Strong"], ["Matilda", "Strong"], ["Vera", "Sweet"],
        ["Mabel", "Sweet"], ["Elsie", "Sweet"], ["Cora", "Sweet"], ["Isla", "Modern"], ["Naomi", "Classic"],
        ["Ruby", "Vintage"], ["Pearl", "Vintage"], ["Esther", "Vintage"], ["Florence", "Vintage"], ["June", "Nature"],
        ["Margot", "Unique"], ["Elowen", "Unique"], ["Lyra", "Unique"], ["Winter", "Nature"], ["Autumn", "Nature"]
      ],
      boys: [
        ["Oliver", "Classic"], ["Henry", "Classic"], ["Theodore", "Classic"], ["Arthur", "Classic"], ["George", "Vintage"],
        ["Walter", "Vintage"], ["Otis", "Vintage"], ["Archie", "Vintage"], ["Forest", "Nature"], ["River", "Nature"],
        ["Rowan", "Nature"], ["Ash", "Nature"], ["Jasper", "Nature"], ["Leo", "Modern"], ["Kai", "Modern"],
        ["Ezra", "Modern"], ["Milo", "Modern"], ["Finn", "Modern"], ["Atticus", "Unique"], ["Caspian", "Unique"],
        ["Sterling", "Unique"], ["Wolfgang", "Unique"], ["Maximus", "Strong"], ["Magnus", "Strong"], ["Rex", "Strong"],
        ["Jude", "Sweet"], ["Felix", "Sweet"], ["Miles", "Sweet"], ["August", "Vintage"], ["Elias", "Classic"],
        ["Silas", "Unique"], ["Rhys", "Unique"], ["Cedar", "Nature"], ["Brooks", "Nature"], ["Everett", "Classic"],
        ["Harvey", "Vintage"], ["Vincent", "Classic"], ["Desmond", "Classic"], ["Rowan", "Nature"], ["Kingsley", "Strong"]
      ]
    };
    var GENDERS = ["girls", "boys"];
    var VIBES = ["Classic", "Modern", "Vintage", "Nature", "Strong", "Sweet", "Unique"];
    var gender = "girls", vibe = null;

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="controls"><span class="muted small">Gender:</span>'
      + '<div class="chips">' + GENDERS.map(function (g) { return '<button class="chip' + (g === "girls" ? " active" : "") + '" data-g="' + g + '">' + (g === "girls" ? "👧 Girls" : "👦 Boys") + "</button>"; }).join("") + "</div></div>"
      + '<div class="controls"><span class="muted small">Vibe:</span>'
      + '<div class="chips">' + VIBES.map(function (v) { return '<button class="chip" data-v="' + v + '">' + v + "</button>"; }).join("") + "</div></div>"
      + '<div class="controls"><button class="btn primary" type="button" id="more">🎲 Give me 5 names</button></div>'
      + '<div class="stats" id="names"></div>'
      + "</div>";

    function pool() {
      var list = DATA[gender];
      if (vibe) list = list.filter(function (n) { return n[1] === vibe; });
      return list;
    }
    function shuffle(a) {
      var arr = a.slice();
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      return arr;
    }
    function generate() {
      var p = pool();
      var wrap = box.querySelector("#names");
      if (!p.length) {
        wrap.innerHTML = '<div class="stat" style="grid-column:1/-1;"><div class="num" style="font-size:1rem;">😕</div><div class="label">No names match — clear the vibe</div></div>';
        return;
      }
      var picks = shuffle(p).slice(0, 5);
      wrap.innerHTML = picks.map(function (n) {
        return '<div class="name-card"><div class="nm">' + n[0] + '</div><div><span class="badge" style="background:var(--accent-soft);color:var(--accent);">' + n[1] + "</span></div></div>";
      }).join("");
    }
    box.querySelectorAll('[data-g]').forEach(function (c) {
      c.addEventListener("click", function () {
        gender = c.dataset.g;
        box.querySelectorAll('[data-g]').forEach(function (x) { x.classList.toggle("active", x === c); });
        generate();
      });
    });
    box.querySelectorAll('[data-v]').forEach(function (c) {
      c.addEventListener("click", function () {
        vibe = vibe === c.dataset.v ? null : c.dataset.v;
        box.querySelectorAll('[data-v]').forEach(function (x) { x.classList.toggle("active", x.dataset.v === vibe); });
        generate();
      });
    });
    box.querySelector("#more").addEventListener("click", generate);
    generate();
  }
});