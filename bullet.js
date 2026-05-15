export class Bullet {

  constructor(x, y, angle) {

    this.x = x;
    this.y = y;

    this.angle = angle;

    this.speed = 520;

    this.w = 10;
    this.h = 3;

    this.color = '#fde047';

    this.isDead = false;

  }

  getAABB() {

    const r = 6;

    return {
      x: this.x - r,
      y: this.y - r,
      w: r * 2,
      h: r * 2
    };

  }

  update(dt, canvas) {

    this.x +=
      Math.cos(this.angle)
      *
      this.speed
      *
      dt;

    this.y +=
      Math.sin(this.angle)
      *
      this.speed
      *
      dt;

    if (
      this.x < -20
      ||
      this.x > canvas.width + 20
      ||
      this.y < -20
      ||
      this.y > canvas.height + 20
    ) {

      this.isDead = true;

    }

  }

  draw(ctx) {

    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rotate(this.angle);

    // Glow
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#fde047';

    ctx.fillStyle = this.color;

    ctx.fillRect(
      -this.w * 0.2,
      -this.h / 2,
      this.w,
      this.h
    );

    ctx.restore();

  }

}