// Efectul Compus - Landing Page Script

class EfectulCompus {
    constructor() {
        this.maxNumber = 365;
        this.totalGoal = (this.maxNumber * (this.maxNumber + 1)) / 2; // 66795
        this.balanceKey = 'efc_balance_v1';
        this.txKey = 'efc_transactions_v1';
        this.balance = this.loadBalance();
        this.transactions = this.loadTransactions();
        this.currentNumber = this.computePaidDays(this.balance);
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindUI();
        this.updateDisplay();
        this.showCurrentDate();
        this.showProjectInfo();
        this.generateMilestones();
        this.buildDaysGrid();
        this.renderTransactionsLog();
        this.checkForMilestone();
    }
    
    // Persistence
    loadBalance() {
        const v = parseFloat(localStorage.getItem(this.balanceKey));
        return Number.isFinite(v) ? v : 0;
    }

    saveBalance() {
        localStorage.setItem(this.balanceKey, String(this.balance));
    }

    loadTransactions() {
        try { return JSON.parse(localStorage.getItem(this.txKey) || '[]'); } catch { return []; }
    }

    saveTransactions() {
        localStorage.setItem(this.txKey, JSON.stringify(this.transactions));
    }

    // Logic: compute paid days from balance using triangular numbers
    computePaidDays(balance) {
        const b = Math.max(0, Math.min(balance, this.totalGoal));
        const k = Math.floor((Math.sqrt(8 * b + 1) - 1) / 2);
        return Math.min(this.maxNumber, Math.max(0, k));
    }
    
