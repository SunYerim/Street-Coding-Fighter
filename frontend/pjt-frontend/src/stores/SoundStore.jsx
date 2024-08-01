import { create } from 'zustand';
import { Howl } from 'howler';

const SoundStore = create((set) => ({
  sound: new Howl({
    src: ["/BGM-1.mp3"],
    loop: true,
    volume: 0.3,
  }),
  isPlaying: false,
  volume: 0.3, // 기본 볼륨 값 추가
  clickSound: new Howl({
    src: ['/clickSound.mp3'], // 효과음 파일 경로
    volume: 1.0,
  }),
  play: () => {
    set((state) => {
      state.sound && state.sound.play();
      return { isPlaying: true };
    });
  },
  pause: () => {
    set((state) => {
      state.sound && state.sound.pause();
      return { isPlaying: false };
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
        state.sound.volume(volume);
      }
      return { volume }; // 상태의 volume을 업데이트
    });
  },
  playClickSound: () => {
    set((state) => {
      state.clickSound.play();
      return {};
    });
  },
}));

export default SoundStore;
