import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const testProblem = {
  problemId: 8,
  title: '문자열 슬라이싱 문제',
  problemType: 'SHORT_ANSWER_QUESTION',
  category: '문자열',
  difficulty: 1,
  problemContent: {
    problemId: 8,
    content: "# 다음 코드를 실행했을 때 출력될 값을 적으시오.\ns = 'Python Programming'\nprint(s[0:6])",
    numberOfBlanks: 0,
  },
  problemChoices: [],
};
const store = create(
  persist(
    (set) => ({
      baseURL: 'https://www.ssafy11s.com',
      // baseURL: "http://localhost:8080",

      wsBattle: 'ws-battle',
      wsChat: 'ws-chat',

      memberId: '',
      setMemberId: (memberId) => set({ memberId }),

      userId: '',
      setUserId: (userId) => set({ userId }),

      name: '',
      setName: (name) => set({ name }),

      email: '',
      setEmail: (email) => set({ email }),

      schoolName: '',
      setSchoolName: (schoolName) => set({ schoolName }),

      birth: '',
      setBirth: (birth) => set({ birth }),

      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),

      exp: 0,
      setExp: (exp) => set({ exp }),

      normalQuit: false,
      setNormalQuit: (normalQuit) => set({ normalQuit }),

      registerInfo: {
        userId: '',
        name: '',
        password: '',
        email: '',
        schoolName: '',
        birth: '',
        characterType: '',
      },
      setRegisterInfo: (registerInfo) => set({ registerInfo }),

      code: '',
      setCode: (code) => set({ code }),

      character: '',
      setCharacter: (character) => set({ character }),

      roomId: '',
      setRoomId: (roomId) => set({ roomId }),

      hostId: '',
      setHostId: (hostId) => set({ hostId }),

      roomPassword: '',
      setRoomPassword: (roomPassword) => set({ roomPassword }),

      enemyId: '',
      setEnemyId: (enemyId) => set({ enemyId }),

      enemyName: '',
      setEnemyName: (enemyName) => set({ enemyName }),

      blankSolve: {},
      setBlankSolve: (blankSolve) => set({ blankSolve }),

      myBlankProblem: {},
      setMyBlankProblem: (myBlankProblem) => set({ myBlankProblem }),

      shortAnswerSolve: '',
      setShortSolve: (shortSolve) => set({ shortSolve }),

      myShortAnswerProblem: testProblem,
      setMyShortAnswerProblem: (myShortProblem) => set({ myShortProblem }),

      multipleChoiceSolve: {},
      setMultipleSolve: (multipleSolve) => set({ multipleSolve }),

      myMultipleChoiceProblem: {},
      setMyMultipleChoiceProblem: (myMultipleProblem) => set({ myMultipleProblem }),
    }),
    {
      name: 'userStorage',
      getStorage: () => localStorage,
    }
  )
);

export default store;
