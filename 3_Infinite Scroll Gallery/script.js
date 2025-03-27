document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery");
    const loading = document.getElementById("loading");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const observerTarget = document.getElementById("observer");

    const scrollToTopButton = document.getElementById("scrollToTop");


    let isLoading = false; // Prevent multiple requests
    let imageCount = 0;

    // Load theme from localStorage
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        themeIcon.src = "moon.png";
    }

    
    window.addEventListener("scroll", () => {
        scrollToTopButton.style.display = window.scrollY > 50 ? "block" : "none";
    });

    scrollToTopButton.addEventListener("click", () => {
        smoothScrollToTop();
    });

    
    function smoothScrollToTop() {
        const startPosition = window.scrollY;
        const duration = 800; // Adjust time in ms for smoother effect
        let startTime = null;

        function animationStep(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            const ease = easeOutQuad(progress, startPosition, -startPosition, duration);
            window.scrollTo(0, ease);

            if (progress < duration) {
                requestAnimationFrame(animationStep);
            }
        }

        function easeOutQuad(t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        }

        requestAnimationFrame(animationStep);
    }

    // Theme toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode);
        themeIcon.src = isDarkMode ? "moon.png" : "sun.png";
        themeToggle.style.backgroundColor = isDarkMode ? "#f1c40f" : "white";
    });

    // Function to fetch and load images
    async function fetchImages() {
        if (isLoading) return;
        isLoading = true;
        loading.style.display = "block";

        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                const imgElement = document.createElement("img");
                imgElement.src = `https://picsum.photos/200/300?random=${imageCount}`;
                imgElement.loading = "lazy"; // Optimize performance
                gallery.appendChild(imgElement);
                imageCount++; 
            }
            loading.style.display = "none";
            isLoading = false;
        }, 1000);
    }

    // Intersection Observer for infinite scrolling
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading) {
            fetchImages();
        }
    }, { threshold: 1.0 });

    observer.observe(observerTarget);
    fetchImages();
});
