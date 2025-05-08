# Movie Search App

A responsive web application that allows users to search for movies using the OMDB API. Built with vanilla JavaScript, HTML, and CSS.

## Features

- **Search Movies**: Search for movies by title
- **Movie Grid**: Display search results in a responsive grid layout
- **Movie Details**: View detailed information about each movie in a modal window
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Remembers your last search query
- **Loading States**: Visual feedback during API requests
- **Error Handling**: Clear error messages for failed requests
- **Keyboard Support**: Use Enter to search and Escape to close modals

## Tech Stack

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- OMDB API

## Getting Started

1. Clone this repository
2. Replace the `API_KEY` in index.html with your OMDB API key:
```javascript
const API_KEY = 'your_api_key_here';
```
3. Open index.html in a web browser

## API Configuration

This app uses the [OMDB API](https://www.omdbapi.com/). To use it:

1. Visit [OMDB API](https://www.omdbapi.com/apikey.aspx) to get your API key
2. Replace the placeholder API key in the code
3. Make sure your API key is valid and active

## Features in Detail

### Search Functionality
- Real-time search with error handling
- Search on Enter key press or button click
- Last search term saved in localStorage

### Movie Display
- Responsive grid layout
- Movie cards with hover effects
- Fallback images for missing posters

### Movie Details Modal
- Comprehensive movie information
- Rating display
- Cast and crew details
- Release information
- Responsive layout
- Click outside or press Escape to close

### UI/UX Features
- Loading spinner during API requests
- Error messages for failed requests
- No results handling
- Responsive design for all screen sizes
- Smooth animations and transitions

## CSS Variables

The app uses CSS variables for consistent theming:

```css
--primary-color: #032541
--secondary-color: #01b4e4
--text-color: #333
--background-color: #f5f5f5
--card-color: #fff
--error-color: #e74c3c
--shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
--rating-color: #f39c12
```

