export class Enemy {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.radius = 12;

    this.speed =
      120 + Math.random() * 60;

    this.color = '#ef4444';

    this.health = 1;

    this.isDead = false;

  }

  getAABB() {

    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      w: this.radius * 2,
      h: this.radius * 2
    };

  }

  damage(amount = 1) {

    this.health -= amount;

    if (this.health <= 0) {
      this.isDead = true;
    }

  }

  update(dt, player) {

    const dx = player.x - this.x;
    const dy = player.y - this.y;

    const len = Math.hypot(dx, dy) || 1;

    this.x +=
      (dx / len)
      *
      this.speed
      *
      dt;

    this.y +=
      (dy / len)
      *
      this.speed
      *
      dt;

  }

  draw(ctx) {

    ctx.save();

    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    ctx.fillStyle = this.color;

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // HEALTH BAR

    const barWidth = 30;
    const barHeight = 4;

    ctx.fillStyle = '#111827';

    ctx.fillRect(
      this.x - barWidth / 2,
      this.y - this.radius - 12,
      barWidth,
      barHeight
    );

    ctx.fillStyle = '#22c55e';

    ctx.fillRect(
      this.x - barWidth / 2,
      this.y - this.radius - 12,
      (this.health / 5) * barWidth,
      barHeight
    );

    ctx.restore();

  }

}