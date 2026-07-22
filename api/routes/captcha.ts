import { Router, type Request, type Response } from 'express';
import axios from 'axios';

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

async function downloadImage(url: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(response.data, 'binary');
  return `data:image/png;base64,${buffer.toString('base64')}`;
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
    const imageData = await downloadImage(imageUrl);
    const targets = generateSpacedTargets(3, 400, 300);

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
      targets,
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
  let allMatched = true;

  for (let i = 0; i < challenge.targets.length; i++) {
    if (i >= userInput.length) {
      allMatched = false;
      break;
    }

    const target = challenge.targets[i];
    const userPoint = userInput[i];

    const distance = Math.sqrt(
      Math.pow(userPoint.x - target.x, 2) +
      Math.pow(userPoint.y - target.y, 2)
    );

    if (distance > tolerance) {
      allMatched = false;
      break;
    }
  }

  if (allMatched && userInput.length === challenge.targets.length) {
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