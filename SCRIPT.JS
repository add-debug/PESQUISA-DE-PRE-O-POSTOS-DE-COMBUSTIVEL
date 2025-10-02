let estados = [];
const postosPorCidade = {
  "São Miguel do Guamá": [
    {
      nome: "Posto Guamá",
      alcool: 4.59,
      gasolina: 5.89,
      gasolinaAditivada: 6.09,
      diesel: 5.49,
      dieselS10: 5.69,
      endereco: "Av. Magalhães Barata, 100 - Centro",
      data: "28/09/2025 09:00"
    },
    {
      nome: "Posto São Miguel",
      alcool: 4.49,
      gasolina: 5.79,
      gasolinaAditivada: 5.99,
      diesel: 5.39,
      dieselS10: 5.59,
      endereco: "Rua da Paz, 200 - Bairro Novo",
      data: "28/09/2025 09:10"
    }
  ]
};

function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("password").value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaValida = senha.length >= 4;

  if (emailValido && senhaValida) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
    carregarEstados();
  } else {
    alert("Digite um e-mail válido e uma senha com pelo menos 4 caracteres.");
  }
}

function abrirCadastro() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("cadastro-screen").style.display = "block";
}

function voltarLogin() {
  document.getElementById("cadastro-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "block";
}

function cadastrarUsuario() {
  const email = document.getElementById("novoEmail").value.trim();
  const senha = document.getElementById("novaSenha").value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaValida = senha.length >= 4;

  if (emailValido && senhaValida) {
    alert("Usuário cadastrado com sucesso!");
    voltarLogin();
  } else {
    alert("Informe um e-mail válido e senha com pelo menos 4 caracteres.");
  }
}

function esqueciSenha() {
  const email = prompt("Digite seu e-mail para redefinir a senha:");
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Um link de redefinição foi enviado para " + email);
  } else {
    alert("E-mail inválido.");
  }
}

function carregarEstados() {
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())
    .then(data => {
      estados = data.sort((a, b) => a.nome.localeCompare(b.nome));
      const estadoSelect = document.getElementById("estado");
      estadoSelect.innerHTML = '<option value="">Selecione o Estado</option>';
      estados.forEach(estado => {
        const opt = document.createElement("option");
        opt.value = estado.id;
        opt.textContent = estado.sigla;
        estadoSelect.appendChild(opt);
      });
    });
}

