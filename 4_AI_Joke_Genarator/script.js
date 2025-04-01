// DOM Elements
const jokeText = document.getElementById('joke-text');
const getJokeBtn = document.getElementById('get-joke-btn');
const jokeContainer = document.querySelector('.joke-container');
const loadingElement = document.getElementById('loading');

// Using JokeAPI - specifically for programming jokes
const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Programming?safe-mode';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Generate a joke when the page loads
    generateJoke();
});

getJokeBtn.addEventListener('click', generateJoke);

// Functions
async function generateJoke() {
    // Show loading state
    showLoading(true);
    
    try {
        const joke = await fetchJokeFromAPI();
        displayJoke(joke);
    } catch (error) {
        displayError();
        console.error('Error fetching joke:', error);
    } finally {
        // Hide loading state
        showLoading(false);
    }
}

async function fetchJokeFromAPI() {
    // Fetch the joke
    const response = await fetch(JOKE_API_URL);
    
    // Check if the request was successful
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Extract the joke text from the response based on joke type
    let joke;
    if (data.type === 'single') {
        joke = data.joke;
    } else {
        joke = `${data.setup} ${data.delivery}`;
    }
    
    return joke;
}

function displayJoke(joke) {
    // Update the joke text
    jokeText.textContent = joke;
    
    // Add animation
    jokeContainer.classList.add('animate');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        jokeContainer.classList.remove('animate');
    }, 500);
}

function displayError() {
    jokeText.textContent = "Oops! The AI comedian seems to be on break. Please try again later (Internet Issue)";
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingElement.classList.remove('hidden');
        getJokeBtn.disabled = true;
    } else {
        loadingElement.classList.add('hidden');
        getJokeBtn.disabled = false;
    }
}