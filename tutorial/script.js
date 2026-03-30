// ============================================
// HTML DEMO FUNCTIONS
// ============================================

// Things we can add to the HTML demo
const headings = [
    "Hello World!",
    "I Love Coding!",
    "Jonathan is Awesome!",
    "Web Pages are Fun!",
    "Look at Me!"
];

const paragraphs = [
    "This is a paragraph. Paragraphs hold text!",
    "HTML creates the structure of web pages.",
    "I'm learning to code and it's super cool!",
    "Every website uses HTML, CSS, and JavaScript.",
    "Practice makes perfect!"
];

const emojis = ["🚀", "🎮", "⭐", "🌈", "🦄", "🎨", "🏆", "💎", "🔥", "🎯"];

let htmlDemoCleared = false;

function addHeading() {
    const demo = document.getElementById('html-demo');
    clearPlaceholder(demo);
    
    const randomHeading = headings[Math.floor(Math.random() * headings.length)];
    const h1 = document.createElement('h1');
    h1.textContent = randomHeading;
    h1.style.animation = 'popIn 0.3s ease';
    demo.appendChild(h1);
}

function addParagraph() {
    const demo = document.getElementById('html-demo');
    clearPlaceholder(demo);
    
    const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    const p = document.createElement('p');
    p.textContent = randomParagraph;
    p.style.animation = 'popIn 0.3s ease';
    demo.appendChild(p);
}

function addImage() {
    const demo = document.getElementById('html-demo');
    clearPlaceholder(demo);
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const span = document.createElement('span');
    span.className = 'emoji-img';
    span.textContent = randomEmoji;
    span.style.animation = 'popIn 0.3s ease';
    demo.appendChild(span);
}

function clearPlaceholder(demo) {
    const placeholder = demo.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }
}

function clearHtmlDemo() {
    const demo = document.getElementById('html-demo');
    demo.innerHTML = '<p class="placeholder">👆 Click the buttons to add things here!</p>';
}

// ============================================
// CSS DEMO FUNCTIONS
// ============================================

const colors = {
    red: '#ff6b6b',
    blue: '#74b9ff',
    green: '#55efc4',
    yellow: '#ffeaa7',
    purple: '#a29bfe'
};

// Track current CSS values for live code display
let currentCss = {
    color: 'gray',
    colorName: 'gray',
    width: '150px',
    height: '150px',
    borderRadius: '10px'
};

function updateCssCodeDisplay() {
    const codeDisplay = document.getElementById('css-code-display');
    if (codeDisplay) {
        codeDisplay.innerHTML = `<span class="selector">.box</span> {
  <span class="property">background-color</span>: <span class="value">${currentCss.colorName}</span>;
  <span class="property">width</span>: <span class="value">${currentCss.width}</span>;
  <span class="property">height</span>: <span class="value">${currentCss.height}</span>;
  <span class="property">border-radius</span>: <span class="value">${currentCss.borderRadius}</span>;
}`;
        // Flash effect to show update
        codeDisplay.style.backgroundColor = '#2d3436';
        setTimeout(() => {
            codeDisplay.style.backgroundColor = '#1e272e';
        }, 150);
    }
}

function changeColor(color) {
    const target = document.getElementById('css-target');
    target.style.backgroundColor = colors[color];
    
    // Change text color for better contrast on light backgrounds
    if (color === 'yellow' || color === 'green') {
        target.style.color = '#333';
    } else {
        target.style.color = 'white';
    }
    
    // Update code display
    currentCss.color = colors[color];
    currentCss.colorName = color;
    updateCssCodeDisplay();
}

function changeSize(size) {
    const target = document.getElementById('css-target');
    
    switch(size) {
        case 'small':
            target.style.width = '80px';
            target.style.height = '80px';
            target.style.fontSize = '0.9em';
            currentCss.width = '80px';
            currentCss.height = '80px';
            break;
        case 'medium':
            target.style.width = '150px';
            target.style.height = '150px';
            target.style.fontSize = '1.2em';
            currentCss.width = '150px';
            currentCss.height = '150px';
            break;
        case 'big':
            target.style.width = '220px';
            target.style.height = '220px';
            target.style.fontSize = '1.6em';
            currentCss.width = '220px';
            currentCss.height = '220px';
            break;
    }
    updateCssCodeDisplay();
}

