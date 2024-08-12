  function Timer({ setTimerEnded }) {
    useEffect(() => {
      if (count <= 0) {
        setTimerEnded(true);
        return;
      }
  
      const id = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
  
      return () => clearInterval(id);
    }, [count]);
  
    useEffect(() => {
      if (timerEnded && !isSubmitRef.current) {
        // 타이머가 끝났을 때 문제 제출 로직을 처리
        switch (problemList[round].problemType) {
          case "FILL_IN_THE_BLANK":
            setBlankSolve(null);
            handleBlankAnswer();
            break;
          case "SHORT_ANSWER_QUESTION":
            handleShortAnswer(null);
            break;
          case "MULTIPLE_CHOICE":
            handleChoiceSelection(null);
            break;
          default:
            console.log("Unknown problem type: " + problemList[round].problemType);
        }
        isSubmitRef.current = true;
      }
    }, [timerEnded]);
  
    return <div><span>{count}</span></div>;
  }
