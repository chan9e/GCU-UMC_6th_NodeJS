import express from 'express';
import { tempRouter } from './routes/temp.route.js';
import { response } from './config/response.js';
import { userRouter } from './routes/user.route.js';
import { specs } from './swagger/swagger.config.js'; //사용되지 않는 듯
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs'; // fs 모듈에서 readFileSync와 existsSync를 임포트
import SwaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';
import yaml from 'js-yaml';

// ES 모듈 환경에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

// server setting - view, static, body-parser etc..
app.set('port', process.env.PORT || 3000); // 서버 포트 지정
app.use(cors()); // cors 방식 허용
app.use(express.static('public')); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// Swagger 파일 경로 출력 (디버깅 목적)
const swaggerFilePath = join(__dirname, 'swagger', 'swagger.yaml');
console.log('Swagger 파일 경로:', swaggerFilePath);

// 파일 존재 여부 확인
if (existsSync(swaggerFilePath)) {
  console.log('Swagger 파일이 존재합니다.');
  const swaggerDocument = yaml.load(readFileSync(swaggerFilePath, 'utf8'));
  console.log('Swagger 파일 로드 성공:', swaggerDocument);

  // swagger
  app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
} else {
  console.error('Swagger 파일을 찾을 수 없습니다:', swaggerFilePath);
}

// router setting
app.use('/temp', tempRouter);
app.use('/user', userRouter);

// error handling
app.use((err, req, res, next) => {
  // 템플릿 엔진 변수 설정
  res.locals.message = err.message;
  // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500).send(response(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
