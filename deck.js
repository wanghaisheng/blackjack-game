class Deck {
    constructor() {
        this.cards = [];
        this.initDeck();
    }

    initDeck() {
        const suits = ["hearts", "diamonds", "clubs", "spades"];
        const values = [
            "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "jack", "queen", "king", "ace"
        ];

        for (let suit of suits) {
            for (let value of values) {
                this.cards.push(new Card(suit, value));
            }
        }

        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }

    remainingCards() {
        return this.cards.length;
    }
}