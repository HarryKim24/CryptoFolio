import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import killPort from 'kill-port';
import waitOn from 'wait-on';

const ffmpegPath = `"C:\\Users\\tl943\\Desktop\\develop\\ffmpeg-7.1.1-essentials_build\\bin\\ffmpeg.exe"`;
const testResultsDir = path.resolve('test-results');
const outputDir = path.resolve('docs', 'videos');
const videoOutput = path.join(outputDir, 'main.mp4');
const gifOutput = path.join(outputDir, 'main.gif');
const palettePath = path.join(outputDir, 'palette.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🛑 기존 3000 포트 종료 중...');
try {
  await killPort(3000, 'tcp');
  console.log('✅ 기존 포트 종료 완료');
} catch {
  console.log('ℹ️ 종료할 포트 없음');
}

console.log('📦 빌드 실행 중...');
execSync('npm run build', { stdio: 'inherit' });

console.log('🚀 프로덕션 서버 실행 중...');
const server = spawn('npm', ['run', 'start'], { stdio: 'inherit', shell: true });

await waitOn({ resources: ['http://localhost:3000'], timeout: 30000 });
console.log('✅ 서버 실행 완료');

console.log('🎥 Playwright 테스트 실행 중...');
try {
  execSync(`npx playwright test tests/main.spec.ts --project=chromium`, { stdio: 'inherit' });
} catch {
  console.error('❌ Playwright 테스트 실패');
} finally {
  console.log('🛑 프로덕션 서버 종료 중...');
  server.kill();
}

const findLatestVideo = (dir) => {
  const folders = fs.readdirSync(dir)
    .map((name) => ({
      name,
      time: fs.statSync(path.join(dir, name)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  for (const folder of folders) {
    const videoPath = path.join(dir, folder.name, 'video.webm');
    if (fs.existsSync(videoPath)) {
      console.log(`🎯 최신 영상 발견: ${videoPath}`);
      return videoPath;
    }
  }
  return null;
};

const videoInput = findLatestVideo(testResultsDir);
if (!videoInput) {
  console.error('❌ 영상 파일을 찾을 수 없습니다.');
  process.exit(1);
}

console.log('🎬 ffmpeg MP4 변환 중...');
execSync(`${ffmpegPath} -y -ss 0.4 -i "${videoInput}" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p "${videoOutput}"`, { stdio: 'inherit' });
console.log(`✅ MP4 변환 완료: ${videoOutput}`);

const mp4Stats = fs.statSync(videoOutput);
console.log(`📦 MP4 파일 크기: ${(mp4Stats.size / 1024 / 1024).toFixed(2)} MB`);

console.log('🖼️ ffmpeg GIF 팔레트 생성 중...');
execSync(`${ffmpegPath} -y -ss 0.4 -i "${videoOutput}" -vf "fps=30,scale=960:-1:flags=lanczos,palettegen" "${palettePath}"`, { stdio: 'inherit' });

console.log('🖼️ ffmpeg GIF 최적화 변환 중...');
execSync(`${ffmpegPath} -y -ss 0.4 -i "${videoOutput}" -i "${palettePath}" -lavfi "fps=30,scale=960:-1:flags=lanczos [x]; [x][1:v] paletteuse" -loop 0 "${gifOutput}"`, { stdio: 'inherit' });

console.log(`✅ GIF 최적화 완료: ${gifOutput}`);

const gifStats = fs.statSync(gifOutput);
console.log(`📦 GIF 파일 크기: ${(gifStats.size / 1024 / 1024).toFixed(2)} MB`);