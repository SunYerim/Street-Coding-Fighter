import { create } from "zustand";
import { persist } from "zustand/middleware";

const store = create(
  persist(
    (set) => ({
      baseURL: "https://ssafy11s.com",

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

      exp: 0,
      setExp: (exp) => set({ exp }),

      character: "",
      setCharacter: (character) => set({ character }),
    }),
    {
      name: "userStorage",
      getStorage: () => localStorage,
    }
  )
);

export default store;
