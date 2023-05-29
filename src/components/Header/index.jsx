import React from 'react';
import styles from './Header.module.scss';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.header} onClick={() => navigate('/')}>
      {/* <h1>Gartic Show</h1> */}
    </div>
  );
};

export default Header;
