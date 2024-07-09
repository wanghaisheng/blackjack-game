I used Claude 3.5 Sonnet Chat + Cursor + open source images. I created this game to develop a workflow between chat and Cursor

# Blackjack Game

This project is a feature-rich, web-based implementation of the classic casino game Blackjack. It offers an immersive gaming experience with smooth animations, sound effects, and realistic gameplay.

## Features

- **Responsive Design**: Adapts to different screen sizes for optimal play on both desktop and mobile devices.
- **Realistic Gameplay**: Follows standard Blackjack rules including hit, stand, double down, and split.
- **Betting System**: Players can place bets using chips of different denominations.
- **Multiple Hands**: Support for playing and splitting multiple hands.
- **Animations**: Smooth card dealing and chip animations for an engaging experience.
- **Sound Effects**: Audio feedback for actions like dealing cards and placing bets.
- **Statistics Tracking**: Keeps track of games played, won, and win percentage.
- **Customizable**: Easy to adjust game parameters like minimum deck size and dealer stand value.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/entrepeneur4lyf/blackjack.git
   ```

2. Navigate to the project directory:
   ```
   cd blackjack
   ```

3. Open `index.html` in a modern web browser.

## Project Structure

- `index.html`: Main HTML file that structures the game interface.
- `styles.css`: Contains all the styling for the game.
- `main.js`: Entry point of the application.
- `blackjack.js`: Core game logic and state management.
- `blackjackui.js`: Handles UI updates and user interactions.
- `blackjackaudio.js`: Manages sound effects.
- `card.js`: Defines the Card class.
- `deck.js`: Implements the Deck class for card management.
- `gsap.min.js` & `TweenMax.min.js`: Animation libraries for smooth transitions.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- GSAP (GreenSock Animation Platform)

## Customization

You can easily customize various game parameters by modifying the `Blackjack` class in `blackjack.js`:

- `dealerMustStand`: The value at which the dealer must stand (default: 17)
- `minDeckSize`: Minimum number of cards before reshuffling (default: 20)
- `maxBet`: Maximum allowed bet (default: 500)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
