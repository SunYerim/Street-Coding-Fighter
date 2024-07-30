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

  return (
    <div
      className="blank"
      key={`blank-${id}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children}
    </div>
  );
};

const Choice = ({ id, children }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text', children);
  };

  return (
    <div
      className="choice"
      key={`choice-${id}`}
      draggable="true"
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  );
};

const DragNDropQuiz = () => {
  const [blanks, setBlanks] = useState({});
  const [choices, setChoices] = useState(Object.values(testQuizContent.choices));
  
  const handleDrop = (id, data) => {
    setBlanks((prev) => {
      const newBlanks = { ...prev, [id]: data };
      
      // 드롭된 빈칸에 이미 데이터가 있는 경우 그 데이터를 choices에 추가
      if (prev[id]) {
        setChoices((prevChoices) => [...prevChoices, prev[id]]);
      }

      return newBlanks;
    });

    // 드롭된 데이터를 choices에서 제거
    setChoices((prevChoices) => prevChoices.filter((choice) => choice !== data));
  };

  const modifiedContent = reactStringReplace(testQuizContent.content, /\$blank(\d+)\$/g, (match, i) => (
    <Blank key={i} id={i} onDrop={handleDrop}>
      {blanks[i]}
    </Blank>
  ));

  return (
    <>
      <div className="quiz-container">
        <pre className="code-with-blanks">{modifiedContent}</pre>
      </div>

      <div className="choices-container">
        {choices.map((choice, idx) => {
          return <Choice key={`choice-${idx}`}>{choice}</Choice>;
        })}
      </div>
      <style>{`
        .blank {
          display: inline-block;
          width: 50px;
          height: 1.3em;
          background-color: white;
          border: 1px solid black;
          margin: 0 2px;
          color: black;
          text-align: center;
        }
        .code-with-blanks {
          white-space: pre-wrap;
          font-family: 'Courier New', Courier, monospace;
        }
        .choice {
          display: inline-block;
          width: 50px;
          height: 1.5em;
          text-align: center;
          margin: 0 5px;
          background-color: black;
          color: white;
          cursor: move;
        }
        .choices-container {
          margin-top: 20px;
        }
        .draggable.dragging {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
};

export default DragNDropQuiz;
