let quiz = [];
let acertos = 0;
let perguntas = 0;
let listaQuizzes = [];
let todosQuizzes = [];
let seusQuizzes = {};
let seusQuizzesSerializado = localStorage.getItem("seusQuizzes")
let seusQuizzesLocal = JSON.parse(seusQuizzesSerializado);
let quizzLocal= []
let contPerguntas = 0;
let contNiveis = 0;
let todosQuizzesAtt = [];

function carregarTelaLoading() {
    const telaLoading = document.querySelector("body");
    telaLoading.innerHTML = `
        <div class="loading">
            <img class="barra-loading" src="./images/loading.gif" alt="Carregando" />
            <p>Carregando</p>
        </div>`;
}

function exibirTela2() {

    const tela2 = document.querySelector("body")
    tela2.innerHTML = `
        <div class="tela-2">
            <div class="topo-quiz"><p>BuzzQuizz</p></div>
            <div class="titulo-quiz-topo">
                <div class="degrade-img"></div>
                <img class="banner-quiz-unico" src="${quiz.image}" alt="Banner do Quiz" />
                <p class="titulo-quiz-unico">${quiz.title}</p>
            </div>
            <div class="conteiner-quizzes">
                ${imprimirQuizz()}
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="scripts.js"></script>
        `;
}

