import { useState } from 'react';
import reactStringReplace from 'react-string-replace';

const testQuizContent = {
  content:
    'def bubble_sort(arr):\n    n = len(arr)  \n    for i in range(n):  \n        for j in range(0, n - i - 1):  \n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[$blank1$], arr[$blank2$]\n\n# 테스트용 리스트\ndata = [64, 34, 25, 12, 22, 11, 90]\n\n# 정렬 함수 호출\nbubble_sort($blank3$)\nprint("정렬된 리스트:", data)',
  answer: {
    1: 'j + 1',
    2: 'j',
    3: 'data',
  },
  choices: {
    1: 'i',
    2: 'i+1',
    3: 'j+1',
    4: 'j',
    5: 'data',
    6: 'print',
  },
};

const Blank = ({ id, children, onDrop }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    onDrop(id, data);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.currentTarget.classList.add('over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('over');
  };

  return (
    <div
      className="blank"
      key={`blank-${id}`}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      {children ? <Choice isInBlank={true}>{children}</Choice> : null}
    </div>
  );
};

const Choice = ({ id, children, isInBlank }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text', children);
  };

  return (
    <div className={!isInBlank ? 'choice' : 'choice-inblank'} key={`choice-${id}`} draggable="true" onDragStart={handleDragStart}>
      {children}
    </div>
  );
};

const ChoiceContainer = ({ onDrop, children }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    onDrop(null, data);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="choices-container" onDrop={handleDrop} onDragOver={handleDragOver}>
      {children}
    </div>
  );
};

const DragNDropQuiz = () => {
  const [blanks, setBlanks] = useState({});
  const [choices, setChoices] = useState(Object.values(testQuizContent.choices));

  const handleDrop = (id, data) => {
    setBlanks((prev) => {
      const newBlanks = { ...prev };

      if (id !== null) {
        // 빈칸에 새로운 선택지가 드롭될 때, 기존 선택지를 choices로 되돌림
        if (newBlanks[id]) {
          setChoices((prevChoices) => [...prevChoices, newBlanks[id]]);
        }
        newBlanks[id] = data;
      }

      return newBlanks;
    });

    // 새로운 선택지가 choices에서 사라지도록 업데이트
    setChoices((prevChoices) => {
      if (id === null) {
        return [...prevChoices, data];
      }
      return prevChoices.filter((choice) => choice !== data);
    });
  };

  const modifiedContent = reactStringReplace(testQuizContent.content, /\$blank(\d+)\$/g, (match, i) => {
    return (
      <Blank key={match} id={match} onDrop={handleDrop}>
        {blanks[match]}
      </Blank>
    );
  });

  return (
    <>
      <div className="quiz-container">
        <pre className="code-with-blanks">{modifiedContent}</pre>
      </div>

      <ChoiceContainer onDrop={handleDrop}>
        {choices.map((choice, idx) => {
          return <Choice isInBlank={false} key={`choice-${idx}`}>{choice}</Choice>;
        })}
      </ChoiceContainer>

      <style>{`
        .blank {
          display: inline-block;
          width: 50px;
          height: 1.3em;
          background-color: white;
          border: 1px solid black;
          margin: 0 2px;
          padding: 3px;
          color: black;
          text-align: center;
          transition: all 0.3s ease;
        }
        .blank.over {
          background-color: #007BFF;
          width: 60px;
          height: 1.6em;
          border: 2px dashed #0056b3;
        }
        .code-with-blanks {
          white-space: pre-wrap;
          font-family: 'Courier New', Courier, monospace;
        }
        .choice {
          display: inline-block;
          width: 80px;
          height: 2em;
          align-content: center;
          text-align: center;
          margin: 0 5px;
          background-color: black;
          color: white;
          cursor: move;
        }
        .choice-inblank {
          width: 90%;
          background-color: black;
          color: white;
        }
        .choice:hover {
          background-color: gray;
        }
        .choices-container {
          margin-top: 20px;
          padding: 10px;
          height: 50px;
          background-color: #007BFF;
        }
        .draggable.dragging {
          opacity: 0.25;
        }
        .over {
          background-color: gray;
          transition: transform 0.3s;
          &:hover {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default DragNDropQuiz;
