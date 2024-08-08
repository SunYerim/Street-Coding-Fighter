import React, { useEffect, useState } from 'react';
import S from './styled';
import { FaRegCommentDots } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { PiMouseRightClick, PiMouseLeftClick } from 'react-icons/pi';
import { TypeAnimation } from 'react-type-animation';
import { useParams, useNavigate } from 'react-router-dom';
import SoundStore from '../../../stores/SoundStore.jsx';
import SingleBanner from './SingleBanner.jsx';
import ChatModal from './chat-modal/ChatModal.jsx';
import axios from 'axios';
import store from '../../../store/store';
import Loading from '../../loading/Loading.jsx';
import ReactModal from 'react-modal';
import SingleInfoStore from '../../../stores/SingleInfoStore.jsx';
import Setting from '../../sanghyeon/components/Setting.jsx';
import { IoIosLogOut, IoIosSettings, IoIosClose } from 'react-icons/io';
import { display } from '@mui/system';

const testDialogueList = [
  {
      "pageNo": 0,
      "scriptContent": "안녕! 나는 너희에게 프로그래밍을 \n 가르쳐줄 고양이 선생님이다냥. \n 아직 이름은 없다냥!",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 1,
      "scriptContent": "나는 프로그래밍의 기초부터 \n 하나씩 차근차근 알려줄 거다냥. \n 같이 열심히 공부하자냥!",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 2,
      "scriptContent": "오늘은 첫 시간으로 변수가 무엇인지 \n 알아볼 거다냥. 기대된다냥?",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 3,
      "scriptContent": "프로그래밍이란 무엇일까냥? 프로그래밍은 \n 컴퓨터에게 명령을 내려서 일을 시키는 거다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 4,
      "scriptContent": "그럼 변수란 무엇일까냥? \n 변수를 한 마디로  정의하자면,  \n 값을 저장하는 이름표라고 할 수 있다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 5,
      "scriptContent": "변수는 메모리 공간에 있는 값에 이름을 \n 붙여주는 역할을 한다냥. \n 이렇게 하면 값을 쉽게 찾을 수 있다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 6,
      "scriptContent": "변수는 어떠한 “한 값”을 가지고 있는 \n “메모리 공간 주소”에 붙인 “이름” \n 또는 메모리 공간 그 자체다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 7,
      "scriptContent": "여기서 값이란, 메모리에 저장된 데이터를 \n 의미한다냥. 이 값은 숫자, 문자열, \n 리스트 등 여러 가지 형태로 존재할 수 있다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 8,
      "scriptContent": "예를 들어, x = 5 라고 하면 \n x라는 이름의 변수에 5라는 값이 \n 저장되는 거다냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 9,
      "scriptContent": "이때 = 기호는 할당 연산자라고 부르는데, \n 오른쪽의 값을 왼쪽의 변수에 \n 저장하는 역할을 한다냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 10,
      "scriptContent": "그래서 x = 5는 5라는 값을 \n x라는 변수에 저장하라는 의미다냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 11,
      "scriptContent": "변수의 값은 언제든지 바꿀 수 있다냥. \n 이번엔 x = 10으로 바꿔볼까냥?",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 12,
      "scriptContent": "이렇게 하면 x는 이제 10이라는 \n 새로운 값을 가지게 된다냥. \n 간단하다냥!",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 13,
      "scriptContent": "변수의 이름을 정할 때는 규칙이 있다냥. \n 알파벳, 숫자, 밑줄(_)만 사용할 수 있고, \n 숫자로 시작할 수 없다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 14,
      "scriptContent": "예를 들어, 1cat은 안 되지만 \n cat1은 가능하다냥. \n 그리고 대소문자를 구분한다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 15,
      "scriptContent": "변수명을 정할 때는 의미 있는 이름을 사용하는 것이 좋다냥. \n 예를 들어, numCats 같은 이름이 좋다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 16,
      "scriptContent": "이제 변수를 이용해 값을 교환하는 방법을 알아보겠다냥. \n 예를 들어, x와 y의 값을 바꾸고 싶다면...",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 17,
      "scriptContent": "temp = x \n x = y \n y = temp \n 이렇게 하면 x와 y의 값이 서로 바뀌게 된다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 18,
      "scriptContent": "파이썬에서는 더 간단하게 \n x, y = y, x \n 이렇게 한 줄로도 값을 바꿀 수 있다냥!",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 19,
      "scriptContent": "변수는 프로그램에서 데이터를 \n 저장하고 다루는 기본적인 도구다냥. \n 그래서 기초가 아주 중요하다냥!",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 20,
      "scriptContent": "할당이란 값을 변수에 저장하는 \n 과정을 말한다냥. x = 5는 5라는 값을 \n x에 할당하는 것이다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 21,
      "scriptContent": "값이란 변수에 저장된 데이터를 \n 의미한다냥. 숫자, 문자열, 리스트 등 \n 다양한 값이 있을 수 있다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 22,
      "scriptContent": "평가란 표현식이나 문을 실행하여 \n 하나의 값을 얻는 과정을 말한다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 23,
      "scriptContent": "예를 들어, x + 2는 x의 값에 \n 2를 더한 결과를 평가하여 \n 새로운 값을 얻는 것이다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 24,
      "scriptContent": "변수를 왜 사용하는지에 대해 \n 설명할게다냥. 변수를 사용하면 \n 같은 값을 여러 번 재사용할 수 있다냥.",
      "action": 0,
      "imageCount": 0
  },
  {
      "pageNo": 25,
      "scriptContent": "예를 들어, print(1)을 사용해 \n 1을 세 번 출력한다고 생각해보자냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 26,
      "scriptContent": "하지만, 2를 3번 출력한다고 바꾸면 \n print(1)에서 1을 세 번 바꿔야 한댜냥 \n 무한대로 늘렸을 때는? 너무 귀찮다냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 27,
      "scriptContent": "또한 특정 1만 2로 바꿔야 한다면? \n 어떤 기준으로 바꿔야 하는지 알 수 없다냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 28,
      "scriptContent": "그래서 변수를 통한 데이터 관리는 \n 프로그래밍에서 필수적이다냥.",
      "action": 0,
      "imageCount": 1
  },
  {
      "pageNo": 29,
      "scriptContent": "다음 시간에는 자료형에 대해 \n 알아보겠다냥. 그럼 다음에 또 만나자냥!",
      "action": 0,
      "imageCount": 0
  }
]



