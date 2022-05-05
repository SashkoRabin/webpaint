import React, { useEffect, useRef } from 'react';
import '../styles/canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';

const Canvas = observer(() => {
  canvasState.setUsername(Date.now());
  const canvasRef = useRef('');
  const params = useParams();
  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
  }, []);

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case 'rect':
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          toolState.tool.fillColor
        );
        break;
      case 'finish':
        ctx.beginPath();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: 'connection',
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`пользователь ${msg.username} присоединился`);
            break;
          case 'draw':
            drawHandler(msg);
            break;
          default:
            break;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasState.username]);

  return (
    <div className="canvas">
      <canvas
        onMouseDown={() => mouseDownHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      ></canvas>
    </div>
  );
});

export default Canvas;
