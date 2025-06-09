// === VARIÁVEIS GLOBAIS ===
let playerHP = 100;
let playerLevel = 1;

let monsterLevel = 1;
let monsterBaseHP = 100;
let monsterHP = monsterBaseHP;

let currentQuestion = {};
let currentAnswer = 0;
let correctStreak = 0;
let usedQuestions = [];
let currentMistakes = 0;


// === LISTAS DE MONSTROS ===
const monsterNames = [
  "Slime Verde", "Morcego Sombrio", "Goblin Raivoso", "Aranha Gigante", "Zumbi Lento",
  "Esqueleto Guerreiro", "Orc Selvagem", "Mago das Sombras", "Golem de Pedra", "Dragão Bebê",
  "Fênix Renascida", "Elemental de Gelo", "Demônio da Névoa", "Cavaleiro Negro", "Serpente Venenosa",
  "Minotauro", "Quimera", "Espírito Ancestral", "Titã de Lava", "Dragão Ancião"
];

const monsterStories = [
  "Um pequeno ser gelatinoso que adora multiplicações fáceis.",
  "Adora se esconder na escuridão e atacar com problemas de tabuada.",
  "Um goblin que fica mais forte quando você erra!",
  "Tece teias de problemas matemáticos!",
  "Anda devagar, mas seus problemas são traiçoeiros.",
  "Um guerreiro esquelético que desafia sua mente.",
  "Corre ferozmente em direção a quem não sabe multiplicar!",
  "Conjura equações sombrias.",
  "Duro como pedra... e suas perguntas também!",
  "Pequeno, mas com fogo nos olhos e nos cálculos!",
  "Renasce das cinzas com perguntas mais difíceis.",
  "Congela mentes com multiplicações geladas.",
  "Esconde-se na neblina e ataca com confusão.",
  "Seu olhar desafia até os melhores estudantes.",
  "Se rasteja silenciosamente com perguntas venenosas.",
  "Corre pelos labirintos da matemática.",
  "Tem corpo de leão, cabeça de cabra e perguntas de gênio!",
  "Fala em enigmas matemáticos antigos.",
  "Cada passo treme a terra e sua mente.",
  "Um dos monstros mais poderosos. Você está preparado?"
];

// === LÓGICA DE PERGUNTAS ===
function generateQuestion() {
  const max = Math.min(10 + monsterLevel, 50);
  let a, b, product;

  do {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    product = a * b;
  } while (usedQuestions.includes(product));

  currentQuestion = {
    question: `Quanto é ${a} × ${b}?`,
    answer: product
  };

  document.getElementById("question-text").textContent = currentQuestion.question;
  document.getElementById("answer").value = "";
  document.getElementById("question-result").textContent = "";

  currentMistakes = 0;

}

// === CHECAGEM DE RESPOSTA ===
function checkAnswer() {
  const userAnswer = parseInt(document.getElementById("answer").value);
  const resultMsg = document.getElementById("question-result");

  if (userAnswer === currentQuestion.answer) {
    correctStreak++;
    usedQuestions.push(`${Math.min(userAnswer, currentQuestion.answer)}x${Math.max(userAnswer, currentQuestion.answer)}`);
    if (usedQuestions.length > 5) usedQuestions.shift();

    monsterHP -= 25;
    resultMsg.textContent = `✅ Acertou! Dano de 25 no monstro!`;
    showDamageMessage("monstro", 25);
    currentMistakes = 0; // reseta erros

    if (monsterHP <= 0) {
      monsterHP = 0;
      playerHP = 100;
      healPlayer();

      document.getElementById("victory-message").textContent = "🎉 Você derrotou o monstro!";
      document.querySelector(".victory").style.display = "block";

      playerLevel++;
      document.getElementById("player-level").textContent = playerLevel;

      setTimeout(() => {
        nextLevel();
        generateQuestion();
      }, 1500);
    } else {
      generateQuestion();
    }
  } else {
    playerHP -= 20;
    currentMistakes++;
    showDamageMessage("jogador", 20);

    if (currentMistakes >= 3) {
  resultMsg.textContent = `❌ 3 erros! A resposta era ${currentQuestion.answer}. Você perdeu 20 de vida.`;

    setTimeout(() => {
      generateQuestion();
    }, 6000); // Espera 6 segundos antes de mostrar a próxima
  }

        if (playerHP <= 0) {
      playerHP = 0;
      document.getElementById("game-over-message").textContent = "💀 Game Over!";
      document.querySelector(".game-over").style.display = "block";

      setTimeout(() => {
        restartGame();
      }, 3000); // Espera 3 segundos antes de reiniciar
    }

  }

  updateHP();
}

