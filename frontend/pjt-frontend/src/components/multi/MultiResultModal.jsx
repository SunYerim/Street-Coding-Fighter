import React, { useRef, useEffect, useState } from "react";
import MultiRanking from "./MultiRanking.jsx";
import JSConfetti from 'js-confetti';


const MultiResultModal = () => {
  
  const [modalOpen, setModalOpen] = useState(true);
  const modalOutside = useRef();
  const [jsConfetti, setJsConfetti] = useState(null);

  useEffect(() => {
      setJsConfetti(new JSConfetti());
  }, []);

  const handleClick = () => {
    if (jsConfetti) {
      jsConfetti.addConfetti({
        confettiColors: [
          "#CAB0FF"
        ],
        confettiNumber: 500,
      });
    }
  };

  const handleModalClick = (e) => {
    if (e.target === modalOutside.current) {
      setModalOpen(false);
    }
    handleClick(); // Trigger confetti when the modal is clicked
  };

  return (
    <>
      {
        modalOpen &&
        <div
          className={'result-modal-container'}
          ref={modalOutside}
          onClick={handleModalClick}
        >
          <div className="result-modal-content">
              <MultiRanking />
          </div>
        </div>
      }
    
    </>
  );
}

export default MultiResultModal;
