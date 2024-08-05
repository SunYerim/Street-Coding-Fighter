import { create } from "zustand";

const useQuizInfoStore = create((set) => ({
  boardPeriod: "total",
  setBoardPeriod: (period) => set({ boardPeriod: period }),
}));

export default useQuizInfoStore;
