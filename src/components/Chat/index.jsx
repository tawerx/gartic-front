import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setMessages } from '../../redux/slices/logicSlice';
import socket from '../../socket';
import styles from './Chat.module.scss';

const Chat = () => {
  const { role, userName } = useSelector((state) => state.logic);
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.logic);
  const [value, setValue] = React.useState('');
  const roomId = useLocation().pathname.slice(1, useLocation().pathname.length);
  return (
    <div className={styles.chat}>
      <div className={styles.chat_messages}>
        <ul>
          {chat.map((message, i) => {
            return <li key={i}>{`${message}`}</li>;
          })}
        </ul>
      </div>
      <div className={styles.chat_control}>
        <input
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              socket.emit('sendMessage', { roomId, message: `${userName}: ${value}` });
              setValue('');
              dispatch(setMessages(`${userName}: ${value}`));
            }
          }}
          value={value}
          placeholder="Введите сообщение"
        />
        <button
          onClick={() => {
            socket.emit('sendMessage', { roomId, message: `${userName}: ${value}` });
            setValue('');
            dispatch(setMessages(`${userName}: ${value}`));
          }}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
