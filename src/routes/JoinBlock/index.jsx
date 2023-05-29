import React from 'react';
import Header from '../../components/Header';
import socket from '../../socket';
import styles from './JoinBlock.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserNickName } from '../../redux/slices/logicSlice';

const JoinBlock = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = React.useState(`User#${(+new Date()).toString(30).substring(5)}`);
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
      contextRef.current.lineWidth = 5;
      contextRef.current.lineCap = 'round';
    }
    setInterval(() => coord.shift(), 12);
    let id = setInterval(() => requestAnimationFrame(drawing), 0);
  }, []);

  const coord = [];
  const draw = (e) => {
    if (contextRef.current) {
      coord.push({ x: e.pageX, y: e.pageY });
    }
  };

  const drawing = React.useCallback(() => {
    if (contextRef.current && coord.length) {
      contextRef.current.clearRect(0, 0, 1920, 1080);
      contextRef.current.beginPath();
      for (let i = 0; i < coord.length; i++) {
        if (i == 0) {
          continue;
        }

        contextRef.current.moveTo(coord[i].x, coord[i].y);
        contextRef.current.lineTo(
          coord[coord[i + 1] ? [i + 1] : i].x,
          coord[coord[i + 1] ? [i + 1] : i].y,
        );

        if (i > 100) {
          contextRef.current.strokeStyle = `rgba(203, 178, 255, ${i / 1000})`;
        } else {
          contextRef.current.strokeStyle = `rgba(203, 178, 255, ${i / 70})`;
        }

        contextRef.current.stroke();
      }
      contextRef.current.closePath();
    }
  }, []);

  const onClickPrivate = () => {
    if (userName == '') {
      return alert('Введите никнейм');
    }
    const privateRoom = (+new Date()).toString(16);
    socket.emit('createRoom', { roomId: privateRoom, userName });
    dispatch(setUserNickName(userName));
    navigate(`/${privateRoom}`);
  };

  const onClickPublic = () => {
    if (userName == '') {
      return alert('Введите никнейм');
    }
    socket.emit('joinPublic', { userName });
    dispatch(setUserNickName(userName));
    navigate('/public');
  };

  return (
    <>
      <div className="background"></div>
      <div className="wrapper">
        <Header />
        <div className={styles.joinBlock}>
          <div className={styles.joinBlock_title}>
            <h2>Быстрая игра</h2>
          </div>
          <div className={styles.joinBlock_nick}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Введите никнейм"
            />
          </div>
          <div className={styles.joinBloc_joinTo}>
            <button onClick={onClickPrivate}>Создать частную комнату</button>
            <button onClick={onClickPublic}>Играть в общей комнате</button>
          </div>
        </div>
      </div>
      <div className="canvas">
        <canvas
          onPointerMove={draw}
          ref={canvasRef}
          width={window.screen.width}
          height={window.screen.height}
        />
      </div>
    </>
  );
};

export default JoinBlock;
