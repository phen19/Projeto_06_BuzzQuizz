let quizzes = [];
let quiz = [];
let acertos = 0;
let listaQuizzes = [];
let todosQuizzes = [];
let seusQuizzes = {};
const seusQuizzesSerializado = localStorage.getItem("seusQuizzes")
const seusQuizzesLocal = JSON.parse(seusQuizzesSerializado);
let quizzLocal= []
let contPerguntas = 0;
let contNiveis =0;


function exibirTela2() {
    console.log(quiz)
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
    const promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${(elemento.id)}`)
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
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promessa.then(carregarDados);
}
function carregarDados(dados){
    todosQuizzes = dados.data;
    renderizarQuizzes();
}
function renderizarQuizzes(){
    const conteudo = document.querySelector(".lista-quizzes");
    conteudo.innerHTML ="";
    
    for ( let i=0; i< todosQuizzes.length;i++){
        conteudo.innerHTML += `
        <div class="quizz" id="${todosQuizzes[i].id}" onclick="obterUnicoQuiz(this)"><img src=${todosQuizzes[i].image}>
            <div class="degrade"></div>
            <div class="titulo-quizz">${todosQuizzes[i].title} </div>
        </div>
        `
    }      
}

function criarQuizzInfo(){
    const conteudo = document.querySelector("body")
    conteudo.innerHTML = `
        <div class="topo"> BuzzQuizz</div>
        <div class="conteudo-info-basicas"> <span><strong>Comece pelo começo</strong></span>
            <div class="info-basicas"> 
                <input type="text" class ="titulo" placeholder = "Título do seu quizz">
                <input type="text" class ="url-imagem" placeholder = "URL da imagem do seu quizz">
                <input type="text" class ="qtd-perguntas" placeholder = "Quantidade de perguntas do quizz">
                <input type="text" class ="qtd-niveis" placeholder = "Quantidade de níveis do quizz">
            </div>
            <button class="criar" onclick = "validarInfos()"> Prosseguir pra criar perguntas
        </div>
    `
}

function criarPerguntasQuizz(){
    seusQuizzes.title = document.querySelector(".titulo").value;
    seusQuizzes.image = document.querySelector(".url-imagem").value;
    alert(seusQuizzes)
    contPerguntas = document.querySelector(".qtd-perguntas").value
    contNiveis = document.querySelector(".qtd-niveis").value
    let conteudo = document.querySelector("body")
    conteudo.innerHTML = `
        <div class="topo"> BuzzQuizz</div>
        <div class="conteudo-perguntas-quizz"> <span><strong>Crie suas perguntas</strong></span>
           
        </div>
        `
    conteudo = document.querySelector(".conteudo-perguntas-quizz")
    for (let i = 0; i < contPerguntas;i++){
           conteudo.innerHTML+= `<div class="perguntas"> <span><strong>Pergunta ${i+1} </strong> </span>
                <input type="text" class ="texto-pergunta${i+1}" placeholder = "Texto da pergunta">
                <input type="text" class ="cor-fundo${i+1}" placeholder = "Cor de fundo da pergunta">
                <span><strong>Resposta Correta</strong></span>
                <input type="text" class ="resposta-correta${i+1}" placeholder = "Resposta Correta">
                <input type="text" class ="imagem-resposta-correta${i+1}" placeholder = "URL da Imagem">
                <span><strong>Respostas Incorretas</strong></span>
                <input type="text" class ="resposta-incorreta1${i+1}" placeholder = "Resposta Incorreta 1">
                <input type="text" class ="imagem-resposta-incorreta1${i+1}" placeholder = "URL da Imagem">
                <input type="text" class ="resposta-incorreta2${i+1}" placeholder = "Resposta Incorreta 2">
                <input type="text" class ="imagem-resposta-incorreta2${i+1}" placeholder = "URL da Imagem">
                <input type="text" class ="resposta-incorreta3${i+1}" placeholder = "Resposta Incorreta 3">
                <input type="text" class ="imagem-resposta-incorreta3${i+1}" placeholder = "URL da Imagem">
            </div>
            `
    }    
    conteudo.innerHTML+= `<button class="criar" onclick = "criarNiveisQuizz()"> Prosseguir pra criar níveis`
}

function criarNiveisQuizz(){
    seusQuizzes.questions = [];
    let answers = [];
    for (let i = 0; i< contPerguntas; i++){
        answers = [ {text: document.querySelector(`.resposta-correta${i+1}`).value, image: document.querySelector(`.imagem-resposta-correta${i+1}`).value, isCorrectAnswer: true},
                    {text: document.querySelector(`.resposta-incorreta1${i+1}`).value, image: document.querySelector(`.imagem-resposta-incorreta1${i+1}`).value, isCorrectAnswer: false},
                    {text: document.querySelector(`.resposta-incorreta2${i+1}`).value, image: document.querySelector(`.imagem-resposta-incorreta2${i+1}`).value, isCorrectAnswer: false},
                    {text: document.querySelector(`.resposta-incorreta3${i+1}`).value, image: document.querySelector(`.imagem-resposta-incorreta3${i+1}`).value, isCorrectAnswer: false},
        ]
        seusQuizzes.questions[i] = {
            title: document.querySelector(`.texto-pergunta${i+1}`).value,
            color: document.querySelector(`.cor-fundo${i+1}`).value
        }

        seusQuizzes.questions[i].answers=answers;
    }

  let conteudo = document.querySelector("body")
  conteudo.innerHTML = `<div class="topo"> BuzzQuizz</div>
                        <div class="conteudo-niveis-quizz"> <span><strong>Agora decida os níveis</strong></span>
                        </div
  `
    conteudo = document.querySelector(".conteudo-niveis-quizz")
  for(let i=0; i<contNiveis; i++){
    conteudo.innerHTML += `
            <div class="niveis"> <span><strong>Nível ${i+1} </strong> </span>
                <input type="text" class ="titulo-nivel${i+1}" placeholder = "Título do nível">
                <input type="text" class ="acerto-mínimo${i+1}" placeholder = "% de acerto mínima">
                <input type="text" class ="imagem-nivel${i+1}" placeholder = "URL da imagem do nível">
                <input type="text" class ="descricao-nivel${i+1}" placeholder = "Descrição do nível">
            </div>
            
    `
  }
  conteudo.innerHTML+= `<button class="criar" onclick = "finalizarQuizz()"> Finalizar Quizz`
}

function finalizarQuizz(){
    seusQuizzes.levels = [];
    let niveis =[];
    for (let i=0; i<contNiveis; i++){
        niveis = {title: document.querySelector(`.titulo-nivel${i+1}`).value, 
                    image: document.querySelector(`.imagem-nivel${i+1}`).value, 
                    text: document.querySelector(`.descricao-nivel${i+1}`).value, 
                    minValue:document.querySelector(`.acerto-mínimo${i+1}`).value }
        
        seusQuizzes.levels[i]=niveis;
    }

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes",seusQuizzes);
    requisicao.then(criarQuizz)
    requisicao.catch()
}

function criarQuizz(resposta){
    let local = resposta.data
    alert(local.id)
    if(seusQuizzesLocal !== null){
        quizzLocal = seusQuizzesLocal;
        quizzLocal.push(local)
        const dadosSerializados = JSON.stringify(quizzLocal)
        localStorage.setItem("seusQuizzes",dadosSerializados)
    }else{
        quizzLocal.push(local)
        const dadosSerializados = JSON.stringify(quizzLocal)
        localStorage.setItem("seusQuizzes", dadosSerializados)
    }
    alert(quizzLocal)
}

function renderizarHome(){

    const conteudo = document.querySelector(".seus-quizzes-nenhum")
    let conteudo2= document.querySelector(".container-seus-quizzes")
    if (seusQuizzesLocal === null){
        conteudo.innerHTML = `
                            <div class="container-seus-quizzes-nenhum ">
                                <span>Você não criou nenhum quizz ainda :(</span>
                                <div class="botao-criar-grande" onclick="criarQuizzInfo()">Criar Quizz</div>
                            </div>
        `
    }else{
        conteudo2.classList.remove("desativado")
        let conteudo3=document.querySelector(".seus-quizzes")
        for ( let i=0; i< seusQuizzesLocal.length;i++){
            conteudo3.innerHTML += `
                                    <div class="quizz" onclick="exibirTela2()"><img src="${seusQuizzesLocal[i].image}" alt="${seusQuizzesLocal[i].title}">
                                        <div class="degrade"></div>
                                        <div class="titulo-quizz"> ${seusQuizzesLocal[i].title} </div>
                                    </div>
            
            `
        }
    }
}

function validarInfos(){
    let titulo = document.querySelector(".titulo").value
    let qtdperguntas = document.querySelector(".qtd-perguntas").value
    let qtdniveis = document.querySelector(".qtd-niveis").value
    if(titulo.length < 20){
        alert("Titulo deve conter entre 20 e 65 caracteres")
        return false;
    }if (titulo.length > 65){
        alert("Titulo deve conter entre 20 e 65 caracteres")
        return false;
    }if(qtdperguntas < 3){
        alert("Quantidade mínima de perguntas é 3")
        return false;
    }if(qtdniveis < 2){
        alert("Quantidade mínima de níveis é 2")
        return false;
    }else{
        
    }
    criarPerguntasQuizz()
}

renderizarHome();
buscarTodosQuizzes();