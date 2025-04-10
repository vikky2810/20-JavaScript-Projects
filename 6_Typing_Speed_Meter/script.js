document.addEventListener('DOMContentLoaded', () => {
  const textDisplay = document.getElementById('textDisplay');
  const textInput = document.getElementById('textInput');
  const startBtn = document.getElementById('startBtn');
  const timerElement = document.getElementById('timer');
  const wpmElement = document.getElementById('wpm');
  const accuracyElement = document.getElementById('accuracy');
  const errorsElement = document.getElementById('errors');
  
  let timer;
  let timeLeft = 60; // Default to 60-second test
  let isTestActive = false;
  let startTime;
  let wordIndex = 0;
  let errorCount = 0;
  let correctChars = 0;
  let totalChars = 0;
  let totalWordsTyped = 0; // Track total words across all texts
  let currentWord = '';
  let words = [];
  let restartBtn;
  let usedTexts = new Set(); // Track which texts have been used
  
  // Sample texts for typing practice
  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages.",
    "The sun peeked over the horizon, casting golden rays across the tranquil lake. Birds began their morning chorus as the world slowly awakened to a new day.",
    "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.",
    "Music is the art of arranging sounds in time through the elements of melody, harmony, rhythm, and timbre. It is one of the universal cultural aspects of all human societies.",
    "In the world of culinary arts, flavors and techniques from different cultures blend together to create innovative dishes that tantalize the taste buds and inspire the imagination.",
    "The ancient library contained scrolls that had been carefully preserved for centuries, each one holding knowledge that had survived the rise and fall of civilizations.",
    "Exercise increases endorphins, improves mood, boosts energy, enhances sleep quality, and contributes to overall health and longevity when practiced regularly.",
    "Sustainable development meets the needs of the present without compromising the ability of future generations to meet their own needs, balancing economic, environmental, and social factors.",
    "Photography is the art, application, and practice of creating durable images by recording light, either electronically or chemically, through a light-sensitive material such as photographic film."
  ];
  
  // Function to get a random text from sample texts
  function getRandomText() {
    // If all texts have been used, reset the tracking
    if (usedTexts.size >= sampleTexts.length) {
      usedTexts.clear();
    }
    
    // Get an unused text
    let availableTexts = sampleTexts.filter((_, index) => !usedTexts.has(index));
    let randomIndex = Math.floor(Math.random() * availableTexts.length);
    let selectedTextIndex = sampleTexts.indexOf(availableTexts[randomIndex]);
    
    // Mark this text as used
    usedTexts.add(selectedTextIndex);
    
    return sampleTexts[selectedTextIndex];
  }
  
  // Function to prepare the text display
  function prepareTextDisplay(text) {
    words = text.split(' ');
    textDisplay.innerHTML = '';
    
    words.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.innerHTML = word;
      wordSpan.id = `word-${index}`;
      
      if (index === 0) {
        wordSpan.classList.add('current-word');
        currentWord = word;
      }
      
      textDisplay.appendChild(wordSpan);
      
      // Add space after each word (except the last one)
      if (index < words.length - 1) {
        textDisplay.appendChild(document.createTextNode(' '));
      }
    });
    
    // Add cursor after the first word
    const firstWord = document.getElementById('word-0');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    firstWord.appendChild(cursor);
  }
  
  // Function to start the test
  function startTest() {
    if (isTestActive) return;
    
    isTestActive = true;
    startTime = new Date().getTime();
    timeLeft = 60;
    wordIndex = 0;
    errorCount = 0;
    correctChars = 0;
    totalChars = 0;
    totalWordsTyped = 0;
    usedTexts.clear();
    
    prepareTextDisplay(getRandomText());
    
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    startBtn.style.display = 'none';
    
    if (restartBtn) {
      restartBtn.style.display = 'none';
    }
    
    // Create restart button container if it doesn't exist
    if (!document.getElementById('restart-container')) {
      const restartContainer = document.createElement('div');
      restartContainer.id = 'restart-container';
      restartBtn = document.createElement('button');
      restartBtn.id = 'restartBtn';
      restartBtn.textContent = 'Restart Test';
      restartBtn.style.display = 'none';
      restartBtn.addEventListener('click', startTest);
      restartContainer.appendChild(restartBtn);
      startBtn.parentNode.insertBefore(restartContainer, startBtn.nextSibling);
    } else {
      restartBtn = document.getElementById('restartBtn');
    }
    
    // Update timer and check if time's up
    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      
      // Update WPM in real-time
      const elapsedTime = (new Date().getTime() - startTime) / 1000; // in seconds
      const currentWpm = Math.round(((totalWordsTyped + wordIndex) / elapsedTime) * 60);
      wpmElement.textContent = currentWpm;
      
      if (timeLeft <= 0) {
        endTest();
      }
    }, 1000);
  }
  
  // Function to end the test
  function endTest() {
    clearInterval(timer);
    isTestActive = false;
    textInput.disabled = true;
    
    // Calculate final statistics
    const elapsedTime = (new Date().getTime() - startTime) / 1000; // in seconds
    const wordsTyped = totalWordsTyped + wordIndex;
    const wpm = Math.round((wordsTyped / elapsedTime) * 60);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    // Update UI
    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy;
    errorsElement.textContent = errorCount;
    
    // Show buttons for a new test
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Start New Test';
    
    if (restartBtn) {
      restartBtn.style.display = 'inline-block';
    }
    
    // Add a completion message
    const completionMessage = document.createElement('div');
    completionMessage.style.margin = '20px 0';
    completionMessage.style.fontSize = '20px';
    completionMessage.style.fontWeight = 'bold';
    completionMessage.style.color = '#a6e3a1';
    completionMessage.textContent = `⏱️ Time's up! You typed ${wordsTyped} words in 60 seconds.`;
    
    textDisplay.parentNode.insertBefore(completionMessage, textDisplay.nextSibling);
    
    // Scroll to see the completion message
    completionMessage.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Function to generate a new text when current one is completed
  function generateNewText() {
    // Add current words to total
    totalWordsTyped += words.length;
    
    // Show a quick "New Text" notification
    const notification = document.createElement('div');
    notification.textContent = '✨ New text loaded!';
    notification.style.position = 'absolute';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(137, 180, 250, 0.9)';
    notification.style.color = '#1e1e2e';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '8px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '100';
    textDisplay.appendChild(notification);
    
    // Remove notification after a brief delay
    setTimeout(() => {
      notification.remove();
      
      // Load new text
      const text = getRandomText();
      prepareTextDisplay(text);
      wordIndex = 0;
      textInput.value = '';
      textInput.focus();
    }, 500);
  }
  
  // Handle input changes
  textInput.addEventListener('input', (e) => {
    if (!isTestActive) return;
    
    const inputText = e.target.value;
    const wordToMatch = words[wordIndex];
    
    // Check if the user has started typing a word
    if (inputText.length > 0) {
      totalChars++;
      
      // Check for errors
      if (wordToMatch.startsWith(inputText)) {
        correctChars++;
      } else {
        errorCount++;
      }
      
      // Update UI to show progress
      const currentWordElement = document.getElementById(`word-${wordIndex}`);
      currentWordElement.innerHTML = '';
      
      for (let i = 0; i < wordToMatch.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = wordToMatch[i];
        
        if (i < inputText.length) {
          if (inputText[i] === wordToMatch[i]) {
            charSpan.className = 'correct';
          } else {
            charSpan.className = 'incorrect';
          }
        }
        
        currentWordElement.appendChild(charSpan);
      }
      
      // Add cursor
      if (inputText.length < wordToMatch.length) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        currentWordElement.appendChild(cursor);
      }
      
      // Update accuracy in real-time
      const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
      accuracyElement.textContent = accuracy;
      errorsElement.textContent = errorCount;
    }
    
    // Check if the word is complete (space pressed)
    if (inputText.endsWith(' ')) {
      const typedWord = inputText.trim();
      
      // Check if the typed word matches the current word
      if (typedWord === wordToMatch) {
        document.getElementById(`word-${wordIndex}`).classList.remove('current-word');
        wordIndex++;
        
        if (wordIndex < words.length) {
          document.getElementById(`word-${wordIndex}`).classList.add('current-word');
          const newCurrentWord = document.getElementById(`word-${wordIndex}`);
          
          // Add cursor to the beginning of the next word
          const cursor = document.createElement('span');
          cursor.className = 'cursor';
          newCurrentWord.appendChild(cursor);
          
          // Clear input for next word
          textInput.value = '';
        } else {
          // Generate new text since user has completed all words
          generateNewText();
        }
      }
    }
    
    // Handle checking for last word (no space at the end)
    if (wordIndex === words.length - 1 && inputText === wordToMatch) {
      document.getElementById(`word-${wordIndex}`).classList.remove('current-word');
      wordIndex++;
      
      // Generate new text since all words are completed
      generateNewText();
    }
  });
  
  // Start the test when the start button is clicked
  startBtn.addEventListener('click', startTest);
  
  // Handle Restart button functionality
  if (restartBtn) {
    restartBtn.addEventListener('click', startTest);
  }
});
