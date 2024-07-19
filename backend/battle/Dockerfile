# openjdk 21 버전의 환경을 구성
FROM openjdk:21

# tzdata 패키지 설치 및 타임존 설정
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

# 임시 볼륨 설정
VOLUME /tmp

# JAR_FILE이라는 변수 명에 build/libs/*.jar 선언
ARG JAR_FILE

# JAR_FILE을 /app/app.jar로 복사
COPY ${JAR_FILE} /app/app.jar

# 운영 및 개발에서 사용되는 환경 설정을 분리
# -Duser.timezone=Asia/Seoul JVM 옵션을 사용하여 애플리케이션 수준에서도 타임존을 설정
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "-Duser.timezone=Asia/Seoul", "/app/app.jar"]
