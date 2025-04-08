
let data = [];

function populateMarcaSelect() {
  const marcaSelect = document.getElementById("marcaSelect");
  const modelloSelect = document.getElementById("modelloSelect");
  let marcaSet = new Set();

  data.forEach(row => marcaSet.add(row.Marca));

  marcaSelect.innerHTML = '<option value="">Seleziona marca</option>';
  marcaSet.forEach(marca => {
    let option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    marcaSelect.appendChild(option);
  });

  marcaSelect.addEventListener("change", () => {
    const selectedMarca = marcaSelect.value;
    modelloSelect.innerHTML = '<option value="">Seleziona modello</option>';
    let modelloSet = new Set();

    data.filter(d => d.Marca === selectedMarca).forEach(d => modelloSet.add(d.Modello));
    modelloSet.forEach(modello => {
      let option = document.createElement("option");
      option.value = modello;
      option.textContent = modello;
      modelloSelect.appendChild(option);
    });
  });

  modelloSelect.addEventListener("change", () => {
    const marca = marcaSelect.value;
    const modello = modelloSelect.value;
    const result = data.find(d => d.Marca === marca && d.Modello === modello);
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
}

document.getElementById("csvUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const [headerLine, ...lines] = text.trim().split('\n');
    const headers = headerLine.split(",");
    data = lines.map(line => {
      const values = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim() ?? ""]));
    });
    populateMarcaSelect();
  };
  reader.readAsText(file);
});
