ToolBox.define("currency-converter", {
  render: function (box) {
    var COMMON = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "BRL", "KRW", "MXN", "SGD", "NZD", "SEK", "NOK", "DKK", "ZAR", "TRY", "AED"];
    var CACHE_KEY = "toolbox-fx-rates";

    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Amount</label><input type="number" id="amount" value="100" min="0" step="any" style="padding:12px 14px;"></div>'
      + '<div class="field"><label>From</label><select id="from"></select></div>'
      + "</div>"
      + '<div class="controls"><button id="swap" class="btn">⇅ Swap</button>'
      + '<span class="muted small" id="rate-note"></span></div>'
      + '<div class="field"><label>To</label><select id="to"></select></div>'
      + '<div class="big-num" id="result" style="margin-top:6px;">—</div>'
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="rate" style="font-size:1rem;">—</div><div class="label">Exchange rate</div></div>'
      + '<div class="stat"><div class="num" id="updated" style="font-size:.85rem;">—</div><div class="label">Rates updated</div></div>'
      + "</div>"
      + '<p class="note-box" id="status">Fetching live rates…</p>'
      + "</div>";

    var rates = null, updatedAt = null;

    function populateSelects() {
      var from = box.querySelector("#from"), to = box.querySelector("#to");
      var all = COMMON.slice();
      if (rates) Object.keys(rates).forEach(function (c) { if (all.indexOf(c) === -1) all.push(c); });
      all.forEach(function (c) {
        var o1 = document.createElement("option"); o1.value = c; o1.textContent = c;
        var o2 = document.createElement("option"); o2.value = c; o2.textContent = c;
        from.appendChild(o1); to.appendChild(o2);
      });
      from.value = "USD"; to.value = "EUR";
    }

    function loadRates() {
      // try cache first
      try {
        var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && cached.rates && cached.ts > Date.now() - 24 * 3600 * 1000) {
          rates = cached.rates;
          updatedAt = new Date(cached.ts);
          onRates();
          return;
        }
      } catch (e) {}
      fetch("https://open.er-api.com/v6/latest/USD")
        .then(function (r) { if (!r.ok) throw new Error("bad response"); return r.json(); })
        .then(function (j) {
          if (!j || !j.rates) throw new Error("no rates");
          rates = j.rates;
          updatedAt = new Date();
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: rates, ts: Date.now() })); } catch (e) {}
          onRates();
        })
        .catch(function () {
          box.querySelector("#status").textContent = "⚠️ Couldn\u2019t fetch live rates (are you online?). Cached rates will be used if available.";
          box.querySelector("#status").style.color = "var(--danger)";
          try {
            var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
            if (cached && cached.rates) { rates = cached.rates; updatedAt = new Date(cached.ts); onRates(); return; }
          } catch (e) {}
          box.querySelector("#result").textContent = "—";
        });
    }

    function onRates() {
      if (!box.querySelector("#from").options.length) populateSelects();
      box.querySelector("#status").textContent = "✅ Live rates loaded (" + Object.keys(rates).length + " currencies).";
      box.querySelector("#status").style.color = "var(--ok)";
      box.querySelector("#updated").textContent = updatedAt ? updatedAt.toLocaleString() : "—";
      convert();
    }

    function convert() {
      if (!rates) return;
      var amt = Number(box.querySelector("#amount").value);
      var from = box.querySelector("#from").value, to = box.querySelector("#to").value;
      var rFrom = from === "USD" ? 1 : (rates[from] || 0);
      var rTo = to === "USD" ? 1 : (rates[to] || 0);
      if (isNaN(amt) || !rFrom || !rTo) { box.querySelector("#result").textContent = "—"; return; }
      box.querySelector("#result").textContent = (amt * rTo / rFrom).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + " " + to;
      box.querySelector("#rate").textContent = "1 " + from + " = " + (rTo / rFrom).toFixed(4) + " " + to;
    }

    box.querySelector("#amount").addEventListener("input", convert);
    box.querySelector("#from").addEventListener("change", convert);
    box.querySelector("#to").addEventListener("change", convert);
    box.querySelector("#swap").addEventListener("click", function () {
      var from = box.querySelector("#from"), to = box.querySelector("#to");
      var tmp = from.value; from.value = to.value; to.value = tmp;
      convert();
    });
    loadRates();
  }
});