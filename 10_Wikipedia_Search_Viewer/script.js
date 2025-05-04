document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const messageContainer = document.getElementById('message-container');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use preferred color scheme
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme or system preference
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Update the icon
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Focus the search input when the page loads
    searchInput.focus();

    // Search when the button is clicked
    searchButton.addEventListener('click', () => {
        performSearch();
    });

    // Search when Enter key is pressed
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Function to perform the search
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Validate input
        if (!searchTerm) {
            showMessage('Please enter a search term', 'error-message');
            return;
        }
        
        // Show loading message
        showMessage('Searching Wikipedia...', 'loading-message');
        
        // Build the API URL
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`;
        
        // Fetch data from Wikipedia API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Clear the message
                messageContainer.innerHTML = '';
                
                // Process and display results
                displayResults(data, searchTerm);
            })
            .catch(error => {
                showMessage(`Error: ${error.message}`, 'error-message');
                console.error('Error fetching data:', error);
            });
    }

    // Function to display search results
    function displayResults(data, searchTerm) {
        const searchResults = data.query.search;
        
        if (searchResults.length === 0) {
            showMessage(`No results found for "${searchTerm}"`, 'error-message');
            return;
        }
        
        // Show the number of results
        showMessage(`Found ${searchResults.length} results for "${searchTerm}"`, '');
        
        // Create result cards
        searchResults.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            
            // Create the article URL
            const articleUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`;
            
            // Create HTML for the result card
            resultCard.innerHTML = `
                <h3 class="result-title">
                    <a href="${articleUrl}" target="_blank">${result.title}</a>
                </h3>
                <p class="result-snippet">${result.snippet}</p>
                <a href="${articleUrl}" class="result-link" target="_blank">Read more</a>
            `;
            
            resultsContainer.appendChild(resultCard);
        });
    }

    // Function to show a message
    function showMessage(message, className) {
        messageContainer.innerHTML = message;
        messageContainer.className = 'message-container';
        if (className) {
            messageContainer.classList.add(className);
        }
    }
}); 