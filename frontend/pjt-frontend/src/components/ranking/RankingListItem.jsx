import styled from 'styled-components';

export default function RankingListItem() {
  return (
    <RankingItemContainer>
      <h4>4</h4>
      <ProfileImageContainer>
      {/* <img src="..\..\src\assets\single-test.webp" alt="profileImage" /> */}
      
      </ProfileImageContainer>
      <div>name</div>
      <div>10000000</div>
    </RankingItemContainer>
  );
}

const RankingItemContainer = styled.div`
  display: flex;
  background-color : #D9D9D9;
  border-radius : 10px;
  width : 300px;
  margin : 10px;
  padding : 5px;
  padding-left : 20px;
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

export {LeaderBoardPlayerLayouts};