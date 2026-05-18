import { Enemy } from './enemy.js';

export class TankEnemy extends Enemy {

  constructor(x, y) {

    super(x, y);

    this.speed = 70;

    this.radius = 26;

    this.health = 5;

    this.color = '#7c3aed';

  }

}