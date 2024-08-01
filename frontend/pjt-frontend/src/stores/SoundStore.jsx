import { create } from "zustand";
import { Howl } from 'howler';

const SoundStore = create((set) => ({
  sound: null,
  play: () => {
    set((state) => {
      state.sound && state.sound.play();
      return {};
    });
  },
  pause: () => {
    set((state) => {
      state.sound && state.sound.pause();
      return {};
    });
  },
  setSound: (src) => {
    const sound = new Howl({
      src: [src],
      loop: true,
      volume: 0.5,
      onplayerror: (id, error) => {
        console.error('Audio play failed:', error);
        sound.once('unlock', () => {
          sound.play();
        });
      },
    });

    set({ sound });
  },
}));

export default SoundStore;
