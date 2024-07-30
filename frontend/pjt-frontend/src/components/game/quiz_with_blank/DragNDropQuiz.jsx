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

  const onDragStart = (e) => {
    console.log('drag start');
  }
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
      {children}
    </div>
  );
};

const Choice = ({ id, children }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text', children);
  };

  return (
    <div className="choice" key={`choice-${id}`} draggable="true" onDragStart={handleDragStart}>
      {children}
    </div>
  );
};

const DragNDropQuiz = () => {
  const [dragAndDrop, setDragAndDrop] = useState({
    draggedFrom : null,
    draggedTo : null,
    isDragging : false,
    originalOrder : [],
    updatedOrder:[],
    
      })
    
  const [blanks, setBlanks] = useState({});
  const [choices, setChoices] = useState(Object.values(testQuizContent.choices));

  const handleDrop = (id, data) => {
    setBlanks((prev) => {
      const newBlanks = { ...prev, [id]: data };
      console.log(newBlanks);

      if (prev[id]) {
        setChoices((prevChoices) => [...prevChoices, prev[id]]);
      }

      return newBlanks;
    });

    setChoices((prevChoices) => prevChoices.filter((choice) => choice !== data));
  };

  const modifiedContent = reactStringReplace(testQuizContent.content, /\$blank(\d+)\$/g, (match, i) => {
    console.log(`Matched index: ${match}, i: ${i}`);
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
          padding : 3px;
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
          .choice:hover{
          background-color: gray;
        }
        .choices-container {
          margin-top: 20px;
          padding : 10px;
          height : 50px;
          background-color : #007BFF;
        }
        .draggable.dragging {
          opacity: 25;
        }
          
        .over{
          background-color:gray;
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
