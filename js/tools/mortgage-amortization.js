ToolBox.define("mortgage-amortization", {
  styles: ".amo-wrap { max-height: 420px; overflow: auto; border: 1px solid var(--border); border-radius: 12px; margin-top: 14px; } .amo-wrap table { min-width: 560px; } .amo-wrap th { position: sticky; top: 0; background: var(--surface); z-index: 1; }",
  render: function (box) {
    box.innerHTML =
      '<div class="tool-body">'
      + '<div class="split">'
      + '<div class="field"><label>Home price ($)</label><input type="number" id="price" placeholder="e.g. 450000" min="0" step="1000"></div>'
      + '<div class="field"><label>Down payment ($)</label><input type="number" id="down" placeholder="e.g. 90000" min="0" step="1000"></div>'
      + "</div>"
      + '<div class="split">'
      + '<div class="field"><label>Annual interest rate (%)</label><input type="number" id="rate" placeholder="e.g. 6.5" min="0" step="0.01"></div>'
      + '<div class="field"><label>Term (years)</label><input type="number" id="years" placeholder="e.g. 30" min="1" max="40" step="1"></div>'
      + "</div>"
      + '<div class="stats">'
      + '<div class="stat"><div class="num" id="payment">—</div><div class="label">Monthly payment</div></div>'
      + '<div class="stat"><div class="num" id="interest-total">—</div><div class="label">Total interest</div></div>'
      + '<div class="stat"><div class="num" id="loan-total">—</div><div class="label">Loan amount</div></div>'
      + '<div class="stat"><div class="num" id="grand-total">—</div><div class="label">Total with down</div></div>'
      + "</div>"
      + '<div class="amo-wrap"><table class="data" id="table"><thead><tr><th>#</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody></tbody></table></div>'
      + "</div>";

    function fmt(n) { return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }); }

    function update() {
      var price = Number(box.querySelector("#price").value);
      var down = Number(box.querySelector("#down").value) || 0;
      var apr = Number(box.querySelector("#rate").value);
      var yrs = Number(box.querySelector("#years").value);
      var amt = price - down;
      var note = box.querySelector("#note");
      if (isNaN(price) || isNaN(apr) || isNaN(yrs) || amt <= 0 || apr < 0 || yrs <= 0) {
        box.querySelector("#payment").textContent = box.querySelector("#interest-total").textContent =
          box.querySelector("#loan-total").textContent = box.querySelector("#grand-total").textContent = "—";
        box.querySelector("#table tbody").innerHTML = "";
        return;
      }
      var r = apr / 100 / 12;
      var n = Math.round(yrs * 12);
      var pay = r === 0 ? amt / n : amt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

      var bal = amt, interestTotal = 0, rows = "";
      for (var i = 1; i <= n; i++) {
        var ip = bal * r;
        var pp = pay - ip;
        bal = Math.max(0, bal - pp);
        interestTotal += ip;
        rows += "<tr><td>" + i + "</td><td>" + fmt(pay) + "</td><td>" + fmt(pp) + "</td><td>" + fmt(ip) + "</td><td>" + fmt(bal) + "</td></tr>";
      }
      box.querySelector("#payment").textContent = fmt(pay);
      box.querySelector("#interest-total").textContent = fmt(interestTotal);
      box.querySelector("#loan-total").textContent = fmt(amt);
      box.querySelector("#grand-total").textContent = fmt(amt + interestTotal + down);
      box.querySelector("#table tbody").innerHTML = rows;
    }

    box.querySelector("#price").addEventListener("input", update);
    box.querySelector("#down").addEventListener("input", update);
    box.querySelector("#rate").addEventListener("input", update);
    box.querySelector("#years").addEventListener("input", update);
    box.querySelector("#price").value = "450000";
    box.querySelector("#down").value = "90000";
    box.querySelector("#rate").value = "6.5";
    box.querySelector("#years").value = "30";
    update();
  }
});