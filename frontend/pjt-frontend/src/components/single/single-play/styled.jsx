import styled from 'styled-components';

const PlayView = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-image: url('/src/assets/background-single.png');
  background-size: cover;
  color: black;
`;

const ImageBox = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100%;
`;

const DialogueBox = styled.div`
  position: fixed;
  bottom: 10px;
  left: 5vw;
  width: 70vw;
  height: 180px;
  background-color: rgba(240, 240, 240, 0.9);
  border-radius: 0.4em;
  font-size: 1.3em;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 85%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-right-color: rgba(240, 240, 240, 0.8);
    border-left: 0;
    border-top: 0;
    margin-top: -10px;
    margin-left: -20px;
  }
`;

const DialogueHeader = styled.div`
  // display: flex;
  justify-content: space-between;
`;

const DialogueButton = styled.button`
  /* 버튼 스타일을 여기에 추가하세요 */
`;
const DialogueBody = styled.div`
  /* 버튼 스타일을 여기에 추가하세요 */
  display: flex;
  padding: 10px;
  // justify-content: space-between;
`;
const DialogueBodyLeft = styled.div``;
const DialogueBodyRight = styled.div`
  position: fixed;
  height: 180px;
  left: 78vw;
  bottom: 10px;
  color : white;
  // background-color: rgba(240, 240, 240, 0.9);
`;
const DialogueContent = styled.div`
  /* 버튼 스타일을 여기에 추가하세요 */
  margin-left: 10px;
`;

const CharacterImage = styled.img`
  position: fixed;
  height: 600px;
  left: 30vw;
  bottom: 0px;
`;

const CharacterName = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  height: 20px;
  font-size: 1em;
  border-radius: 10px;
  border: 1px solid black;
  background-color: rgba(240, 240, 240, 0.8);
  padding : 5px;
  padding-right : 15px;
`;

const S = {
  PlayView,
  DialogueBody,
  DialogueBodyLeft,
  DialogueBodyRight,
  DialogueBox,
  DialogueButton,
  DialogueHeader,
  DialogueContent,
  CharacterImage,
  CharacterName,
  ImageBox,
};
export default S;
