# 🎮 Street Coding Fighter (SCF)

<div align="center">
  
  <h3>프로그래밍을 게임처럼 즐기는, 실시간 참여형 학습 플랫폼</h3>
  
  <div>
    ✨ <a href="https://www.notion.so/SSAFY-df70a221ba984927b8fed0d68d34dd92">가화만사성 팀 노션</a>
  </div>
  
  <br />
  
  <img src="image/gahwa.jpg" width="50%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" alt="Gahwa Image"/>
  
  <br />
  <br />
  
  <h3>🏆 수상 내역</h3>
  <div align="center">
    <p>🥈 SSAFY 11기 공통 프로젝트 우수상 - 삼성전자 주식회사</p>
  </div>
  
  <br />
  
</div>

### 📜 목차

---

1. [**프로젝트 일정**](#1)
2. [**프로젝트 개요**](#2)
3. [**서비스 소개**](#3)
4. [**주요 기능**](#4)
5. [**실사용자 배포 및 운영 경험**](#5)
6. [**기술 스택**](#6)
7. [**산출물**](#7)
8. [**팀원 소개**](#8)
   <br><br>

<div id="1"></div>

### 🗓️ 프로젝트 일정

---

- 일정: 2024년 7월 8일 - 2024년 8월 16일 (6주)
  <br><br>

<div id="2"></div>

### 🔎 프로젝트 개요

---

2017년 교육 과정 개정으로 인해 현재 **고등학생들은 프로그래밍 교육을 의무적**으로 받고 있습니다. 또한, 2025년부터는 초등학생과 중학생도 프로그래밍을 의무적으로 배우게 됩니다. <br>

저희는 경남 양산의 한 고등학교 학생들을 만나 이야기를 들어보았습니다.<br>

인터뷰 결과 학생들은 코딩이 중요하다는 것을 알지만, **학교 수업이 이론 중심으로 진행되어 지루하고 재미가 없다**고 말했습니다. 특히 학생들은 **코딩의 중요성을 인지하고 있지만, 이론 중심의 수업과 배운 내용을 단순 학습지에 답안을 채우는 방식의 수업에 흥미를 잃고 있었습니다.** <br>

이러한 문제를 해결하기 위해, 저희는 어떻게 하면 **학생들이 코딩을 재미있게 배우고 더 효과적으로 학습**할 수 있을지 고민하여 **코딩을 게임처럼 즐길 수 있는 실시간 참여형 학습 플랫폼, '스트릿 코딩 파이터'를 제작**하게 되었습니다.

<br>

<div id="3"></div>

### 🔎 서비스 소개

---

Street Coding Fighter는 프로그래밍을 게임처럼 배우는 실시간 참여형 학습 플랫폼입니다.

<br>

<div id="4"></div>

### 🔎 주요 기능

---

- **스토리 모드**: 실제 교육 과정을 바탕으로 제작된 스토리 모드는 게임처럼 프로그래밍을 하나의 이야기로 학습할 수 있도록 구성되었습니다. 프로그래밍에 익숙하지 않은 사람들도 쉽게 학습할 수 있도록 설계된 튜토리얼 모드입니다.

- **멀티 모드**: 이 모드에서는 최대 100명의 인원이 실시간으로 문제를 풀며 경쟁할 수 있습니다. 학교나 다양한 단체에서 활용할 수 있어, 효과적인 학습 도구로 활용할 수 있습니다.

- **배틀 모드**: 스트리트 코딩 파이터의 이름처럼, 1대1로 빠르게 문제를 풀며 대결하는 모드입니다. 상대방보다 빠르게 문제를 풀어 공격하고, 늦게 풀면 회복하는 시스템으로, 게임의 긴장감과 재미를 극대화했습니다.

- **개인 분석 리포트**: 단순히 문제를 푸는 것만으로는 충분하지 않습니다. 이 서비스는 게임을 즐기면서 학습자의 풀이를 바탕으로 AI가 강점과 약점을 분석하고, 맞춤형 피드백을 제공하여 지속적인 실력 향상을 도와줍니다.

<br>

<div id="5"></div>

### 🚀 실사용자 배포 및 운영 경험

---

저희 팀은 개발에 그치지 않고, 기획 단계에서 인터뷰했던 **양산 OO고등학교 학생들**을 대상으로 1차적인 테스트를 진행해 피드백과 기술적 문제점들을 보완하여 서비스를 고도화했습니다.

**1️⃣ 1차 배포(테스트 및 피드백 반영)**
- **[사용자 피드백 반영]** 학생들의 피드백을 적극 수용하여 **언어를 파이썬으로 단일화**하고 게임 요소와 함께 **교육 과정 내용을 학습할 수 있는 튜토리얼 방식**을 도입해 흥미를 높이는 동시에 코딩의 진입 장벽을 낮췄습니다.
- **[서비스 안정성 확보]**  단일 게임방 최대 100명 참여 구조상, 여러 방이 동시 종료될 때 **트래픽 급증으로 인한 데이터 유실 우려가 제기**되었습니다. 이에 **디스크 기반 구조로 유실 위험이 낮고 높은 처리량에 적합한 Kafka**를 도입하고 비동기 구조로 전환해 대량의 요청에도 안정성을 확보했습니다.

**2️⃣ 실사용자 운영 성과 (2차 배포 3일간)**
- **총 사용자 수:** 201명
- **누적 문제 풀이:** 1,551개
- 트래픽 급증 상황에서도 데이터 누락 없이 안정적 운영 가능

<br>

<div id="6"></div>

### ⚒️ 기술 스택

---

- **Frontend**

  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Zustand](https://img.shields.io/badge/zustand-7C3AED?style=for-the-badge&logo=zustand&logoColor=white)
  ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
  ![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
  ![Styled Components](https://img.shields.io/badge/styled_components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
  ![Howler.js](https://img.shields.io/badge/howler.js-4FC08D?style=for-the-badge&logo=howler.js&logoColor=white)
  ![Web Socket](https://img.shields.io/badge/Web%20Socket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

- **Backend**

  ![Java](https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white)
  ![Spring](https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
  ![Spring Security](https://img.shields.io/badge/spring_security-6DB33F?style=for-the-badge&logo=spring_security&logoColor=white)
  ![Django](https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=django&logoColor=white)
  ![Web Socket](https://img.shields.io/badge/Web%20Socket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

- **Infra**

  ![Kafka](https://img.shields.io/badge/kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![Nginx](https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
  ![Jenkins](https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
  ![Amazon EC2](https://img.shields.io/badge/amazon_ec2-FF9900?style=for-the-badge&logo=Amazon-ec2&logoColor=white)

- **Database**

  ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
  ![Redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)

- **Tool**

  ![GitLab](https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)
  ![Jira](https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)
  ![Notion](https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white)

<br>
<div id="7"></div>

### 📜 산출물

---

**🖋️아키텍처 구조도**

<img src="image/architecture.png" width="950"> <br>

**🖋️ERD**

<img src="image/erd.png" width="950"> <br>

### 🖋️주요 기능 화면

---

- **타이틀 화면**
  <br/>
  <img src="image/Title_GIF.gif" alt="title"/> <br><br>
- **메인 화면** <br>
  <img src="image/Main_GIF.gif" alt="main"/> <br><br>
- **스토리 모드** <br>
  <img src="image/Story1_GIF.gif" alt="story_main"/>
  <img src="image/Story2_GIF.gif" alt="story_play"/>

- **멀티 모드** <br>
  <img src="image/Multi_GIF.gif" alt="multi"/> <br><br>

- **배틀 모드** <br>
  <img src="image/Battle_GIF.gif" alt="battle"/> <br><br>

- **개인 분석 리포트** <br>
  <img src="image/AI_Report_GIF.gif" alt="multi"/> <br><br>

<div id="8"></div>

---

### 👥 팀원 소개

<table>
  <tr>
    <td align="center">
      <img src="./image/Bernie.jpg" width="200px" height="200px" style="border-radius:50%;" alt="여대기"/><br />
      <b>여대기 (Bernie)</b><br />
      <i>Frontend</i>
    </td>
    <td align="center">
      <img src="./image/Ethan.png" width="200px" height="200px" style="border-radius:50%;" alt="정범수"/><br />
      <b>정범수 (Ethan)</b><br />
      <i>Frontend</i>
    </td>
    <td align="center">
      <img src="./image/Falcon.jpg" width="200px" height="200px" style="border-radius:50%;" alt="이상현"/><br />
      <b>이상현 (Falcon)</b><br />
      <i>Frontend, AI</i>
    </td>
    <td align="center">
      <img src="./image/Hermes.jpg" width="200px" height="200px" style="border-radius:50%;" alt="김민욱"/><br />
      <b>김민욱 (Hermes)</b><br />
      <i>Backend</i>
    </td>
    <td align="center">
      <img src="./image/Sophia.jpg" width="200px" height="200px" style="border-radius:50%;" alt="선예림"/><br />
      <b>선예림 (Sophia)</b><br />
      <i>Backend</i>
    </td>
    <td align="center">
      <img src="./image/Jack.png" width="200px" height="200px" style="border-radius:50%;" alt="박지훈"/><br />
      <b>박지훈 (Jack)</b><br />
      <i>Backend, Infra</i>
    </td>
  </tr>
</table>
