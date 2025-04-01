# AI Programming Joke Generator

A simple web application that generates programming-related jokes using the [JokeAPI](https://jokeapi.dev/). The jokes are displayed in a stylish UI with animations, and a loading spinner indicates when a joke is being fetched.

## Features
- Fetches programming-related jokes from the JokeAPI
- Displays single-line and two-part jokes dynamically
- Includes a loading spinner while fetching jokes
- Animations for joke display
- Simple, clean, and responsive design

## Technologies Used
- HTML
- CSS
- JavaScript (Fetch API)

## Installation & Usage
1. Clone the repository:
   ```bash
   git clone https://github.com/vikky2810/20-JavaScript-Projects.git
   cd 4_AI_Joke_Genarator
   ```
2. Open `index.html` in your browser.

## File Structure
```
AI-Programming-Joke-Generator/
│-- index.html       # Main HTML file
│-- style.css        # Stylesheet for UI design
│-- script.js        # JavaScript logic for fetching and displaying jokes
│-- README.md        # Project documentation (this file)
```

## API Used
This project utilizes the JokeAPI to fetch programming-related jokes:
- API Endpoint: `https://v2.jokeapi.dev/joke/Programming?safe-mode`

## How It Works
1. The page loads and automatically fetches a joke.
2. Clicking the "Generate Joke" button fetches a new joke.
3. While fetching, a loading spinner appears.
4. The joke is displayed with an animation effect.
5. If an error occurs (e.g., no internet), a message is displayed instead.

## Demo
You can try the live demo [here](https://funnybot-ai.vercel.app
).

## Contributing
Feel free to contribute! You can:
- Improve the UI/UX
- Add more animations
- Enhance functionality with additional joke categories


