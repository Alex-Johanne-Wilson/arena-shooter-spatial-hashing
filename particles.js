export class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;

    this.vx = (Math.random() - 0.5) * 400;
    this.vy = (Math.random() - 0.5) * 400;

    this.life = 1;
    this.radius = 2 + Math.random() * 3;
    this.color = color;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.vx *= 0.96;
    this.vy *= 0.96;

    this.life -= dt * 2;
  }

  draw(ctx) {
    ctx.save();

    ctx.globalAlpha = Math.max(0, this.life);

    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}