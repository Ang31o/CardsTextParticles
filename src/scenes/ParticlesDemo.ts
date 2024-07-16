import * as PIXI from "pixi.js";
import BaseScene from "./BaseScene";
import { centerObjects } from "../utils/misc";
import { between } from "../utils/math";
import FireSpark from "../core/FireSpark";
import config from "../config";

export default class ParticlesDemo extends BaseScene {
  label = "ParticlesDemo";
  private fire!: PIXI.Sprite;
  private fireDisplacement!: PIXI.Sprite;
  private fireContainer!: PIXI.Container;
  private fireSparks!: FireSpark[];

  async start() {
    super.start();
    this.addFire();
    this.addParticles();
  }

  /**
   * Adds fire animation as a fire sprite with DisplacementFilter which is animated in update() method
   */
  addFire(): void {
    this.fireContainer = new PIXI.Container();
    this.fire = new PIXI.Sprite(PIXI.Assets.get("fire"));
    this.fire.anchor.set(0.5);
    this.fireDisplacement = new PIXI.Sprite(
      PIXI.Assets.get("fire-displacement")
    );
    this.fireDisplacement.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.fireDisplacement.anchor.set(0.5);

    const fireDisplacementFilter = new PIXI.DisplacementFilter({
      sprite: this.fireDisplacement,
      scale: { x: 10, y: 10 },
    });
    fireDisplacementFilter.padding = 10;
    this.fire.filters = [fireDisplacementFilter];
    this.fireContainer.addChild(this.fire, this.fireDisplacement);
    centerObjects(this.fireContainer);
    this.addChild(this.fireContainer);
  }

  /**
   * Adds fire sparks particles which fly's upward
   */
  addParticles(): void {
    this.fireSparks = [];
    for (let i = 0; i < config.particles.amount; i++) {
      const fireSpark = new FireSpark(
        between(2, 6),
        between(-150, -220),
        this.fire.width
      );
      this.fireSparks.push(fireSpark);
      this.fireContainer.addChild(fireSpark);
    }
  }

  onResize(width: number, height: number) {
    super.onResize(width, height);
    centerObjects(this.fireContainer);
  }

  update(delta: number): void {
    super.update(delta);
    this.fireDisplacement.x += 2;
    if (this.fireDisplacement.x > this.fireDisplacement.width) {
      this.fireDisplacement.x = 0;
    }
    for (let i = 0; i < this.fireSparks.length; i++) {
      this.fireSparks[i].update();
    }
  }
}
