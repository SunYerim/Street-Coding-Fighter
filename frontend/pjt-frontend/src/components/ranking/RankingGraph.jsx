import styled from 'styled-components';
import { LeaderBoardPlayerLayouts as P } from './RankingListItem';
import useLeaderboardStore from '../../../stores/LeaderboardStore.jsx';

const RankingGraph = () => {
  const { rankingList, setRankingList, boardPeriod, setBoardPeriod } = useLeaderboardStore();
  const PodiumPlayer = ({rank}) => {
    const player = rankingList[boardPeriod]?.[rank];
    // console.log(rankingList[boardPeriod][rank])
    if(!player){
      return <div>No player data</div>;
    }
    return (
      <>
        <P.ProfileImageContainer></P.ProfileImageContainer>
        <P.NameContainer>{player.name}</P.NameContainer>
        <P.ScoreContainer>score</P.ScoreContainer>
      </>
    );
  };
  return (
    <>
      <GraphContainer>
        <LeaderBoardSecond>
          <PodiumPlayerContainer>
            <PodiumPlayer rank={2}></PodiumPlayer>
          </PodiumPlayerContainer>
        </LeaderBoardSecond>
        <LeaderBoardFirst>
          <PodiumPlayerContainer>
            <PodiumPlayer rank={1}></PodiumPlayer>
          </PodiumPlayerContainer>
        </LeaderBoardFirst>
        <LeaderBoardThird>
          <PodiumPlayerContainer>
            <PodiumPlayer rank={3}></PodiumPlayer>
          </PodiumPlayerContainer>
        </LeaderBoardThird>
      </GraphContainer>
    </>
  );
}
export default RankingGraph;
const GraphContainer = styled.div`
  display: flex;
  background-color: gray;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  width: 40vw;
  height: 50vh;
`;

const LeaderBoardFirst = styled.div`
  position: relative;

  margin: 0px 20px;
  background-color: gold;
  width: 20%;
  height: 160px;
`;
const LeaderBoardSecond = styled.div`
  position: relative;
  background-color: silver;
  width: 20%;
  height: 120px;
`;
const LeaderBoardThird = styled.div`
  position: relative;
  background-color: brown;
  width: 20%;
  height: 80px;
`;
const PodiumPlayerContainer = styled.div`
  position: absolute;
  bottom: 100%;
`;
