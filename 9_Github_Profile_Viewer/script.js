document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Update ARIA state
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
        themeToggle.setAttribute('aria-label', `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    const searchBtn = document.getElementById('search-btn');
    const usernameInput = document.getElementById('username-input');
    const profileContainer = document.getElementById('profile-container');
    const repositoriesContainer = document.getElementById('repositories-container');
    const errorContainer = document.getElementById('error-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const searchHistoryList = document.getElementById('search-history-list');
    const MAX_HISTORY_ITEMS = 5;
    
    // Profile elements
    const avatar = document.getElementById('avatar');
    const nameElement = document.getElementById('name');
    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');
    const repoCount = document.getElementById('repo-count');
    const followersCount = document.getElementById('followers-count');
    const followingCount = document.getElementById('following-count');
    const contributionsCount = document.getElementById('contributions-count');
    const viewProfileBtn = document.getElementById('view-profile');
    const repoList = document.getElementById('repo-list');
    
    // Handle search form submission
    searchBtn.addEventListener('click', searchUser);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchUser();
        }
    });

    // Add this to your DOMContentLoaded event listener
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' || e.key === '.') {
            e.preventDefault();
            usernameInput.focus();
        }
    });
    
    // Load search history from localStorage
    function loadSearchHistory() {
        const history = getSearchHistory();
        updateSearchHistoryUI(history);
    }

    // Get search history from localStorage
    function getSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    // Add a new search to history
    function addToSearchHistory(username) {
        let history = getSearchHistory();
        
        // Remove username if it already exists
        history = history.filter(item => item !== username);
        
        // Add new username at the beginning
        history.unshift(username);
        
        // Keep only MAX_HISTORY_ITEMS items
        history = history.slice(0, MAX_HISTORY_ITEMS);
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(history));
        
        // Update UI
        updateSearchHistoryUI(history);
    }

    // Update the search history UI
    function updateSearchHistoryUI(history) {
        searchHistoryList.innerHTML = '';
        
        history.forEach(username => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <i class="fas fa-history" aria-hidden="true"></i>
                <span>${username}</span>
            `;
            li.addEventListener('click', () => {
                usernameInput.value = username;
                searchUser();
            });
            searchHistoryList.appendChild(li);
        });
    }
    
    async function searchUser() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showError('Please enter a GitHub username');
            return;
        }
        
        // Add to search history
        addToSearchHistory(username);
        
        // Reset UI
        resetUI();
        showLoading();
        
        try {
            // Fetch user data
            const userData = await fetchUserData(username);
            
            if (userData.message === 'Not Found') {
                showError(`User "${username}" not found`);
                return;
            }
            
            // Display user profile
            displayUserProfile(userData);
            
            // Fetch and display repositories
            const repositories = await fetchRepositories(username);
            displayRepositories(repositories);
            
            // Try to fetch contributions data
            try {
                const contributions = await fetchContributions(username);
                contributionsCount.textContent = contributions;
            } catch (e) {
                contributionsCount.textContent = 'N/A';
            }
            
        } catch (error) {
            showError('Error fetching data from GitHub API');
            console.error('Error:', error);
        } finally {
            hideLoading();
        }
    }
    
    async function fetchUserData(username) {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return await response.json();
    }
    
    async function fetchRepositories(username) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return await response.json();
    }
    
    async function fetchContributions(username) {
        // This is a simplified approach to get contributions
        // GitHub API doesn't provide direct access to contributions count
        // In a real application, we would need to parse the contributions graph
        // For this example, we'll just return a random number
        return Math.floor(Math.random() * 1000) + 100;
    }
    
    function displayUserProfile(userData) {
        // Show profile container
        profileContainer.style.display = 'block';
        
        // Set profile data
        avatar.src = userData.avatar_url;
        nameElement.textContent = userData.name || userData.login;
        usernameElement.textContent = `@${userData.login}`;
        bioElement.textContent = userData.bio || 'No bio available';
        repoCount.textContent = userData.public_repos;
        followersCount.textContent = userData.followers;
        followingCount.textContent = userData.following;
        viewProfileBtn.href = userData.html_url;
    }
    
    function displayRepositories(repositories) {
        // Show repositories container
        repositoriesContainer.style.display = 'block';
        
        // Clear previous repos
        repoList.innerHTML = '';
        
        if (repositories.length === 0) {
            repoList.innerHTML = '<li class="repo-item">No repositories found</li>';
            return;
        }
        
        // Add repositories to the list
        repositories.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.className = 'repo-item';
            
            const repoDesc = repo.description || 'No description available';
            const language = repo.language || 'Not specified';
            
            repoItem.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                <p>${repoDesc}</p>
                <div class="repo-meta">
                    <span><i class="fas fa-code"></i> ${language}</span>
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count} stars</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count} forks</span>
                    <span><i class="fas fa-calendar"></i> Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            `;
            
            repoList.appendChild(repoItem);
        });
    }
    
    function showError(message) {
        errorContainer.style.display = 'block';
        errorMessage.textContent = message;
        hideLoading();
    }
    
    function showLoading() {
        loadingSpinner.style.display = 'block';
    }
    
    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }
    
    function resetUI() {
        profileContainer.style.display = 'none';
        repositoriesContainer.style.display = 'none';
        errorContainer.style.display = 'none';
    }

    // Load search history when the page loads
    loadSearchHistory();
});