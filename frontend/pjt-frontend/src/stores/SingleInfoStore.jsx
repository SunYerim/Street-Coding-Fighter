import { create } from 'zustand';

const courses = [
  { id: 0, content_type: "변수와 자료형", title: "변수" },
  { id: 1, content_type: "변수와 자료형", title: "자료형" },
  { id: 2, content_type: "연산자", title: "연산자" },
  { id: 3, content_type: "입출력", title: "표준입출력" },
  { id: 4, content_type: "입출력", title: "파일입출력" },
  { id: 5, content_type: "제어구조", title: "반복문" },
  { id: 6, content_type: "제어구조", title: "조건문" },
  { id: 7, content_type: "자료구조", title: "1차원 리스트" },
  { id: 8, content_type: "자료구조", title: "2차원 리스트" },
  { id: 9, content_type: "함수", title: "함수의 활용" },
  { id: 10, content_type: "알고리즘", title: "탐색" },
  { id: 11, content_type: "알고리즘", title: "정렬" },
];

const completed = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
];

const useLeaderboardStore = create((set) => ({
  courses: courses,
  completed: completed,
  setCompleted: (completedList) => set({ completed: completedList }),
}));

export default useLeaderboardStore;
