import { drawText } from "canvas-txt";

type DrawingState = {
  text: string;
  bgColor: string;
  textColor: string;
  scrollSpeed: number; // pixels per second
  staticViewFontSize: number;
};
class BigTextCanvas {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  state?: DrawingState;

  private _scrollLastTS = 0;
  private _scrollX = 0;
  private _viewType: "scroll" | "static" = "scroll";
  private _staticFontSize = 100;

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas as HTMLCanvasElement;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;
    this.ctx.font = this.font(100);
    requestAnimationFrame(this.animateScrollTextFrame.bind(this));
  }

  fitCanvasSize() {
    if (!window) throw new Error("No window object");
    if (!this.canvas) throw new Error("Canvas not initialized");

    // horizontal screen long side
    let length = window.screen.width;
    // horizontal screen short side
    let width = window.screen.height;
    if (length < width) {
      [length, width] = [width, length];
    }

    this.canvas.width = length;
    this.canvas.height = width;
  }

  animateScrollText(state: DrawingState) {
    if (!this.canvas || !this.ctx) throw new Error("Canvas not initialized");

    this.state = state;
    this.ctx.font = this.font(this.calcSingleLineFontSizeToFitHeight());
    this.ctx.textBaseline = "middle";
    this._scrollX = this.canvas.width;
    this._viewType = "scroll";
  }

  displayStaticText(state: DrawingState) {
    if (!this.canvas || !this.ctx) throw new Error("Canvas not initialized");

    this.state = state;
    this._staticFontSize = this.calcStaticFontSizeToFitBox();
    this._viewType = "static";
  }

  private animateScrollTextFrame(ts: DOMHighResTimeStamp) {
    if (!this.canvas || !this.ctx) throw new Error("Canvas not initialized");

    if (!this.state) {
      requestAnimationFrame(this.animateScrollTextFrame.bind(this));
      return;
    }

    if (this._viewType === "scroll") {
      if (!this._scrollLastTS) this._scrollLastTS = ts;
      const dt = (ts - this._scrollLastTS) / 1000;
      this._scrollLastTS = ts;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = this.state.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const textWidth = this.ctx.measureText(this.state.text).width;
      this.ctx.fillStyle = this.state.textColor;
      this.ctx.fillText(this.state.text, this._scrollX, this.canvas.height / 2);
      this.ctx.fillText(this.state.text, this._scrollX + textWidth, this.canvas.height / 2);
      this.ctx.fillText(this.state.text, this._scrollX + textWidth * 2, this.canvas.height / 2);
      this._scrollX -= this.state.scrollSpeed * dt;
      if (this._scrollX < -textWidth) {
        this._scrollX += textWidth;
      }
    } else if (this._viewType === "static") {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = this.state.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = this.state.textColor;
      this.drawStaticText(this._staticFontSize);
    }

    requestAnimationFrame(this.animateScrollTextFrame.bind(this));
  }

  private drawStaticText(size: number) {
    if (!this.canvas || !this.ctx) throw new Error("Canvas not initialized");
    if (!this.state) throw new Error("State not initialized");

    return drawText(this.ctx, this.state.text, {
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      align: "center",
      vAlign: "middle",
      font: this.fontFamily,
      fontSize: size,
      fontWeight: this.fontWeight,
    });
  }

  private fontFamily = "sans-serif";
  private fontWeight = "bold";
  private font(size: number) {
    return `${this.fontWeight} ${size}px ${this.fontFamily}`;
  }

  private calcSingleLineFontSizeToFitHeight(maxIter = 50) {
    if (!this.canvas || !this.ctx) throw new Error("Canvas not initialized");

    if (!this.state) return 100;
    let fontSize = 100;
    const targetHeight = this.canvas.height - this.canvas.height * 0.1;

    let iter = 0;
    while (true) {
      if (iter++ > maxIter) break;
      iter += 1;
      this.ctx.font = this.font(fontSize);
      const metrics = this.ctx.measureText(this.state.text);
      const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      if (fontHeight < targetHeight) {
        fontSize *= 1.1;
      } else {
        fontSize *= 0.9;
        break;
      }
    }

    return fontSize;
  }

  private calcStaticFontSizeToFitBox(maxIter = 50) {
    if (!this.canvas || !this.ctx) throw new Error("Canvas not initialized");

    if (!this.state) return 100;
    let fontSize = 100;
    const targetHeight = this.canvas.height - this.canvas.height * 0.1;

    let iter = 0;
    while (true) {
      if (iter++ > maxIter) break;
      iter += 1;

      const { height } = this.drawStaticText(fontSize);
      if (height < targetHeight) {
        fontSize *= 1.1;
      } else {
        fontSize *= 0.9;
        break;
      }
    }

    return fontSize;
  }
}

export const bigTextCanvas = new BigTextCanvas();
