import styled from 'styled-components';
import React, { useState } from 'react';
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
  width: 90vw;
  height: 180px;
  background-color: rgba(240, 240, 240, 0.9);
  border-radius: 0.4em;
  font-size: 1.3em;

  &:after {
    content: '';
    position : absolute;
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
  left : 20px;
  height : 20px;
  font-size :1em;
  border-radius: 10px;
  background-color: rgba(240, 240, 240, 0.8);
`;

export default function SinglePlay() {
  const [page, setPage] = useState(0);
  const dialogueList = [
    {
      page_no: 0,
      script_content: '<p>첫번째줄 대사입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>'
    },
    {
      page_no: 1,
      script_content: '<p>두번째페이지입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>'
    },
  ]
  const nextPage = ()=>{
    if(page < dialogueList.length-1){
      setPage((prevPage) => prevPage + 1);
    }
    else{
      setPage(0);
    }
    console.log(page);

  }
  return (
    <PlayView>
      <ImageBox>
        <CharacterImage src="/src/assets/character-test-removebg-preview.png" alt="" />
      </ImageBox>
      <DialogueBox onClick ={nextPage}>
        <DialogueHeader>
          <CharacterName>Hoshino Ai</CharacterName>
        </DialogueHeader>
        <DialogueBody dangerouslySetInnerHTML={{__html:dialogueList[page].script_content}}>
        </DialogueBody>
      </DialogueBox>
    </PlayView>
  );
}
