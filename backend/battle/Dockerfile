# openjdk 21 버전의 환경을 구성
FROM openjdk:21

# tzdata 패키지 설치 및 타임존 설정
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

# 임시 볼륨 설정
VOLUME /tmp

WORKDIR /app

# JAR 파일을 /app 디렉토리로 복사
COPY build/libs/api-module-0.0.1-SNAPSHOT-plain.jar /app/app-module.jar

# 운영 및 개발에서 사용되는 환경 설정을 분리
# -Duser.timezone=Asia/Seoul JVM 옵션을 사용하여 애플리케이션 수준에서도 타임존을 설정
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "-Duser.timezone=Asia/Seoul", "/app/app-module.jar"]