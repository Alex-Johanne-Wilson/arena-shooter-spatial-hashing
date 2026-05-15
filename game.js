import { SpatialHashGrid } from './spatialHash.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Bullet } from './bullet.js';

import { Particle } from './particles.js';
import { FastEnemy } from './temp.js';
import { TankEnemy } from './temp2.js';

const input = {
  keys: new Set(),
  mouse: null
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const healthEl = document.getElementById('health');
const fpsEl = document.getElementById('fps');

const CELL_SIZE = 64;

const grid = new SpatialHashGrid(CELL_SIZE);

const player = new Player(
  canvas.width / 2,
  canvas.height / 2
);

const enemies = [];
const bullets = [];
const particles = [];

let score = 0;

let useSpatialHash = true;

let shakePower = 0;

let enemySpawnTimer = 0;
const enemySpawnInterval = 1.2;

let lastTime = performance.now();
let fps = 0;

window.addEventListener('keydown', (e) => {

  if (
    ['KeyW','KeyA','KeyS','KeyD','Space']
    .includes(e.code)
  ) {
    e.preventDefault();
  }

  input.keys.add(e.code);

  // Stress Test
  if (e.code === 'KeyB') {
    for (let i = 0; i < 500; i++) {
      spawnEnemy();
    }
  }

  // Toggle Hashing
  if (e.code === 'KeyH') {
    useSpatialHash = !useSpatialHash;
  }

  // Restart
  if (player.health <= 0 && e.code === 'KeyR') {
    location.reload();
  }

});

window.addEventListener('keyup', (e) => {
  input.keys.delete(e.code);
});

canvas.addEventListener('mousemove', (e) => {

  const r = canvas.getBoundingClientRect();

  input.mouse = {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top) * (canvas.height / r.height)
  };

});

window.addEventListener('blur', () => {
  input.keys.clear();
});

function triggerShake(power = 8) {
  shakePower = power;
}

function tryShoot() {

  if (
    input.keys.has('Space')
    && player.canShoot()
  ) {

    const mx =
      player.x + Math.cos(player.angle) * 18;

    const my =
      player.y + Math.sin(player.angle) * 18;

    bullets.push(
      new Bullet(mx, my, player.angle)
    );

    player.onShoot();
  }
}

function spawnEnemy() {

  const w = canvas.width;
  const h = canvas.height;

  const side = Math.floor(Math.random() * 4);

  let x = 0;
  let y = 0;

  if (side === 0) {
    x = Math.random() * w;
    y = -20;
  }
  else if (side === 1) {
    x = w + 20;
    y = Math.random() * h;
  }
  else if (side === 2) {
    x = Math.random() * w;
    y = h + 20;
  }
  else {
    x = -20;
    y = Math.random() * h;
  }

  const roll = Math.random();

  if (score > 40 && roll < 0.15) {
    enemies.push(new TankEnemy(x, y));
  }
  else if (score > 15 && roll < 0.45) {
    enemies.push(new FastEnemy(x, y));
  }
  else {
    enemies.push(new Enemy(x, y));
  }

}

function circleCircle(a, b) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  const r = a.radius + b.radius;

  return dx * dx + dy * dy <= r * r;
}

function bulletHitsEnemy(b, e) {

  return circleCircle(
    {
      x: b.x,
      y: b.y,
      radius: 6
    },
    e
  );

}

function drawGrid() {

  ctx.save();

  ctx.strokeStyle = '#1e2633';
  ctx.lineWidth = 1;

  for (
    let x = 0;
    x <= canvas.width;
    x += CELL_SIZE
  ) {

    ctx.beginPath();

    ctx.moveTo(x + 0.5, 0);

    ctx.lineTo(
      x + 0.5,
      canvas.height
    );

    ctx.stroke();
  }

  for (
    let y = 0;
    y <= canvas.height;
    y += CELL_SIZE
  ) {

    ctx.beginPath();

    ctx.moveTo(0, y + 0.5);

    ctx.lineTo(
      canvas.width,
      y + 0.5
    );

    ctx.stroke();
  }

  ctx.restore();
}

function drawHUD() {

  scoreEl.textContent =
    `Score: ${score}`;

  const hearts =
    '❤'.repeat(player.health)
    +
    '♡'.repeat(
      player.healthMax - player.health
    );

  healthEl.textContent =
    `Health: ${hearts}`;

  fpsEl.textContent =
  `FPS: ${Math.round(fps)}
   | Enemies: ${enemies.length}
   | Bullets: ${bullets.length}
   | Hash: ${useSpatialHash ? 'ON' : 'OFF'}`;
}

