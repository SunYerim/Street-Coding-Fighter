import SinglePlay from './single-play/SinglePlay.jsx';
import EpisodeList from './single-list/EpisodeList.jsx';
import Container from '../../components/sanghyeon/components/Container.jsx';
import '../../css/Container.css';
import styled from 'styled-components';

export default function SingleMain() {
  return (
    <div id="container">
      <TitleDiv>
        <h1>Tutorials</h1>
      </TitleDiv>
        <EpisodeList rownum={3}></EpisodeList>
    </div>
  );
}

const TitleDiv = styled.div`
    display: flex;
    justify-content: center;
    margin : 15px 0px;
    `;
