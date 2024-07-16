import * as PIXI from "pixi.js";
import Stats from "stats.js";
import Scene from "../core/Scene";
import Button from "../prefabs/Button";
import EventService from "../core/EventService";
import { Events } from "../enums/events";

/**
 * This is the BaseScene which all other game scene extends,
 * Currently it has common things that every scene would need like
 * FPSMeter and ReturnButton to return to the Menu scene
 */
export default class BaseScene extends Scene {
  label = "BaseScene";
  private returnButton!: Button;
  private stats!: Stats;

  async start() {
    this.addReturnButton();
    this.addFPSMeter();
  }

  addFPSMeter(): void {
    if (this.stats) return;
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  addReturnButton(): void {
    this.returnButton = new Button(
      window.innerWidth * 0.9,
      window.innerHeight * 0.9,
      "button-return",
      "",
      this.openMenu
    );
    this.addChild(this.returnButton);
  }

  openMenu(): void {
    EventService.emit(Events.OPEN_MENU);
  }

  onResize(width: number, height: number): void {
    this.returnButton.position.set(width * 0.9, height * 0.9);
  }

  update(delta: number): void {
    if (super.update) super.update(delta);
    this.stats.update();
  }
}
