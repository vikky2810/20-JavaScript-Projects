// Get references to the input field and progress bar
const passwordInput = document.getElementById('password');
const progressBar = document.getElementById('progress-bar');

// Function to evaluate password strength
function evaluatePasswordStrength(password) {
    let strength = 0;

    // Check password length
    if (password.length >= 8) {
        strength++;
        document.getElementById('1').innerHTML = `<i class="fa-solid fa-circle-check"></i>  At least 8 characters`;
    } else {
        document.getElementById('1').innerHTML = `<i class="fa-solid fa-circle-xmark"></i>  At least 8 characters`;
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
        strength++;
        document.getElementById('2').innerHTML = `<i class="fa-solid fa-circle-check"></i>  At least one uppercase letter`;
    } else {
        document.getElementById('2').innerHTML = `<i class="fa-solid fa-circle-xmark"></i>  At least one uppercase letter`;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
        strength++;
        document.getElementById('3').innerHTML = `<i class="fa-solid fa-circle-check"></i>  At least one lowercase letter`;
    } else {
        document.getElementById('3').innerHTML = `<i class="fa-solid fa-circle-xmark"></i>  At least one lowercase letter`;
    }

    // Check for digits
    if (/\d/.test(password)) {
        strength++;
        document.getElementById('4').innerHTML = `<i class="fa-solid fa-circle-check"></i>  At least one digit`;
    } else {
        document.getElementById('4').innerHTML = `<i class="fa-solid fa-circle-xmark"></i>  At least one digit`;
    }

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
        strength++;
        document.getElementById('5').innerHTML = `<i class="fa-solid fa-circle-check"></i>  At least one special character`;
    } else {
        document.getElementById('5').innerHTML = `<i class="fa-solid fa-circle-xmark"></i>  At least one special character`;
    }

    return strength; // Now strength will always be in the range [0, 5]
}


// Event listener for password input
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = evaluatePasswordStrength(password);
    const strengthPercent = (strength / 5) * 100;

    // Update progress bar width and class based on strength
    progressBar.style.width = strengthPercent + '%';
    if (strength === 0) {
        progressBar.className = 'progress-bar strength-very-weak';
        document.getElementById('strength-text').innerHTML = `Password Strength: ` + "Very Weak";
    } else if (strength === 1) {
        progressBar.className = 'progress-bar strength-weak';
        document.getElementById('strength-text').innerHTML = `Password Strength: ` + "Weak";
    } else if (strength === 2) {
        progressBar.className = 'progress-bar strength-medium';
        document.getElementById('strength-text').innerHTML = `Password Strength: ` + "Medium";
    } else if (strength === 3) {
        progressBar.className = 'progress-bar strength-strong';
        document.getElementById('strength-text').innerHTML = `Password Strength: ` + "Strong";
    } else if (strength >= 4) {
        progressBar.className = 'progress-bar strength-very-strong';
        document.getElementById('strength-text').innerHTML = `Password Strength: ` + "Very Strong";
    }
});

const toggleButton = document.getElementById('toggle-password');
if (toggleButton) {
    toggleButton.addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        const passwordFieldType = passwordField.getAttribute('type');

        if (passwordFieldType === 'password') {
            passwordField.setAttribute('type', 'text');
            this.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`; // Show 'hide' icon
        } else {
            passwordField.setAttribute('type', 'password');
            this.innerHTML = `<i class="fa-solid fa-eye"></i>`; // Show 'show' icon
        }
    });
}


