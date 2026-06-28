const API_URL = 'https://api.github.com/search/repositories';
const CHAVE_LOCALSTORAGE = 'favoritos_repositorios';

//tamanho minimo de pesquisa
const TAMANHO_MINIMO = 3;

let favoritos = [];

// Pega os elementos do HTML que vamos usar
const formulario = document.getElementById('search-form');
const campoBusca = document.getElementById('search-input');
const campoQuantidade = document.getElementById('search-limit');
const mensagemErro = document.getElementById('search-error');
const mensagemStatus = document.getElementById('search-status');
const areaResultados = document.getElementById('results-grid');
const areaFavoritos = document.getElementById('favorites-grid');
const textoSemFavoritos = document.getElementById('favorites-empty');
const contadorFavoritos = document.getElementById('favorites-count');

// Quando a página carrega: lê os favoritos salvos e mostra na tela
window.addEventListener('DOMContentLoaded', function () {
  favoritos = carregarFavoritosDoLocalStorage();
  mostrarFavoritos();
});

// Faz o menu "Resources" e o botão "View live demo" rolarem até a seção
document.querySelectorAll('[data-target]').forEach(function (elemento) {
  elemento.addEventListener('click', function () {
    const secao = document.getElementById(elemento.dataset.target);
    if (secao) secao.scrollIntoView({ behavior: 'smooth' });
  });
});


// Quando o formulário é enviado (clique no botão "Buscar")
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault(); // impede o recarregamento da página (SPA)

  const termo = campoBusca.value.trim();
  const quantidade = campoQuantidade.value;

  // Validação do campo: não pode ser vazio nem ter menos de 3 caracteres
  if (termo.length === 0) {
    mensagemErro.textContent = 'Digite um termo de busca antes de continuar.';
    return;
  }
  if (termo.length < TAMANHO_MINIMO) {
    mensagemErro.textContent = 'Digite pelo menos ' + TAMANHO_MINIMO + ' caracteres.';
    return;
  }

  mensagemErro.textContent = ''; // limpa erro anterior
  buscarRepositorios(termo, quantidade);
});

// Faz a requisição AJAX para a API JSON, enviando os parâmetros de busca
async function buscarRepositorios(termo, quantidade) {
  mensagemStatus.textContent = 'Buscando...';
  areaResultados.innerHTML = '';

  // Parâmetros enviados na URL para a API: termo buscado (q) e quantidade (per_page)
  const url = API_URL + '?q=' + encodeURIComponent(termo) + '&per_page=' + quantidade;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagemStatus.textContent = 'Não foi possível buscar agora. Tente novamente em 1 minuto.';
      return;
    }

    const repositorios = dados.items;

    if (repositorios.length === 0) {
      mensagemStatus.textContent = 'Nenhum repositório encontrado para "' + termo + '".';
      return;
    }

    mensagemStatus.textContent = repositorios.length + ' resultado(s) encontrado(s).';
    mostrarResultados(repositorios);

  } catch (erro) {
    console.error(erro);
    mensagemStatus.textContent = 'Erro ao buscar dados. Verifique sua conexão.';
  }
}

// Mostra os resultados da busca na tela, criando um card para cada item
function mostrarResultados(repositorios) {
  areaResultados.innerHTML = '';

  repositorios.forEach(function (repo) {
    const card = criarCardRepositorio(repo);
    areaResultados.appendChild(card);
  });
}

//FAVORITOS (salvar + listar)

