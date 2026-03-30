const button = document.querySelector('button');
const emojiBox = document.querySelector('.emoji-box');

const emojis = [
    '🦄', '🌈', '✨', '🌟', '💫', '⭐', '🔥', '💖', '🎉', '🎊',
    '🚀', '🎮', '🎨', '🎯', '🏆', '💎', '👑', '🦋', '🐱', '🐶',
    '🐼', '🦊', '🦁', '🐸', '🐙', '🦖', '🦕', '🐳', '🐬', '🦈',
    '🌸', '🌺', '🌻', '🌼', '🍀', '🌙', '☀️', '🌊', '❄️', '🔮',
    '🍕', '🍦', '🍩', '🍪', '🎂', '🍭', '🍬', '🧁', '🍿', '🥤',
    '⚽', '🏀', '🎸', '🎹', '🎤', '🎧', '🎬', '📸', '🎁', '💝'
];

button.addEventListener('click', () => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    emojiBox.innerHTML = randomEmoji;
    emojiBox.classList.add('magic');
    
    setTimeout(() => {
        emojiBox.classList.remove('magic');
    }, 700);
});
