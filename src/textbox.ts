export class TextBox {
  text: string;
  cursor: number;
  enterCallback;
  escapeCallback;
  allowedCharacters = "all";

  constructor() {
    this.text = "";
    this.cursor = 0;
    this.enterCallback = () => { };
    this.escapeCallback = () => { };
  }

  setEnterCallback = (callback) => {
    this.enterCallback = callback;
  }

  setEscapeCallback = (callback) => {
    this.escapeCallback = callback;
  }

  clear = () => {
    this.text = "";
    this.cursor = 0;
  }

  handleKeyPress = (key: string) => {
    if (key.length === 1) {
      key = key.toLowerCase();
      if (this.allowedCharacters === "all" || this.allowedCharacters.includes(key)) {
        this.text = this.text.substring(0, this.cursor) + key + this.text.substring(this.cursor, this.text.length);
        this.cursor += 1;
      }
    } else {
      switch (key) {
        case "Backspace":
          this.text = this.text.substring(0, this.cursor - 1) + this.text.substring(this.cursor, this.text.length);
          this.cursor = Math.max(0, this.cursor - 1);
          break;
        case "Delete":
          this.text = this.text.substring(0, this.cursor) + this.text.substring(this.cursor + 1, this.text.length);
          break;
        case "ArrowLeft":
          this.cursor = Math.max(0, this.cursor - 1);
          break;
        case "ArrowRight":
          this.cursor = Math.min(this.text.length, this.cursor + 1);
          break;
        case "Enter":
          this.enterCallback();
          break;
        case "Escape":
          this.escapeCallback();
          break;
      }
    }
  }
}