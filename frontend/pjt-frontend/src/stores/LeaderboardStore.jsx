import { create } from "zustand";

const testRanking = {
  total: {
    1: { name: "탱글대기", exp: 1000000 },
    2: { name: "Bernie2", exp: 1000000 },
    3: { name: "Bernie3", exp: 1000000 },
    4: { name: "Bernie4", exp: 1000000 },
    5: { name: "Bernie5", exp: 1000000 },
    6: { name: "Bernie6", exp: 1000000 },
    7: { name: "Bernie7", exp: 1000000 },
    8: { name: "Bernie8", exp: 1000000 },
    9: { name: "Bernie9", exp: 1000000 },
    10: { name: "Bernie10", exp: 1000000 },
    11: { name: "Bernie10", exp: 1000000 },
    12: { name: "Bernie10", exp: 1000000 },
    13: { name: "Bernie10", exp: 1000000 },
    14: { name: "Bernie10", exp: 1000000 },
    15: { name: "Bernie10", exp: 1000000 },
    16: { name: "Bernie10", exp: 1000000 },
    17: { name: "Bernie10", exp: 1000000 },
    18: { name: "Bernie10", exp: 1000000 },
    19: { name: "Bernie10", exp: 1000000 },
    20: { name: "Bernie10", exp: 1000000 },
  },
  weekly: {
    1: { name: "Bernie", exp: 1000000 },
    2: { name: "Bernie", exp: 1000000 },
    3: { name: "Bernie", exp: 1000000 },
    4: { name: "Bernie", exp: 1000000 },
    5: { name: "Bernie", exp: 1000000 },
    6: { name: "Bernie", exp: 1000000 },
    7: { name: "Bernie", exp: 1000000 },
    8: { name: "Bernie", exp: 1000000 },
    9: { name: "Bernie", exp: 1000000 },
    10: { name: "Bernie", exp: 1000000 },
    11: { name: "Bernie", exp: 1000000 },
    12: { name: "Bernie", exp: 1000000 },
    13: { name: "Bernie", exp: 1000000 },
    14: { name: "Bernie", exp: 1000000 },
    15: { name: "Bernie", exp: 1000000 },
  },
  daily: {
    1: { name: "Bernie", exp: 1000000 },
    2: { name: "Bernie", exp: 1000000 },
    3: { name: "Bernie", exp: 1000000 },
    4: { name: "Bernie", exp: 1000000 },
    5: { name: "Bernie", exp: 1000000 },
    6: { name: "Bernie", exp: 1000000 },
    7: { name: "Bernie", exp: 1000000 },
    8: { name: "Bernie", exp: 1000000 },
    9: { name: "Bernie", exp: 1000000 },
    10: { name: "Bernie", exp: 1000000 },
  },
};

const useLeaderboardStore = create((set) => ({
  rankingList: testRanking,
  setRankingList: (rankingList) => set({ rankingList }),
  boardPeriod: "total",
  setBoardPeriod: (period) => set({ boardPeriod: period }),
}));

export default useLeaderboardStore;
  