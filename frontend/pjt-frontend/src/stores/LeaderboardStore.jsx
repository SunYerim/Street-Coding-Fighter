import { create } from 'zustand';

const testRanking = {
  total: [
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
  ],
  weekly: [
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
  ],
  daily: [
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
    {
      userId: '123',
      name: 'x탱글대기2',
      exp: 1234,
    },
  ],
};

const useLeaderboardStore = create((set) => ({
  rankingList: { total: [], weekly: [], daily: [] },
  setTotalList: (newList) =>
    set((state) => {
      return { rankingList: { ...state, total: newList } };
    }),
  setWeeklyList: (newList) => set((state) => {
    return { rankingList: { ...state, weekly: newList } };
  }),
  setDailyList: (newList) => set((state) => {
    return { rankingList: { ...state, daily: newList } };
  }),
  boardPeriod: 'total',
  setBoardPeriod: (period) => set({ boardPeriod: period }),
}));

export default useLeaderboardStore;
