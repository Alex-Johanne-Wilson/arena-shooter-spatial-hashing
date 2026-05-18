import { Enemy } from './enemy.js';

export class FastEnemy extends Enemy {

  constructor(x, y) {

    super(x, y);

    this.speed = 260;

    this.radius = 8;

    this.health = 1;

    this.color = '#f97316';

  }

}