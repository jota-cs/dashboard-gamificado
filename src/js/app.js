// Estado inicial da Gamificação
let currentXP = 0;
let currentLevel = 1;
const xpPerLevel = 1000; 

// Seletores do DOM
const xpBar = document.getElementById('xpBar');
const xpText = document.getElementById('xpText');
const levelDisplay = document.getElementById('levelDisplay');
const completeButtons = document.querySelectorAll('.btn-complete');

// Função principal de atualização
function gainXP(amount) {
    currentXP += amount;
    
    // Verifica Level Up
    if (currentXP >= xpPerLevel) {
        currentXP = currentXP - xpPerLevel; // Fica com o "troco" do XP
        currentLevel++;
        levelUpAnimation();
    }

    updateUI();
}

function updateUI() {
    // Calcula porcentagem e limita a 100% visualmente
    const percentage = Math.min((currentXP / xpPerLevel) * 100, 100);
    
    // Atualiza a tela
    xpBar.style.width = `${percentage}%`;
    xpText.textContent = `${currentXP} / ${xpPerLevel} XP`;
    levelDisplay.textContent = `Lvl ${currentLevel}`;
}

function levelUpAnimation() {
    // Efeito visual rápido para os sócios verem que funciona
    levelDisplay.style.boxShadow = "0 0 30px #f43f5e";
    levelDisplay.style.transform = "scale(1.2)";
    levelDisplay.style.transition = "all 0.3s ease";
    
    setTimeout(() => {
        levelDisplay.style.boxShadow = "0 0 15px rgba(225, 29, 72, 0.4)";
        levelDisplay.style.transform = "scale(1)";
        alert(`🔥 Sensacional! Você subiu para o Nível ${currentLevel}!`);
    }, 400);
}

// Escuta os cliques nos botões de completar tarefa
completeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Pega o valor do data-xp no HTML
        const xpAmount = parseInt(this.getAttribute('data-xp'));
        
        gainXP(xpAmount);
        
        // Estado de botão desabilitado
        this.textContent = "Concluído";
        this.disabled = true;
    });
});

// Inicializa a UI vazia
updateUI();