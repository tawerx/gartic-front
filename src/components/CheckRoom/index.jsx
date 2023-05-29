import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ConnectToRoom from '../../routes/ConnectToRoom';
import Game from '../../routes/Game';
import NotFoundRoom from '../../routes/NotFoundRoom';
import axios from 'axios';

const CheckRoom = () => {
  const [roomExist, setRoomExist] = React.useState(false);
  const { userName } = useSelector((state) => state.logic);
  const roomId = useLocation().pathname.slice(1, useLocation().pathname.length);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}checkRoom?roomId=${roomId}`)
      .then((res) => setRoomExist(res.data));

    console.log('mount');
    return () => {
      console.log('unmount');
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}checkRoom?roomId=${roomId}`)
        .then((res) => setRoomExist(res.data));
    };
  }, []);

  if (roomExist && userName == null) {
    return <ConnectToRoom />;
  }
  if (roomExist && userName != null) {
    return <Game />;
  }

  if (!roomExist) {
    return <NotFoundRoom />;
  }
};

export default CheckRoom;
