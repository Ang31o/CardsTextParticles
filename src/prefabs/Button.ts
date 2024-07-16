import * as PIXI from "pixi.js";

export default class Button extends PIXI.Container {
  private background!: PIXI.Sprite;
  private text!: PIXI.Text;
  constructor(
    x: number,
    y: number,
    private buttonTexture: string = "button",
    private buttonLabel?: string,
    private onRelease?: (e?: any) => void,
    private onReleaseScope?: any
  ) {
    super({ x, y });
    this.init();
  }

  init(): void {
    this.addBackground();
    this.addText();
    this.interactive = true;
    this.cursor = "pointer";
    this.on("pointerup", this.onPointerUp, this);
  }

  addBackground(): void {
    this.background = new PIXI.Sprite(PIXI.Assets.get(this.buttonTexture));
    this.background.anchor.set(0.5);
    this.addChild(this.background);
  }

  addText(): void {
    if (this.buttonLabel) {
      this.text = new PIXI.Text({
        text: this.buttonLabel,
        style: {
          fontFamily: "Verdana",
          fontSize: 30,
          fill: "white",
          align: "center",
        },
      });
      this.text.anchor.set(0.5);
      this.addChild(this.text);
    }
  }

  setEnable(state: boolean): void {
    this.interactive = state;
    this.alpha = state ? 1 : 0.5;
  }

  onPointerUp(): void {
    if (this.onRelease) {
      this.onReleaseScope
        ? this.onRelease.call(this.onReleaseScope)
        : this.onRelease();
    }
  }

  destroy(options?: PIXI.DestroyOptions): void {
    this.off("pointerup", this.onPointerUp, this);
    this.children.forEach((child) => child.destroy(options));
    super.destroy(options);
  }
}
