# # Node.js 환경 설정
# FROM node:18-buster

# # 작업 디렉토리 설정
# WORKDIR /app

# # ARG를 사용하여 빌드 시점에 변수 값을 받음
# ARG SOCKET
# ARG DB
# ARG TOSS_CLIENT_KEY

# # 환경 변수 설정
# ENV SOCKET ${SOCKET}
# ENV DB ${DB}
# ENV TOSS_CLIENT_KEY &{TOSS_CLIENT_KEY}

# # 의존성 파일 복사 및 설치
# COPY package*.json ./
# RUN npm install

# # 애플리케이션 파일 복사
# COPY . .

# # .env 파일 생성 및 환경 변수 값 입력
# RUN echo "SOCKET=${SOCKET}" > .env
# RUN echo "DB=${DB}" >> .env
# RUN echo "TOSS_CLIENT_KEY=${TOSS_CLIENT_KEY}" >> .env

# # 애플리케이션 실행 포트 설정
# EXPOSE 8080

# # 애플리케이션 실행
# CMD ["npm", "start"]

# Node.js 환경 설정 및 빌드 단계
FROM node:18-buster AS builder

# 작업 디렉토리 설정
WORKDIR /app

# ARG를 사용하여 빌드 시점에 변수 값을 받음
ARG SOCKET
ARG DB
ARG TOSS_CLIENT_KEY

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 파일 복사
COPY . .

# .env 파일 생성 및 환경 변수 값 입력
RUN echo "SOCKET=${SOCKET}" > .env
RUN echo "DB=${DB}" >> .env
RUN echo "TOSS_CLIENT_KEY=${TOSS_CLIENT_KEY}" >> .env

# 빌드 실행
RUN npm run build

# Production 환경 설정
FROM node:18-buster AS runner

# 작업 디렉토리 설정
WORKDIR /app

# serve 설치
RUN npm install -g serve

# 빌드 결과물 복사
COPY --from=builder /app/dist /app

# 애플리케이션 실행 포트 설정
EXPOSE 8080

# 정적 파일 서버 실행
CMD ["serve", "-s", ".", "-l", "8080"]
