let data = [];
let marcaSet = new Set();
let modelloSet = new Set();
let allData = [];

fetch("compatibilita_cascos.csv")
  .then((res) => res.text())
  .then((csv) => {
    const [header, ...rows] = csv.trim().split("\n");
    const keys = header.split(",");
    data = rows.map(row => {
      const values = row.split(",");
      return Object.fromEntries(keys.map((k, i) => [k.trim(), values[i].trim()]));
    });

    allData = data;
    data.forEach(row => {
      marcaSet.add(row.Marca);
    });

    const marcaSelect = document.getElementById("marcaSelect");
    const modelloSelect = document.getElementById("modelloSelect");

    marcaSet.forEach(marca => {
      let option = document.createElement("option");
      option.value = marca;
      option.textContent = marca;
      marcaSelect.appendChild(option);
    });

    marcaSelect.addEventListener("change", function () {
      const selectedMarca = this.value;
      modelloSelect.innerHTML = '<option value="">Seleziona modello</option>';
      modelloSet.clear();

      allData
        .filter(d => d.Marca === selectedMarca)
        .forEach(d => modelloSet.add(d.Modello));

      modelloSet.forEach(modello => {
        let option = document.createElement("option");
        option.value = modello;
        option.textContent = modello;
        modelloSelect.appendChild(option);
      });
    });

    modelloSelect.addEventListener("change", function () {
      const marca = marcaSelect.value;
      const modello = this.value;
      const result = allData.find(d => d.Marca === marca && d.Modello === modello);
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
      if (!result) {
        resultsDiv.innerHTML = "<p>Nessun risultato trovato.</p>";
        return;
      }
      let html = `<h3>${result.Marca} ${result.Modello}</h3><ul>`;
      Object.keys(result).forEach(k => {
        if (k !== "Marca" && k !== "Modello") {
          html += `<li>${k}: ${result[k]}</li>`;
        }
      });
      html += "</ul>";
      resultsDiv.innerHTML = html;
    });
  });
