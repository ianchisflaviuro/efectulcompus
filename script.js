// Efectul Compus - Landing Page Script

class EfectulCompus {
    constructor() {
        this.maxNumber = 365;
        // Încarcă data de început din localStorage sau folosește data curentă
        this.startDate = this.loadStartDate();
        this.currentNumber = this.calculateCurrentDay();
        this.isAnimating = false;
        
        this.init();
    }
    
    // Încarcă data de început din localStorage sau creează una nouă
    loadStartDate() {
        // Forțează data de început la 3 octombrie 2025
        const startDate = new Date('2025-10-03T00:00:00');
        localStorage.setItem('efectulCompusStartDate', startDate.toISOString());
        return startDate;
    }
    
    init() {
        this.setupAutoUpdate();
        this.updateDisplay();
        this.showCurrentDate();
        this.showProjectInfo();
        this.generateMilestones();
    }
    
    // Calculează ziua curentă bazată pe data de astăzi
    calculateCurrentDay() {
        const today = new Date();
        const timeDiff = today.getTime() - this.startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
        
        // Limitează la maximum 365 de zile (proiectul durează 1 an)
        const currentDay = Math.min(Math.max(daysDiff, 1), this.maxNumber);
        
        console.log(`Data de început: ${this.startDate.toLocaleDateString('ro-RO')}`);
        console.log(`Data curentă: ${today.toLocaleDateString('ro-RO')}`);
        console.log(`Diferența în zile: ${daysDiff}`);
        console.log(`Ziua calculată: ${currentDay} (din ${this.maxNumber})`);
        
        return currentDay;
    }
    
    // Configurează actualizarea automată la 00:00
    setupAutoUpdate() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        
        // Actualizează la miezul nopții
        setTimeout(() => {
            this.currentNumber = this.calculateCurrentDay();
            this.updateDisplay();
            this.showCurrentDate();
            this.showProjectInfo();
            
            // Configurează actualizarea pentru următoarea zi
            this.setupAutoUpdate();
        }, timeUntilMidnight);
        
        console.log(`Următoarea actualizare la: ${tomorrow.toLocaleString('ro-RO')}`);
    }
    
    // Afișează informațiile despre proiect
    showProjectInfo() {
        const startDateString = this.startDate.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
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
            <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 0.5rem;">
                Proiect început: ${startDateString}
            </div>
            <div style="font-size: 0.9rem; opacity: 0.7;">
                ${daysRemaining > 0 ? `${daysRemaining} zile rămase` : 'Proiect completat!'}
            </div>
        `;
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
        this.updateCurrentNumber();
        this.updateProgressBar();
        this.updateDayIndicator();
        this.updateTotalAmount();
        this.generateMilestones();
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
            // Calculează suma totală a proiectului (1+2+3+...+365)
            const totalSum = (this.maxNumber * (this.maxNumber + 1)) / 2;
            
            // Calculează suma parțială până la numărul curent
            const partialSum = (this.currentNumber * (this.currentNumber + 1)) / 2;
            
            // Afișează suma parțială și totalul proiectului
            const displayText = `${partialSum.toLocaleString('ro-RO')} / ${totalSum.toLocaleString('ro-RO')} lei`;
            
            // Animația pentru suma parțială
            this.animateNumber(totalElement, partialSum, totalSum);
        }
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
