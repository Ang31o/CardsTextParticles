import * as PIXI from "pixi.js";
import config from "../config";
import { Tween } from "@tweenjs/tween.js";
import { between } from "../utils/math";
import Card from "../prefabs/Card";
import BaseScene from "./BaseScene";
import Button from "../prefabs/Button";

export default class CardsDemo extends BaseScene {
  label = "CardsDemo";

  private background!: PIXI.Sprite;
  private cardsDeckContainer!: PIXI.Container<PIXI.ContainerChild>;
  private cards!: Card[];
  private cardSize!: { width: number; height: number };
  private flipButton!: Button;
  private cardsOpen = false;

  load() {
    this.addBackground();
  }

  async start() {
    super.start();
    this.addCardsDeck();
    this.addFlipButton();
    this.adjustCardsDeckContainerPosition();
    this.addEventListeners();
  }

  addBackground(): void {
    this.background = new PIXI.Sprite(PIXI.Assets.get("bg"));
    this.background.setSize(window.innerWidth, window.innerHeight);
    this.addChild(this.background);
  }

  addCardsDeck(): void {
    const cardTexture = PIXI.Assets.get("card-back");
    this.cardSize = { width: cardTexture.width, height: cardTexture.height };
    this.cards = [];
    this.cardsDeckContainer = new PIXI.Container({
      x: 0,
      y: 150,
      isRenderGroup: true,
    });
    for (let i = 0; i < config.cards.amount; i++) {
      const symbol = between(1, 14);
      const card = new Card(i * 5, 0, symbol === 11 ? 1 : symbol);
      this.cards.push(card);
      this.cardsDeckContainer.addChild(card);
    }
    this.addChild(this.cardsDeckContainer);
  }

  addFlipButton(): void {
    this.flipButton = new Button(
      window.innerWidth / 2,
      window.innerHeight * 0.9,
      "button",
      "Flip",
      this.onFlipButtonRelease,
      this
    );
    this.addChild(this.flipButton);
  }

  onFlipButtonRelease(): void {
    this.cardsOpen = !this.cardsOpen;
    for (let i = this.cards.length - 1; i >= 0; i--) {
      new Tween(this.cards[i])
        .onStart(() => this.cards[i].flipCardAnimation())
        .to(
          {
            y: 100 + this.cardSize.height,
          },
          2000
        )
        .delay(1000 * Math.abs(i - this.cards.length + 1))
        .start();
    }
  }

  adjustCardsDeckContainerPosition(): void {
    const scale = Math.min(
      window.innerWidth / this.cardsDeckContainer.width,
      1
    );
    this.cardsDeckContainer.scale.set(scale);
    const cardWidth = this.cardSize.width * scale;
    const x =
      window.innerWidth / 2 + cardWidth / 2 - this.cardsDeckContainer.width / 2;
    this.cardsDeckContainer.position.set(x, 150);
  }

  addEventListeners(): void {}

  onResize(width: number, height: number) {
    super.onResize(width, height);
    if (this.background) {
      this.background.setSize(width, height);
    }
    this.adjustCardsDeckContainerPosition();
    this.flipButton.position.set(
      window.innerWidth / 2,
      window.innerHeight * 0.9
    );
  }

  destroy(options?: PIXI.DestroyOptions): void {
    super.destroy(options);
    this.children.forEach((child) => child.destroy(options));
  }
}
