import { create } from "zustand";
import { persist } from "zustand/middleware";

const store = create(
  persist(
    (set) => ({
      baseURL: "http://www.ssafy11s.com:8080",
      // baseURL: "localhost:8080",

      memberId: "",
      setMemberId: (memberId) => set({ memberId }),

      userId: "",
      setUserId: (userId) => set({ userId }),

      name: "",
      setName: (name) => set({ name }),

      email: "",
      setEmail: (email) => set({ email }),

      schoolName: "",
      setSchoolName: (schoolName) => set({ schoolName }),

      birth: "",
      setBirth: (birth) => set({ birth }),

      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),

      exp: 0,
      setExp: (exp) => set({ exp }),

      registerInfo: {
        userId: "",
        name: "",
        password: "",
        email: "",
        schoolName: "",
        birth: "",
        characterType: "",
      },
      setRegisterInfo: (registerInfo) => set({ registerInfo }),

      code: "",
      setCode: (code) => set({ code }),

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