function carregarCidades() {
  const estadoId = document.getElementById("estado").value;
  const cidadeSelect = document.getElementById("cidade");
  cidadeSelect.innerHTML = '<option value="">Carregando cidades...</option>';

  fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`)
    .then(res => res.json())
    .then(data => {
      cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>';
      data.forEach(cidade => {
        const opt = document.createElement("option");
        opt.value = cidade.nome;
        opt.textContent = cidade.nome;
        cidadeSelect.appendChild(opt);
      });
    });
}

function carregarPostos() {
  const cidade = document.getElementById("cidade").value;
  const postoSelect = document.getElementById("posto");
  postoSelect.innerHTML = '<option value="">Selecione o Posto</option>';
  if (postosPorCidade[cidade]) {
    postosPorCidade[cidade].forEach(posto => {
      const opt = document.createElement("option");
      opt.value = posto.nome;
      opt.textContent = posto.nome;
      postoSelect.appendChild(opt);
    });
  }
}

function mostrarInfoPosto() {
  const cidade = document.getElementById("cidade").value;
  const nomePosto = document.getElementById("posto").value;
  const infoDiv = document.getElementById("info-posto");
  const posto = postosPorCidade[cidade]?.find(p => p.nome === nomePosto);
  if (posto) {
    infoDiv.innerHTML = `
      <strong>${posto.nome}</strong><br/>
      Endereço: ${posto.endereco || "Não informado"}<br/>
      Álcool: R$${posto.alcool}<br/>
      Gasolina Comum: R$${posto.gasolina}<br/>
      Gasolina Aditivada: R$${posto.gasolinaAditivada}<br/>
      Diesel: R$${posto.diesel}<br/>
      Diesel S-10: R$${posto.dieselS10}<br/>
      Atualizado: ${posto.data}
    `;
  }
}

function editarPreco() {
  const cidade = document.getElementById("cidade").value;
  const nomePosto = document.getElementById("posto").value;
  const posto = postosPorCidade[cidade]?.find(p => p.nome === nomePosto);
  if (posto) {
    document.getElementById("edicao-posto").style.display = "block";
    document.getElementById("editNomePosto").value = posto.nome;
    document.getElementById("editAlcool").value = posto.alcool;
    document.getElementById("editGasolina").value = posto.gasolina;
    document.getElementById("editGasolinaAditivada").value = posto.gasolinaAditivada;
    document.getElementById("editDiesel").value = posto.diesel;
    document.getElementById("editDieselS10").value = posto.dieselS10;

    const partes = posto.endereco?.split(",") || [];
    document.getElementById("editRua").value = partes[0]?.trim() || "";
    document.getElementById("editNumero").value = partes[1]?.split("-")[0]?.trim() || "";
    document.getElementById("editBairro").value = partes[1]?.split("-")[1]?.trim() || "";
  }
}

function salvarEdicaoPosto() {
  const cidade = document.getElementById("cidade").value;
  const nome = document.getElementById("editNomePosto").value;
  const posto = postosPorCidade[cidade]?.find(p => p.nome === nome);
  if (posto) {
    posto.alcool = parseFloat(document.getElementById("editAlcool").value);
    posto.gasolina = parseFloat(document.getElementById("editGasolina").value);
    posto.gasolinaAditivada = parseFloat(document.getElementById("editGasolinaAditivada").value);
    posto.diesel = parseFloat(document.getElementById("editDiesel").value);
    posto.dieselS10 = parseFloat(document.getElementById("editDieselS10").value);

    const rua = document.getElementById("editRua").value;
    const numero = document.getElementById("editNumero").value;
    const bairro = document.getElementById("editBairro").value;
    posto.endereco = `${rua}, ${numero} - ${bairro}`;
    posto.data = new Date().toLocaleString("pt-BR");

    alert("Posto atualizado com sucesso!");
    document.getElementById("edicao-posto").style.display = "none";
    mostrarInfoPosto();
  }
}

function abrirCadastroPosto() {
  document.getElementById("cadastro-posto").style.display = "block";
}

function pegarLocalizacaoAtual() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
      	  if (status === "OK" && results[0]) {
          const addressComponents = results[0].address_components;
          const rua = addressComponents.find(c => c.types.includes("route"))?.long_name || "";
          const numero = addressComponents.find(c => c.types.includes("street_number"))?.long_name || "";
          const bairro = addressComponents.find(c => c.types.includes("sublocality") || c.types.includes("neighborhood"))?.long_name || "";

          document.getElementById("rua").value = rua;
          document.getElementById("numero").value = numero;
          document.getElementById("bairro").value = bairro;
        } else {
          alert("Endereço não encontrado.");
        }
      });
    }, () => {
      alert("Permissão de localização negada.");
    });
  } else {
    alert("Geolocalização não suportada neste navegador.");
  }
}

function salvarNovoPosto() {
  const cidade = document.getElementById("cidadeEndereco").value || document.getElementById("cidade").value;
const estado = document.getElementById("estadoEndereco").value;

  const rua = document.getElementById("rua").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const endereco = `${rua}, ${numero} - ${bairro}`;

  const posto = {
    nome,
    alcool: parseFloat(document.getElementById("novoAlcool").value),
    gasolina: parseFloat(document.getElementById("novoGasolina").value),
    gasolinaAditivada: parseFloat(document.getElementById("novoGasolinaAditivada").value),
    diesel: parseFloat(document.getElementById("novoDiesel").value),
    dieselS10: parseFloat(document.getElementById("novoDieselS10").value),
    endereco,
    data: new Date().toLocaleString("pt-BR")
  };

  if (!postosPorCidade[cidade]) postosPorCidade[cidade] = [];
  postosPorCidade[cidade].push(posto);
  alert("Posto cadastrado com sucesso!");
  document.getElementById("cadastro-posto").style.display = "none";
  carregarPostos();
  mostrarInfoPosto();
  adicionarMarcadorMapa(posto, cidade);
}

function adicionarMarcadorMapa(posto, cidade) {
  const geocoder = new google.maps.Geocoder();
  const address = posto.endereco || `${posto.nome}, ${cidade}, Brasil`;
  geocoder.geocode({ address }, function (results, status) {
    if (status === "OK" && results[0]) {
      const marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: posto.nome
      });

      marker.addListener("click", () => {
        document.getElementById("cidade").value = cidade;
        carregarPostos();
        document.getElementById("posto").value = posto.nome;
        mostrarInfoPosto();
      });
    }
  });
}

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -1.613, lng: -47.478 },
    zoom: 13,
  });

  for (const cidade in postosPorCidade) {
    postosPorCidade[cidade].forEach(posto => {
      adicionarMarcadorMapa(posto, cidade);
    });
  }
function buscarCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length !== 8) {
    alert("CEP inválido. Deve conter 8 dígitos.");
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      document.getElementById("rua").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidadeEndereco").value = data.localidade || "";
      document.getElementById("estadoEndereco").value = data.uf || "";
    })
    .catch(() => alert("Erro ao buscar o CEP."));
}
}
