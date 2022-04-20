let quizzes = [];

function exibirTela2(){
    alert("hello world!")
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
        <div class="quizz" onclick="exibirTela2()"><img src=${quizzes[i].image} alt="${quizzes[i].id}">
            <div class="degrade"></div>
            <div class="titulo-quizz">${quizzes[i].title} </div>
        </div>
        `
    }        

}

buscarTodosQuizzes();
