import { create } from "zustand";

const store = create((set) => ({
  userId: "",
  setUserId: (userId) => set({ userId }),

  name: "",
  setName: (name) => set({ name }),
}));

export default store;
