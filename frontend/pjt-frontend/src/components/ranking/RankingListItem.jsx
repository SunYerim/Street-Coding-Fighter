import styled from "styled-components";

export default function RankingListItem({ rank, player }) {
  console.log(player);
  return (
    <RankingItemContainer>
      <h4>{rank}</h4>
      <ProfileImageContainer>
        {/* <img src="..\..\src\assets\single-test.webp" alt="profileImage" /> */}
      </ProfileImageContainer>
      <div>{player?.name}</div>
      <div>{player?.exp}</div>
    </RankingItemContainer>
  );
}

const RankingItemContainer = styled.div`
  display: flex;
  background-color: #d9d9d9;
  border-radius: 10px;
  width: 300px;
  margin: 10px;
  padding: 5px;
  padding-left: 20px;
  align-items: center;
`;

const ProfileImageContainer = styled.div`
  width: 50px;
  height: 50px;
  background-image: url("../../../src/assets/single-test.webp");
  background-size: cover;
  border-radius: 50%;
`;

const NameContainer = styled.div``;

const ScoreContainer = styled.div``;

const LeaderBoardPlayerLayouts = {
  ProfileImageContainer,
  NameContainer,
  ScoreContainer,
};

export { LeaderBoardPlayerLayouts };