function update(dt) {

  player.update(dt, input, canvas);

  tryShoot();

  for (const e of enemies) {
    e.update(dt, player);
  }

  for (const b of bullets) {
    b.update(dt, canvas);
  }

  for (const p of particles) {
    p.update(dt);
  }

  let p = particles.length;

  while (p--) {

    if (particles[p].life <= 0) {
      particles.splice(p, 1);
    }

  }

  grid.clear();

  grid.insert(
    player,
    player.getAABB()
  );

  for (const e of enemies) {
    grid.insert(e, e.getAABB());
  }

  for (const b of bullets) {
    grid.insert(b, b.getAABB());
  }

  // COLLISIONS

  if (useSpatialHash) {

    for (const b of bullets) {

      if (b.isDead) continue;

      const near =
        grid.retrieve(b.getAABB());

      for (const obj of near) {

        if (
          obj === b
          ||
          !(obj instanceof Enemy)
        ) continue;

        if (bulletHitsEnemy(b, obj)) {

  b.isDead = true;

  obj.damage(1);

  if (obj.isDead) {

    triggerShake(5);

    for (let i = 0; i < 12; i++) {

      particles.push(
        new Particle(
          obj.x,
          obj.y,
          obj.color
        )
      );

    }

    score += 1;

  }

  break;
}
      }
    }

  }
  else {

    for (const b of bullets) {

      for (const e of enemies) {

        if (bulletHitsEnemy(b, e)) {

          b.isDead = true;
          e.isDead = true;

          score++;

        }

      }

    }

  }

  const aroundPlayer =
    grid.retrieve(player.getAABB());

  for (const obj of aroundPlayer) {

    if (
      obj instanceof Enemy
      &&
      !obj.isDead
    ) {

      if (circleCircle(obj, player)) {

        player.damage(1);

        triggerShake(10);

        obj.damage(1);
      }

    }

  }

  let i = enemies.length;

  while (i--) {

    if (enemies[i].isDead) {
      enemies.splice(i, 1);
    }

  }

  i = bullets.length;

  while (i--) {

    if (bullets[i].isDead) {
      bullets.splice(i, 1);
    }

  }

  enemySpawnTimer -= dt;

  if (enemySpawnTimer <= 0) {

    spawnEnemy();

    enemySpawnTimer = Math.max(
      0.5,
      enemySpawnInterval
      *
      (0.98 ** (score / 5))
    );

  }

}

function render() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.save();

  if (shakePower > 0) {

    ctx.translate(
      (Math.random() - 0.5)
      * shakePower,

      (Math.random() - 0.5)
      * shakePower
    );

    shakePower *= 0.9;

    if (shakePower < 0.5) {
      shakePower = 0;
    }

  }

  drawGrid();

  for (const p of particles) {
    p.draw(ctx);
  }

  for (const b of bullets) {
    b.draw(ctx);
  }

  for (const e of enemies) {
    e.draw(ctx);
  }

  player.draw(ctx);

  ctx.restore();
}

function loop(now) {

  const dt = Math.min(
    0.033,
    (now - lastTime) / 1000
  );

  lastTime = now;

  const inst = 1 / (dt || 1/60);

  fps =
    0.9 * fps
    +
    0.1 * inst;

  update(dt);

  render();

  drawHUD();

  if (player.health <= 0) {

    gameOverScreen();

    return;
  }

  requestAnimationFrame(loop);
}

function gameOverScreen() {

  ctx.save();

  ctx.fillStyle =
    'rgba(0,0,0,0.55)';

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = '#e6edf3';

  ctx.textAlign = 'center';

  ctx.font =
    'bold 42px system-ui';

  ctx.fillText(
    'Game Over',
    canvas.width / 2,
    canvas.height / 2 - 10
  );

  ctx.font =
    'bold 22px system-ui';

  ctx.fillText(
    `Final Score: ${score}`,
    canvas.width / 2,
    canvas.height / 2 + 24
  );

  ctx.fillText(
    'Press R to Restart',
    canvas.width / 2,
    canvas.height / 2 + 60
  );

  ctx.restore();
}

requestAnimationFrame(loop);