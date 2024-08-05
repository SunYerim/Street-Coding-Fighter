import { create } from "zustand";

const testRanking = {
  total: [],
  weekly: [],
  daily: [],
};

const useLeaderboardStore = create((set) => ({
  rankingList: testRanking,
  setRankingList: (rankingList) => set({ rankingList }),
  boardPeriod: "total",
  setBoardPeriod: (period) => set({ boardPeriod: period }),
}));

export default useLeaderboardStore;
