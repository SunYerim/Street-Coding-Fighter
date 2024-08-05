import { create } from "zustand";

const multiStore = create((set) => ({
  roomId: null,
  userId: 35,
  username: "Ethan",
  setRoomId: (roomId) => set({ roomId }),
  setUserId: (userId) => set({ userId }),
  setUsername: (username) => set({ username }),
}));

export default multiStore;
