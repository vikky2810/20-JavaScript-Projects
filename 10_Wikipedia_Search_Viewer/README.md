# 🔍 Wikipedia Search Viewer

A modern Wikipedia search interface with dark mode support and real-time results.

## 🚀 Features
- Instant Wikipedia article search
- Clean and responsive card-based results
- Dark/Light mode with system preference detection
- Article previews with snippets
- Mobile-friendly design
- Search suggestions and error handling
- Persistent theme preferences

## 🛠️ Technologies Used
- Vanilla JavaScript for DOM manipulation
- Wikipedia API integration
- CSS3 with CSS Variables for theming
- LocalStorage for theme persistence
- Font Awesome icons
- Responsive design with media queries

## 📸 Screenshot
(Include a screenshot of your project here)

## 🔧 Installation
1. Clone this repository:
   ```bash
   git clone https
   cd wikipedia-search-viewer
   ```
2. Open `index.html` in your browser.

## 🏗️ Usage
- Type your search query in the search box
- Press Enter or click the search icon
- Results will appear as cards with:
  - Article title
  - Content snippet
  - "Read more" link
- Toggle dark/light mode using the moon/sun icon
- Click any result to open the full Wikipedia article

## 🔌 API Reference
This project uses the [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) for searching articles:
```javascript
https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&origin=*
```

---

📚 Happy searching and learning! 🎓