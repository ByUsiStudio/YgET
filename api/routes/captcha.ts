import { Router, type Request, type Response } from 'express';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';

const router = Router();

interface CaptchaChallenge {
  id: string;
  type: 'click';
  siteKey: string;
  imageData: string;
  targets: Array<{ x: number; y: number }>;
  createdAt: Date;
  expiresAt: Date;
}

interface VerificationToken {
  id: string;
  challengeId: string;
  token: string;
  isVerified: boolean;
  expiresAt: Date;
}

const challenges: Map<string, CaptchaChallenge> = new Map();
const tokens: Map<string, VerificationToken> = new Map();

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateToken(): string {
  return 'ygt_' + generateId();
}

const imageSources = [
  'https://picsum.photos/400/300',
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
  'https://picsum.photos/400/300?random=6',
  'https://picsum.photos/400/300?random=7',
  'https://picsum.photos/400/300?random=8',
  'https://picsum.photos/400/300?random=9',
  'https://picsum.photos/400/300?random=10',
  'https://picsum.photos/400/300?random=11',
  'https://picsum.photos/400/300?random=12',
  'https://picsum.photos/400/300?random=13',
  'https://picsum.photos/400/300?random=14',
  'https://picsum.photos/400/300?random=15',
  'https://picsum.photos/400/300?random=16',
  'https://picsum.photos/400/300?random=17',
];

function getRandomImageUrl(): string {
  return imageSources[Math.floor(Math.random() * imageSources.length)];
}

function generateSpacedTargets(count: number = 3, width: number = 400, height: number = 300): Array<{ x: number; y: number }> {
  const targets: Array<{ x: number; y: number }> = [];
  const minDistance = 80;
  const padding = 60;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let newTarget: { x: number; y: number };

    do {
      newTarget = {
        x: Math.floor(Math.random() * (width - padding * 2)) + padding,
        y: Math.floor(Math.random() * (height - padding * 2)) + padding,
      };
      attempts++;
    } while (
      attempts < 50 &&
      targets.some(target => {
        const distance = Math.sqrt(
          Math.pow(newTarget.x - target.x, 2) +
          Math.pow(newTarget.y - target.y, 2)
        );
        return distance < minDistance;
      })
    );

    targets.push(newTarget);
  }

  return targets;
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data, 'binary');
}

async function composeImageWithTargets(imageBuffer: Buffer, targets: Array<{ x: number; y: number }>): Promise<string> {
  const img = await loadImage(imageBuffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  targets.forEach((target, index) => {
    const radius = 18;
    
    ctx.beginPath();
    ctx.arc(target.x, target.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(target.x, target.y, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${index + 1}`, target.x, target.y);
  });

  return canvas.toDataURL('image/png');
}

router.post('/generate', async (req: Request, res: Response) => {
  const { type = 'click', siteKey } = req.body;
  
  if (!siteKey) {
    return res.status(400).json({
      success: false,
      message: '缺少 siteKey',
      code: 'MISSING_SITE_KEY',
    });
  }

  try {
    const challengeId = generateId();
    const imageUrl = getRandomImageUrl();
    const imageBuffer = await downloadImage(imageUrl);
    const targets = generateSpacedTargets(3, 400, 300);
    const imageData = await composeImageWithTargets(imageBuffer, targets);

    const challenge: CaptchaChallenge = {
      id: challengeId,
      type: 'click',
      siteKey,
      imageData,
      targets,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    challenges.set(challengeId, challenge);

    res.json({
      success: true,
      challengeId,
      imageData,
      targetCount: targets.length,
      expiresAt: challenge.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Failed to generate captcha:', error);
    res.status(500).json({
      success: false,
      message: '生成验证码失败',
      code: 'CAPTCHA_GENERATION_ERROR',
    });
  }
});

router.post('/verify', (req: Request, res: Response) => {
  const { challengeId, userInput } = req.body;

  if (!challengeId || !userInput || !Array.isArray(userInput)) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
      code: 'MISSING_PARAMS',
    });
  }

  const challenge = challenges.get(challengeId);

  if (!challenge) {
    return res.status(400).json({
      success: false,
      message: '挑战不存在或已过期',
      code: 'CHALLENGE_NOT_FOUND',
    });
  }

  if (new Date() > challenge.expiresAt) {
    challenges.delete(challengeId);
    return res.status(400).json({
      success: false,
      message: '挑战已过期',
      code: 'CHALLENGE_EXPIRED',
    });
  }

  const tolerance = 25;
  const matchedTargets: number[] = [];

  for (const target of challenge.targets) {
    for (let i = 0; i < userInput.length; i++) {
      if (matchedTargets.includes(i)) continue;
      
      const distance = Math.sqrt(
        Math.pow(userInput[i].x - target.x, 2) +
        Math.pow(userInput[i].y - target.y, 2)
      );
      
      if (distance <= tolerance) {
        matchedTargets.push(i);
        break;
      }
    }
  }

  if (matchedTargets.length === challenge.targets.length) {
    const token = generateToken();
    const verificationToken: VerificationToken = {
      id: generateId(),
      challengeId,
      token,
      isVerified: true,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    tokens.set(token, verificationToken);
    challenges.delete(challengeId);

    return res.json({
      success: true,
      token,
      challengeId,
      expiresAt: verificationToken.expiresAt.toISOString(),
    });
  } else {
    challenges.delete(challengeId);
    return res.json({
      success: false,
      message: '验证失败，请重试',
      code: 'VERIFICATION_FAILED',
    });
  }
});

router.post('/verify/token', (req: Request, res: Response) => {
  const { token, siteKey } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: '缺少 token',
      code: 'MISSING_TOKEN',
    });
  }

  const verificationToken = tokens.get(token);

  if (!verificationToken) {
    return res.status(400).json({
      success: false,
      message: '无效的 Token',
      code: 'INVALID_TOKEN',
    });
  }

  if (new Date() > verificationToken.expiresAt) {
    tokens.delete(token);
    return res.status(400).json({
      success: false,
      message: 'Token 已过期',
      code: 'TOKEN_EXPIRED',
    });
  }

  if (!verificationToken.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'Token 未验证',
      code: 'TOKEN_NOT_VERIFIED',
    });
  }

  tokens.delete(token);

  res.json({
    success: true,
    message: '验证通过',
    data: {
      challengeId: verificationToken.challengeId,
      verifiedAt: new Date().toISOString(),
    },
  });
});

export default router;