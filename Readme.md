# Arena Shooter — Spatial Hashing Optimization Demo

A real-time 2D arena shooter built using JavaScript and HTML5 Canvas, featuring spatial hashing for optimized collision detection in dense combat scenarios.

---

## Overview

This project was developed as a performance-focused game development experiment to explore how Data Structures and Algorithms concepts can be applied in real-time systems.

The core focus of the project is collision optimization using spatial hashing, reducing unnecessary collision checks between bullets and enemies during gameplay.

---

## Features

- Real-time 2D combat system
- Spatial hashing collision optimization
- Toggleable collision systems
- Stress test mode
- Dynamic enemy spawning
- Multiple enemy types
- Health system
- Particle effects
- Screen shake effects
- FPS monitoring
- Modular architecture using ES Modules

---

## Technologies Used

- JavaScript (ES6 Modules)
- HTML5 Canvas
- CSS3

---

## Performance Engineering

### Problem

Naive collision detection requires every projectile to check against every enemy.

Complexity:

```text
O(n²)
```

Where:
- n = number of entities

This becomes computationally expensive under high entity counts.

---

### Solution — Spatial Hashing

The game world is partitioned into fixed-size grid cells.

Entities are inserted into spatial buckets based on position, allowing collision checks to be performed only against nearby entities.

Optimized Complexity:

```text
O(n · k)
```

Where:
- n = total entities
- k = nearby entities per grid cell

This significantly reduces unnecessary collision checks and improves scalability during stress tests.

---

## Enemy Types

### Standard Enemy
- Balanced movement speed
- Basic chase behavior

### Fast Enemy
- High movement speed
- Lower size and survivability

### Tank Enemy
- Large health pool
- Slow movement speed
- Designed to absorb multiple hits

---

## Controls

| Key | Action |
|---|---|
| WASD | Move |
| Mouse | Aim |
| Space | Shoot |
| B | Spawn 500 enemies |
| H | Toggle spatial hashing |
| R | Restart game |

---

## Stress Test Mode

The project includes a benchmark mode for evaluating collision system scalability.

Press:

```text
B
```

to spawn hundreds of enemies simultaneously.

Use:

```text
H
```

to toggle between:
- Spatial hashing
- Brute-force collision detection

This allows direct FPS comparison between optimized and non-optimized collision systems.

---

## Project Structure

```text
arena-shooter/
│
├── index.html
├── style.css
├── game.js
├── player.js
├── enemy.js
├── fastEnemy.js
├── tankEnemy.js
├── bullet.js
├── particles.js
├── spatialHash.js
│
└── README.md
```

---

## Running The Project

Because the project uses ES Modules (`import/export`), it should be run using a local development server.

### Recommended

Use:
- VS Code Live Server Extension

Then open:

```text
index.html
```

---

## Future Improvements

- Object pooling
- QuadTree collision comparison
- Boss enemy system
- Dash mechanics
- Procedural waves
- Audio system
- Minimap
- Dynamic lighting
- ECS architecture
- Multiplayer support

---

## Screenshots

_Add gameplay screenshots or GIFs here._
![alt text](image.png)
---

## Learning Outcomes

This project helped reinforce concepts related to:

- Spatial partitioning
- Collision optimization
- Real-time rendering loops
- Game architecture
- Performance engineering
- Data structures in practical systems
- Object-oriented programming
- Delta-time based movement systems

---

## Author

Alex Johanne Wilson