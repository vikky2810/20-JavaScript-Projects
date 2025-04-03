# Password Strength Checker

A simple web application that evaluates the strength of a password based on multiple criteria. The strength is visually represented using a progress bar, and the user receives real-time feedback. A toggle button allows users to show or hide the password.

## Features

- Evaluates password strength based on five key factors:
  - Minimum length of 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character
- Updates strength dynamically as the user types
- Displays real-time feedback with checkmarks and crossmarks for each requirement
- Progress bar visualization for password strength
- Toggle button to show/hide the password
- Simple and responsive UI

## Technologies Used

- HTML
- CSS
- JavaScript (DOM manipulation, event handling)

## Installation & Usage

Clone the repository:

```sh
git clone https://github.com/vikky2810/20-JavaScript-Projects.git
cd 5_Password_Strength_Checker
```

Open `index.html` in your browser.

## File Structure

```
password-strength-checker/
│-- index.html       # Main HTML file
│-- style.css        # Stylesheet for UI design
│-- main.js          # JavaScript logic for evaluating password strength
│-- README.md        # Project documentation (this file)
```

## How It Works

1. The user types a password in the input field.
2. The application evaluates the password based on five security criteria.
3. The progress bar updates dynamically based on the password's strength.
4. Icons indicate whether each password requirement is met.
5. Users can toggle password visibility using the eye icon.

## Demo

You can try the live demo [here](#). (Add a link to your hosted project if available.)

## Contributing

Feel free to contribute! You can:

- Improve the UI/UX
- Add more password security checks
- Enhance animations and styling
