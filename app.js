let data = [];
fetch("compatibilita_cascos.csv")
  .then((res) => res.text())
  .then((csv) => {
    const [header, ...rows] = csv.trim().split("\n");
    const keys = header.split(",");
    data = rows.map(row => {
      const values = row.split(",");
      return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    });
  });

document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (query.length < 2) return;
  const results = data.filter(d =>
    d.Marca.toLowerCase().includes(query) || d.Modello.toLowerCase().includes(query)
  );
  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>Nessun veicolo trovato.</p>";
    return;
  }
  results.forEach(r => {
    let html = `<h3>${r.Marca} ${r.Modello}</h3><ul>`;
    Object.keys(r).forEach(k => {
      if (k !== "Marca" && k !== "Modello") {
        html += `<li>${k}: ${r[k]}</li>`;
      }
    });
    html += "</ul>";
    resultsDiv.innerHTML += html;
  });
});
