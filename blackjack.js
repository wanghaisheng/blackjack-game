class Blackjack {
    constructor() {
        this.audio = new BlackjackAudio();
        this.ui = new BlackjackUI(this);
        this.deck = new Deck();
        
        this.playerHands = [[]];
        this.currentHandIndex = 0;
        this.dealerHand = [];
        this.bets = [0];
        this.balance = 2000;
        this.gameState = "betting";
        this.gamesPlayed = 0;
        this.gamesWon = 0;
        this.dealerMustStand = 17;
        this.minDeckSize = 20;
        this.maxBet = 500;
        this.currentBet = 0;
        this.dealerHandRevealed = false;
    }

    init() {
        this.ui.initEventListeners();
        this.audio.initializeAudioOnUserGesture();
        this.ui.updateUI();
    }

    startRound() {
        if (this.currentBet === 0) return;
        
        this.gameState = 'dealing';
        this.ui.updateDealButton(true);
        this.playerHands = [[]];
        this.currentHandIndex = 0;
        this.dealerHand = [];
        this.bets = [this.currentBet];
        this.dealerHandRevealed = false;

        this.ui.clearTable();
        this.dealInitialCards();
    }

    async dealInitialCards() {
        const dealSequence = [
            () => this.dealCard(this.playerHands[0], false),
            () => this.dealCard(this.dealerHand, true),
            () => this.dealCard(this.playerHands[0], false),
            () => this.dealCard(this.dealerHand, true)
        ];

        await this.ui.dealInitialCards(dealSequence);
        this.checkInitialBlackjacks();
    }

    async dealCard(hand, isDealer) {
        if (this.deck.remainingCards() < this.minDeckSize) {
            this.deck.initDeck();
        }
        const card = this.deck.draw();
        hand.push(card);
        this.audio.playSound("dealCard");
        await this.ui.animateDeal(card, isDealer);
        return card;
    }

    checkInitialBlackjacks() {
        const playerBlackjack = this.isBlackjack(this.playerHands[0]);
        const dealerBlackjack = this.isBlackjack(this.dealerHand);

        if (playerBlackjack || dealerBlackjack) {
            this.dealerHandRevealed = true;
            this.ui.updateUI();
            
            setTimeout(() => {
                if (playerBlackjack && dealerBlackjack) {
                    this.ui.showMessage("Both have Blackjack! It's a push.", 2000);
                } else if (playerBlackjack) {
                    this.ui.showMessage("Blackjack! You win!", 2000);
                } else {
                    this.ui.showMessage("Dealer has Blackjack. Dealer wins.", 2000);
                }
                setTimeout(() => this.endRound(), 2000);
            }, 1000);
        } else {
            this.gameState = 'player';
            this.ui.updateUI();
            this.playHand();
        }
    }
    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.value === "ace") {
                aces += 1;
                value += 11;
            } else if (["jack", "queen", "king"].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
        }

        return { total: value, soft: aces > 0 && value <= 21 };
    }

    doubleDown() {
        if (this.balance >= this.bets[this.currentHandIndex]) {
            this.balance -= this.bets[this.currentHandIndex];
            this.bets[this.currentHandIndex] *= 2;
            this.hit();
            if (this.gameState === "player") {
                this.nextHand();
            }
        }
    }

    split() {
        if (this.canSplit()) {
            const currentHand = this.playerHands[this.currentHandIndex];
            const newHand = [currentHand.pop()];
            this.playerHands.push(newHand);
            
            // Deal a new card to each hand
            this.dealCard(currentHand, false);
            this.dealCard(newHand, false);
            
            // Duplicate the bet for the new hand
            this.bets.push(this.bets[this.currentHandIndex]);
            this.balance -= this.bets[this.currentHandIndex];
            
            this.ui.updateUI();
            this.playHand();
        }
    }

    playHand() {
        if (this.currentHandIndex < this.playerHands.length) {
            const currentHand = this.playerHands[this.currentHandIndex];
            const handValue = this.calculateHandValue(currentHand);

            this.ui.showMessage(`Playing Hand ${this.currentHandIndex + 1}`, 2000);
            this.ui.updateControls(true);

            if (handValue.total >= 21) {
                setTimeout(() => this.nextHand(), 1000);
            }
        } else {
            this.dealerTurn();
        }
    }

    nextHand() {
        this.currentHandIndex++;
        if (this.currentHandIndex < this.playerHands.length) {
            this.playHand();
            this.ui.updatePlayerHands();
        } else {
            const allHandsBusted = this.playerHands.every(hand => this.calculateHandValue(hand).total > 21);
            if (allHandsBusted) {
                this.endRound();
            } else {
                this.dealerTurn();
            }
        }
    }

    hit() {
        if (this.currentHandIndex < this.playerHands.length) {
            const currentHand = this.playerHands[this.currentHandIndex];
            this.dealCard(currentHand, false);
            const handValue = this.calculateHandValue(currentHand);

            this.ui.updateUI();

            if (handValue.total > 21) {
                this.ui.showMessage("Bust!", 1000);
                setTimeout(() => {
                    if (this.currentHandIndex === this.playerHands.length - 1) {
                        this.endRound();
                    } else {
                        this.nextHand();
                    }
                }, 1000);
            }
        }
    }

    stand() {
        this.nextHand();
    }

    dealerTurn() {
        this.gameState = 'dealer';
        this.dealerHandRevealed = true;
        this.ui.updateUI();
        
        const dealerPlay = () => {
            let dealerHand = this.calculateHandValue(this.dealerHand);
            if (dealerHand.total < this.dealerMustStand || (dealerHand.soft && dealerHand.total === this.dealerMustStand)) {
                this.dealCard(this.dealerHand);
                this.ui.updateUI();
                setTimeout(dealerPlay, 1000);
            } else {
                this.endRound();
            }
        };

        setTimeout(dealerPlay, 1000);
    }

    isBlackjack(hand) {
        return hand.length === 2 && this.calculateHandValue(hand).total === 21;
    }

    endRound() {
        if (this.gameState === 'roundOver') return; // Prevent multiple executions

        this.gameState = 'roundOver';
        this.dealerHandRevealed = true;
        this.ui.updateUI();

        const allHandsBusted = this.playerHands.every(hand => this.calculateHandValue(hand).total > 21);
        if (allHandsBusted) {
            this.ui.showMessage("All hands busted. Dealer wins!", 2000);
            this.updateStats(false);
        } else {
            const dealerTotal = this.calculateHandValue(this.dealerHand).total;
            const results = this.playerHands.map(hand => {
                const playerTotal = this.calculateHandValue(hand).total;
                if (playerTotal > 21) return "Bust";
                if (dealerTotal > 21) return "Win";
                if (playerTotal > dealerTotal) return "Win";
                if (playerTotal < dealerTotal) return "Lose";
                return "Push";
            });

            this.displayResults(results);
        }
        this.ui.clearBettingArea();

        setTimeout(() => {
            this.resetRound();
        }, 3000);
    }

    displayResults(results) {
        const messages = results.map((result, index) => {
            const handNumber = this.playerHands.length > 1 ? ` (Hand ${index + 1})` : '';
            switch (result) {
                case "Win":
                    this.balance += this.bets[index] * 2;
                    this.gamesWon++;
                    return `You win${handNumber}! +$${this.bets[index]}`;
                case "Lose":
                    return `You lose${handNumber}. -$${this.bets[index]}`;
                case "Push":
                    this.balance += this.bets[index];
                    return `Push${handNumber}. Your bet is returned.`;
                case "Bust":
                    return `Bust${handNumber}. -$${this.bets[index]}`;
                default:
                    return `Unknown result${handNumber}.`;
            }
        });

        this.gamesPlayed++;
        this.updateStats();
        this.ui.showResults(messages);
    }

    updateStats() {
        this.ui.updateStats();
    }

    placeBet(amount) {
        if (this.gameState !== 'betting') return;
        
        if (this.balance >= amount && this.currentBet + amount <= this.maxBet) {
            this.currentBet += amount;
            this.balance -= amount;
            this.ui.animateChipToBettingArea(amount);
            this.ui.updateUI();
            this.audio.playSound('chip');
        }
    }

    canSplit() {
        const currentHand = this.playerHands[this.currentHandIndex];
        return currentHand && 
               currentHand.length === 2 &&
               currentHand[0].value === currentHand[1].value &&
               this.playerHands.length < 4 &&
               this.balance >= this.bets[this.currentHandIndex];
    }

    removeBet(amount) {
        if (this.gameState !== 'betting') return;
        
        if (this.currentBet >= amount) {
            this.currentBet -= amount;
            this.balance += amount;
            this.ui.updateUI();
            this.audio.playSound('chip');
        }
    }

    resetRound() {
        this.currentBet = 0;
        this.bets = [];
        this.gameState = 'betting';
        this.ui.updateUI();
        if (this.balance <= 0) {
            this.ui.showMessage("You're out of money. Game over.", 3000);
            location.reload();
        }
    }
}