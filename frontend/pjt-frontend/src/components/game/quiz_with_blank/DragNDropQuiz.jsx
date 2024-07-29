import React from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';

// 원본 코드에 %block% 부분을 흰색 div로 바꾸는 함수
const replaceBlocks = (content) => {
  return content.replace(
    /\$blank(\d+)\$/g,
    (match, p1) => `<Droppable><div class="blank" data-blank-id="${p1}"></div></Droppable>`
  );
};

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
function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

const DragNDropQuiz = () => {
  const testQuizInfo = {
    title: '빈칸 : 버블정렬1',
    type: '2',
    category: '정렬',
  };

  const modifiedContent = replaceBlocks(testQuizContent.content);
  const choices = [];
  for (let key in testQuizContent.choices) {
    choices.push(testQuizContent.choices[key]);
  }
  return (
    <>
      <DndContext>
        <div className="quiz-container">
          <div className="code-with-blanks" dangerouslySetInnerHTML={{ __html: modifiedContent }} />
          {choices.map((e, idx) => {
            return <Draggable>{e}</Draggable>;
          })}
        </div>
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
        }
      `}</style>
    </>
  );
};

export default DragNDropQuiz;
