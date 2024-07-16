import * as PIXI from "pixi.js";
import BaseScene from "./BaseScene";
import TextImageMixer from "../prefabs/TextImageMixer";
import { between } from "../utils/math";
import config from "../config";

export default class TextDemo extends BaseScene {
  label = "TextDemo";
  private background!: PIXI.Sprite;
  private textContainer!: PIXI.Container<PIXI.ContainerChild>;
  private generateInterval!: number;

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

  /**
   * Generates a random word using characters from a predefined charset array, based on the specified length.
   * The generated word may include emoticons, formatted in the `<emoticon1>` manner,
   * based on a probability defined in the configuration file.
   *
   * @param {number} length - The desired length of the generated word.
   * @returns {string} - A randomly generated word, potentially containing emoticons.
   */
  generateRandomWord(length: number): string {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomText = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      let randomLetter = charset[randomIndex];
      if (Math.random() < config.text.emoticonProbability) {
        randomLetter = `<emoticon${[between(1, 7)]}>`;
      }
      randomText += randomLetter;
    }

    return randomText;
  }

  /**
   * Creates a TextImageMixer instance with randomly generated text and styling.
   * If a random probability exceeds `config.text.priceProbability`, the text is a price (300 to 3,000,000) with a dollar sign.
   * Otherwise, the text is a random word (3 to 10 characters).
   * The font weight is "bolder" for prices and "normal" for random words.
   *
   * @returns {TextImageMixer} - An instance of TextImageMixer with the generated properties.
   */
  addTextImageMixer(): TextImageMixer {
    let text;
    const probability = Math.random();
    if (probability < config.text.priceProbability) {
      text = `${between(300, 3000000).toLocaleString("de-DE")}<dollar>`;
    } else {
      text = this.generateRandomWord(between(3, 10));
    }
    return new TextImageMixer(
      between(10, 50),
      probability < config.text.priceProbability ? "bolder" : "normal",
      text
    );
  }

  /**
   * Generates a new text container with 16 text-image mixers arranged in a grid.
   *
   * The container is destroyed if it exists, then recreated and populated with 16 instances of text-image mixers.
   * The mixers are positioned in a grid, 4 per row, with each new row starting at a new y-coordinate.
   * After positioning the mixers, the container's position is adjusted, and the container is added to the display list.
   *
   * @returns {void}
   */
  generateRandomText(): void {
    // Destroy container if it already exists
    this.textContainer?.destroy({ children: true });
    this.textContainer = new PIXI.Container();
    let x = 0;
    let y = 0;
    let wordsWidth = 0;
    const wordsCount = 8;
    const wordSpacing = 30;
    const lineSpacing = 80;
    const maxWordsWidth = 400;
    // Generate wordsCount (8) words with random characters and emoticons
    for (let i = 0; i < wordsCount; i++) {
      const word = this.addTextImageMixer();
      // If words width in total exceeds maxWordsWidth (400px) add next word in new line
      if (wordsWidth >= maxWordsWidth) {
        y += lineSpacing;
        x = 0;
        wordsWidth = 0;
      }
      // Sum the words width so it would know when to break in new line
      wordsWidth += word.width;
      word.position.set(x, y);
      x += word.width + wordSpacing;
      this.textContainer.addChild(word);
    }
    this.adjustTextContainerPosition();
    this.addChild(this.textContainer);
  }

  /**
   * Generate random text every 2 seconds.
   */
  addGenerateInterval(): void {
    this.generateInterval = setInterval(
      this.generateRandomText.bind(this),
      2000
    );
  }

  /**
   * Adjust text container size and position on resize() so the container would be visible
   */
  adjustTextContainerPosition(): void {
    const scale = Math.min(window.innerWidth / this.textContainer.width, 1);
    if (innerWidth <= this.textContainer.width) {
      this.textContainer.setSize(
        window.innerWidth,
        this.textContainer.height * scale
      );
    } else {
      this.textContainer.scale.set(1);
    }
    const x = window.innerWidth / 2 - this.textContainer.width / 2;
    this.textContainer.position.set(x, 150);
  }

  onResize(width: number, height: number) {
    super.onResize(width, height);
    if (this.background) {
      this.background.setSize(width, height);
    }
    this.adjustTextContainerPosition();
  }

  destroy(options?: PIXI.DestroyOptions): void {
    clearInterval(this.generateInterval);
    super.destroy(options);
  }
}
