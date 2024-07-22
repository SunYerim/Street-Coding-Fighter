import SinglePlay from './single-play/SinglePlay.jsx';
import EpisodeList from './single-list/EpisodeList.jsx';
import Container from '../../components/sanghyeon/components/Container.jsx';
import '../../css/Container.css';

export default function SingleMain() {
  return (
    <div id="container">
      <h1>Tutorials</h1>
      <EpisodeList rownum={3}></EpisodeList>
    </div>
  );
}
