# 🌻 Garden Walk Game

A charming 2D garden exploration game where you control a character walking through a beautiful garden and collecting flowers!

## Features

- **Simple Controls**: Use arrow keys or WASD to move around the garden
- **Flower Collection**: Press Space to collect flowers within your pickup radius
- **Visual Feedback**: See a golden circle around your character showing the pickup range
- **Infinite Exploration**: Flowers respawn as you collect them, keeping the garden always full
- **Beautiful Graphics**: Hand-drawn style graphics with animated particles when collecting flowers
- **Score Tracking**: Keep track of how many flowers you've collected

## How to Play

1. Open `index.html` in your web browser
2. Use **Arrow Keys** or **WASD** to move your character through the garden
3. Move close to flowers and press **Space** to collect them
4. Watch your score increase as you gather flowers
5. Enjoy exploring the peaceful garden!

## Controls

- **↑ W** - Move Up
- **↓ S** - Move Down
- **← A** - Move Left
- **→ D** - Move Right
- **Space** - Pick up flowers

## Technical Details

- Built with **Phaser 3** game framework
- Procedurally generated garden with random flower spawning
- Physics-based player movement with smooth controls
- Dynamic particle effects for flower collection
- Responsive canvas sizing

## Game Mechanics

- **Pickup Radius**: Stand within 80 pixels of a flower to collect it
- **Auto-spawning**: New flowers appear to keep the count around 15
- **Score System**: Each collected flower increases your score by 1

## Customization

You can modify various parameters in `game.js`:
- `pickupRadius`: Change how close you need to be to collect flowers
- `speed`: Adjust player movement speed
- `flowers count`: Modify the number of flowers in the garden

## Installation

Simply clone or download this repository and open `index.html` in any modern web browser. No additional installation required!

```bash
git clone https://github.com/meerabcl/garden-walk-game.git
cd garden-walk-game
# Open index.html in your browser
```

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- WebGL (with Canvas fallback)
- JavaScript ES6+

Enjoy your peaceful garden walk! 🌺🌸🌼
