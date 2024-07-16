import * as PIXI from "pixi.js";

export default class TextImageMixer extends PIXI.Container {
  private parts!: string[];

  constructor(
    private fontSize: number,
    private fontWeight: PIXI.TextStyleFontWeight,
    private imageTextString: string
  ) {
    super();
    this.init();
  }

  init(): void {
    this.parseImageText();
    this.addTextImage();
  }

  parseImageText(): void {
    const regex = /(<[^>]*>)/g;

    this.parts = this.imageTextString
      .split(regex)
      .filter((part) => part !== "");
  }

  addTextImage(): void {
    let x = 0;
    this.parts.forEach((part) => {
      if (part[0] !== "<") {
        const text = this.addText(part);
        text.x = x;
        x += text.width;
        this.addChild(text);
      } else {
        const sprite = this.addImage(part.slice(1, -1));
        sprite.x = x;
        x += sprite.width;
        this.addChild(sprite);
      }
    });
  }

  addText(str: string): PIXI.Text {
    const text = new PIXI.Text({
      text: str,
      style: {
        fontFamily: "verdana",
        fontWeight: this.fontWeight,
        fontSize: this.fontSize,
        fill: "black",
      },
    });
    text.anchor.set(0, 0.5);
    return text;
  }

  addImage(imageKey: string): PIXI.Sprite {
    const sprite = new PIXI.Sprite(PIXI.Assets.get(imageKey));
    sprite.anchor.set(0, 0.5);
    sprite.setSize(this.fontSize);
    return sprite;
  }
}
