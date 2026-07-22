(function (window) {
  'use strict';

  class YgET {
    constructor(options = {}) {
      this.baseUrl = options.baseUrl || 'http://localhost:3001';
      this.siteKey = options.siteKey || 'demo_site_key';
      this.challengeId = null;
      this.onVerify = options.onVerify || null;
      this.onError = options.onError || null;
    }

    async generateCaptcha(type = 'click') {
      try {
        const response = await fetch(`${this.baseUrl}/api/captcha/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type, siteKey: this.siteKey }),
        });

        const data = await response.json();

        if (data.success) {
          this.challengeId = data.challengeId;
          return data;
        } else {
          if (this.onError) {
            this.onError(data);
          }
          throw new Error(data.message || '生成验证码失败');
        }
      } catch (error) {
        if (this.onError) {
          this.onError({ message: error.message });
        }
        throw error;
      }
    }

    async verifyCaptcha(userInput) {
      try {
        if (!this.challengeId) {
          throw new Error('请先生成验证码');
        }

        const response = await fetch(`${this.baseUrl}/api/captcha/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            challengeId: this.challengeId,
            userInput,
          }),
        });

        const data = await response.json();

        if (data.success) {
          if (this.onVerify) {
            this.onVerify(data);
          }
          return data;
        } else {
          if (this.onError) {
            this.onError(data);
          }
          throw new Error(data.message || '验证失败');
        }
      } catch (error) {
        if (this.onError) {
          this.onError({ message: error.message });
        }
        throw error;
      }
    }

    async verifyToken(token) {
      try {
        const response = await fetch(`${this.baseUrl}/api/captcha/verify/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, siteKey: this.siteKey }),
        });

        const data = await response.json();

        if (data.success) {
          return data;
        } else {
          throw new Error(data.message || 'Token 验证失败');
        }
      } catch (error) {
        throw error;
      }
    }

    async healthCheck() {
      try {
        const response = await fetch(`${this.baseUrl}/api/health`);
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    }

    setBaseUrl(url) {
      this.baseUrl = url;
    }

    setSiteKey(key) {
      this.siteKey = key;
    }

    setOnVerify(callback) {
      this.onVerify = callback;
    }

    setOnError(callback) {
      this.onError = callback;
    }
  }

  class YgETWidget {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      this.options = {
        siteKey: options.siteKey || 'demo_site_key',
        baseUrl: options.baseUrl || 'http://localhost:3001',
        onVerify: options.onVerify || null,
        onError: options.onError || null,
        width: options.width || '100%',
        maxWidth: options.maxWidth || '400px',
        ...options,
      };

      this.yget = new YgET({
        baseUrl: this.options.baseUrl,
        siteKey: this.options.siteKey,
        onVerify: this.options.onVerify,
        onError: this.options.onError,
      });

      this.state = {
        status: 'idle',
        imageData: '',
        targets: [],
        clickedPoints: [],
        message: '点击图片中显示的目标位置完成验证',
      };

      this.init();
    }

    async init() {
      this.render();
      await this.fetchChallenge();
    }

    async fetchChallenge() {
      this.setState({ status: 'idle', clickedPoints: [], message: '加载中...' });

      try {
        const data = await this.yget.generateCaptcha('click');

        const composedImage = await this.composeImage(data.imageData, data.targets);

        this.setState({
          status: 'clicking',
          imageData: composedImage,
          targets: data.targets,
          message: `请按顺序点击图片中的 ${data.targets.length} 个目标`,
        });
      } catch (error) {
        this.setState({
          status: 'error',
          message: '加载验证码失败',
        });
      }
    }

    async composeImage(baseImageData, targetPoints) {
      return new Promise((resolve) => {
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
    }

    handleImageClick(e) {
      if (this.state.status !== 'clicking') return;

      const imageElement = this.container.querySelector('.yget-image');
      if (!imageElement) return;

      const rect = imageElement.getBoundingClientRect();
      const scaleX = 400 / rect.width;
      const scaleY = 300 / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const tolerance = 25;
      const existingIndex = this.state.clickedPoints.findIndex((point) => {
        const distance = Math.sqrt(
          Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
        );
        return distance <= tolerance;
      });

      let newPoints;
      if (existingIndex >= 0) {
        newPoints = this.state.clickedPoints.filter((_, index) => index !== existingIndex);
      } else {
        newPoints = [...this.state.clickedPoints, { x, y }];
      }

      this.setState({ clickedPoints: newPoints });

      if (newPoints.length >= this.state.targets.length) {
        this.verifyCaptcha(newPoints);
      } else {
        this.setState({
          message: `已选择 ${newPoints.length}/${this.state.targets.length} 个目标`,
        });
      }
    }

    async verifyCaptcha(points) {
      this.setState({ status: 'verifying', message: '验证中...' });

      try {
        const result = await this.yget.verifyCaptcha(points);
        this.setState({ status: 'success', message: '验证成功' });
      } catch (error) {
        this.setState({ status: 'error', message: '验证失败，请重试' });
        setTimeout(() => {
          this.fetchChallenge();
        }, 1500);
      }
    }

    refresh() {
      this.fetchChallenge();
    }

    clear() {
      if (this.state.status === 'clicking') {
        this.setState({
          clickedPoints: [],
          message: `请按顺序点击图片中的 ${this.state.targets.length} 个目标`,
        });
      }
    }

    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.render();
    }

    render() {
      if (!this.container) return;

      const { status, imageData, clickedPoints, message, targets } = this.state;

      const overlay = {
        verifying: `
          <div class="yget-overlay yget-overlay-verifying">
            <div class="yget-overlay-content">
              <div class="yget-spinner"></div>
            </div>
          </div>
        `,
        success: `
          <div class="yget-overlay yget-overlay-success">
            <div class="yget-overlay-content">
              <div class="yget-check">✓</div>
            </div>
          </div>
        `,
        error: `
          <div class="yget-overlay yget-overlay-error">
            <div class="yget-overlay-content">
              <div class="yget-cross">✗</div>
            </div>
          </div>
        `,
      };

      const clickedMarks = clickedPoints
        .map(
          (point, index) => `
        <div class="yget-clicked-mark" style="left: ${(point.x / 400) * 100}%; top: ${(point.y / 300) * 100}%;">
          <div class="yget-clicked-mark-inner">${index + 1}</div>
          <div class="yget-clicked-mark-ping"></div>
        </div>
      `
        )
        .join('');

      this.container.innerHTML = `
        <style>
          .yget-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            width: ${this.options.width};
            max-width: ${this.options.maxWidth};
            margin: 0 auto;
          }
          .yget-card {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #dbeafe;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .yget-image-container {
            position: relative;
            width: 100%;
            aspect-ratio: 4/3;
            background: linear-gradient(to bottom right, #eff6ff, #fef2f2);
            overflow: hidden;
            ${status === 'verifying' || status === 'success' || status === 'error' ? 'pointer-events: none;' : ''}
          }
          .yget-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
          }
          .yget-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .yget-overlay-content {
            background: #ffffff;
            border-radius: 50%;
            padding: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          }
          .yget-overlay-success .yget-overlay-content {
            background: #22c55e;
          }
          .yget-overlay-error .yget-overlay-content {
            background: #ef4444;
          }
          .yget-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #3b82f6;
            border-top-color: transparent;
            border-radius: 50%;
            animation: yget-spin 0.8s linear infinite;
          }
          .yget-check {
            font-size: 40px;
            color: #ffffff;
            font-weight: bold;
          }
          .yget-cross {
            font-size: 32px;
            color: #ffffff;
            font-weight: bold;
          }
          .yget-refresh-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            border: none;
            cursor: pointer;
            transition: background 0.2s;
          }
          .yget-refresh-btn:hover {
            background: #ffffff;
          }
          .yget-refresh-icon {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: #4b5563;
            stroke-width: 2;
            ${status === 'verifying' ? 'animation: yget-spin 0.8s linear infinite;' : ''}
          }
          .yget-clicked-mark {
            position: absolute;
            transform: translate(-50%, -50%);
            z-index: 20;
          }
          .yget-clicked-mark-inner {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #22c55e;
            border: 2px solid #22c55e;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .yget-clicked-mark-ping {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid #22c55e;
            animation: yget-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .yget-footer {
            padding: 16px;
            background: #f9fafb;
          }
          .yget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .yget-title {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .yget-target-icon {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: ${status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#3b82f6'};
            stroke-width: 2;
          }
          .yget-message {
            font-size: 14px;
            font-weight: 500;
            color: ${status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#374151'};
          }
          .yget-clear-btn {
            font-size: 14px;
            color: #3b82f6;
            cursor: pointer;
            font-weight: 500;
            background: none;
            border: none;
          }
          .yget-clear-btn:hover {
            color: #2563eb;
          }
          .yget-progress-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .yget-progress-bar {
            flex: 1;
            height: 8px;
            background: #e5e7eb;
            border-radius: 9999px;
            overflow: hidden;
          }
          .yget-progress-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.3s;
            background: ${status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : 'linear-gradient(to right, #60a5fa, #fca5a5)'};
          }
          .yget-progress-text {
            font-size: 12px;
            color: #6b7280;
          }
          .yget-success-message {
            margin-top: 12px;
            padding: 12px;
            background: #dcfce7;
            border-radius: 8px;
            border: 1px solid #bbf7d0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .yget-success-check {
            width: 16px;
            height: 16px;
            fill: #22c55e;
          }
          .yget-success-text {
            font-size: 14px;
            font-weight: 500;
            color: #15803d;
          }
          .yget-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
          }
          .yget-loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #93c5fd;
            border-top-color: transparent;
            border-radius: 50%;
            animation: yget-spin 0.8s linear infinite;
            margin-bottom: 8px;
          }
          .yget-loading-text {
            font-size: 14px;
            color: #6b7280;
          }
          @keyframes yget-spin {
            to { transform: rotate(360deg); }
          }
          @keyframes yget-ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        </style>

        <div class="yget-widget">
          <div class="yget-card">
            <div class="yget-image-container">
              ${imageData ? `
                <img class="yget-image" src="${imageData}" alt="验证码图片" />
              ` : `
                <div class="yget-loading">
                  <div class="yget-loading-spinner"></div>
                  <div class="yget-loading-text">加载图片中...</div>
                </div>
              `}
              ${overlay[status] || ''}
              ${clickedMarks}
              <button class="yget-refresh-btn" onclick="this.closest('.yget-widget').__ygetWidget.refresh()">
                <svg class="yget-refresh-icon" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  <path d="M21 3v5h-5" />
                </svg>
              </button>
            </div>
            <div class="yget-footer">
              <div class="yget-header">
                <div class="yget-title">
                  <svg class="yget-target-icon" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span class="yget-message">${message}</span>
                </div>
                ${clickedPoints.length > 0 && status === 'clicking' ? `
                  <button class="yget-clear-btn" onclick="this.closest('.yget-widget').__ygetWidget.clear()">清除选择</button>
                ` : ''}
              </div>
              <div class="yget-progress-container">
                <div class="yget-progress-bar">
                  <div class="yget-progress-fill" style="width: ${(clickedPoints.length / (targets.length || 3)) * 100}%;"></div>
                </div>
                <span class="yget-progress-text">${clickedPoints.length}/${targets.length || 3}</span>
              </div>
              ${status === 'success' ? `
                <div class="yget-success-message">
                  <svg class="yget-success-check" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span class="yget-success-text">验证成功！您可以继续操作。</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      const widget = this.container.querySelector('.yget-widget');
      if (widget) {
        widget.__ygetWidget = this;

        const image = this.container.querySelector('.yget-image');
        if (image) {
          image.addEventListener('click', (e) => this.handleImageClick(e));
        }
      }
    }

    destroy() {
      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }

  YgETWidget.mount = function (container, options) {
    return new YgETWidget(container, options);
  };

  window.YgET = YgET;
  window.YgETWidget = YgETWidget;
})(window);