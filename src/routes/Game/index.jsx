import React from 'react';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import Header from '../../components/Header';
import '../../styles/app.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  setChat,
  setDrawFlag,
  setGameWord,
  setMessages,
  setRole,
  setUsers,
} from '../../redux/slices/logicSlice';
import { io } from 'socket.io-client';
import axios from 'axios';
import PlayerList from '../../components/PlayerList';
import socket from '../../socket';
import { useLocation, useNavigate } from 'react-router-dom';

const Game = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameWord, role, userName } = useSelector((state) => state.logic);
  const [create, setCreate] = React.useState(false);
  const [canvasImage, setCanvasImage] = React.useState('');
  const [isPhone, setIsPhone] = React.useState(false);
  const canvasRef = React.useRef();
  const roomId = useLocation().pathname.slice(1, useLocation().pathname.length);
  const onClickCreate = () => {
    if (gameWord == '') {
      alert('Введите слово!');
    } else {
      setCreate(!create);

      socket.emit('setGameWord', { roomId, gameWord });

      dispatch(setDrawFlag(true));
      if (window.screen.width < 500) {
        setIsPhone(true);
      }
    }
  };

  React.useEffect(() => {
    if (userName == null) {
      return navigate('/');
    }

    socket.emit('sessionInfo', roomId);

    socket.on('canvasImg', (data) => {
      if (canvasRef.current) {
        const img = new Image();
        img.src = data;
        img.onload = () => {
          canvasRef.current.clearRect(0, 0, 1171, 800);
          canvasRef.current.drawImage(img, 0, 0, 1171, 800);
        };
      }
    });

    socket.on('clearCanvas', (data) => {
      if (canvasRef.current) {
        canvasRef.current.clearRect(0, 0, 1171, 800);
      }
    });

    socket.on('role', (role) => {
      dispatch(setRole(role));
    });
    axios.get(`${process.env.REACT_APP_SERVER_URL}${roomId}/messages`).then((res) => {
      dispatch(setChat(res.data));
    });

    axios.get(`${process.env.REACT_APP_SERVER_URL}${roomId}/canvas`).then((res) => {
      setCanvasImage(res.data);
    });

    socket.on('endGame', (data) => {
      alert(data);
      dispatch(setDrawFlag(false));
      dispatch(setGameWord(''));
      setCreate(false);
      setIsPhone(false);
    });

    socket.on('getMessage', (msg) => {
      dispatch(setMessages(msg));
    });

    socket.on('getUsers', (data) => {
      dispatch(setUsers(data));
    });

    return () => {
      socket.emit('leaveGame');
      dispatch(setGameWord(''));
      dispatch(setRole(null));
      dispatch(setDrawFlag(false));
      dispatch(setUsers([]));
      dispatch(setChat([]));
    };
  }, []);

  React.useEffect(() => {
    const img = new Image();
    img.src = canvasImage;
    img.onload = () => {
      canvasRef.current.clearRect(0, 0, 1171, 800);
      canvasRef.current.drawImage(img, 0, 0, 1171, 800);
    };
  }, [canvasImage]);

  if (isPhone) {
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    return (
      <>
        <Canvas onInit={(canvasCtx) => (canvasRef.current = canvasCtx)} />
        <Chat />
      </>
    );
  } else {
    document.body.style.position = 'static';
    document.body.style.overflow = 'auto';
  }

  return (
    <>
      <div className="background"></div>
      <div className="wrapper">
        <Header />
        <div className="container">
          <div className="leftSide">
            <PlayerList />
            <Chat />
            {role != 'writer' ? null : (
              <div className="create-word">
                {create == false ? (
                  <input
                    onChange={(e) => {
                      dispatch(setGameWord(e.target.value));
                    }}
                    value={gameWord}
                    placeholder="Введите слово"
                  />
                ) : (
                  <p>{gameWord}</p>
                )}

                {create || <button onClick={onClickCreate}>Загадать слово</button>}
              </div>
            )}
          </div>
          <div className="rigthSide">
            <Canvas onInit={(canvasCtx) => (canvasRef.current = canvasCtx)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
