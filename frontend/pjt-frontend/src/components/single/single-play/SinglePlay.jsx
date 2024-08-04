import React, { useEffect, useState } from 'react';
import S from './styled';
import { FaRegCommentDots } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { PiMouseRightClick, PiMouseLeftClick } from 'react-icons/pi';
import { TypeAnimation } from 'react-type-animation';
import { useParams } from 'react-router-dom';
import SingleBanner from './SingleBanner.jsx';
import SoundStore from '../../../stores/SoundStore.jsx';
import SingleSoundStore from '../../../stores/SingleSoundStore.jsx'; // SingleSoundStore import 추가
import { style } from '@mui/system';

export default function SinglePlay() {
  const [page, setPage] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false); // DialogueBox를 표시할지 여부를 결정하는 상태
  const { content_id } = useParams();
  const dialogueList = [
    {
      page_no: 0,
      script_content: '첫번째 줄 \n 두번째 줄 \n 세번째 줄',
      action: 0,
      imageCount: 0,
    },
    {
      page_no: 1,
      script_content: '두번째 페이지 줄 \n 두번째 줄 \n 세번째 줄',
      action: 1,
      imageCount: 1,
    },
    {
      page_no: 3,
      script_content: '세번째 페이지 줄 \n 두번째 줄 \n 세번째 줄',
      action: 2,
      imageCount: 2,
    },
    {
      page_no: 4,
      script_content: '네번째 페이지 \n 두번째 줄 \n 세번째 줄',
      action: 3,
      imageCount: 1,
    },
  ];

  useEffect(() => {
    // 싱글 플레이 모드 진입 시
    SoundStore.getState().stopBackgroundMusic();
    SingleSoundStore.getState().playSingleBgm();

    const timer = setTimeout(() => {
      setShowDialogue(true); // 2초 후에 DialogueBox를 표시하도록 설정
    }, 2000);

    return () => {
      // 싱글 플레이 모드 종료 시
      SingleSoundStore.getState().stopSingleBgm();
      SoundStore.getState().playBackgroundMusic();
      clearTimeout(timer);
    };
  }, []);
  const { playClickSoundSingle } = SingleSoundStore();
  const nextPage = () => {
    if (page < dialogueList.length - 1) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage(dialogueList.length - 1);
    }
    playClickSoundSingle();
    console.log(page);
  };

  const prevPage = (event) => {
    event.preventDefault();
    if (0 < page) {
      setPage((prevPage) => prevPage - 1);
    } else {
      setPage(0);
    }
    playClickSoundSingle();
    console.log(page);
  };

  const currentDialogue = dialogueList[page];
  const ChatButton = () => {
    return <div style={styles.chatButton}>채팅(아이콘으로바꿀꺼)</div>;
  };

  const renderImages = () => {
    const images = [];
    for (let i = 0; i < currentDialogue.imageCount; i++) {
      images.push(
        <S.ImageContentBox
          key={i}
          style={{
            top: currentDialogue.imageCount === 1 ? '30vh' : `${20 + i * 25}vh`,
            right: currentDialogue.imageCount === 1 ? '20vw' : '30vw',
            width: currentDialogue.imageCount === 1 ? '30vw' : '20vw',
            height: currentDialogue.imageCount === 1 ? '40vh' : '20vh',
          }}
        >
          <img
            src={`/image-content-${i + 1}.png`}
            alt={`content ${i + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </S.ImageContentBox>
      );
    }
    return images;
  };

  return (
    <S.PlayView>
      <SingleBanner />
      <S.ImageBox>
        {renderImages()}
        <S.CharacterImage
          src="/character-test-removebg-preview.png"
          alt=""
          style={{
            left: currentDialogue.imageCount > 0 ? '10vw' : '30vw',
          }}
        />
      </S.ImageBox>
      {showDialogue && (
        <S.DialogueSection>
          <ChatButton></ChatButton>
          <S.DialogueBox onClick={nextPage} onContextMenu={prevPage}>
            <S.DialogueHeader>
              <S.CharacterName>
                <span>
                  <CgProfile />
                  <span> Hoshino Ai {content_id}</span>
                </span>
              </S.CharacterName>
            </S.DialogueHeader>

            <S.DialogueBody>
              <S.DialogueBodyLeft>
                <p>
                  <FaRegCommentDots />
                </p>
              </S.DialogueBodyLeft>
              <S.DialogueContent>
                <TypeAnimation
                  key={page}
                  style={{
                    color: 'black',
                    whiteSpace: 'pre-line',
                  }}
                  sequence={[currentDialogue.script_content, 500]}
                  wrapper="p"
                  speed={50}
                />
              </S.DialogueContent>
            </S.DialogueBody>
            <S.DialogueBodyRight>
              <p>
                <PiMouseLeftClick /> 클릭 : 다음
              </p>
              <p>
                <PiMouseRightClick /> 우클릭 : 이전
              </p>
            </S.DialogueBodyRight>
          </S.DialogueBox>
        </S.DialogueSection>
      )}
    </S.PlayView>
  );
}


const styles = {
  chatButton : {
    position: 'fixed',
    right : '10px',
    bottom : '30vh'
  }
}