// === PULAR PERGUNTA ===
function nextQuestion() {
  playerHP -= 15;
  if (playerHP < 0) playerHP = 0;

  document.getElementById("question-result").textContent = "⚠️ Você perdeu 15 de vida por pular a pergunta.";
  showDamageMessage("jogador", 15);

  generateQuestion();
  updateHP();

  if (playerHP === 0) {
  document.getElementById("game-over-message").textContent = "💀 Game Over!";
  document.querySelector(".game-over").style.display = "block";

  setTimeout(() => {
    restartGame();
  }, 3000);
}

}

// === AVANÇAR PARA PRÓXIMO MONSTRO ===
function nextLevel() {
  monsterLevel++;
  monsterBaseHP = 100 + (monsterLevel - 1) * 50;
  monsterHP = monsterBaseHP;

  document.querySelector(".victory").style.display = "none";
  updateMonster();
  updateHP();
}

// === ATUALIZAR MONSTRO ===
function updateMonster() {
  const monsterImage = document.getElementById("monster-image");
  const index = Math.min(monsterLevel, 20);
  monsterImage.src = `imagens/monster${index}.png`;

  document.getElementById("monster-level").textContent = monsterLevel;
  document.getElementById("monster-name").textContent = monsterNames[index - 1] || "Monstro Desconhecido";

  let storyBox = document.getElementById("monster-story");
  if (!storyBox) {
    storyBox = document.createElement("p");
    storyBox.id = "monster-story";
    storyBox.style.fontStyle = "italic";
    storyBox.style.marginTop = "10px";
    document.querySelector(".stats").appendChild(storyBox);
  }

  storyBox.textContent = monsterStories[index - 1] || "";
}

// === ATUALIZAR HP VISUAL ===
function updateHP() {
  document.getElementById("player-hp").textContent = playerHP;
  document.getElementById("monster-hp").textContent = `${monsterHP} / ${monsterBaseHP}`;
  document.getElementById("player-bar").style.width = `${playerHP}%`;

  const monsterPercent = (monsterHP / monsterBaseHP) * 100;
  document.getElementById("monster-bar").style.width = `${monsterPercent}%`;
}

// === EFEITOS VISUAIS ===
function showDamageMessage(target, damage) {
  const msg = document.createElement("p");
  msg.className = "damage-message";
  msg.textContent = target === "monstro" ? `💥 -${damage} HP no Monstro!` : `💥 -${damage} HP no Jogador!`;

  const container = document.querySelector(".game");
  container.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}

function healPlayer() {
  const playerBar = document.getElementById("player-bar");
  playerBar.classList.add("heal-effect");

  const healText = document.createElement("p");
  healText.className = "heal-message";
  healText.textContent = `❤️ +100 HP recuperado!`;
  document.querySelector(".game").appendChild(healText);

  setTimeout(() => {
    playerBar.classList.remove("heal-effect");
    healText.remove();
  }, 1500);
}

// === REINICIAR JOGO ===
function restartGame() {
  playerHP = 100;
  playerLevel = 1;
  monsterLevel = 1;
  monsterBaseHP = 100;
  monsterHP = monsterBaseHP;
  correctStreak = 0;
  usedQuestions = [];

  document.querySelector(".game-over").style.display = "none";
  document.querySelector(".victory").style.display = "none";

  document.getElementById("player-level").textContent = playerLevel;
  document.getElementById("monster-level").textContent = monsterLevel;

  updateMonster();
  updateHP();
  generateQuestion();
}

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
  updateMonster();
  updateHP();
  generateQuestion();

  document.getElementById("answer").addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkAnswer();
  });
});
