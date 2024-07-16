export class GameState {
  private static _mainCardSymbol: number;
  private static _mainCardPosition: { x: number; y: number };

  static get mainCardSymbol(): number {
    return this._mainCardSymbol;
  }

  static set mainCardSymbol(value: number) {
    this._mainCardSymbol = value;
  }

  static get mainCardPosition(): { x: number; y: number } {
    return this._mainCardPosition;
  }

  static set mainCardPosition(position: { x: number; y: number }) {
    this._mainCardPosition = position;
  }

  static init(): void {
    this._mainCardSymbol = 0;
    this._mainCardPosition = { x: 0, y: 0 };
  }
}
