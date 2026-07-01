<h1 align="center">Plausible Analytics (Clone Acadêmico)&nbsp; 
  <img src="imgs/logocompleto.png" alt="Logo do Projeto" width="100">
  
</h1>



## 📌 Sobre o Projeto
Este repositório contém o desenvolvimento de um site inspirado na plataforma Plausible Analytics, criado exclusivamente para fins acadêmicos.

O objetivo é recriar a interface visual da plataforma, focando na estrutura, design e organização dos elementos, sem implementação de funcionalidades interativas.

---

## 🎯 Objetivo
- Praticar fundamentos de desenvolvimento web  
- Trabalhar com estruturação em HTML  
- Aplicar estilização com CSS  
- Desenvolver noções de layout e responsividade  
- Simular uma interface real de sistema  
- (Projeto 2) Consumir uma API JSON aberta via JavaScript no lado cliente

---

## 🛠️ Tecnologias Utilizadas
- HTML5  
- CSS3  
- JavaScript (ES6+)
- [GitHub Repository Search API](https://docs.github.com/en/rest/search/search#search-repositories) — API JSON aberta, sem necessidade de chave
- `localStorage` para persistência dos favoritos no navegador

---

## ⚙️ Funcionalidades (Projeto 2 - JavaScript)
Implementadas em `script.js`, seguindo o conceito de **SPA (Single Page Application)** — tudo funciona em
`index.html`, sem nenhum redirecionamento de página:

1. **Busca de conteúdo**: o formulário envia dois parâmetros para a API (`q` = termo buscado e
   `per_page` = quantidade de resultados) usando `fetch` (AJAX) e mostra na tela nome, descrição,
   ⭐ estrelas, 🍴 forks e linguagem de cada repositório encontrado.
2. **Salvar favoritos**: cada repositório pode ser marcado como favorito; os dados são salvos no
   `localStorage` do navegador.
3. **Lista de favoritos**: seção que lista todos os favoritos salvos, com opção de remover.

A API foi escolhida porque está na lista oficial do `public-apis` (categoria *Development*) e porque
combina com o tema do site: assim como o Plausible mostra métricas de um site, essa seção mostra
métricas reais (estrelas, forks) de qualquer projeto open source que o usuário pesquisar — inclusive,
buscando por "analytics" aparece o próprio repositório do Plausible!

O campo de busca tem validação simples: não permite envio vazio nem com menos de 3 caracteres,
mostrando uma mensagem de erro abaixo do campo. Por ser uma API pública sem login, o GitHub limita a
busca a 10 requisições por minuto — o suficiente para uso normal e para a apresentação.

---

## 👥 Integrantes
Projeto desenvolvido em dupla como atividade escolar.
- João Pedro Magri Martins | Github: Jpmagri-07
- Miguel Perino | Github: MiguelPerino

---

## 🚫 Limitações
- Sem backend ou banco de dados (persistência apenas via `localStorage` no navegador)
- Apenas a busca/favoritos é dinâmica; o restante da landing page permanece estático

---

## 📷 Preview do Projeto

<p align="center">
  <img src="imgs/site-miguel01.png" alt="Preview do Projeto" width="100%">
</p>

---

## 📚 Finalidade
Este projeto tem caráter exclusivamente educacional, não possuindo qualquer vínculo oficial com a plataforma original.
