import Header from "../components/Header";
import "../../../css/ItemPage.css";
import { useRef, useState } from "react";
import createAuthClient from "../apis/createAuthClient";
import Swal from "sweetalert2";
import store from "../../../store/store.js";
import pixelTicket from "/pixel-ticket.jpg";
import renderCharacter from "../apis/renderCharacter.js";

const ItemPage = () => {
  const {
    baseURL,
    accessToken,
    setAccessToken,
    character,
    setCharacter,
    exp,
    setExp,
    name,
  } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    character: state.character,
    setCharacter: state.setCharacter,
    exp: state.exp,
    setExp: state.setExp,
    name: state.name,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const overlay = overlayRef.current;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 45;
    const rotateY = ((centerX - x) / centerX) * 45;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    overlay.style = `background-position: ${
      (centerX - x) / 5 + (centerY - y) / 5
    }%`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    card.style.transform = `rotateX(0) rotateY(0)`; // 원상 복귀
    overlay.style.backgroundPosition = `100% 100%`; // 애니메이션과 함께 되돌리기
  };

  const purchaseCharacterTicket = async () => {
    if (exp < 500) {
      Swal.fire({
        icon: "error",
        title: "포인트 부족",
        text: "포인트가 부족합니다.",
        timer: 3000,
      });
    }

    try {
      const purchaseRes = await authClient({
        method: "GET",
        url: "/user/gacha/character-type",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const nextCharacter =
        purchaseRes.data.characterType * 100 + (character % 100);
      setCharacter(nextCharacter);
      setExp(exp - 500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "아이템 구매 실패",
        text: "아이템 구매에 실패하였습니다. 다시 시도해주세요.",
        timer: 3000,
      });
    }
  };

  const purchaseClothesTicket = async () => {
    if (exp < 500) {
      Swal.fire({
        icon: "error",
        title: "포인트 부족",
        text: "포인트가 부족합니다.",
        timer: 3000,
      });
    }

    try {
      const purchaseRes = await authClient({
        method: "GET",
        url: "/user/gacha/character-cloth",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const nextCharacter =
        character - (character % 100) + purchaseRes.data.characterClothType;
      setCharacter(nextCharacter);
      setExp(exp - 500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "아이템 구매 실패",
        text: "아이템 구매에 실패하였습니다. 다시 시도해주세요.",
        timer: 3000,
      });
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "알쏭달쏭 캐릭터 티켓",
      description:
        "사용하면 프로필의 캐릭터를 10가지 캐릭터와 일부 특별한 캐릭터 중 임의로 바꿔 주는 아이템입니다. 아이템을 사용하는 순간 프로필의 캐릭터가 바뀌며 영구적으로 적용되고, 현재 캐릭터는 사라집니다.",
      imgSrc: pixelTicket,
      buttonText: "구매 (500 P)",
      onClick: () => purchaseCharacterTicket(), // 여기에 클릭 핸들러 추가
    },
    {
      title: "알쏭달쏭 의상 티켓",
      description:
        "사용하면 프로필의 캐릭터의 의상을 10가지 의상과 일부 특별한 의상 중 임의로 바꿔 주는 아이템입니다. 아이템을 사용하는 순간 프로필의 캐릭터의 의상이 바뀌며 영구적으로 적용되고, 현재 의상은 사라집니다.",
      imgSrc: pixelTicket,
      buttonText: "구매 (500 P)",
      onClick: () => purchaseClothesTicket(), // 여기에 클릭 핸들러 추가
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  useEffect(() => {
    const getProfile = async () => {
      if (name) return;

      try {
        const profileRes = await authClient({
          method: "GET",
          url: `${baseURL}/profile`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setName(profileRes.data.name);
        setSchoolName(profileRes.data.school);
        setBirth(profileRes.data.birth);
        setCharacter(profileRes.data.character);
        setExp(profileRes.data.exp);
      } catch (error) {
        Swal.fire({
          text: "프로필을 불러오는데 실패했습니다.",
          icon: "error",
          timer: 3000,
        });
        console.log(error);
      }
    };

    getProfile();
  }, []);

  return (
    <>
      <div className="item-outer-outer-container">
        <Header />
        <div className="item-outer-container">
          <div className="item-container">
            <div className="item-inner-container">
              <div className="item-left-container">
                <div className="item-title-container">
                  <div className="item-title">아이템 샵</div>
                </div>
                <div className="item-point-container">
                  <div className="item-point">포인트: 1,000,000 P</div>
                </div>
                <div className="item-info-container">
                  <div className="carousel">
                    <div
                      className="carousel-inner"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {slides.map((slide, index) => (
                        <div className="carousel-item" key={index}>
                          <div className="item-info-upper-container">
                            <div className="item-info-img-container">
                              <img src={slide.imgSrc} alt="item" />
                            </div>
                            <div className="item-info-title-container">
                              {slide.title}
                            </div>
                          </div>
                          <div className="item-info">{slide.description}</div>
                          <div className="item-info-button-container">
                            <button onClick={slide.onClick}>
                              {slide.buttonText}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control prev"
                      onClick={prevSlide}
                    >
                      &#10094;
                    </button>
                    <button
                      className="carousel-control next"
                      onClick={nextSlide}
                    >
                      &#10095;
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="item-right-container"
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="item-character-overlay" ref={overlayRef}></div>
                <div className="item-character-outer-container">
                  <div className="item-character-inner-container">
                    <div className="item-character-rank-container">
                      <div className="item-character-rank">R</div>
                    </div>
                    <div className="item-character-img-container">
                      <img
                        src={renderCharacter(character)}
                        alt="my-character"
                      />
                    </div>
                    <div className="item-character-name-container">
                      <div className="item-character-name">The Slime.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemPage;
