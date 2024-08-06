import { create } from "zustand";

const multiStore = create((set) => ({
  roomId: null,
  setRoomId: (roomId) => set({ roomId }),
}));

export default multiStore;
