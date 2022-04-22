let quizzes = [];
let acertos = 0;
let listaQuizzes = [];

function exibirTela2(){
    const tela2 = document.querySelector("body")
    tela2.innerHTML = `
            <div class="tela-2">
                <div class="topo-quiz"><p>BuzzQuiz</p></div>
                <div class="titulo-quiz-topo">
                    <div class="degrade-img"></div>
                    <img class="banner-quiz-unico" src="${quiz.image}" />
                    <p class="titulo-quiz-unico">${quiz.title}</p>
                </div>
                <div class="conteiner-quizzes">
                    ${imprimirTitleQuizz()}
                </div>
               
            </div>
            `
}

function obterUnicoQuiz(elemento) {
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${(elemento.id)}`)
    promise.then(carregarDadosQuizUnico) 
}

function carregarDadosQuizUnico (dados) {
    quiz = dados.data
    exibirTela2()
}
function imprimirTitleQuizz () {
    let texto = "";
    for(let i = 0; i < quiz.questions.length; i++) {
        texto += `
        <div class="conteudo-quiz">
            <div class="titulo-quiz-secundario" style="background-color: ${quiz.questions[i].color}">
                <p>${quiz.questions[i].title}</p>
            </div>
            <div class="quiz-imagens">
        `
        quiz.questions[i].answers.sort(comparador)

        for(let c = 0; c < quiz.questions[i].answers.length; c++) {
            texto += `
            
                <button onclick="selecionarResposta(this), analizarResposta(this)" data-verifica="${quiz.questions[i].answers[c].isCorrectAnswer}">
                    <img src=${quiz.questions[i].answers[c].image} alt="" />
                    <p>${quiz.questions[i].answers[c].text}</p>
                </button>
            `
        }
        texto += `
            </div>
        `
    }
    
    texto += `
        <button class="reiniciar-quiz" onclick="">Reiniciar Quizz</button>
        <button class="voltar-home">Voltar pra home</button>
    </div>
    `
    return texto;
}

function comparador() { 
	return Math.random() - 0.5; 
}

function selecionarResposta(elemento) {
  
    let conteudoQuizz = elemento.parentNode.querySelectorAll("button")

    console.log(conteudoQuizz)
    for(let i = 0; i < conteudoQuizz.length; i++) {
            
        if(conteudoQuizz[i].dataset.verifica === "true") {
            conteudoQuizz[i].querySelector("p").classList.add("resposta-correta")
        }
        else {
            
            conteudoQuizz[i].querySelector("p").classList.add("resposta-errada")
        }
        conteudoQuizz[i].classList.add("opaco")
        conteudoQuizz[i].disabled = true;
    }
    elemento.classList.remove("opaco")
    elemento.querySelector("p").classList.add("resposta-correta")
    setTimeout(()=>{rolar(elemento)}, 2000)
}
function rolar(elemento) {
    elemento.parentNode.lastElementChild.scrollIntoView()
}
function analizarResposta(elemento) {
    if(elemento.dataset.verifica === "true") {
        acertos += 1;
    }
}
function buscarTodosQuizzes(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promessa.then(carregarDados);
}
function carregarDados(dados){
    quizzes = dados.data;
    renderizarQuizzes();
}
function renderizarQuizzes(){
    const conteudo = document.querySelector(".lista-quizzes");
    conteudo.innerHTML ="";
    
    for ( let i=0; i< quizzes.length;i++){
        conteudo.innerHTML += `
        <div class="quizz" id="${quizzes[i].id}" onclick="obterUnicoQuiz(this)"><img src=${quizzes[i].image} alt="${quizzes[i].id}">
            <div class="degrade"></div>
            <div class="titulo-quizz">${quizzes[i].title} </div>
        </div>
        `
    }      
}

buscarTodosQuizzes();
