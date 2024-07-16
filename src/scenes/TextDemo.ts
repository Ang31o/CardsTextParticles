import * as PIXI from "pixi.js";
import BaseScene from "./BaseScene";
import TextImageMixer from "../prefabs/TextImageMixer";
import { between } from "../utils/math";

export default class TextDemo extends BaseScene {
  label = "TextDemo";

  private background!: PIXI.Sprite;
  private textContainer!: PIXI.Container<PIXI.ContainerChild>;

  load() {
    this.addBackground();
  }

  async start() {
    super.start();
    this.generateRandomText();
    this.addGenerateInterval();
  }

  addBackground(): void {
    this.background = new PIXI.Sprite(PIXI.Assets.get("bg"));
    this.background.setSize(window.innerWidth, window.innerHeight);
    this.addChild(this.background);
  }

  generateRandomWord(length: number): string {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomText = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      let randomLetter = charset[randomIndex];
      if (Math.random() > 0.7) {
        randomLetter = `<emoticon${[between(1, 7)]}>`;
      }
      randomText += randomLetter;
    }

    return randomText;
  }

  addTextImageMixer(): TextImageMixer {
    let text;
    const probability = Math.random();
    if (probability > 0.7) {
      text = `${between(300, 3000000).toLocaleString("de-DE")}<dollar>`;
    } else {
      text = this.generateRandomWord(between(3, 10));
    }
    return new TextImageMixer(
      0,
      0,
      between(10, 50),
      probability > 0.7 ? "bolder" : "normal",
      text
    );
  }

  generateRandomText(): void {
    this.textContainer?.destroy();
    this.textContainer = new PIXI.Container();
    let x = 0;
    let y = 0;
    for (let i = 0; i < 16; i++) {
      const word = this.addTextImageMixer();
      if (i % 4 === 0) {
        y += 80;
        x = 0;
      }
      word.position.set(x, y);
      x += word.width + 30;
      this.textContainer.addChild(word);
    }
    this.adjustCardsDeckContainerPosition();
    this.addChild(this.textContainer);
  }

  addGenerateInterval(): void {
    setInterval(this.generateRandomText.bind(this), 2000);
  }

  adjustCardsDeckContainerPosition(): void {
    const scale = Math.min(window.innerWidth / this.textContainer.width, 1);
    this.textContainer.scale.set(scale);
    const x = window.innerWidth / 2 - this.textContainer.width / 2;
    this.textContainer.position.set(x, 150);
  }

  addEventListeners(): void {}

  onResize(width: number, height: number) {
    super.onResize(width, height);
    if (this.background) {
      this.background.setSize(width, height);
    }
    this.adjustCardsDeckContainerPosition();
  }

  destroy(options?: PIXI.DestroyOptions): void {
    super.destroy(options);
    this.children.forEach((child) => child.destroy(options));
  }
}