export default function SinglePlay() {
  const [page, setPage] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const { content_id } = useParams();
  const navigate = useNavigate();
  const [dialogueList, setDialogueList] = useState(testDialogueList);
  const { completed } = SingleInfoStore();
  const { switchBackgroundMusic, playBackgroundMusic, playEffectSound } = SoundStore();
  const { baseURL, accessToken, memberId } = store();
  const [showCharacter, setShowCharacter] = useState(false); //캐릭터 보이기/안보이기 상태 추가
  const [isClickable, setIsClickable] = useState(true);
  //캐릭터 애니메이션 상태 추가
  // const [isVibrating, setIsVibrating] = useState(false);

  const isVibrating = dialogueList?.[page].action === 1;
  const isCloseUp = dialogueList?.[page].action === 2;
  useEffect(() => {
    switchBackgroundMusic('single', (newBackgroundMusic) => {
      newBackgroundMusic.play();
    });
      axios({
        method: 'get',
        url: `${baseURL}/single/${content_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MCIsImF1dGgiOiJVU0VSIiwibWVtYmVySWQiOjkwLCJ1c2VybmFtZSI6IuqwgOyghOyCrOyXheu2gC3quYDrr7zsmrEiLCJpYXQiOjE3MjMxMDM3NjgsImV4cCI6MTcyMzEwNzM2OH0.Qy2T-1du9CNOfrGZi_1axMkE4jSsmeKKjXR_TdZCqY0`,
        },
      })
        .then((response) => {
          console.log(response.data)
          console.log(content_id);
          console.log(`${baseURL}/single/${content_id}`);
          const data = response.data;
          setDialogueList(data.detailList);
          // 여기서 데이터 로드함!! 로그 확인하고 주석해제 ㄱㄱ
          setLoading(true);
        })
        .catch((error) => {
          console.error('Error fetching content: ', error);
          setLoading(false);
        });
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const timer = setTimeout(() => {
      setShowDialogue(true);
    }, 3000);

    return () => {
      switchBackgroundMusic('main', (newBackgroundMusic) => {
        newBackgroundMusic.play();
      });
      clearTimeout(timer);
    };
  }, [content_id]); 

  const changePage = (increment) => {
    console.log('click');
    if (loading || !showDialogue) return;

    // 모달이 열려있으면 모달을 닫고 함수 종료
    if (isModalOpen) {
      handleCloseModal();
      return;
    }
    // console.log(isModalOpen);
    // 채팅이 열려있으면 페이지 변경을 하지 않고 함수 종료
    // if (isChatOpen) {
    //   // console.log(isChatOpen);
    //   handleChatOpen();
    //   return;
    // }
    // console.log('111');
    // console.log(page);

    //넘어가면 안될때 누르면 바로 return!
    console.log(isClickable);
    if (!isClickable) {
      return;
    }

    // 클릭이 불가능하게 만든 후 1초 후 클릭이 가능하게 상태 변경
    // 대사 넘어가고나서 1초동안 못넘어가게하기
    setIsClickable(false);
    console.log('false로 바뀜');
    setTimeout(() => {
      setIsClickable(true);
      console.log('true로 바뀜');
    }, 1500);
    if (increment) {
      if (page < dialogueList.length - 1) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setIsModalOpen(true);
      }
    } else {
      if (0 < page) {
        setPage((prevPage) => prevPage - 1);
      } else {
        setPage(0);
      }
    }
    if (dialogueList[page].action == 1) {
      // setIsVibrating(true);
      // console.log('vibrating');
      // setTimeout(() => {
        // setIsVibrating(false);
      // }, 2000);
    }
    playEffectSound('singleClickSound');
    console.log(page);
  };
  const handleChatOpen = () => {
    // console.log('chat handle');
    if (isChatOpen) {
      setIsChatOpen(false); // 채팅 닫기
    } else {
      setIsChatOpen(true); // 채팅 열기
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const openExitModal = () => {
    setIsExitModalOpen(true);
  };
  const closeExitModal = () => {
    setIsExitModalOpen(false);
  };
  const goToList = (isFinish) => {
    if (isFinish && !completed[content_id]?.complete) {
      axios({
        method: 'post',
        url: `${baseURL}/single`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    navigate('/single-main');
  };

  const currentDialogue = dialogueList[page] || {};

  const openSettingModal = () => {
    setIsSettingOpen(true);
  };
  const closeSettingModal = () => {
    setIsSettingOpen(false);
  };
  const ChatButton = () => {
    const handleClick = (e) => {
      e.stopPropagation(); // 페이지 이동을 방지
      handleChatOpen();
    };
    if (!isChatOpen) {
      return (
        <div style={styles.chatButton} onClick={handleClick}>
          채팅
        </div>
      );
    }

    return (
      <div style={styles.chatButton} onClick={handleClick}>
        채팅
        <ChatModal />
      </div>
    );
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
            src={`/single-image/${content_id}/${content_id}-${page}-${i + 1}.png`}
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

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <S.PlayView
        onClick={() => {
          changePage(true);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          changePage(false);
        }}
      >
        <SingleBanner />

        <S.ImageBox>
          {renderImages()}
          <S.CharacterImage
            src="/character-test-removebg-preview.png"
            alt=""
            style={{
              left: currentDialogue.imageCount > 0 ? '10vw' : '30vw',
            }}
            $isVibrating={isVibrating}
            $isCloseUp={isCloseUp}
          />
        </S.ImageBox>
        {showDialogue && (
          <S.DialogueSection>
            {/* <ChatButton></ChatButton> */}
            {/* 채팅 버튼 비활성화 */}
            <S.DialogueBox>
              <S.DialogueHeader>
                <S.CharacterName>
                  <span>
                    <CgProfile />
                    <span>  야옹 선생</span>
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
                    sequence={[currentDialogue.scriptContent, 500]}
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
      <ReactModal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>학습 완료</h2>
        </div>
        <div onClick={handleCloseModal} style={styles.closeButton}>
          <IoIosClose></IoIosClose>
        </div>
        <hr />
        <div style={styles.modalContent}>
          <h2>학습을 완료하시겠습니까?</h2>
          <div style={styles.modalButtons}>
            <S.CompleteButton onClick={() => goToList(true)}>학습 완료</S.CompleteButton>
            <S.CancelButton onClick={handleCloseModal}>돌아가기</S.CancelButton>
          </div>
        </div>
      </ReactModal>
      <ReactModal isOpen={isExitModalOpen} onRequestClose={closeExitModal} style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>나가기</h2>
        </div>
        <div onClick={closeExitModal} style={styles.closeButton}>
          <IoIosClose></IoIosClose>
        </div>
        <hr />
        <div style={styles.modalContent}>
          <p>목록으로 돌아가시겠습니까?</p>
          <p>미완료된 진행사항은 저장되지 않습니다.</p>
          <div style={styles.modalButtons}>
            <S.CompleteButton onClick={() => goToList(false)}>나가기</S.CompleteButton>
            <S.CancelButton onClick={closeExitModal}>돌아가기</S.CancelButton>
          </div>
        </div>
      </ReactModal>
      <S.MenuContainer>
        <S.MenuButton onClick={openSettingModal}>
          <IoIosSettings />
        </S.MenuButton>
        <S.MenuButton onClick={openExitModal}>
          <IoIosLogOut />
        </S.MenuButton>
      </S.MenuContainer>
      <Setting isOpen={isSettingOpen} onClose={closeSettingModal}></Setting>
    </>
  );
}
const styles = {
  chatButton: {
    position: 'fixed',
    right: '10px',
    bottom: '30vh',
    backgroundColor: 'yellow',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30px',
    margin: '0px',
  },
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '30px',
    cursor: 'pointer',
  },
  modalContent: {
    textAlign: 'center',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    border: 'none',
    // cursor: 'pointer',
  },
  completeButton: {
    padding: '10px 20px',
    backgroundColor: '#76DCFE', // 진한 하늘색
    color: '#233551',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#D1E7EF', // 하늘색
    color: '#233551',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modal: {
    content: {
      width: '500px',
      height: 'auto',
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '10px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    },
  },
};
