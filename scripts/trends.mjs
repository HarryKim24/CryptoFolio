import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import killPort from 'kill-port';
import waitOn from 'wait-on';

const ffmpegPath = `"C:\\Users\\tl943\\Desktop\\develop\\ffmpeg-7.1.1-essentials_build\\bin\\ffmpeg.exe"`;
const testResultsDir = path.resolve('test-results');
const outputDir = path.resolve('docs', 'videos');
const videoOutput = path.join(outputDir, 'trends.mp4');
const gifOutput = path.join(outputDir, 'trends.gif');
const palettePath = path.join(outputDir, 'palette-trends.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function findLatestVideo(dir) {
  const folderNames = fs.readdirSync(dir);
  let latestVideoPath = null;
  let latestTime = 0;

  for (const folderName of folderNames) {
    const folderPath = path.join(dir, folderName);
    const stat = fs.statSync(folderPath);
    const modifiedTime = stat.mtime.getTime();
    const videoPath = path.join(folderPath, 'video.webm');

    if (fs.existsSync(videoPath) && modifiedTime > latestTime) {
      latestTime = modifiedTime;
      latestVideoPath = videoPath;
    }
  }

  if (latestVideoPath) {
    console.log(`Latest video found: ${latestVideoPath}`);
  }

  return latestVideoPath;
}

function runCommand(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

async function main() {
  console.log('Stopping port 3000...');
  try {
    await killPort(3000, 'tcp');
    console.log('Port 3000 stopped');
  } catch {
    console.log('No port to stop');
  }

  console.log('Running build...');
  runCommand('npm run build');

  console.log('Starting production server...');
  const server = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true,
  });

  await waitOn({
    resources: ['http://localhost:3000'],
    timeout: 30000,
  });
  console.log('Server is running');

  console.log('Running Playwright tests...');
  try {
    runCommand('npx playwright test tests/trends.spec.ts --project=chromium');
  } catch {
    console.error('Playwright tests failed');
  } finally {
    console.log('Stopping production server...');
    server.kill();
  }

  const videoInput = findLatestVideo(testResultsDir);
  if (!videoInput) {
    console.error('Video file not found');
    process.exit(1);
  }

  console.log('Converting to MP4...');
  const mp4Command = `${ffmpegPath} -y -ss 0.2 -i "${videoInput}" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p "${videoOutput}"`;
  runCommand(mp4Command);
  console.log(`MP4 output: ${videoOutput}`);

  const mp4Stats = fs.statSync(videoOutput);
  console.log(`MP4 file size: ${(mp4Stats.size / 1024 / 1024).toFixed(2)} MB`);

  console.log('Generating GIF palette...');
  const paletteCommand = `${ffmpegPath} -y -ss 0.2 -i "${videoOutput}" -vf "fps=30,scale=960:-1:flags=lanczos,palettegen" "${palettePath}"`;
  runCommand(paletteCommand);

  console.log('Converting to GIF...');
  const gifCommand = `${ffmpegPath} -y -ss 0.2 -i "${videoOutput}" -i "${palettePath}" -lavfi "fps=30,scale=960:-1:flags=lanczos [x]; [x][1:v] paletteuse" -loop 0 "${gifOutput}"`;
  runCommand(gifCommand);
  console.log(`GIF output: ${gifOutput}`);

  const gifStats = fs.statSync(gifOutput);
  console.log(`GIF file size: ${(gifStats.size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});