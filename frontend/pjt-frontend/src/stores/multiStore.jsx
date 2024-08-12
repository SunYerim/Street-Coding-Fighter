import { create } from "zustand";

const multiStore = create((set) => ({
  // 방정보
  roomId: null,
  setRoomId: (roomId) => set({ roomId }),

  // 입장 패스워드
  password: null,
  setPassword: (password) => set({ password }),

  // 게임중인지 여부
  playing: false,
  setPlaying: (playing) => set({ playing }),

  // 문제 리스트
  problemList: [
    {
      problemId: 3,
      title: "조건문 문제",
      problemType: "SHORT_ANSWER_QUESTION",
      category: "조건문",
      difficulty: 1,
      problemContent: {
        problemId: 3,
        content:
          '다음 코드를 실행했을 때의 출력을 예상하시오.\\n\\n코드:\\n\\nif 10 % 3 == 1:\\n    print("True")\\nelse:\\n    print("False")',
        numberOfBlanks: 0,
      },
      problemChoices: [],
      problemAnswers: [
        {
          answerId: 5,
          problemId: 3,
          blankPosition: null,
          correctChoice: {
            choiceId: null,
            problemId: 3,
            choiceText: "True",
          },
          correctAnswerText: "True",
        },
      ],
    },
  ],
  setProblemList: (problems) => set({ problemList: problems }),
  clearProblemList: () =>
    set({
      problemList: [
        {
          problemId: 3,
          title: "조건문 문제",
          problemType: "SHORT_ANSWER_QUESTION",
          category: "조건문",
          difficulty: 1,
          problemContent: {
            problemId: 3,
            content:
              '다음 코드를 실행했을 때의 출력을 예상하시오.\\n\\n코드:\\n\\nif 10 % 3 == 1:\\n    print("True")\\nelse:\\n    print("False")',
            numberOfBlanks: 0,
          },
          problemChoices: [],
          problemAnswers: [
            {
              answerId: 5,
              problemId: 3,
              blankPosition: null,
              correctChoice: {
                choiceId: null,
                problemId: 3,
                choiceText: "True",
              },
              correctAnswerText: "True",
            },
          ],
        },
      ],
    }),

  // 문제 타입
  type: "",
  setType: (type) => set({ type }),
  clearType: () => set({ type: "" }),

  // 현재라운드
  currentRound: 0,
  setCurrentRound: (currentRound) => set({ currentRound }),
  clearCurrentRound: () => set({ currentRound: 0 }),

  // 소켓에 연결된 플레이어리스트
  playerList: [],
  setPlayerList: (playerList) => set({ playerList }),
  clearPlayerList: () => set({ playerList: [] }),

  // 라운드 랭크
  roundRank: [],
  setRoundRank: (roundRank) => set({ roundRank }),
  clearRoundRank: () => set({ roundRank: [] }),

  // 게임랭크
  gameRank: [],
  setGameRank: (gameRank) => set({ gameRank }),
  clearGameRank: () => set({ gameRank: [] }),

  // 제출 리스트
  submitList: [],
  setSubmitList: (submitList) => set({ submitList }),
  clearSubmitList: () => set({ submitList: [] }),

  // 빈칸 답변
  blankSolve: null,
  setBlankSolve: (blankSolve) => set({ blankSolve }),
  clearBlankSolve: () => set({ blankSolve: null }),

  // 얻은 점수
  getScore: 0,
  setGetScore: (getScore) => set({ getScore }),
}));

export default multiStore;
