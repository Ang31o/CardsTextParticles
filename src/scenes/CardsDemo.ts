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
  }

  addBackground(): void {
    this.background = new PIXI.Sprite(PIXI.Assets.get("bg"));
    this.background.setSize(window.innerWidth, window.innerHeight);
    this.addChild(this.background);
  }

  /**
   * Adds predefined amount cards which are back faced.
   * Amount of cards can be changed in game's config file.
   */
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
      const card = new Card(i * 2, 0, symbol === 11 ? 1 : symbol);
      this.cards.push(card);
      this.cardsDeckContainer.addChild(card);
    }
    this.addChild(this.cardsDeckContainer);
  }

  /**
   * Adds flip button which is used to start flipping cards animation
   */
  addFlipButton(): void {
    this.flipButton = new Button(
      window.innerWidth / 2,
      700,
      "button",
      "Flip",
      this.onFlipButtonRelease,
      this
    );
    this.addChild(this.flipButton);
  }

  /**
   * Flip cards to front or to back
   */
  onFlipButtonRelease(): void {
    this.flipButton.setEnable(false);
    this.cardsOpen ? this.flipToBack() : this.flipToFront();
    this.cardsOpen = !this.cardsOpen;
  }

  /**
   * Flips the cards in desired way (facing front or back) and fly's them to new position
   * @param card Card game object
   * @param y final card's y position
   * @param rotation final card's rotation
   * @param isFlipButtonEnable should flip button be enabled
   * @param delay tween's start delay
   */
  flipAnimation(
    card: Card,
    y: number,
    rotation: number,
    isFlipButtonEnable: boolean,
    delay: number
  ): void {
    if (card.destroyed) return;
    new Tween(card)
      .onStart(() => card.flipCardAnimation())
      .to(
        {
          y,
          rotation,
        },
        2000
      )
      .onComplete(() => {
        this.flipButton.setEnable(isFlipButtonEnable);
      })
      .delay(delay)
      .start();
  }

  /**
   * Flip the card to front face
   */
  flipToFront(): void {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      const card = this.cards[i];
      const y = 100 + this.cardSize.height;
      const rotation = Math.PI;
      const enableFlipButton = i === 0;
      const delay = 1000 * Math.abs(i - this.cards.length + 1);
      this.flipAnimation(card, y, rotation, enableFlipButton, delay);
    }
  }

  /**
   * Flip the card to back face
   */
  flipToBack(): void {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const y = 0;
      const rotation = 0;
      const enableFlipButton = i === this.cards.length - 1;
      const delay = 1000 * i;
      this.flipAnimation(card, y, rotation, enableFlipButton, delay);
    }
  }

  /**
   * Adjust cards deck container size and position on resize() so the container would be visible
   */
  adjustCardsDeckContainerPosition(): void {
    const scale = Math.min(
      window.innerWidth / this.cardsDeckContainer.width,
      1
    );
    if (window.innerWidth <= this.cardsDeckContainer.width) {
      this.cardsDeckContainer.setSize(
        window.innerWidth,
        this.cardsDeckContainer.height * scale
      );
    } else {
      this.cardsDeckContainer.scale.set(1);
    }
    const cardWidth = this.cardSize.width * scale;
    const x =
      window.innerWidth / 2 + cardWidth / 2 - this.cardsDeckContainer.width / 2;
    this.cardsDeckContainer.position.set(x, 150);
  }

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
}