function criarCardRepositorio(repo) {
  const card = document.createElement('article');
  card.className = 'repo-card';

  const nome = document.createElement('a');
  nome.className = 'repo-name';
  nome.href = repo.html_url;
  nome.target = '_blank';
  nome.textContent = repo.full_name;

  const descricao = document.createElement('p');
  descricao.className = 'repo-description';
  descricao.textContent = repo.description || 'Sem descrição.';

  const estatisticas = document.createElement('div');
  estatisticas.className = 'repo-stats';
  estatisticas.innerHTML =
    '<span class="repo-stat">⭐ ' + repo.stargazers_count + '</span>' +
    '<span class="repo-stat">🍴 ' + repo.forks_count + '</span>' +
    '<span class="repo-stat repo-language">' + (repo.language || '—') + '</span>';

  const botaoFavoritar = document.createElement('button');
  botaoFavoritar.type = 'button';

  // Verifica se esse repositório já está nos favoritos para mostrar o estado certo
  const jaFavoritado = favoritos.some(function (fav) { return fav.id === repo.id; });
  atualizarBotaoFavorito(botaoFavoritar, jaFavoritado);

  // Ao clicar, adiciona ou remove dos favoritos
  botaoFavoritar.addEventListener('click', function () {
    const estaFavoritado = favoritos.some(function (fav) { return fav.id === repo.id; });

    if (estaFavoritado) {
      removerFavorito(repo.id);
      atualizarBotaoFavorito(botaoFavoritar, false);
    } else {
      adicionarFavorito(repo);
      atualizarBotaoFavorito(botaoFavoritar, true);
    }

    mostrarFavoritos();
  });

  card.appendChild(nome);
  card.appendChild(descricao);
  card.appendChild(estatisticas);
  card.appendChild(botaoFavoritar);

  return card;
}

// Deixa o botão com o texto/estilo certo dependendo se já é favorito ou não
function atualizarBotaoFavorito(botao, favoritado) {
  botao.className = favoritado ? 'favorite-btn is-favorite' : 'favorite-btn';
  botao.textContent = favoritado ? '★ Favoritado' : '☆ Favoritar';
}

// Adiciona um repositório no array de favoritos e salva no localStorage
function adicionarFavorito(repo) {
  favoritos.push({
    id: repo.id,
    nome: repo.full_name,
    descricao: repo.description || 'Sem descrição.',
    estrelas: repo.stargazers_count,
    forks: repo.forks_count,
    linguagem: repo.language || '—',
    url: repo.html_url
  });
  salvarFavoritosNoLocalStorage();
}

// Remove um repositório do array de favoritos (pelo id) e salva no localStorage
function removerFavorito(id) {
  favoritos = favoritos.filter(function (fav) { return fav.id !== id; });
  salvarFavoritosNoLocalStorage();
}

// Salva o array de favoritos inteiro no localStorage (precisa converter para texto/JSON)
function salvarFavoritosNoLocalStorage() {
  localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(favoritos));
}

// Lê os favoritos guardados no localStorage (se não existir nada, começa vazio)
function carregarFavoritosDoLocalStorage() {
  const dadosSalvos = localStorage.getItem(CHAVE_LOCALSTORAGE);
  return dadosSalvos ? JSON.parse(dadosSalvos) : [];
}

// Mostra a lista de favoritos salvos na tela
function mostrarFavoritos() {
  contadorFavoritos.textContent = favoritos.length;
  areaFavoritos.innerHTML = '';

  if (favoritos.length === 0) {
    textoSemFavoritos.style.display = 'block';
    return;
  }
  textoSemFavoritos.style.display = 'none';

  favoritos.forEach(function (fav) {
    const card = document.createElement('article');
    card.className = 'repo-card';

    const nome = document.createElement('a');
    nome.className = 'repo-name';
    nome.href = fav.url;
    nome.target = '_blank';
    nome.textContent = fav.nome;

    const descricao = document.createElement('p');
    descricao.className = 'repo-description';
    descricao.textContent = fav.descricao;

    const estatisticas = document.createElement('div');
    estatisticas.className = 'repo-stats';
    estatisticas.innerHTML =
      '<span class="repo-stat">⭐ ' + fav.estrelas + '</span>' +
      '<span class="repo-stat">🍴 ' + fav.forks + '</span>' +
      '<span class="repo-stat repo-language">' + fav.linguagem + '</span>';

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.className = 'favorite-btn is-favorite remove-favorite-btn';
    botaoRemover.textContent = '✕ Remover dos favoritos';
    botaoRemover.addEventListener('click', function () {
      removerFavorito(fav.id);
      mostrarFavoritos();
    });

    card.appendChild(nome);
    card.appendChild(descricao);
    card.appendChild(estatisticas);
    card.appendChild(botaoRemover);

    areaFavoritos.appendChild(card);
  });
}