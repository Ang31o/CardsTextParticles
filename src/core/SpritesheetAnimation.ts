import { sound } from "@pixi/sound";
import * as PIXI from "pixi.js";

export default class SpritesheetAnimation extends PIXI.Container {
  animationTextures: Record<string, PIXI.AnimatedSprite["textures"]>;
  sprite?: PIXI.AnimatedSprite;
  speed = 1;

  animations = new Map<string, PIXI.AnimatedSprite>();

  currentAnimation: string | null = null;

  constructor(label: string, speed = 1) {
    super();

    this.speed = speed;
    this.animationTextures = PIXI.Assets.get(label).animations;
  }

  private initAnimation(anim: string) {
    const textures = this.animationTextures[anim];

    if (!textures) {
      console.error(`Animation ${anim} not found`);

      return;
    }

    const sprite = new PIXI.AnimatedSprite(textures);

    sprite.label = anim;
    sprite.anchor.set(0.5);
    sprite.animationSpeed = this.speed;

    return sprite;
  }

  play({
    anim,
    soundName,
    loop = false,
    speed = this.speed,
  }: {
    anim: string;
    soundName?: string;
    loop?: boolean;
    speed?: number;
  }) {
    if (this.sprite) {
      this.sprite.stop();

      this.removeChild(this.sprite);
    }

    this.sprite = this.animations.get(anim);

    if (!this.sprite) {
      this.sprite = this.initAnimation(anim);

      if (!this.sprite) return;

      this.animations.set(anim, this.sprite);
    }

    this.currentAnimation = anim;

    this.sprite.loop = loop;
    this.sprite.animationSpeed = speed;
    this.sprite.gotoAndPlay(0);

    if (soundName) sound.play(soundName);

    this.addChild(this.sprite);

    return new Promise<void>((resolve) => {
      if (!this.sprite) return resolve();

      this.sprite.onComplete = () => {
        this.currentAnimation = null;

        resolve();
      };
    });
  }
}