function changeShape(shape) {
    const target = document.getElementById('css-target');
    
    switch(shape) {
        case 'square':
            target.style.borderRadius = '0px';
            currentCss.borderRadius = '0px';
            break;
        case 'rounded':
            target.style.borderRadius = '20px';
            currentCss.borderRadius = '20px';
            break;
        case 'circle':
            target.style.borderRadius = '50%';
            currentCss.borderRadius = '50%';
            break;
    }
    updateCssCodeDisplay();
}

// ============================================
// JAVASCRIPT DEMO FUNCTIONS
// ============================================

// Counter
let count = 0;

function updateJsCodeDisplay() {
    const codeDisplay = document.getElementById('js-code-display');
    if (codeDisplay) {
        codeDisplay.innerHTML = `<span class="keyword">let</span> count = <span class="number">${count}</span>;

<span class="keyword">function</span> <span class="function">addOne</span>() {
  count = count + <span class="number">1</span>;
  <span class="comment">// count is now ${count + 1}</span>
}

<span class="keyword">function</span> <span class="function">sayHello</span>(name) {
  <span class="function">alert</span>(<span class="string">"Hello, "</span> + name);
}`;
        // Flash effect
        codeDisplay.style.backgroundColor = '#2d3436';
        setTimeout(() => {
            codeDisplay.style.backgroundColor = '#1e272e';
        }, 150);
    }
}

function addOne() {
    count++;
    updateCounter();
    updateJsCodeDisplay();
}

function subtractOne() {
    count--;
    updateCounter();
    updateJsCodeDisplay();
}

function resetCounter() {
    count = 0;
    updateCounter();
    updateJsCodeDisplay();
}

function updateCounter() {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = count;
    
    // Add a little animation
    counterElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        counterElement.style.transform = 'scale(1)';
    }, 100);
    
    // Change color based on value
    if (count > 0) {
        counterElement.style.color = '#00b894';
    } else if (count < 0) {
        counterElement.style.color = '#d63031';
    } else {
        counterElement.style.color = '#6c5ce7';
    }
}

// Magic Color Box
function magicColor() {
    const box = document.getElementById('magic-box');
    
    // Generate random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    // Random emoji
    const magicEmojis = ['✨', '🌟', '💫', '⭐', '🔮', '🪄', '💖', '🌈'];
    const randomEmoji = magicEmojis[Math.floor(Math.random() * magicEmojis.length)];
    
    box.style.backgroundColor = randomColor;
    box.textContent = randomEmoji;
    
    // Spin animation
    box.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        box.style.transform = 'rotate(0deg) scale(1)';
    }, 300);
}

// Say Hello
function sayHello() {
    const nameInput = document.getElementById('name-input');
    const greeting = document.getElementById('greeting');
    
    const name = nameInput.value.trim();
    
    if (name) {
        const greetings = [
            `Hello, ${name}! 👋`,
            `Hi there, ${name}! 🎉`,
            `Hey ${name}! You're awesome! 🌟`,
            `Welcome, ${name}! 🚀`,
            `Nice to meet you, ${name}! 😊`
        ];
        greeting.textContent = greetings[Math.floor(Math.random() * greetings.length)];
    } else {
        greeting.textContent = "Type your name first! 📝";
    }
    
    // Animate the greeting
    greeting.style.transform = 'scale(1.1)';
    setTimeout(() => {
        greeting.style.transform = 'scale(1)';
    }, 200);
}

// Allow Enter key to trigger sayHello
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sayHello();
            }
        });
    }
});

// ============================================
// ADD SOME CSS ANIMATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        70% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    #counter, .greeting, #magic-box {
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);
