import * as PIXI from "pixi.js";
import Scene from "../core/Scene";
import Button from "../prefabs/Button";
import EventService from "../core/EventService";
import { Events } from "../enums/events";
import { GameState } from "../state/game-state";

export default class Menu extends Scene {
  label = "Menu";
  private menuLabel!: PIXI.Text;
  private buttonsContainer!: PIXI.Container<PIXI.ContainerChild>;
  private cardsDemoButton!: Button;
  private textDemoButton!: Button;
  private particlesDemoButton!: Button;

  async start() {
    GameState.init();
    this.addMenuLabel();
    this.addButtons();
    // window.g = this;
  }

  addMenuLabel(): void {
    this.menuLabel = new PIXI.Text({
      text: "Menu",
      style: {
        fontFamily: "Verdana",
        fontSize: 50,
        fill: "white",
      },
    });
    this.menuLabel.anchor.set(0.5);
    this.menuLabel.position.set(window.innerWidth / 2, 50);
    this.addChild(this.menuLabel);
  }

  addButtons(): void {
    this.buttonsContainer = new PIXI.Container({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    this.cardsDemoButton = new Button(
      0,
      -100,
      "button",
      "Cards",
      this.openCardsDemo
    );
    this.textDemoButton = new Button(0, 0, "button", "Text", this.openTextDemo);
    this.particlesDemoButton = new Button(
      0,
      100,
      "button",
      "Particles",
      this.openParticlesDemo,
      this
    );
    this.buttonsContainer.addChild(
      this.cardsDemoButton,
      this.textDemoButton,
      this.particlesDemoButton
    );
    this.addChild(this.buttonsContainer);
  }

  openCardsDemo(): void {
    EventService.emit(Events.OPEN_CARDS_DEMO);
  }

  openTextDemo(): void {
    EventService.emit(Events.OPEN_TEXT_DEMO);
  }

  openParticlesDemo(): void {
    EventService.emit(Events.OPEN_PARTICLES_DEMO);
  }

  onResize(width: number, height: number): void {
    this.menuLabel.x = width / 2;
    this.buttonsContainer.position.set(width / 2, height / 2);
  }

  destroy(options?: PIXI.DestroyOptions): void {
    super.destroy(options);
  }
}
