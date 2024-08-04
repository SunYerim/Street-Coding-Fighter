import create from 'zustand';

const multiStore = create((set) => ({
  roomId: null,
  userId: null,
  username: null,
  setRoomId: (roomId) => set({ roomId }),
  setUserId: (userId) => set({ userId }),
  setUsername: (username) => set({ username }),
}));

export default multiStore;
