let quizzes = [];

function exibirTela2(){
    const tela2 = document.querySelector("body")
    tela2.innerHTML = `
            <div class="tela-2">
            <div class="topo-quiz"><p>BuzzQuiz</p></div>
            <div class="titulo-quiz-topo">
                <img class="banner-quiz" src="https://sm.ign.com/ign_br/screenshot/default/naruto-shippuden_zy11.jpg" />
                <p class="titulo-quiz">O quanto vc gosta de naruto?</p>
            </div>
            
            <div class="conteiner-quizzes">
                <div class="conteudo-quiz">
                    <div class="titulo-quiz-secundario">
                        <p>Quem é o naruto?</p>
                    </div>
                    <div class="quiz-imagens">
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Narutzu</p>
                        </div>
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Textana</p>
                        </div> 
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Textana</p>
                        </div>
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Narito</p>
                        </div>
                    </div>
                </div>
                <div class="conteudo-quiz">
                    <div class="titulo-quiz-secundario">
                        <p>Quem é o naruto?</p>
                    </div>
                    <div class="quiz-imagens">
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Textana</p>
                        </div>
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Textana</p>
                        </div> 
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Textana</p>
                        </div>
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            <p>Textana</p>
                        </div>
                    </div>
                </div>
                <div class="conteudo-quiz">
                    <div class="titulo-quiz-secundario quiz-resultado">
                        <p>88% de acerto: Você é praticamente um aluno de Hogwarts!</p>
                    </div>
                    <div class="quiz-imagens parte-final">
                        <div>
                            <img src="https://tm.ibxk.com.br/2021/12/07/07103639346140.jpg" alt="" />
                            
                        </div>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda ut illo iste veniam suscipit in molestiae temporibus? Minus fugit facere error ut inventore sed dignissimos culpa. Accusantium velit iure temporibus!</p>
                        
                    </div>
                </div>
                <button class="reiniciar-quiz">Reiniciar Quizz</button>
                <button class="voltar-home">Voltar pra home</button>
            </div>
    `
}

function buscarTodosQuizzes(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
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

function criarQuizzInfo(){
    conteudo = document.querySelector("body")
    conteudo.innerHTML = `
        <div class="topo"> BuzzQuizz</div>
        <div class="conteudo-info-basicas"> <span><strong>Comece pelo começo</strong></span>
            <div class="info-basicas"> 
                <input type="text" class ="titulo" placeholder = "Título do seu quizz">
                <input type="text" class ="url-imagem" placeholder = "URL da imagem do seu quizz">
                <input type="text" class ="qtd-perguntas" placeholder = "Quantidade de perguntas do quizz">
                <input type="text" class ="qtd-niveis" placeholder = "Quantidade de níveis do quizz">
            </div>
            <button class="criar-perguntas" onclick = "criarPerguntasQuizz()"> Prosseguir pra criar perguntas
        </div>
    `
}

function criarPerguntasQuizz(){
    alert("apertou o botao hein")
}

buscarTodosQuizzes();
