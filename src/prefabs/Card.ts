import { Tween } from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";
import { GameState } from "../state/game-state";

export default class Card extends PIXI.Container {
  private backSprite!: PIXI.Sprite;
  private frontSprite!: PIXI.Sprite;
  constructor(
    x: number,
    y: number,
    public symbol: number,
    public isOpen?: boolean,
    public isDeck?: boolean
  ) {
    super({ x, y });
    this.init();
  }

  init(): void {
    this.addBackSprite();
    this.addFrontSprite();
  }

  addBackSprite(): void {
    this.backSprite = new PIXI.Sprite(PIXI.Assets.get("card-back"));
    this.backSprite.anchor.set(0.5);
    this.addChild(this.backSprite);
  }

  addFrontSprite(): void {
    this.frontSprite = new PIXI.Sprite(PIXI.Assets.get(`card${this.symbol}`));
    this.frontSprite.anchor.set(0.5);
    this.frontSprite.scale.set(0, 1);
    this.addChild(this.frontSprite);
  }

  flipCardAnimation(): void {
    this.parent?.setChildIndex(this, this.parent.children.length - 1);
    if (!this.isOpen) {
      const flipBack = new Tween(this.backSprite.scale).to({ x: 0 }, 500);
      const flipFront = new Tween(this.frontSprite.scale).to({ x: 1 }, 500);
      flipBack.chain(flipFront).start();
      this.isOpen = true;
    } else {
      const flipFront = new Tween(this.frontSprite.scale).to({ x: 0 }, 500);
      const flipBack = new Tween(this.backSprite.scale).to({ x: 1 }, 500);
      flipFront.chain(flipBack).start();
      this.isOpen = false;
    }
  }

  flyToMainCardAnimation(): void {
    this.parent.setChildIndex(this, this.parent.children.length - 1);
    new Tween(this)
      .to(
        {
          x: GameState.mainCardPosition.x,
          y: GameState.mainCardPosition.y,
          rotation: Math.PI,
        },
        500
      )
      .onComplete(() => {
        if (this.isDeck) {
          this.isDeck = false;
        }
        GameState.mainCardSymbol = this.symbol;
      })
      .start();
  }

  onPointerUp(): void {
    if (
      this.isOpen &&
      (this.symbol === GameState.mainCardSymbol - 1 ||
        this.symbol === GameState.mainCardSymbol + 1)
    ) {
      this.flyToMainCardAnimation();
    } else if (this.isDeck) {
      this.flipCardAnimation();
      this.flyToMainCardAnimation();
    }
  }
}
