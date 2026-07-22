import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, RefreshCw, Loader2, Target } from 'lucide-react';

interface TargetPoint {
  x: number;
  y: number;
}

interface ClickPoint {
  x: number;
  y: number;
}

export default function CaptchaWidget() {
  const [status, setStatus] = useState<'idle' | 'clicking' | 'verifying' | 'success' | 'error'>('idle');
  const [challengeId, setChallengeId] = useState<string>('');
  const [imageData, setImageData] = useState<string>('');
  const [targets, setTargets] = useState<TargetPoint[]>([]);
  const [clickedPoints, setClickedPoints] = useState<ClickPoint[]>([]);
  const [message, setMessage] = useState('点击图片中显示的目标位置完成验证');
  const [composedImageData, setComposedImageData] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const composeImage = useCallback(async (baseImageData: string, targetPoints: TargetPoint[]) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(baseImageData);
          return;
        }

        ctx.drawImage(img, 0, 0);

        targetPoints.forEach((target, index) => {
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

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        resolve(baseImageData);
      };
      img.src = baseImageData;
    });
  }, []);

  const fetchChallenge = async () => {
    setStatus('idle');
    setClickedPoints([]);
    setMessage('加载中...');

    try {
      const response = await fetch('http://localhost:3001/api/captcha/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'click', siteKey: 'demo_site_key' }),
      });

      const data = await response.json();

      if (data.success) {
        setChallengeId(data.challengeId);
        setImageData(data.imageData);
        setTargets(data.targets);
        
        const composed = await composeImage(data.imageData, data.targets);
        setComposedImageData(composed);
        
        setStatus('clicking');
        setMessage(`请按顺序点击图片中的 ${data.targets.length} 个目标`);
      } else {
        setMessage('加载验证码失败');
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
      setMessage('网络错误，请重试');
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  const handleImageClick = (e: React.MouseEvent) => {
    if (status !== 'clicking' || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const scaleX = 400 / imageRect.width;
    const scaleY = 300 / imageRect.height;
    
    const x = (e.clientX - imageRect.left) * scaleX;
    const y = (e.clientY - imageRect.top) * scaleY;

    const tolerance = 25;
    const existingIndex = clickedPoints.findIndex(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) +
        Math.pow(point.y - y, 2)
      );
      return distance <= tolerance;
    });

    if (existingIndex >= 0) {
      const newPoints = clickedPoints.filter((_, index) => index !== existingIndex);
      setClickedPoints(newPoints);
      setMessage(`已选择 ${newPoints.length}/${targets.length} 个目标`);
    } else {
      const newPoints = [...clickedPoints, { x, y }];
      setClickedPoints(newPoints);
      
      if (newPoints.length >= targets.length) {
        verifyCaptcha(newPoints);
      } else {
        setMessage(`已选择 ${newPoints.length}/${targets.length} 个目标`);
      }
    }
  };

  const verifyCaptcha = async (points: ClickPoint[]) => {
    setStatus('verifying');
    setMessage('验证中...');

    try {
      const response = await fetch('http://localhost:3001/api/captcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId,
          userInput: points,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('验证成功');
      } else {
        setStatus('error');
        setMessage('验证失败，请重试');
        setTimeout(() => {
          fetchChallenge();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to verify:', error);
      setStatus('error');
      setMessage('验证失败，请重试');
      setTimeout(() => {
        fetchChallenge();
      }, 1500);
    }
  };

  const handleRefresh = () => {
    fetchChallenge();
  };

  const handleClear = () => {
    if (status === 'clicking') {
      setClickedPoints([]);
      setMessage(`请按顺序点击图片中的 ${targets.length} 个目标`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl border border-blue-200 overflow-hidden shadow-md">
        <div className="relative">
          <div
            ref={containerRef}
            className={`relative w-full aspect-[4/3] bg-gradient-to-br from-blue-50 to-light-50 flex items-center justify-center overflow-hidden ${
              status === 'verifying' || status === 'success' || status === 'error'
                ? 'pointer-events-none'
                : ''
            }`}
          >
            {composedImageData ? (
              <img
                ref={imageRef}
                src={composedImageData}
                alt="验证码图片"
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleImageClick}
              />
            ) : (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                <p className="text-sm text-gray-500">加载图片中...</p>
              </div>
            )}

            {status === 'verifying' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-green-500 rounded-full p-4 shadow-lg">
                  <Check className="w-10 h-10 text-white" />
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-red-500 rounded-full p-4 shadow-lg">
                  <span className="text-2xl text-white">✗</span>
                </div>
              </div>
            )}

            {clickedPoints.map((point, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ 
                  left: `${(point.x / 400) * 100}%`, 
                  top: `${(point.y / 300) * 100}%` 
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-green-500 animate-ping" />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            title="刷新验证码"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${status === 'verifying' ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${
                status === 'success' ? 'text-green-500' :
                status === 'error' ? 'text-red-500' : 'text-blue-500'
              }`} />
              <span className={`text-sm font-medium ${
                status === 'success' ? 'text-green-500' :
                status === 'error' ? 'text-red-500' : 'text-gray-700'
              }`}>
                {message}
              </span>
            </div>

            {clickedPoints.length > 0 && status === 'clicking' && (
              <button
                onClick={handleClear}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                清除选择
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  status === 'success' ? 'bg-green-400' :
                  status === 'error' ? 'bg-red-400' : 'bg-gradient-to-r from-blue-400 to-light-400'
                }`}
                style={{ width: `${(clickedPoints.length / targets.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {clickedPoints.length}/{targets.length}
            </span>
          </div>

          {status === 'success' && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">验证成功！您可以继续操作。</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}