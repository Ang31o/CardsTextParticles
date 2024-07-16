import * as PIXI from "pixi.js";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";

export default class Loading extends Scene {
  label = "Loading";
  private loadingText!: PIXI.Text;

  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Loading");

    this.loadingText = new PIXI.Text({
      text: "Loading...",
      style: {
        fontFamily: "Verdana",
        fontSize: 50,
        fill: "white",
      },
    });
    centerObjects(this.loadingText);
    this.addChild(this.loadingText);
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
  }
}
