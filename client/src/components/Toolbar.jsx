import React from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import '../styles/toolbar.scss';
import Rect from '../tools/Rect';
import Eraser from '../tools/Eraser';
import Circle from '../tools/Circle';
import Line from '../tools/Line';

export default function Toolbar() {
  const changeColor = (e) => {
    toolState.setFillColor(e.target.value);
    toolState.setStrokeColor(e.target.value);
  };
  return (
    <div className="toolbar">
      <button
        className="toolbar__btn brush"
        onClick={() =>
          toolState.setTool(
            new Brush(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      ></button>
      <button
        className="toolbar__btn rect"
        onClick={() =>
          toolState.setTool(
            new Rect(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      ></button>
      <button
        className="toolbar__btn circle"
        onClick={() => toolState.setTool(new Circle(canvasState.canvas))}
      ></button>
      <button
        className="toolbar__btn eraser"
        onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}
      ></button>
      <button
        className="toolbar__btn line"
        onClick={() => toolState.setTool(new Line(canvasState.canvas))}
      ></button>
      <input
        onChange={(e) => changeColor(e)}
        type="color"
        style={{ marginLeft: 10 }}
      />
      <button
        className="toolbar__btn undo"
        onClick={() => canvasState.undo()}
      ></button>
      <button
        className="toolbar__btn redo"
        onClick={() => canvasState.redo()}
      ></button>
      <button className="toolbar__btn save"></button>
    </div>
  );
}
