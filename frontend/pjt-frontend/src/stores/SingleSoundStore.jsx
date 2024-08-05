import { create } from 'zustand';
import { Howl } from 'howler';
import SoundStore from './SoundStore';
const SingleSoundStore = create((set) => ({
  singleBgm: () => {

    new Howl({
      src: ['/single-bgm.mp3'],
      loop: true,
      volume: 0.3,
    })
    console.log('single bgm constructed');
  }
  ,
  isPlayingSingle: false,
  clickSoundSingle: new Howl({
    src: ['/single-click.mp3'], // 효과음 파일 경로
    volume: 1,
  }),
  playSingleBgm: () => {
    set((state) => {
      SoundStore.getState().stopBackgroundMusic()
      if (state.singleBgm && !state.isPlayingSingle) {
        state.singleBgm.play();
        return { isPlayingSingle: true };
      }
      return {};
    });
  },
  stopSingleBgm: () => {
    set((state) => {
      if (state.singleBgm && state.isPlayingSingle) {
        state.singleBgm.stop();
        return { isPlayingSingle: false };
      }
      return {};
    });
  },
  playClickSoundSingle: () => {
    set((state) => {
      state.clickSoundSingle.play();
      console.log('clickSoundSingle');
      return {};
    });
  },
}));

export default SingleSoundStore;
