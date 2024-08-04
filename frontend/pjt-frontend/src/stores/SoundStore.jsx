import { create } from 'zustand';
import { Howl } from 'howler';

const SoundStore = create((set) => ({
  sound: new Howl({
    src: ['/BGM-1.mp3'],
    loop: true,
    volume: 0.3,
  }),
  isPlaying: false,
  volume: 0.3, // 기본 볼륨 값 추가
  clickSound: new Howl({
    src: ['/clickSound.mp3'], // 효과음 파일 경로
    volume: 0.5,
  }),
  playBackgroundMusic: () => {
    set((state) => {
      if (state.sound && !state.isPlaying) {
        state.sound.play();
        return { isPlaying: true };
      }
      return {};
    });
  },
  stopBackgroundMusic: () => {
    set((state) => {
      console.log(state.isPlaying);
      if (state.sound && state.isPlaying) {
        state.sound.stop();
        console.log('stop background music');
        return { isPlaying: false };
      }
      return {};
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
