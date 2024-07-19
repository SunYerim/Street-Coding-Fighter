import EpisodeList from './episode-list/EpisodeList.jsx';
import SinglePlay from './single-play/SinglePlay.jsx';
export default function SingleMain(){
  return (
    <div>
      <SinglePlay></SinglePlay>
      <h1>Tutorials</h1>
      <EpisodeList/>
      <EpisodeList/>
      <EpisodeList/>
    </div>
  )
}