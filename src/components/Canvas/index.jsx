import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setColor, setTool } from '../../redux/slices/logicSlice';
import { useIdleTimer } from 'react-idle-timer';
import styles from './Canvas.module.scss';
import socket from '../../socket';
import { useLocation } from 'react-router-dom';

const Canvas = ({ onInit }) => {
  const { currentTool, color, role, drawFlag, afkTimer } = useSelector((state) => state.logic);
  const dispatch = useDispatch();
  const canvasRef = React.useRef();
  const contextRef = React.useRef();
  const paintRef = React.useRef();
  const [isDrawing, setIsDrawing] = React.useState(false);
  const roomId = useLocation().pathname.slice(1, useLocation().pathname.length);

  // const handleOnIdle = () => {
  //   if (role == 'writer') {
  //     console.log('бездействует рисующий');
  //     socket.emit('afkWriter');
  //     reset();
  //   } else {
  //     console.log('бездействует юзер');
  //     reset();
  //   }
  // };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;
    onInit(context);
  }, []);

  React.useEffect(() => {
    if (role == 'writer') {
      if (window.screen.width > 850 && window.screen.width < 1260) {
        if (canvasRef.current) {
          canvasRef.current.width = 800;
          canvasRef.current.height = 500;
        }
      } else if (window.screen.width < 850) {
        if (paintRef.current) {
          paintRef.current.style.width = '100vw';
          paintRef.current.style.height = '310px';
          if (canvasRef.current) {
            canvasRef.current.width = window.screen.width;
            canvasRef.current.height = 310;
          }
        }
      }
    } else {
      if (canvasRef.current) {
        canvasRef.current.width = 1171;
        canvasRef.current.height = 800;
      }
    }
  }, [role]);

  const startDrawing = (e) => {
    if (drawFlag) {
      if (role == 'writer') {
        contextRef.current.strokeStyle = currentTool == 'brush' ? color : 'white';
        contextRef.current.lineWidth = currentTool == 'brush' ? 5 : 30;
        contextRef.current.beginPath();
        contextRef.current.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
        setIsDrawing(true);
      }
    }
  };

  const endDrawing = () => {
    if (drawFlag) {
      if (role == 'writer') {
        contextRef.current.closePath();
        setIsDrawing(false);
        if (canvasRef.current) {
          socket.emit('canvasImg', { roomId, data: canvasRef.current.toDataURL() });
        }
      }
    }
  };

  const draw = (e) => {
    if (drawFlag) {
      if (isDrawing == true && role == 'writer') {
        contextRef.current.lineTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
        contextRef.current.stroke();

        // socket.emit('coor', {
        //   roomId,
        //   data: {
        //     x: e.pageX - e.target.offsetLeft,
        //     y: e.pageY - e.target.offsetTop,
        //     color,
        //     currentTool,
        //   },
        // });
        if (canvasRef.current) {
          socket.emit('canvasImg', { roomId, data: canvasRef.current.toDataURL() });
        }
      }
    }
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('clearCanvas', { roomId, data: 'Очищено' });
  };

  // const { reset } = useIdleTimer({
  //   timeout: 30 * 1000,
  //   onIdle: handleOnIdle,
  //   onActive: draw,
  // });
  return (
    <div className={styles.canvas}>
      <div ref={paintRef} className={styles.canvas_paint}>
        <canvas
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          ref={canvasRef}
          width={1171}
          height={800}
        />
      </div>
      {role != 'writer' ? null : (
        <div className={styles.canvas_tools}>
          <svg
            onClick={clearCanvas}
            id="Layer_1"
            viewBox="0 0 750 750"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M544.45,223.33c-6.57-29.87-29.06-50.15-59.94-53.89-11.65-1.41-23.32-2.54-35.6-3.86-1.6-6.05-2.82-12.01-4.76-17.72-3.68-10.82-9.37-18.17-24.02-17.76-25.39,.71-50.81,.11-76.22,.3-5.19,.04-10.5,.62-15.55,1.82-15.4,3.65-21.33,11.05-21.98,26.6-.25,5.95-.42,11.9-.68,19.24-8.48,0-15.42,.05-22.35-.01-8.32-.07-16.66-.66-24.96-.25-9.65,.48-19.56,1.6-26.84,8.82-17.23,17.11-25.11,38.83-27.45,62.32-1.28,12.84,7.27,22.24,19.48,24.15,4.59,.72,9.46-.41,16.04-.81,.78,8.33,1.4,16.11,2.27,23.86,3.12,27.82,6.2,55.64,9.53,83.43,4.17,34.74,7.68,69.59,13.12,104.13,5.36,34.08,15.34,67.4,16.26,102.24,.21,7.83,4.87,14.16,11.83,17.9,4.95,2.66,10.33,4.8,15.77,6.2,28.6,7.34,57.95,8.67,87.24,9.65,19.24,.64,38.54-.1,57.79-.74,16.45-.55,24.87-7.04,30.24-22.39,1.73-4.94,2.98-10.06,4.36-15.12,5.52-20.25,11.76-40.34,16.3-60.8,4.72-21.3,9.51-42.83,11.21-64.5,3.04-38.81,3.8-77.79,5.49-116.71,1.04-24.05,1.98-48.11,3.11-72.16,.18-3.8,1.2-7.56,1.74-10.8,19.16-7.16,22.79-13.93,18.57-33.12Zm-167.16-52.62c-14,.47-27.51,6.38-42.74,3,8.16-5.81,26.06-7.12,42.74-3Zm125.01,127.75c-4.46,26.28-10.36,52.34-13.89,78.73-3.88,28.99-6.08,58.22-8.43,87.4-2.14,26.59-3.89,53.21-10.57,79.17-1.96,7.6-4.86,14.96-6.9,22.54-1.82,6.72-5.94,9-12.6,8.38-4.78-.45-9.62-.36-14.43-.25-37.17,.9-74.33,1.9-111.49,2.8-7.38,.18-14.77,.03-23.1,.03-17.21-102.6-21.17-204.86-32.28-307.09,3.87-.91,6.69-2.05,9.55-2.16,21.86-.87,43.72-2.2,65.58-2.14,44.69,.13,89.16-2.85,133.58-7.27,9.46-.94,19-.95,30.56-1.48-1.97,14.84-3.33,28.17-5.57,41.35Zm-6.25-68.56c-65.6,.06-131.2-.18-196.8-.31-16.97-.03-33.93,0-51.27,0-.57-6.85,2.37-10.93,9.14-11.66,14.74-1.6,29.5-3.92,44.28-4.21,35.84-.69,71.72,.29,107.55-.7,28.81-.8,57.59-3.19,86.34-5.48,14.15-1.13,21.51,6.5,28.79,19.9-10.85,1-19.44,2.47-28.03,2.47Z" />
            <path d="M330.94,349.38c-1.98-16.74-7.28-33.16-11.91-49.48-1.48-5.21-4.95-10.36-8.78-14.3-7.26-7.45-15.31-5.58-19.99,3.83-3.37,6.77-2.24,13.27,.26,20.21,3.97,11.02,8.21,22.18,10.17,33.65,5.21,30.55,9.67,61.25,13.63,91.99,3.23,25.11,5.14,50.39,7.99,75.55,1.18,10.39,2.81,20.78,5.15,30.96,1.53,6.67,7.31,10.78,12.15,9.72,6.2-1.36,9.6-5.71,10.52-11.92,.32-2.15,.26-4.35,.42-7.35-.86-6.58-1.99-13.92-2.75-21.3-5.56-53.86-10.51-107.78-16.86-161.55Z" />
            <path d="M440.61,282.4c-6.09-.58-10.48,2.42-12.65,7.51-2.54,5.96-4.79,12.33-5.55,18.71-1.4,11.71-1.43,23.58-2.37,35.35-2.43,30.51-4.63,61.04-7.69,91.49-2.75,27.4-6.52,54.71-9.83,82.06,.42,.04,.84,.09,1.26,.13,0,7-.63,14.07,.19,20.98,.7,5.92,4.14,10.73,10.92,11.28,7.02,.57,10.34-3.92,11.9-9.89,.99-3.77,1.38-7.71,1.81-11.61,2.41-21.73,4.55-43.5,7.15-65.21,3.9-32.56,8.52-65.04,12.05-97.65,2.3-21.25,3.26-42.65,4.65-64,.19-2.99-.1-6.22-1.08-9.02-1.77-5.07-4.51-9.54-10.76-10.14Z" />
            <path d="M390.03,421.57h1.91c0-37.58,.09-75.15-.11-112.72-.03-5.11-.32-10.85-2.65-15.12-1.98-3.63-7.09-7.67-10.8-7.66-3.67,.01-8.85,4.14-10.62,7.79-2.56,5.27-3.31,11.71-3.69,17.72-4.7,74.3,1.61,148.46,3.24,222.68,.1,4.61,1.49,9.79,3.99,13.58,2.07,3.14,6.77,6.5,10.12,6.32,3.4-.18,7.69-3.97,9.54-7.31,1.95-3.51,2.05-8.38,1.96-12.64-.83-37.55-1.89-75.1-2.87-112.65Z" />
          </svg>
          <svg
            onClick={() => dispatch(setTool('erase'))}
            id="Flat"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256.00098 256">
            <path d="M216.001,209.833H125.51562l94.72852-94.72754a22.02474,22.02474,0,0,0-.001-31.11231L174.98828,38.73828a21.99905,21.99905,0,0,0-31.11133,0l-56.564,56.564-.00537.00439-.0044.00537-56.564,56.564a22.02383,22.02383,0,0,0,0,31.1123l37.08886,37.08789a5.99983,5.99983,0,0,0,4.24219,1.75684H216.001a6,6,0,0,0,0-12ZM152.36133,47.22266a10.01288,10.01288,0,0,1,14.14258,0l45.25488,45.25488a10.014,10.014,0,0,1,0,14.14355l-52.32666,52.32569L100.03467,99.54932ZM74.55566,209.833l-35.332-35.33008a10.0129,10.0129,0,0,1,0-14.14258l52.32666-52.32666,59.39746,59.39746L108.54492,209.833Z" />
          </svg>
          <svg
            onClick={() => dispatch(setTool('brush'))}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg">
            <g data-name="1" id="_1">
              <path d="M403.67,187.94a68,68,0,0,1-9.16-.63c-17.89-2.4-35.5-11.48-49.57-25.55h0c-14.07-14.08-23.15-31.68-25.56-49.58-2.57-19.12,2.93-37.07,15.11-49.25s30.13-17.69,49.25-15.11c17.9,2.41,35.51,11.48,49.58,25.56s23.15,31.68,25.56,49.57c2.57,19.13-2.94,37.08-15.11,49.26C433.56,182.41,419.29,187.94,403.67,187.94Zm-37.52-47.4c9.31,9.32,21.11,15.53,32.37,17,9.91,1.34,18.45-1,24-6.59s7.93-14.12,6.59-24c-1.51-11.26-7.72-23.06-17-32.37C394,76.47,368.16,71.69,355.7,84.14s-7.67,38.29,10.45,56.4Z" />
              <path d="M189.36,402.24a68,68,0,0,1-9.15-.62c-17.9-2.41-35.51-11.48-49.58-25.56s-23.15-31.68-25.56-49.57c-2.57-19.13,2.94-37.08,15.11-49.26a15,15,0,0,1,21.22,21.22c-5.59,5.58-7.93,14.12-6.6,24,1.52,11.26,7.73,23.06,17,32.37C170,373,195.79,377.75,208.25,365.3a15,15,0,1,1,21.21,21.21C219.25,396.72,205,402.24,189.36,402.24Z" />
              <path d="M71.69,450a15,15,0,0,1-14.64-18.25c.26-1.17,6.46-29,15.07-59.7,16.16-57.6,25.91-72.67,32.6-79.36L334.49,62.93A15,15,0,1,1,355.7,84.14L125.94,313.91c-.91.9-9.27,10.43-24.94,66.25-3.51,12.51-6.65,24.69-9.1,34.64,10-2.47,22.21-5.61,34.75-9.14,55.72-15.64,65.24-24,66.14-24.9L422.55,151a15,15,0,0,1,21.22,21.21L214,402c-6.69,6.69-21.75,16.44-79.36,32.61-30.65,8.6-58.53,14.8-59.7,15.06A15,15,0,0,1,71.69,450Z" />
              <path d="M391.63,135.07a15,15,0,0,1-10.61-4.4l-5-5a15,15,0,0,1,21.21-21.21l5,5a15,15,0,0,1-10.6,25.61Z" />
            </g>
          </svg>
          <input type="color" value={color} onChange={(e) => dispatch(setColor(e.target.value))} />
        </div>
      )}
    </div>
  );
};

export default Canvas;
