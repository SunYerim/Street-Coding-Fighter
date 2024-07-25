import { create } from "zustand";

const store = create((set) => ({
  memberId: "",
  setMemberId: (memberId) => set({ memberId }),

  userId: "",
  setUserId: (userId) => set({ userId }),

  name: "",
  setName: (name) => set({ name }),

  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
}));

export default store;
