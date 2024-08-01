import { create } from 'zustand';
import { Howl } from 'howler';

const SoundStore = create((set) => ({
  sound: null,
  isPlaying: false,
  play: () => {
    set((state) => {
      state.sound && state.sound.play();
      return { isPlaying: true };
    });
  },
  pause: () => {
    set((state) => {
      state.sound && state.sound.pause();
      return { isPlaying: false }; // isPlaying을 false로 설정
    });
  },
  setSound: (src) => {
    const sound = new Howl({
      src: [src],
      loop: true,
      volume: 0.3,
    });
    set({ sound });
  },
  setVolume: (volume) => {
    set((state) => {
      if (state.sound) {
        state.sound.volume(volume); // Howl 객체의 volume 메서드를 호출
      }
      return { volume }; // 상태의 volume을 업데이트
    });
  },
}));

export default SoundStore;
