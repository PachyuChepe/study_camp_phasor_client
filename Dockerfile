# Dockerfile
# Node.js 환경 설정
FROM node:18-buster

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 파일 복사
COPY . .

# 환경 변수 설정
ENV SOCKET ${SOCKET}

# 애플리케이션 실행 포트 설정 (webpack-dev-server 포트)
EXPOSE 8080

# 애플리케이션 실행
CMD ["npm", "start"]