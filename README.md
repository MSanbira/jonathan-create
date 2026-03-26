# ⚡ Electric Shooting Gallery ⚡

## What is this game?

This is a fun shooting game where you zap targets with electric balls! You control a cool electric gun at the bottom of the screen and try to hit all the moving targets.

## How to Play

1. **Open the game** - Double-click the `index.html` file to open it in your web browser
2. **Aim** - Move your mouse around and watch the gun follow it!
3. **Shoot** - Click anywhere to fire an electric ball
4. **Hit targets** - Try to zap the ducks, robots, and bullseyes before they get away!
5. **Score points** - Every target you hit gives you 10 points!

## The Targets

- 🎯 **Bullseyes** - Colorful circles that bounce around
- 🦆 **Ducks** - They fly across the screen with flapping wings
- 🤖 **Robots** - Metal robots with glowing eyes that float around

## How the Game Works (The Magic Behind It!)

The game is made of 3 files that work together like a team:

### 1. `index.html` - The Skeleton 🦴
This file is like the bones of the game. It sets up the page and tells the browser "Hey, we need a place to draw our game!"

### 2. `style.css` - The Paint 🎨
This file makes everything look pretty! It adds:
- The dark space background
- Glowing blue colors
- The cool title at the top

### 3. `game.js` - The Brain 🧠
This is where all the fun stuff happens! It tells the computer:
- How to draw the gun, targets, and electric balls
- How to make things move around
- What happens when an electric ball hits a target (BOOM! 💥)
- How to keep track of your score

## How Drawing Works

The game draws everything really fast - like a flipbook! It draws the whole picture about 60 times every second. That's so fast your eyes think everything is moving smoothly!

1. Clear the screen (like erasing a whiteboard)
2. Draw the gun pointing at your mouse
3. Draw all the targets
4. Draw all the electric balls flying through the air
5. Draw any explosions
6. Do it all again... and again... and again!

## The Electric Balls ⚡

When you click, the game:
1. Figures out where your mouse is pointing
2. Creates a new electric ball at the tip of the gun
3. Sends it flying toward where you clicked
4. The ball has little lightning bolts dancing around it!

## Collision Detection (Did I Hit It?)

The game is always checking: "Is any electric ball touching any target?"

It measures the distance between them. If they're close enough to be touching, that means you got a hit! Then:
- The target disappears
- Colorful particles explode everywhere
- You get 10 points!

---

**Made with ❤️ by Jonathan and Dad**
