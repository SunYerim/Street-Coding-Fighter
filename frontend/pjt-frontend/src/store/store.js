import { create } from "zustand";
import { persist } from "zustand/middleware";

const store = create(
  persist(
    (set) => ({
      baseURL: "http://www.ssafy11s.com:8080",

      memberId: "",
      setMemberId: (memberId) => set({ memberId }),

      userId: "",
      setUserId: (userId) => set({ userId }),

      name: "",
      setName: (name) => set({ name }),

      schoolName: "",
      setSchoolName: (schoolName) => set({ schoolName }),

      birth: "",
      setBirth: (birth) => set({ birth }),

      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "userStorage",
      getStorage: () => localStorage,
    }
  )
);

export default store;
