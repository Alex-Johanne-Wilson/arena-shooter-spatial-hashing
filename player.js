export class Player {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.angle = 0;

    this.speed = 280;

    this.radius = 16;

    this.color = '#59d0ff';

    this.healthMax = 3;
    this.health = 3;

    this.invulnTimer = 0;

    this.shootCooldown = 0;

  }

  getAABB() {

    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      w: this.radius * 2,
      h: this.radius * 2
    };

  }

  update(dt, input, canvas) {

    let dx = 0;
    let dy = 0;

    if (input.keys.has('KeyW')) dy -= 1;
    if (input.keys.has('KeyS')) dy += 1;
    if (input.keys.has('KeyA')) dx -= 1;
    if (input.keys.has('KeyD')) dx += 1;

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

    const pad = this.radius + 2;

    this.x = Math.max(
      pad,
      Math.min(
        canvas.width - pad,
        this.x
      )
    );

    this.y = Math.max(
      pad,
      Math.min(
        canvas.height - pad,
        this.y
      )
    );

    if (input.mouse) {

      const mx =
        input.mouse.x - this.x;

      const my =
        input.mouse.y - this.y;

      this.angle =
        Math.atan2(my, mx);

    }

    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
    }

    if (this.shootCooldown > 0) {
      this.shootCooldown -= dt;
    }

  }

  canShoot() {

    return this.shootCooldown <= 0;

  }

  onShoot() {

    this.shootCooldown = 0.15;

  }

  damage(n) {

    if (this.invulnTimer > 0) {
      return;
    }

    this.health = Math.max(
      0,
      this.health - n
    );

    this.invulnTimer = 0.8;

  }

  draw(ctx) {

    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rotate(this.angle);

    // Glow Effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    ctx.fillStyle =
      this.invulnTimer > 0
      ? '#eab308'
      : this.color;

    ctx.beginPath();

    ctx.moveTo(18, 0);

    ctx.lineTo(-12, -10);

    ctx.lineTo(-12, 10);

    ctx.closePath();

    ctx.fill();

    ctx.restore();

  }

}