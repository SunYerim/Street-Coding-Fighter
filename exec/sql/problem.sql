use problem_db;

-- Insert data into the problem_info, problem_content, problem_choice, and problem_answer tables

-- Problem 1: 상수와 변수의 차이점
INSERT INTO problem_info (problem_id, title, problem_type, category, difficulty) VALUES (1, '상수와 변수의 차이점', 'MULTIPLE_CHOICE', '변수', 1);
INSERT INTO problem_content (problem_content_id, content, number_of_blanks, problem_id) VALUES (1, '다음 중 상수와 변수의 차이점에 대한 설명으로 올바른 것은 무엇입니까?', 0, 1);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (1, '상수는 값을 변경할 수 없고, 변수는 값을 변경할 수 있다.', 1);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (2, '상수는 값을 변경할 수 있고, 변수는 값을 변경할 수 없다.', 1);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (3, '상수와 변수는 모두 값을 변경할 수 없다.', 1);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (4, '상수와 변수는 모두 값을 변경할 수 있다.', 1);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (1, NULL, 1, NULL, 1);

-- Problem 2: 2차원 리스트 요소 접근
INSERT INTO problem_info (problem_id, title, problem_type, category, difficulty) VALUES (2, '2차원 리스트 요소 접근', 'MULTIPLE_CHOICE', '2차원 리스트', 3);
INSERT INTO problem_content (problem_content_id, content, number_of_blanks, problem_id) VALUES (2, '2차원 리스트에서 첫 번째 행의 두 번째 요소에 접근하는 올바른 방법은 무엇입니까?', 0, 2);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (5, 'list[0][1]', 2);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (6, 'list[1][2]', 2);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (7, 'list[1][1]', 2);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (8, 'list[0, 1]', 2);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (2, NULL, 5, NULL, 2);

-- Problem 3: 명시적 형변환
INSERT INTO problem_info (problem_id, title, problem_type, category, difficulty) VALUES (3, '명시적 형변환', 'FILL_IN_THE_BLANK', '자료형', 2);
INSERT INTO problem_content (problem_content_id, content, number_of_blanks, problem_id) VALUES (3, '다음 코드는 문자열을 정수로 변환하는 코드입니다. 빈칸에 알맞은 내용을 채워서 코드를 완성하세요.\n\nnum_str = \'123\'\nnum_int = $blank1$(num_str)\nprint(\'Integer value:\', num_int)\n', 1, 3);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (9, 'int', 3);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (10, 'float', 3);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (11, 'floor', 3);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (3, 1, 9, NULL, 3);

-- Problem 4: 두 수의 나눗셈
INSERT INTO problem_info (problem_id, title, problem_type, category, difficulty) VALUES (4, '두 수의 나눗셈', 'FILL_IN_THE_BLANK', '연산자', 2);
INSERT INTO problem_content (problem_content_id, content, number_of_blanks, problem_id) VALUES (4, '변수 x와 y의 나눈 값과 나머지를 출력하세요.\nx = 10\ny = 3\nz = x $blank1$ y\nremainder = x $blank2$ y\nprint(z, remainder)', 2, 4);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (12, '/', 4);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (13, '%', 4);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (14, '+', 4);
INSERT INTO problem_choice (choice_id, choice_text, problem_id) VALUES (15, '-', 4);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (4, 1, 12, NULL, 4);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (5, 2, 13, NULL, 4);

-- Problem 5: 조건문 문제
INSERT INTO problem_info (problem_id, title, problem_type, category, difficulty) VALUES (5, '조건문 문제', 'SHORT_ANSWER_QUESTION', '조건문', 1);
INSERT INTO problem_content (problem_content_id, content, number_of_blanks, problem_id) VALUES (5, '# 다음 코드를 실행했을 때 출력될 값을 적으시오.\nx = 10\ny = 20\nif x < y:\n    print(\'1\')\nelse:\n    print(\'2\')', 0, 5);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (6, NULL, NULL, '1', 5);

-- Problem 6: 딕셔너리 값 접근 문제
INSERT INTO problem_info (problem_id, title, problem_type, category, difficulty) VALUES (6, '딕셔너리 값 접근 문제', 'SHORT_ANSWER_QUESTION', '자료형', 1);
INSERT INTO problem_content (problem_content_id, content, number_of_blanks, problem_id) VALUES (6, '# 다음 코드를 실행했을 때 출력될 값을 적으시오.\nstudent = {\'name\': \'Alice\', \'age\': 20, \'grade\': \'A\'}\nprint(student[\'grade\'])', 0, 6);
INSERT INTO problem_answer (answer_id, blank_position, correct_choice_id, correct_answer_text, problem_id) VALUES (7, NULL, NULL, 'A', 6);
