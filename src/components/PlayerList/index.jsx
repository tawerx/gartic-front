import React from 'react';
import { useSelector } from 'react-redux';
import styles from './PlayerList.module.scss';

const PlayerList = () => {
  const { users } = useSelector((state) => state.logic);

  return (
    <div className={styles.playerList}>
      <div className={styles.title}>
        <p>Игроки</p>
      </div>
      <div className={styles.player_list}>
        <ul>
          {users.map((obj) => {
            return (
              <li key={obj.id}>{`${obj.username} ${obj.role == 'writer' ? `- рисует` : ''}`}</li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PlayerList;
