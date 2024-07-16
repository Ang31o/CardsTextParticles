import EventService from "./core/EventService";
import SceneManager from "./core/SceneManager";
import { Events } from "./enums/events";

const sceneManager = new SceneManager();

await sceneManager.switchScene("Loading");
await sceneManager.switchScene("Menu");

EventService.on(Events.OPEN_CARDS_DEMO, async () => {
  await sceneManager.switchScene("CardsDemo");
});
EventService.on(Events.OPEN_TEXT_DEMO, async () => {
  await sceneManager.switchScene("TextDemo");
});
EventService.on(Events.OPEN_PARTICLES_DEMO, async () => {
  await sceneManager.switchScene("ParticlesDemo");
});
EventService.on(Events.OPEN_MENU, async () => {
  await sceneManager.switchScene("Menu");
});