    // UI bindings
    bindUI() {
        const addBtn = document.getElementById('addAmountBtn');
        const resetBtn = document.getElementById('resetDataBtn');
        const input = document.getElementById('amountInput');
        if (addBtn && input) {
            addBtn.addEventListener('click', () => {
                const amount = parseFloat(input.value.replace(',', '.'));
                if (!Number.isFinite(amount) || amount === 0) return;
                this.addTransaction(amount);
                input.value = '';
                input.focus();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    addBtn.click();
                }
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Sigur dorești să resetezi datele?')) {
                    this.balance = 0;
                    this.transactions = [];
                    this.saveBalance();
                    this.saveTransactions();
                    this.currentNumber = this.computePaidDays(this.balance);
            this.updateDisplay();
                    this.buildDaysGrid();
                    this.renderTransactionsLog();
                }
            });
        }
    }
    
    // Afișează informațiile despre proiect
    showProjectInfo() {
        // Adaugă sau actualizează afișajul informațiilor proiectului
        let projectInfoElement = document.getElementById('projectInfo');
        if (!projectInfoElement) {
            projectInfoElement = document.createElement('div');
            projectInfoElement.id = 'projectInfo';
            projectInfoElement.className = 'project-info';
            document.querySelector('.counter-section').appendChild(projectInfoElement);
        }
        
        const daysRemaining = Math.max(0, this.maxNumber - this.currentNumber);
        projectInfoElement.innerHTML = `
            <div style="font-size: 0.9rem; opacity: 0.7;">
                ${daysRemaining > 0 ? `${daysRemaining} zile rămase` : 'Proiect completat!'}
            </div>
        `;
    }
    
    // Verifică dacă trebuie să afișeze felicitări pentru un milestone
    checkForMilestone() {
        const importantDays = [1, 7, 14, 21, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365];
        
        // Verifică dacă ziua curentă este un milestone
        if (importantDays.includes(this.currentNumber)) {
            // Verifică dacă nu am afișat deja felicitările pentru acest milestone
            const lastCelebratedDay = localStorage.getItem('lastCelebratedDay');
            if (lastCelebratedDay != this.currentNumber) {
                // Așteaptă un pic ca pagina să se încarce complet
                setTimeout(() => {
                    this.showCelebration();
                    localStorage.setItem('lastCelebratedDay', this.currentNumber);
                }, 500);
            }
        }
    }
    
    // Afișează artificii și mesaj de felicitare
    showCelebration() {
        // Creează overlay-ul pentru felicitări
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        
        const milestoneAmount = (this.currentNumber * (this.currentNumber + 1)) / 2;
        
        overlay.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h2 class="celebration-title">Felicitări!</h2>
                <p class="celebration-message">Ai atins Milestone-ul Zilei ${this.currentNumber}!</p>
                <p class="celebration-amount">${milestoneAmount.toLocaleString('ro-RO')} lei economisiți</p>
                <p class="celebration-encouragement">Continue așa! Ești pe drumul cel bun! 🌟</p>
                <button class="celebration-close" onclick="this.closest('.celebration-overlay').remove()">Închide</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Pornește artificiile
        this.startFireworks();
        
        // Oprește artificiile după 5 secunde
        setTimeout(() => {
            this.stopFireworks();
        }, 5000);
    }
    
    // Creează și pornește artificiile
    startFireworks() {
        this.fireworksInterval = setInterval(() => {
            this.createFirework();
        }, 300);
    }
    
    // Oprește artificiile
    stopFireworks() {
        if (this.fireworksInterval) {
            clearInterval(this.fireworksInterval);
        }
    }
    
    // Creează un foc de artificii
    createFirework() {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // Poziționează random pe ecran
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6); // Doar în partea de sus
        
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        
        // Culoare random
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700', '#ff6b6b', '#4ecdc4', '#95e1d3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Creează particulele
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.background = color;
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--vx', vx);
            particle.style.setProperty('--vy', vy);
            
            firework.appendChild(particle);
        }
        
        document.body.appendChild(firework);
        
        // Elimină artificiile după animație
        setTimeout(() => {
            firework.remove();
        }, 1500);
    }
    
    // Generează milestone-urile pentru toate cele 365 de zile
    generateMilestones() {
        const container = document.getElementById('milestonesContainer');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        // Zilele importante care vor avea carduri mari
        const importantDays = [1, 7, 14, 21, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365];
        
        // Generează milestone-uri pentru toate cele 365 de zile
        for (let day = 1; day <= this.maxNumber; day++) {
            const milestone = document.createElement('div');
            
            // Calculează suma pentru acest milestone
            const milestoneAmount = (day * (day + 1)) / 2;
            
            // Determină statusul milestone-ului
            let status, statusText;
            if (day < this.currentNumber) {
                status = 'completed';
                statusText = 'Completat';
            } else if (day === this.currentNumber) {
                status = 'current';
                statusText = 'În curs';
            } else {
                status = 'pending';
                statusText = 'Viitor';
            }
            
            // Toate cardurile au aceeași mărime și afișează ziua și suma
            if (importantDays.includes(day)) {
                milestone.className = `milestone milestone-uniform milestone-gold ${status}`;
            } else {
                milestone.className = `milestone milestone-uniform ${status}`;
            }
            
            milestone.innerHTML = `
                <div class="milestone-day">Ziua ${day}</div>
                <div class="milestone-amount">${milestoneAmount.toLocaleString('ro-RO')} lei</div>
                <div class="milestone-status">${statusText}</div>
            `;
            
            container.appendChild(milestone);
        }
    }
    
    // Afișează data curentă
    showCurrentDate() {
        const today = new Date();
        const dateString = today.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Adaugă sau actualizează afișajul datei
        let dateElement = document.getElementById('currentDate');
        if (!dateElement) {
            dateElement = document.createElement('div');
            dateElement.id = 'currentDate';
            dateElement.className = 'current-date';
            document.querySelector('.counter-section').appendChild(dateElement);
        }
        dateElement.textContent = dateString;
    }
    
    // Actualizează afișajul
    updateDisplay() {
        this.currentNumber = this.computePaidDays(this.balance);
        this.updateCurrentNumber();
        this.updateProgressBar();
        this.updateDayIndicator();
        this.updateTotalAmount();
        this.updateTotalPercent();
        this.generateMilestones();
        this.updateMeta();
        this.paintDaysGrid();
    }
    
    // Actualizează numărul curent cu animație
    updateCurrentNumber() {
        const numberElement = document.getElementById('currentNumber');
        if (numberElement) {
            numberElement.classList.add('animate');
            numberElement.textContent = this.currentNumber;
            
            setTimeout(() => {
                numberElement.classList.remove('animate');
            }, 500);
        }
    }
    
    // Actualizează bara de progres
    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentNumber / this.maxNumber) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }
    
    // Actualizează indicatorul zilei
    updateDayIndicator() {
        const dayText = document.getElementById('dayText');
        if (dayText) {
            if (this.currentNumber >= this.maxNumber) {
                dayText.textContent = `Proiect completat! Ziua ${this.maxNumber}`;
                dayText.style.color = '#4ade80'; // Verde pentru completat
            } else {
                dayText.textContent = `Ziua ${this.currentNumber}`;
                dayText.style.color = '#ffffff';
            }
        }
    }
    
    // Actualizează suma totală cu animație
    updateTotalAmount() {
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            const totalSum = this.totalGoal;
            const shown = Math.min(this.balance, totalSum);
            this.animateNumber(totalElement, shown, totalSum);
        }
    }

    // Actualizează procentul completat cu 5 zecimale
    updateTotalPercent() {
        const percentElement = document.getElementById('totalPercent');
        if (!percentElement) return;
        const totalSum = this.totalGoal;
        const partial = Math.min(this.balance, totalSum);
        const percent = (partial / totalSum) * 100;
        percentElement.textContent = `${percent.toFixed(5)}%`;
    }
    
    // Animație pentru numere
    animateNumber(element, targetValue, totalValue) {
        const duration = 500;
        const startTime = performance.now();
        const startValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function pentru animație smooth
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
            
            // Afișează suma parțială / suma totală
            element.textContent = `${Math.floor(currentValue).toLocaleString('ro-RO')} / ${totalValue.toLocaleString('ro-RO')} lei`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    // Days Grid
    buildDaysGrid() {
        const grid = document.getElementById('daysGrid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let day = 1; day <= this.maxNumber; day++) {
            const item = document.createElement('div');
            item.className = 'day-item';
            item.innerHTML = `
                <label class="day">
                    <input type="checkbox" disabled>
                    <span class="day-label">Ziua ${day}</span>
                    <span class="day-amount">${day.toLocaleString('ro-RO')} lei</span>
                </label>
            `;
            grid.appendChild(item);
        }
        this.paintDaysGrid();
        this.updateMeta();
    }

    paintDaysGrid() {
        const grid = document.getElementById('daysGrid');
        if (!grid) return;
        const paid = this.currentNumber;
        const boxes = grid.querySelectorAll('input[type="checkbox"]');
        boxes.forEach((box, idx) => {
            box.checked = idx < paid;
            const wrapper = box.closest('.day');
            if (wrapper) {
                wrapper.classList.toggle('paid', idx < paid);
            }
        });
    }

    updateMeta() {
        const balEl = document.getElementById('balanceValue');
        const goalEl = document.getElementById('goalValue');
        if (balEl) balEl.textContent = Math.max(0, this.balance).toLocaleString('ro-RO');
        if (goalEl) goalEl.textContent = this.totalGoal.toLocaleString('ro-RO');
    }

    // Transactions
    addTransaction(amount) {
        const now = new Date();
        this.transactions.unshift({
            id: now.getTime(),
            ts: now.toISOString(),
            amount
        });
        this.balance = Math.max(0, Math.min(this.balance + amount, this.totalGoal));
        this.saveTransactions();
        this.saveBalance();
        this.updateDisplay();
        this.renderTransactionsLog();
        this.checkForMilestone();
    }

    renderTransactionsLog() {
        const log = document.getElementById('transactionsLog');
        if (!log) return;
        if (this.transactions.length === 0) {
            log.innerHTML = '<div class="log-empty">Nu există tranzacții încă.</div>';
            return;
        }
        log.innerHTML = this.transactions
            .map(t => {
                const dt = new Date(t.ts).toLocaleString('ro-RO');
                const signClass = t.amount >= 0 ? 'plus' : 'minus';
                const sign = t.amount >= 0 ? '+' : '';
                return `<div class="log-row"><span class="log-date">${dt}</span><span class="log-amount ${signClass}">${sign}${t.amount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lei</span></div>`;
            })
            .join('');
    }
}

// Variabilă globală pentru instanța aplicației
let efectulCompusApp;

// Inițializează aplicația când DOM-ul este încărcat
document.addEventListener('DOMContentLoaded', () => {
    efectulCompusApp = new EfectulCompus();
});



// Inițializare aplicație
document.addEventListener('DOMContentLoaded', () => {
    console.log('Efectul Compus - Landing Page încărcat');
    console.log('Data curentă:', new Date().toLocaleDateString('ro-RO'));
});

// Efecte vizuale suplimentare
document.addEventListener('DOMContentLoaded', () => {
    // Adaugă efecte de particule subtile
    createParticleEffect();
});

function createParticleEffect() {
    const container = document.querySelector('.container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s infinite linear;
        `;
        
        document.body.appendChild(particle);
    }
    
    // Adaugă CSS pentru animația particulelor
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
