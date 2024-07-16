import * as PIXI from "pixi.js";
import { between } from "../utils/math";

export default class FireSpark extends PIXI.Sprite {
  constructor(
    private speed: number,
    private maxHeight: number,
    private emissionWidth: number
  ) {
    super(PIXI.Assets.get("fire-spark"));
    this.resetValues();
  }

  init(): void {
    this.x = between(this.emissionWidth / -2, this.emissionWidth / 2);
    this.anchor.set(0.5);
    this.rotation = Math.random();
  }

  resetValues(): void {
    this.y = 0;
    this.x = between(this.emissionWidth / -2, this.emissionWidth / 2);
    this.alpha = 1;
    this.rotation = Math.random();
    this.scale.set(Math.random());
  }

  update(): void {
    if (this.y <= this.maxHeight) {
      this.resetValues();
    }
    this.alpha -= 0.01;
    this.y -= this.speed;
  }
}
