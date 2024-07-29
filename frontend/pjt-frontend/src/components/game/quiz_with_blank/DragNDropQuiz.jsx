import React, { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
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

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${id}`,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="blank">
      {children}
    </div>
  );
}

function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${id}`,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="choice">
      {children}
    </div>
  );
}

const DragNDropQuiz = () => {
  const [parent, setParent] = useState(null);

  const draggable = (choice, idx) => (
    <Draggable id={idx} key={idx}>
      {choice}
    </Draggable>
  );

  const modifiedContent = reactStringReplace(testQuizContent.content, /\$blank(\d+)\$/g, (match, i) => (
    <Droppable key={i} id={i}>
      {parent === `droppable-${i}` ? draggable(testQuizContent.answer[i], i) : 'Drop here'}
    </Droppable>
  ));

  const choices = Object.values(testQuizContent.choices);

  function handleDragEnd({ over }) {
    setParent(over ? over.id : null);
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="quiz-container">
          <pre className="code-with-blanks">{modifiedContent}</pre>
        </div>

        {choices.map((choice, idx) => (
          draggable(choice, idx)
        ))}
      </DndContext>
      <style jsx>{`
        .blank {
          display: inline-block;
          width: 50px;
          height: 1.3em;
          background-color: white;
          border: 1px solid black;
          margin: 0 2px;
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
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default DragNDropQuiz;