function obterUnicoQuiz(elemento) {
    const promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${(elemento.id)}`);
    promise.then(carregarDadosQuizUnico);
    carregarTelaLoading();
}

function carregarDadosQuizUnico (dados) {
    quiz = dados.data;
    exibirTela2();
}

function imprimirQuizz () {
    let texto = "";
    for(let i = 0; i < quiz.questions.length; i++) {
        texto += `
        <div class="conteudo-quiz">
            <div class="titulo-quiz-secundario" style="background-color: ${quiz.questions[i].color}">
                <p>${quiz.questions[i].title}</p>
            </div>
            <div class="quiz-imagens">
        `;
        quiz.questions[i].answers.sort(comparador);

        for(let c = 0; c < quiz.questions[i].answers.length; c++) {
            texto += `
                <button onclick="selecionarResposta(this), analizarResposta(this)" data-verifica="${quiz.questions[i].answers[c].isCorrectAnswer}">
                    <img src=${quiz.questions[i].answers[c].image} alt="Imagem do Quiz" />
                    <p>${quiz.questions[i].answers[c].text}</p>
                </button>
            `;
        }
        texto += `
            </div>
        </div>      
        `;
    }
    texto +=`
        <div class="conteudo-final desativado"></div>
    `;
    return texto;
}

function comparador() { 
	return Math.random() - 0.5; 
}

function selecionarResposta(elemento) {
  
    let conteudoQuizz = elemento.parentNode.querySelectorAll("button");

    for(let i = 0; i < conteudoQuizz.length; i++) {           
        if(conteudoQuizz[i].dataset.verifica === "true") {
            conteudoQuizz[i].querySelector("p").classList.add("resposta-correta");
        }
        else {  
            conteudoQuizz[i].querySelector("p").classList.add("resposta-errada");
        }
        conteudoQuizz[i].classList.add("opaco");
        conteudoQuizz[i].disabled = true;
    }

    elemento.classList.remove("opaco");
    elemento.querySelector("p").classList.add("resposta-correta");
    perguntas += 1;

    setTimeout(()=>{rolar(elemento)}, 2000); 
}

function rolar(elemento) {
    elemento.parentNode.lastElementChild.scrollIntoView();
    if(perguntas === quiz.questions.length) {
        const rolarFinal = document.querySelector(".conteudo-final");
        rolarFinal.scrollIntoView();
    }
}

function analizarResposta(elemento) {

    if(elemento.dataset.verifica === "true") {
        acertos += 1;
    }

    if(perguntas === quiz.questions.length) {
        const botoes = document.querySelector(".tela-2");
        const final = document.querySelector(".conteudo-final");
        final.classList.remove("desativado");
        let comparacaoResposta = parseInt((Math.round((acertos / perguntas) * 100).toFixed(2)));
        for(let i = 0; i < quiz.levels.length; i ++) {
            if(comparacaoResposta >= quiz.levels[i].minValue) {
                final.innerHTML = `
                    <div class="titulo-quiz-secundario quiz-resultado" style="background-color:${quiz.levels[i].color}">
                        <p>${comparacaoResposta}% ${quiz.levels[i].title}</p>
                    </div>
                    <div class="quiz-imagens parte-final">
                        <div>
                            <img src=${quiz.levels[i].image} alt="" />
                        </div>
                        <p>${quiz.levels[i].text}</p>
                    </div>   
                `;
            }
        }
        botoes.innerHTML += `
            <button class="reiniciar-quiz" onclick="reiniciarQuizz()">Reiniciar Quizz</button>
            <button class="voltar-home" onclick="voltarInicio()">Voltar pra home</button>   
        `;
    }
}

function reiniciarQuizz() {
    perguntas = 0;
    acertos = 0;
    document.querySelector(".tela-2").innerHTML = "";
    exibirTela2();
    document.querySelector(".titulo-quiz-topo").scrollIntoView();
}

function voltarInicio() {
    document.querySelector(".tela-2").innerHTML = "";
    carregarTelaLoading();
    setTimeout(buscarTodosQuizzes, 2000);
}

function buscarTodosQuizzes(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promessa.then(carregarDados);
    carregarTelaLoading();
}

function carregarDados(dados){
    todosQuizzes = dados.data;
    renderizarQuizzes();
}

function buscarTodosQuizzesCriado(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promessa.then(carregarDadosCriado);
    carregarTelaLoading();
}
function carregarDadosCriado(dados){
    todosQuizzesAtt = dados.data;
    renderizarQuizzCriado();
    carregarTelaLoading();
}

function renderizarQuizzes(){
    let body = document.querySelector("body")
    body.innerHTML = `
        <div class="topo"> BuzzQuizz</div>
        <div class="seus-quizzes-nenhum">
            
        </div>
        <div class="container-seus-quizzes desativado"> 
            <div class ="cabecalho"><span>Seus Quizzes</span> <span class="botao-criar-pequeno" onclick="criarQuizzInfo()">+</span></div>
            <div class="seus-quizzes"></div>
        </div>
        <div class="container-todos-quizzes">
            <span>Todos os Quizzes</span>
            <div class="lista-quizzes"></div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="scripts.js"></script>`;

    const conteudo1 = document.querySelector(".seus-quizzes-nenhum")
    let conteudo2= document.querySelector(".container-seus-quizzes")
    if (seusQuizzesLocal === null){
        conteudo1.innerHTML = `
            <div class="container-seus-quizzes-nenhum">
                <span>Você não criou nenhum quizz ainda :(</span>
                <div class="botao-criar-grande" onclick="criarQuizzInfo()">Criar Quizz</div>
            </div>
        `
    }
    else{
        conteudo2.classList.remove("desativado")
        let conteudo3=document.querySelector(".seus-quizzes")
        let check= [];
        let cont = 0;
        for ( let i=0; i< seusQuizzesLocal.length;i++){
            check = todosQuizzes.filter(function(elemento){ return elemento.id==seusQuizzesLocal[i];})
            if (check.length > 0){
                conteudo3.innerHTML += `
                    <div class="quizz" id="${check[0].id}" onclick="obterUnicoQuiz(this)" ><img src="${check[0].image}" alt="${check[0].title}">
                        <div class="degrade"></div>
                        <div class="titulo-quizz"> ${check[0].title} </div>
                    </div>
                    `
                cont++;
            } 
        }
        if (cont == 0){
            conteudo2.classList.add("desativado")
            conteudo1.innerHTML = `
            <div class="container-seus-quizzes-nenhum ">
                <span>Você não criou nenhum quizz ainda :(</span>
                <div class="botao-criar-grande" onclick="criarQuizzInfo()">Criar Quizz</div>
            </div>
`
        }
    }

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
                <p class ="titulo"> </p>
                <input type="text" class ="url-imagem" placeholder = "URL da imagem do seu quizz">
                <p class ="url-imagem"> </p>
                <input type="text" class ="qtd-perguntas" placeholder = "Quantidade de perguntas do quizz">
                <p class ="qtd-perguntas"> </p>
                <input type="text" class ="qtd-niveis" placeholder = "Quantidade de níveis do quizz">
                <p class ="qtd-niveis"> </p>
            </div>
            <button class="criar" onclick = "validarInfos()"> Prosseguir pra criar perguntas
        </div>
    `
}

function criarPerguntasQuizz(){
    seusQuizzes.title = document.querySelector(".titulo").value;
    seusQuizzes.image = document.querySelector(".url-imagem").value;
    contPerguntas = document.querySelector(".qtd-perguntas").value
    contNiveis = document.querySelector(".qtd-niveis").value
    let conteudo = document.querySelector("body")
    conteudo.innerHTML = `
        <div class="topo"> BuzzQuizz</div>
        <div class="conteudo-perguntas-quizz"> <span><strong>Crie suas perguntas</strong></span></div>
        `
    conteudo = document.querySelector(".conteudo-perguntas-quizz")
    for (let i = 0; i < contPerguntas;i++){
           conteudo.innerHTML+= `
                <div class="perguntas"> 
                    <span><strong>Pergunta ${i+1} </strong> <ion-icon size ="large"name="create-outline" onclick="editarP(this)"></ion-icon></span>
                    <span><strong>Pergunta ${i+1} </strong> </span>
                    <input type="text" class ="texto-pergunta${i+1} desativado" placeholder = "Texto da pergunta">
                    <p class ="texto-pergunta${i+1}"></p>
                    <input type="text" class ="cor-fundo${i+1}" placeholder = "Cor de fundo da pergunta">
                    <p class ="cor-fundo${i+1}"></p>
                    <span><strong>Resposta Correta</strong></span>
                    <input type="text" class ="resposta-correta${i+1}" placeholder = "Resposta Correta">
                    <p class ="resposta-correta${i+1}"></p>
                    <input type="text" class ="imagem-resposta-correta${i+1}" placeholder = "URL da Imagem">
                    <p class ="imagem-resposta-correta${i+1}"></p>
                    <span><strong>Respostas Incorretas</strong></span>
                    <p class ="qtdRespostaIncorreta${i+1}"> </p>
                    <input type="text" class ="resposta-incorreta1${i+1}" placeholder = "Resposta Incorreta 1">
                    <p class ="resposta-incorreta1${i+1}"></p>
                    <input type="text" class ="imagem-resposta-incorreta1${i+1}" placeholder = "URL da Imagem">
                    <p class ="imagem-resposta-incorreta1${i+1}"></p>
                    <input type="text" class ="resposta-incorreta2${i+1}" placeholder = "Resposta Incorreta 2">
                    <p class ="resposta-incorreta2${i+1}"></p>
                    <input type="text" class ="imagem-resposta-incorreta2${i+1}" placeholder = "URL da Imagem">
                    <p class ="imagem-resposta-incorreta2${i+1}"></p>
                    <input type="text" class ="resposta-incorreta3${i+1}" placeholder = "Resposta Incorreta 3">
                    <p class ="resposta-incorreta3${i+1}"></p>
                    <input type="text" class ="imagem-resposta-incorreta3${i+1}" placeholder = "URL da Imagem">
                    <p class ="imagem-resposta-incorreta3${i+1}"></p>
                </div>
            `
    }    
    conteudo.innerHTML += `<button class="criar-prosseguir-niveis" onclick = "validarPerguntas()"> Prosseguir pra criar níveis`
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
        answers = answers.filter(answer => answer.text !== "" && answer.image !== "");
        seusQuizzes.questions[i] = {
            title: document.querySelector(`.texto-pergunta${i+1}`).value,
            color: document.querySelector(`.cor-fundo${i+1}`).value
        }

        seusQuizzes.questions[i].answers=answers;
    }

  let conteudo = document.querySelector("body")
  conteudo.innerHTML = `
    <div class="topo"> BuzzQuizz</div>
    <div class="conteudo-niveis-quizz"> <span><strong>Agora decida os níveis</strong></span></div>
    `
    conteudo = document.querySelector(".conteudo-niveis-quizz")
  for(let i=0; i<contNiveis; i++){
    conteudo.innerHTML += `
        <div class="niveis">
            <span><strong>Nível ${i+1} </strong> <ion-icon size ="large"name="create-outline" onclick="editarN(this)"></ion-icon></span>
            <span><strong>Nível ${i+1} </strong></span>
            <input type="text" class ="titulo-nivel${i+1}" placeholder = "Título do nível">
            <p class ="titulo-nivel${i+1}"></p>
            <input type="text" id="qtdAcertoMinimo" class ="acerto-mínimo${i+1}" placeholder = "% de acerto mínima">
            <p class ="acerto-mínimo${i+1}"></p>
            <p class ="qtdAcertoMinimo"></p>
            <input type="text" class ="imagem-nivel${i+1}" placeholder = "URL da imagem do nível">
            <p class ="imagem-nivel${i+1}"></p>
            <input type="text" class ="descricao-nivel${i+1}" placeholder = "Descrição do nível">
            <p class ="descricao-nivel${i+1}"></p>
        </div>
    `
  }
  conteudo.innerHTML+= `<button class="criar" onclick = "validarNiveis()"> Finalizar Quizz`
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
    carregarTelaLoading()
  
}

function criarQuizz(resposta){
    let local = resposta.data
    if(seusQuizzesLocal !== null){
        quizzLocal = seusQuizzesLocal;
        quizzLocal.push(local.id)
        const dadosSerializados = JSON.stringify(quizzLocal)
        localStorage.setItem("seusQuizzes",dadosSerializados)
    }else{
        quizzLocal.push(local.id)
        const dadosSerializados = JSON.stringify(quizzLocal)
        localStorage.setItem("seusQuizzes", dadosSerializados)
        seusQuizzesSerializado = localStorage.getItem("seusQuizzes")
        seusQuizzesLocal = JSON.parse(seusQuizzesSerializado);
    }

    buscarTodosQuizzesCriado()
    
}


function renderizarQuizzCriado(){
    let checkCriado
    let indice = 0
    indice = seusQuizzesLocal.length
    checkCriado = todosQuizzesAtt.filter(function(elemento){ return elemento.id===seusQuizzesLocal[indice-1];})
    if (checkCriado.length !==0) {
    let conteudo = document.querySelector("body")
    conteudo.innerHTML =`
        <div class="topo"> BuzzQuizz</div>
        <div class="conteudo-quizz-criado"> <span><strong>Seu quizz está pronto</strong></span>
            <div class="quizz-criado" id="${checkCriado[0].id}" onclick = "obterUnicoQuiz(this)"><img src="${checkCriado[0].image}" alt="Seu Quizz">
                <div class="degrade-criado"></div>
                <div class="titulo-quizz"> ${checkCriado[0].title} </div>
            </div>
            <button class="criar-acessar-quizz" id="${checkCriado[0].id}" onclick = "obterUnicoQuiz(this)"> Acessar Quizz</button>
            <button class="voltar-home" onclick="buscarTodosQuizzes()">Voltar pra home</button>
        </div>
    `}
}

function validarInfos(){
    document.querySelectorAll("p").forEach((elemento)=>{elemento.innerHTML = ""})
    document.querySelectorAll("input").forEach((elemento)=>{elemento.classList.remove("erro")})
    let titulo = document.querySelector(".titulo").value
    let qtdperguntas = document.querySelector(".qtd-perguntas").value
    let qtdniveis = document.querySelector(".qtd-niveis").value
    let url = document.querySelector(".url-imagem").value
    let erros =[]
    if(titulo.length < 20){
        erros.push({ erro: `titulo`,
                mensagem:`Titulo deve conter entre 20 e 65 caracteres\n`})
    }if (titulo.length > 65){
        erros.push({ erro: `titulo`,
                mensagem:`Titulo deve conter entre 20 e 65 caracteres\n`})
    }if(url.match(/^http.*\.(jpeg|jpg|gif|png|apng|avif|jfif|pjpeg|pjp|svg|webp)/) === null) {
        erros.push({ erro: `url-imagem`,
                mensagem:`Formato de URL inválida\n`})
    }if(qtdperguntas < 3){
        erros.push({ erro: `qtd-perguntas`,
                mensagem: `Quantidade mínima de perguntas é 3\n`})
    }if(qtdniveis < 2){
        erros.push({ erro: `qtd-niveis`,
                mensagem: `Quantidade mínima de níveis é 2\n`})
    }if(erros.length > 0){
        for (let i=0; i<erros.length; i++){
            document.querySelector(`p.${erros[i].erro}`).innerHTML = `${erros[i].mensagem}`
            document.querySelector(`input.${erros[i].erro}`).classList.add("erro")
        }
        return false
    }else{
    criarPerguntasQuizz()
    }
}

function validarPerguntas(){
    let erros = []
    document.querySelectorAll("p").forEach((elemento)=>{elemento.innerHTML = ""})
    document.querySelectorAll("input").forEach((elemento)=>{elemento.classList.remove("erro")})
    for (let i=0; i<contPerguntas;i++){
        let texto = document.querySelector(`.texto-pergunta${i+1}`).value;
        let respostaCorreta= document.querySelector(`.resposta-correta${i+1}`).value
        let cor = document.querySelector(`.cor-fundo${i+1}`).value
        let urlImagemCorreta = document.querySelector(`.imagem-resposta-correta${i+1}`).value
        let qtdRespostasIncorretas = 0;
        let respostaIncorreta1 = document.querySelector(`.resposta-incorreta1${i+1}`).value;
        let respostaIncorreta2 = document.querySelector(`.resposta-incorreta2${i+1}`).value;
        let respostaIncorreta3 = document.querySelector(`.resposta-incorreta3${i+1}`).value;

        if(texto.length<20){
            erros.push({ erro: `texto-pergunta${i+1}`,
                mensagem:`Texto da pergunta ${i+1} deve ter no mínimo 20 caracteres\n`})
        }if(/^#[0-9A-F]{6}$/i.test(cor)=== false) {
            erros.push({ erro: `cor-fundo${i+1}`,
                mensagem:`Cor de fundo da pergunta${i+1} deve ser hexadecimal\n`})
        }if (respostaCorreta === ""){
            erros.push({ erro: `resposta-correta${i+1}`,
                mensagem:`Texto da resposta correta da pergunta ${i+1} não pode ser vazio\n`})
        }if (urlImagemCorreta.match(/^http.*\.(jpeg|jpg|gif|png|apng|avif|jfif|pjpeg|pjp|svg|webp)/) === null){
            erros.push({ erro: `imagem-resposta-correta${i+1}`,
                mensagem:`Formato da URL inválida para resposta ${i+1}.\n`})
        }if(respostaIncorreta1 !== ""){
            qtdRespostasIncorretas++
        }if(respostaIncorreta2 !== ""){
            qtdRespostasIncorretas++
        }if(respostaIncorreta3 !== ""){
            qtdRespostasIncorretas++
        }if(qtdRespostasIncorretas == 0){
            document.querySelector(`.qtdRespostaIncorreta${i+1}`).innerHTML = "Necessário ter pelo menos uma resposta incorreta preenchida"
        }if(qtdRespostasIncorretas > 0){
           for (let j = 0; j<qtdRespostasIncorretas;j++){
            let respostaIncorreta = document.querySelector(`.resposta-incorreta${j+1}${i+1}`).value
            let urlImagemIncorreta = document.querySelector(`.imagem-resposta-incorreta${j+1}${i+1}`).value

            if(respostaIncorreta === ""){
                erros.push({ erro: `resposta-incorreta${j+1}${i+1}`,
                mensagem:`Inserir texto na resposta incorreta ${j+1} da pergunta ${i+1}\n`})
                
            }if (urlImagemIncorreta.match(/^http.*\.(jpeg|jpg|gif|png|apng|avif|jfif|pjpeg|pjp|svg|webp)/) === null){
                erros.push({ erro: `imagem-resposta-incorreta${j+1}${i+1}`,
                mensagem:`Formato da URL inválida para resposta incorreta ${j+1} da pergunta ${i+1}.\n`})
            }
            }
        }
    }
    if(erros.length > 0){
        for (let i=0; i<erros.length; i++){
            document.querySelector(`p.${erros[i].erro}`).innerHTML = `${erros[i].mensagem}`
            document.querySelector(`input.${erros[i].erro}`).classList.add("erro")
        }
        return false
    }else{
        criarNiveisQuizz()
    }    
}
let erros = []
let acertosMinimos = 0;
function validarNiveis(){
    erros = []
    acertosMinimos = 0;
    document.querySelectorAll("p").forEach((elemento)=>{elemento.innerHTML = ""})
    document.querySelectorAll("input").forEach((elemento)=>{elemento.classList.remove("erro")})
    let porcentagem = []
    for (let i=0; i<contNiveis;i++){
        let titulo = document.querySelector(`.titulo-nivel${i+1}`).value
        let porc = document.querySelector(`.acerto-mínimo${i+1}`).value
        let url = document.querySelector(`.imagem-nivel${i+1}`).value
        let descricao = document.querySelector(`.descricao-nivel${i+1}`).value

        if(titulo.length < 10){
            erros.push({ erro: `titulo-nivel${i+1}`,
                mensagem:`Título do nível ${i+1} deve conter no mínimo 10 caracteres\n`})
        }

        if(porc.length == 0){
            erros.push({ erro: `acerto-mínimo${i+1}`,
                mensagem:`Acerto mínimo não pode ser vazio\n`})
        }
        
        if(/^(0|[1-9][0-9]?|100)$/.test(porc) === false){
            erros.push({ erro: `acerto-mínimo${i+1}`,
                mensagem:`% de acerto mínima deve ser numero entre 0 e 100\n`})
        }

        if (url.match(/^http.*\.(jpeg|jpg|gif|png|apng|avif|jfif|pjpeg|pjp|svg|webp)/) === null){
            erros.push({ erro: `imagem-nivel${i+1}`,
                mensagem:`Formato da URL inválida para nivel ${i+1}.\n`})
        }

        if(descricao.length < 30){
            erros.push({ erro: `descricao-nivel${i+1}`,
                mensagem:`Descrição do nível ${i+1} deve conter no mínimo 30 caracteres\n`})
        }

        if (porc == 0){
            acertosMinimos++
        }

        for (let j = 0 ; j < porcentagem.length ; j ++) {
            if (porcentagem[j] === porc && porcentagem !== []) {
                document.querySelector(`p.acerto-mínimo${i+1}`).innerHTML = "Essa % de acerto mínima já foi atríbuida para outro nível";
                document.querySelector(`input.acerto-mínimo${i+1}`).classList.add("erro")
            }
        }
        porcentagem.push(porc);

    }

    if (acertosMinimos === 0){
        document.querySelectorAll(`.qtdAcertoMinimo`).forEach((elemento)=>{elemento.innerHTML = "Necessário pelo menos um nível ter % mínima igual a 0"})
        document.querySelectorAll(`[id = qtdAcertoMinimo]`).forEach((elemento)=>{elemento.classList.add("erro")})
        
    }

    if(erros.length>0){
        for (let i=0; i<erros.length; i++){
            document.querySelector(`p.${erros[i].erro}`).innerHTML = `${erros[i].mensagem}`
            document.querySelector(`input.${erros[i].erro}`).classList.add("erro")
        }
        return false
    }else{
    finalizarQuizz()
    }
}

function editarP(perguntaClicada){
    const perguntaSelecionada = document.querySelector(".perguntas.mostrar")
    if (perguntaSelecionada !== null) {
        perguntaSelecionada.classList.remove("mostrar");
    }
    perguntaClicada.closest(".perguntas").classList.toggle("mostrar");
}

function editarN(nivelClicado){
    const nivelSelecionado = document.querySelector(".niveis.mostrar")
    if (nivelSelecionado !== null) {
        nivelSelecionado.classList.remove("mostrar");
    }
    nivelClicado.closest(".niveis").classList.toggle("mostrar");
}

buscarTodosQuizzes();
