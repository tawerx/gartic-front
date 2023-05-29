import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import { setUserNickName } from '../../redux/slices/logicSlice';
import socket from '../../socket';
import styles from './ConnectToRoom.module.scss';

const ConnectToRoom = () => {
  const dispatch = useDispatch();
  const [nickName, setNickName] = React.useState(`User#${(+new Date()).toString(30).substring(5)}`);
  const roomId = useLocation().pathname.slice(1, useLocation().pathname.length);
  return (
    <>
      <div className="background"></div>
      <div className="wrapper">
        <Header />
        <div className={styles.connect_to_room}>
          <div>
            <span>Присоединиться</span>
          </div>
          <div className={styles.connect_to_room_nickname}>
            <input
              placeholder="Введите ник"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
          </div>
          <div className={styles.connect_to_room_button}>
            <button
              onClick={() => {
                dispatch(setUserNickName(nickName));
                socket.emit('joinByLink', { roomId, userName: nickName });
              }}>
              Войти
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectToRoom;
