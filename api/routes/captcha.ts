import { Router, type Request, type Response } from 'express';
import axios from 'axios';

const router = Router();

interface CaptchaChallenge {
  id: string;
  type: 'click';
  siteKey: string;
  imageUrl: string;
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

function generateRandomTargets(count: number = 3): Array<{ x: number; y: number }> {
  const targets: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    targets.push({
      x: Math.floor(Math.random() * 300) + 50,
      y: Math.floor(Math.random() * 200) + 50,
    });
  }
  return targets;
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

  const challengeId = generateId();
  const imageUrl = getRandomImageUrl();
  const targets = generateRandomTargets(3);

  const challenge: CaptchaChallenge = {
    id: challengeId,
    type: 'click',
    siteKey,
    imageUrl,
    targets,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };

  challenges.set(challengeId, challenge);

  res.json({
    success: true,
    challengeId,
    imageUrl,
    targets: targets.length,
    expiresAt: challenge.expiresAt.toISOString(),
  });
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

  const tolerance = 30;
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