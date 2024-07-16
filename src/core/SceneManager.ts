import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import Scene from "./Scene";
import AssetLoader from "./AssetLoader";

export interface SceneUtils {
  assetLoader: AssetLoader;
}

export default class SceneManager {
  private sceneConstructors = this.importScenes();
  public app!: PIXI.Application;
  private sceneInstances = new Map<string, Scene>();
  private currentScene?: Scene;

  constructor() {
    this.init();
  }

  async init() {
    this.app = new PIXI.Application();
    await this.app.init({
      canvas: document.querySelector("#app") as HTMLCanvasElement,
      autoDensity: true,
      resizeTo: window,
      eventMode: "static",
      powerPreference: "high-performance",
      background: "transparent",
      useBackBuffer: true,
    });
    // window.m = this;
    // window.PIXI = PIXI;
    // window.Tween = TWEEN;

    // @ts-expect-error Set PIXI app to global window object for the PIXI Inspector
    window.__PIXI_APP__ = this.app;

    window.addEventListener("resize", (ev: UIEvent) => {
      const target = ev.target as Window;

      this.currentScene?.onResize?.(target.innerWidth, target.innerHeight);
    });

    this.app.ticker.add(() => {
      this.currentScene?.update?.(this.app.ticker.elapsedMS);
      TWEEN.update();
    });
  }

  importScenes() {
    const sceneModules = import.meta.glob("/src/scenes/*.ts", {
      eager: true,
    }) as Record<string, { default: ConstructorType<typeof Scene> }>;

    return Object.entries(sceneModules).reduce((acc, [path, module]) => {
      const fileName = path.split("/").pop()?.split(".")[0];

      if (!fileName) throw new Error("Error while parsing filename");

      acc[fileName] = module.default;

      return acc;
    }, {} as Record<string, ConstructorType<typeof Scene>>);
  }

  async switchScene(sceneLabel: string, deletePrevious = true): Promise<Scene> {
    await this.removeScene(deletePrevious);

    this.currentScene = this.sceneInstances.get(sceneLabel);

    if (!this.currentScene)
      this.currentScene = await this.initScene(sceneLabel);

    if (!this.currentScene)
      throw new Error(`Failed to initialize scene: ${sceneLabel}`);

    this.app.stage.addChild(this.currentScene);

    if (this.currentScene.start) await this.currentScene.start();

    return this.currentScene;
  }

  private async removeScene(destroyScene: boolean) {
    if (!this.currentScene) return;

    if (destroyScene) {
      this.sceneInstances.delete(this.currentScene.label);

      this.currentScene.destroy({ children: true });
    } else {
      this.app.stage.removeChild(this.currentScene);
    }

    if (this.currentScene.unload) await this.currentScene.unload();

    this.currentScene = undefined;
  }

  private async initScene(sceneLabel: string) {
    const sceneUtils = {
      assetLoader: new AssetLoader(),
    };
    const scene = new this.sceneConstructors[sceneLabel](sceneUtils);

    this.sceneInstances.set(sceneLabel, scene);

    if (scene.load) await scene.load();

    return scene;
  }
}
