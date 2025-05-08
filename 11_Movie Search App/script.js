

    // Constants
    const API_KEY = 'faf7e5bb'; // Replace with your actual OMDB API key
    const API_URL = 'https://www.omdbapi.com/';
    
    // DOM Elements
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const moviesGrid = document.querySelector('.movies-grid');
    const loader = document.querySelector('.loader');
    const errorMessage = document.querySelector('.error-message');
    const noResults = document.querySelector('.no-results');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');
    
    // Event Listeners
    searchButton.addEventListener('click', searchMovies);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Function to set the theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeToggleIcon(theme);
    }
    
    // Function to update theme toggle icon
    function updateThemeToggleIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Toggle between dark and light themes
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    // Initialize with recent searches and theme preference
    window.addEventListener('DOMContentLoaded', () => {
        // Initialize theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            // If there's a saved preference, use it
            setTheme(savedTheme);
        } else if (prefersDarkScheme) {
            // Otherwise, respect system preference
            setTheme('dark');
        } else {
            // Default to light theme
            setTheme('light');
        }
        
        // Initialize recent searches
        const recentSearch = localStorage.getItem('recentSearch');
        if (recentSearch) {
            searchInput.value = recentSearch;
            searchMovies();
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only apply if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    });
    
    // Functions
    async function searchMovies() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            showErrorMessage('Please enter a movie title');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('recentSearch', searchTerm);
        
        // Reset and show loader
        resetUI();
        showLoader();
        
        try {
            const response = await fetch(`${API_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`);
            const data = await response.json();
            
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                showNoResults(data.Error || 'No movies found');
            }
        } catch (error) {
            showErrorMessage('Failed to fetch movies. Please try again.');
            console.error('Error fetching data:', error);
        } finally {
            hideLoader();
        }
    }
    
    function displayMovies(movies) {
        moviesGrid.innerHTML = '';
        
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.dataset.id = movie.imdbID;
            
            const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
                ? movie.Poster 
                : 'https://placehold.co/300x450/transparent/black?text=No+Poster+Available';
            
            movieCard.innerHTML = `
                <img class="movie-poster" src="${posterUrl}" 
                     alt="${movie.Title}" 
                     onerror="this.src='https://via.placeholder.com/300x450.png?text=No+Poster+Available'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <p class="movie-year">${movie.Year}</p>
                </div>
            `;
            
            movieCard.addEventListener('click', () => {
                getMovieDetails(movie.imdbID);
            });
            
            moviesGrid.appendChild(movieCard);
        });
    }
    
    async function getMovieDetails(id) {
        showLoader();
        
        try {
            const response = await fetch(`${API_URL}?i=${id}&plot=full&apikey=${API_KEY}`);
            const movie = await response.json();
            
            if (movie.Response === 'True') {
                displayMovieDetails(movie);
            } else {
                showErrorMessage('Failed to load movie details');
            }
        } catch (error) {
            showErrorMessage('Failed to fetch movie details');
            console.error('Error fetching movie details:', error);
        } finally {
            hideLoader();
        }
    }
    
    function displayMovieDetails(movie) {
        const posterUrl = movie.Poster && movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/300x450.png?text=No+Poster+Available';
        
        modalBody.innerHTML = `
            <img class="modal-poster" src="${posterUrl}" 
                 alt="${movie.Title}"
                 onerror="this.src='https://via.placeholder.com/300x450.png?text=No+Poster+Available'">
            <div class="modal-details">
                <h2 class="modal-title">${movie.Title}</h2>
                <div class="modal-meta">
                    <span>${movie.Year}</span>
                    <span>${movie.Runtime}</span>
                    <span>${movie.Rated}</span>
                    ${movie.imdbRating !== 'N/A' ? `<span class="modal-rating">★ ${movie.imdbRating}</span>` : ''}
                </div>
                <p class="modal-plot">${movie.Plot}</p>
                <div class="modal-info-grid">
                    <div class="modal-info-item">
                        <div class="modal-info-label">Genre</div>
                        <div>${movie.Genre}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Director</div>
                        <div>${movie.Director}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Cast</div>
                        <div>${movie.Actors}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Released</div>
                        <div>${movie.Released}</div>
                    </div>
                </div>
            </div>
        `;
        
        openModal();
    }
    
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    function resetUI() {
        moviesGrid.innerHTML = '';
        hideErrorMessage();
        hideNoResults();
    }
    
    function showLoader() {
        loader.style.display = 'block';
    }
    
    function hideLoader() {
        loader.style.display = 'none';
    }
    
    function showErrorMessage(message) {
        errorMessage.textContent = message || 'An error occurred';
        errorMessage.style.display = 'block';
    }
    
    function hideErrorMessage() {
        errorMessage.style.display = 'none';
    }
    
    function showNoResults(message) {
        noResults.textContent = message || 'No movies found. Try another search term.';
        noResults.style.display = 'block';
    }
    
    function hideNoResults() {
        noResults.style.display = 'none';
    }
    
    // Optional: Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
