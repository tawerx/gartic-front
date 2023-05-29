import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './NotFoundRoom.module.scss';

const NotFoundRoom = () => {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <div className="background"></div>
      <Header />
      <div className={styles.not_found_room}>
        <div className={styles.not_found_room_title}>
          <h1>Комната не найдена</h1>
        </div>
        <div className={styles.not_found_room_back}>
          <button onClick={() => navigate('/')}>Вернуться в главное меню</button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundRoom;
