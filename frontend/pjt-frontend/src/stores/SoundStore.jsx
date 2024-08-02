import { create } from 'zustand';
import { Howl } from 'howler';

const SoundStore = create((set) => ({
  sound: null,
  isPlaying: false,
  volume: 0.3, // 기본 볼륨 값 추가
  clickSound: new Howl({
    src: ['/startSound.mp3'], // 효과음 파일 경로
    volume: 0.5,
  }),
  startSound: new Howl({
    src: ['/startSound.mp3'],
    loop: false,
    volume: 0.5,
  }),

  initializeBackgroundMusic: (src) => {
    set((state) => {
      if (!state.sound) { // sound가 없을 때만 새로운 Howl 인스턴스를 생성
        const sound = new Howl({
          src: [src],
          loop: true,
          volume: 0.3,
        });
        sound.play();
        console.log('play bgm');
        return { sound, isPlaying: true };
      }
      return {};
    });
  },
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
      if (state.sound && state.isPlaying) {
        state.sound.stop();
        return { isPlaying: false };
      }
      return {};
    });
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
  playStartSound: () => {
    set((state) => {
      state.startSound.play();
      return {};
    });
  },
}));

export default SoundStore;
