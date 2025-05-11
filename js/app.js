const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const registrarBtn = document.getElementById("registrar");
const registrosContainer = document.getElementById("registros");

let registrosPorDia = {};

function formatarValor(valor) {
  return Math.abs(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function atualizarTotais(data, container) {
  const registros = registrosPorDia[data] || [];
  let receita = 0;
  let despesa = 0;

  registros.forEach(reg => {
    if (reg.valor > 0) receita += reg.valor;
    else despesa += Math.abs(reg.valor);
  });

  const resumo = document.createElement("div");
  resumo.classList.add("saldos");
  resumo.innerHTML = `
    <span>Receita: R$ ${formatarValor(receita)}</span>
    <span>Despesas: R$ ${formatarValor(despesa)}</span>
  `;
  container.appendChild(resumo);
}

function criarRegistroHTML(registro, data, index) {
  const div = document.createElement("div");
  div.classList.add("registro", registro.valor > 0 ? "receita" : "despesa");
  div.innerHTML = `
    <div class="descricao">${registro.descricao}</div>
    <div class="data">${registro.dataHora}</div>
    <div class="valor">R$ ${formatarValor(registro.valor)}</div>
    <button onclick="excluirRegistro('${data}', ${index})">Excluir</button>
  `;
  return div;
}

function renderizarRegistros() {
  registrosContainer.innerHTML = "";

  const datasOrdenadas = Object.keys(registrosPorDia).sort((a, b) => {
    const [d1, m1, y1] = a.split("/").map(Number);
    const [d2, m2, y2] = b.split("/").map(Number);
    return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
  });

  datasOrdenadas.forEach(data => {
    const section = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = data;
    section.appendChild(titulo);

    atualizarTotais(data, section);

    registrosPorDia[data].forEach((registro, index) => {
      const registroHTML = criarRegistroHTML(registro, data, index);
      section.appendChild(registroHTML);
    });

    registrosContainer.appendChild(section);
  });
}

function registrar() {
  const descricao = descricaoInput.value.trim();
  const valorTexto = valorInput.value.trim().replace(",", ".");
  const valor = parseFloat(valorTexto);

  if (!descricao || isNaN(valor) || valor === 0) {
    alert("Preencha uma descrição válida e um valor numérico diferente de zero.");
    return;
  }

  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR");
  const dataHora = agora.toLocaleString("pt-BR");

  const novoRegistro = { descricao, valor, dataHora };

  if (!registrosPorDia[data]) {
    registrosPorDia[data] = [];
  }

  registrosPorDia[data].push(novoRegistro);

  descricaoInput.value = "";
  valorInput.value = "";
  renderizarRegistros();
}

function excluirRegistro(data, index) {
  if (registrosPorDia[data]) {
    registrosPorDia[data].splice(index, 1);
    if (registrosPorDia[data].length === 0) {
      delete registrosPorDia[data];
    }
    renderizarRegistros();
  }
}

registrarBtn.addEventListener("click", registrar);

// Registrar ao pressionar Enter
[descricaoInput, valorInput].forEach(input => {
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      registrar();
    }
  });
});

renderizarRegistros();
