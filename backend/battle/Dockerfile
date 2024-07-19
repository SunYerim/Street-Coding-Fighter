# Gradle 이미지를 사용하여 애플리케이션을 빌드합니다.
FROM gradle:7.6.0-jdk21 AS build

# 컨테이너 내 작업 디렉토리를 설정합니다.
WORKDIR /app

# Gradle wrapper와 빌드 파일들을 복사합니다.
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 소스 코드를 복사합니다.
COPY src src

# 애플리케이션을 빌드합니다.
RUN ./gradlew build --no-daemon

# OpenJDK 이미지를 사용하여 애플리케이션을 실행합니다.
FROM openjdk:21

# 타임존 설정을 위해 tzdata 패키지를 설치합니다.
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo Asia/Seoul > /etc/timezone && \
    apt-get clean

# 빌드 단계에서 생성된 JAR 파일을 복사합니다.
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션을 실행하는 명령어를 설정합니다.
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "-Duser.timezone=Asia/Seoul", "/app.jar"]
