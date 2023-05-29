import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  currentTool: 'brush',
  color: 'black',
  gameWord: '',
  role: '',
  chat: [],
  users: [],
  drawFlag: false,
  userName: null,
};

export const logicSlice = createSlice({
  name: 'logic',
  initialState,
  reducers: {
    setTool: (state, action) => {
      state.currentTool = action.payload;
    },
    setGameWord: (state, action) => {
      state.gameWord = action.payload;
    },
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setMessages: (state, action) => {
      state.chat.push(action.payload);
    },
    setDrawFlag: (state, action) => {
      state.drawFlag = action.payload;
    },
    setUserNickName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

export const {
  setTool,
  setGameWord,
  setColor,
  setRole,
  setUsers,
  setMessages,
  setChat,
  setDrawFlag,
  setUserNickName,
} = logicSlice.actions;

export default logicSlice.reducer;
