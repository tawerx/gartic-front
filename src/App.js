import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CheckRoom from './components/CheckRoom';
import JoinBlock from './routes/JoinBlock';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<JoinBlock />} />
      <Route path={'/:id'} element={<CheckRoom />} />
    </Routes>
  );
};
export default App;
