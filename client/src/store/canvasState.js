import { makeAutoObservable } from 'mobx';

class CanvasState {
  canvas = null;
  undoList = [];
  redoList = [];
  socket = null;
  sessionid = null;
  constructor() {
    makeAutoObservable(this);
  }
  setCanvas(canvas) {
    this.canvas = canvas;
  }
  setSessionId(id) {
    this.sessionid = id;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }
  pushToRedo(data) {
    this.redoList.push(data);
  }
  setUsername(username) {
    this.username = username;
  }
  undo() {
    let ctx = this.canvas.getContext('2d');
    if (this.undoList.length) {
      let dataUrl = this.undoList.pop();
      this.redoList.push(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  redo() {
    let ctx = this.canvas.getContext('2d');
    if (this.redoList.length) {
      let dataUrl = this.redoList.pop();
      this.undoList.push(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }
}

export default new CanvasState();
