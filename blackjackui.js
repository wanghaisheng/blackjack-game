class BlackjackUI {
    constructor(game) {
        this.game = game;
        this.hitButton = document.getElementById("hit-button");
        this.standButton = document.getElementById("stand-button");
        this.doubleButton = document.getElementById("double-button");
        this.splitButton = document.getElementById("split-button");
        this.chipContainer = document.getElementById("chip-container");
        this.notificationArea = document.getElementById("notification-area");
        this.notificationMessage = document.getElementById("notification-message");
        this.startGameButton = document.getElementById("start-game");
        this.showRulesButton = document.getElementById("show-rules");
        this.closeRulesButton = document.getElementById("close-rules");
        this.welcomeScreen = document.getElementById("welcome-screen");
        this.rulesModal = document.getElementById("rules-modal");
        this.gameContainer = document.getElementById("game-container");
        this.betChipsContainer = document.getElementById("bet-chips");
        this.dealButton = document.getElementById("deal-button");
        this.messageTimeout = null;
        this.deckPosition = { x: window.innerWidth / 2, y: -100 }; // Off-screen top center
    }

    initEventListeners() {
        this.hitButton.addEventListener("click", () => this.game.hit());
        this.standButton.addEventListener("click", () => this.game.stand());
        this.doubleButton.addEventListener("click", () => this.game.doubleDown());
        this.splitButton.addEventListener("click", () => this.game.split());
        this.chipContainer.addEventListener("click", (e) => this.handleChipClick(e));
        this.startGameButton.addEventListener("click", () => this.startGame());
        this.showRulesButton.addEventListener("click", () => this.showRules());
        this.closeRulesButton.addEventListener("click", () => this.closeRules());
        this.dealButton.addEventListener("click", () => this.game.startRound());
        this.betChipsContainer.addEventListener("click", (e) => this.handleBetChipClick(e));
        document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    }

    handleChipClick(e) {
        const chip = e.target.closest('.chip');
        if (chip) {
            const amount = parseInt(chip.dataset.value);
            this.game.placeBet(amount);
        }
    }

    handleBetChipClick(e) {
        const chip = e.target.closest('.chip');
        if (chip) {
            const amount = parseInt(chip.dataset.value);
            this.game.removeBet(amount);
        }
    }

    handleKeyPress(e) {
        if (this.game.gameState === "player") {
            switch (e.key.toLowerCase()) {
                case "h":
                    this.game.hit();
                    break;
                case "s":
                    this.game.stand();
                    break;
                case "d":
                    this.game.doubleDown();
                    break;
                case "p":
                    this.game.split();
                    break;
            }
        }
    }

    updateUI() {
        this.updateDealerHand();
        this.updatePlayerHands();
        this.updateControls();
        this.updateStats();
        this.updateBetInfo();
    }

    updateBetInfo() {
        document.getElementById("current-bet").textContent = this.game.currentBet;
        document.getElementById("current-bet-amount").textContent = this.game.currentBet;
        document.getElementById("balance").textContent = this.game.balance;
    }

    updateDealerHand() {
        const dealerHandElement = document.getElementById('dealer-hand');
        dealerHandElement.innerHTML = '';
        
        this.game.dealerHand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (this.game.dealerHandRevealed || index > 0) {
                cardElement.innerHTML = `<img src="cards/${card.value}_of_${card.suit}.svg" alt="${card.value} of ${card.suit}">`;
            } else {
                cardElement.innerHTML = '<img src="cards/back.svg" alt="Card back">';
            }
            dealerHandElement.appendChild(cardElement);
        });
    }

    updatePlayerHands() {
        const playerHandsElement = document.getElementById('player-hands');
        playerHandsElement.innerHTML = '';

        this.game.playerHands.forEach((hand, index) => {
            const handElement = document.createElement('div');
            handElement.className = 'hand';
            if (this.game.playerHands.length > 1) {
                handElement.classList.add(index === this.game.currentHandIndex ? 'active-hand' : 'inactive-hand');
            }
            
            hand.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `<img src="cards/${card.value}_of_${card.suit}.svg" alt="${card.value} of ${card.suit}">`;
                handElement.appendChild(cardElement);
            });

            playerHandsElement.appendChild(handElement);
        });
    }

    updateControls() {
        const canAct = this.game.gameState === 'player' && this.game.currentHandIndex < this.game.playerHands.length;
        const currentHand = this.game.playerHands[this.game.currentHandIndex];

        this.hitButton.disabled = !canAct;
        this.standButton.disabled = !canAct;
        this.doubleButton.disabled = !canAct || (currentHand && currentHand.length !== 2) || this.game.balance < this.game.bets[this.game.currentHandIndex];
        this.splitButton.disabled = !canAct || !this.game.canSplit();
        this.dealButton.disabled = this.game.currentBet === 0 || this.game.gameState !== "betting";
    }

    updateDealButton(disabled) {
        this.dealButton.disabled = disabled;
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `<img src="cards/${card.value}_of_${card.suit}.svg" alt="${card.value} of ${card.suit}">`;
        return cardElement;
    }

    updateStats() {
        document.getElementById("games-played").textContent = this.game.gamesPlayed;
        document.getElementById("games-won").textContent = this.game.gamesWon;
        document.getElementById("win-percentage").textContent =
            this.game.gamesPlayed > 0
                ? ((this.game.gamesWon / this.game.gamesPlayed) * 100).toFixed(2) + "%"
                : "0%";
    }

    showMessage(message, duration = 3000) {
        const dialog = document.getElementById('animated-dialog');
        const dialogMessage = document.getElementById('dialog-message');
        
        if (dialog && dialogMessage) {
            dialogMessage.textContent = message;
            
            // Reset any ongoing animations
            gsap.killTweensOf(dialog);
            
            // Set initial position and opacity
            gsap.set(dialog, { y: 50, opacity: 0, visibility: 'visible' });
            
            // Animate in
            gsap.to(dialog, {
                duration: 0.5,
                y: 0,
                opacity: 1,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    // Wait, then animate out
                    gsap.to(dialog, {
                        delay: duration / 1000,
                        duration: 0.5,
                        y: -50,
                        opacity: 0,
                        ease: 'back.in(1.7)',
                        onComplete: () => {
                            gsap.set(dialog, { visibility: 'hidden' });
                        }
                    });
                }
            });
        } else {
            console.warn('Dialog elements not found in the DOM');
        }
    }

    startGame() {
        this.welcomeScreen.style.display = "none";
        this.gameContainer.style.display = "block";
        this.updateUI();
    }

    showRules() {
        this.rulesModal.style.display = "block";
    }

    closeRules() {
        this.rulesModal.style.display = "none";
    }

    animateDeal(card, isDealer) {
        return new Promise((resolve) => {
            this.ensureHandElements();
            
            const cardElement = document.createElement("div");
            cardElement.className = "card";
            cardElement.style.backgroundImage = `url(cards/${card.value}_of_${card.suit}.svg)`;
            
            const targetElement = isDealer ? 
                document.querySelector('#dealer-hand .hand') : 
                document.querySelector('#player-hands .hand:last-child');

            if (!targetElement) {
                console.error('Target element for card not found');
                resolve();
                return;
            }

            targetElement.appendChild(cardElement);

            const targetRect = targetElement.getBoundingClientRect();
            
            const startX = this.deckPosition.x - targetRect.left;
            const startY = this.deckPosition.y - targetRect.top;

            gsap.set(cardElement, {
                x: startX,
                y: startY,
                rotation: 30,
                opacity: 0
            });

            gsap.to(cardElement, {
                duration: 0.5,
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                ease: "power4.easeInOut",
                onComplete: () => {
                    this.updateUI();
                    resolve();
                }
            });
        });
    }

    createDeck() {
        // Keep this method, but the deck will be invisible
        if (!this.deckElement) {
            this.deckElement = document.createElement('div');
            this.deckElement.className = 'deck';
            document.getElementById('dealer-area').appendChild(this.deckElement);
        }
    }

    removeDeck() {
        if (this.deckElement) {
            this.deckElement.remove();
            this.deckElement = null;
        }
    }

    ensureDeckExists() {
        if (!this.deckElement) {
            this.createDeck();
        }
    }
    
    clearTable() {
        const dealerHandElement = document.getElementById('dealer-hand');
        const playerHandsElement = document.getElementById('player-hands');
        dealerHandElement.innerHTML = '';
        playerHandsElement.innerHTML = '';
        this.createHandElement(dealerHandElement);
        this.createHandElement(playerHandsElement);
        this.removeDeck();
    }

    createHandElement(parentElement) {
        const handElement = document.createElement('div');
        handElement.className = 'hand';
        parentElement.appendChild(handElement);
    }

    ensureHandElements() {
        const dealerHandElement = document.getElementById('dealer-hand');
        const playerHandsElement = document.getElementById('player-hands');
        
        if (!dealerHandElement.querySelector('.hand')) {
            this.createHandElement(dealerHandElement);
        }
        
        if (!playerHandsElement.querySelector('.hand')) {
            this.createHandElement(playerHandsElement);
        }
    }

    dealInitialCards(dealSequence) {
        return new Promise(async (resolve) => {
            this.createDeck();
            for (let dealFunction of dealSequence) {
                await dealFunction();
            }
            this.removeDeck();
            resolve();
        });
    }
    
    clearBettingArea() {
        const chips = this.betChipsContainer.getElementsByClassName("chip");
        Array.from(chips).forEach((chip) => {
            chip.remove();
        });
    }

    animateChipToBettingArea(amount) {
        const originalChip = this.findOriginalChip(amount);
        if (!originalChip) return;
    
        const chipClone = originalChip.cloneNode(true);
        chipClone.style.position = 'absolute';
        document.body.appendChild(chipClone);
    
        const startRect = originalChip.getBoundingClientRect();
        const endRect = this.betChipsContainer.getBoundingClientRect();
    
        const startX = startRect.left;
        const startY = startRect.top;
        const endX = endRect.left + this.betChipsContainer.children.length * 30;
        const endY = endRect.top + endRect.height / 2 - startRect.height / 2;
    
        chipClone.style.left = `${startX}px`;
        chipClone.style.top = `${startY}px`;
    
        const animationDuration = 200; // 500ms
        const startTime = performance.now();
    
        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
    
            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
    
            const currentX = startX + (endX - startX) * easeProgress;
            const currentY = startY + (endY - startY) * easeProgress;
    
            chipClone.style.left = `${currentX}px`;
            chipClone.style.top = `${currentY}px`;
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.betChipsContainer.appendChild(chipClone);
                chipClone.style.position = 'static';
                chipClone.style.left = '';
                chipClone.style.top = '';
            }
        };
    
        requestAnimationFrame(animate);
    
        // Play chip sound
        this.game.audio.playSound('chip');
    }

    findOriginalChip(value) {
        return Array.from(this.chipContainer.children).find(
            (chip) => chip.dataset.value === value.toString()
        );
    }

    resetBettingArea() {
        this.clearBettingArea();
        // Re-enable all chip buttons
        Array.from(this.chipContainer.children).forEach(chip => {
            chip.disabled = false;
        });
    }

    showResults(messages) {
        const showMessages = (index) => {
            if (index < messages.length) {
                this.showMessage(messages[index], 2000);
                setTimeout(() => showMessages(index + 1), 2000);
            } else {
                this.game.resetRound();
                this.showMessage("Place your bet for the next round", 3000);
            }
        };

        showMessages(0);
    }
}