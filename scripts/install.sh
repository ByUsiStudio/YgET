#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}      YgET 验证码服务安装脚本${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""

check_command() {
  if command -v "$1" &> /dev/null; then
    echo -e "${GREEN}✓ $1 已安装${NC}"
    return 0
  else
    echo -e "${RED}✗ $1 未安装${NC}"
    return 1
  fi
}

install_nodejs() {
  echo -e "${YELLOW}正在安装 Node.js...${NC}"
  
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v apt-get &> /dev/null; then
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      sudo apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
      curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
      sudo yum install -y nodejs
    elif command -v dnf &> /dev/null; then
      curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
      sudo dnf install -y nodejs
    elif command -v pacman &> /dev/null; then
      sudo pacman -S --noconfirm nodejs npm
    else
      echo -e "${RED}不支持的包管理器，请手动安装 Node.js${NC}"
      exit 1
    fi
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v brew &> /dev/null; then
      brew install node
    else
      echo -e "${RED}请先安装 Homebrew：/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${NC}"
      exit 1
    fi
  else
    echo -e "${RED}不支持的操作系统${NC}"
    exit 1
  fi
}

install_pnpm() {
  echo -e "${YELLOW}正在安装 pnpm...${NC}"
  npm install -g pnpm
}

echo -e "${YELLOW}【1/4】检查环境依赖${NC}"
echo ""

check_command node || install_nodejs
check_command npm || install_nodejs

echo ""
echo -e "${YELLOW}【2/4】安装 pnpm${NC}"
echo ""

check_command pnpm || install_pnpm

echo ""
echo -e "${YELLOW}【3/4】克隆项目并安装依赖${NC}"
echo ""

if [ -d "YgET" ]; then
  echo -e "${YELLOW}检测到已存在 YgET 目录，将更新代码...${NC}"
  cd YgET
  git pull origin main
else
  echo -e "${YELLOW}正在克隆项目...${NC}"
  git clone https://github.com/ByUsiStudio/YgET.git
  cd YgET
fi

echo -e "${YELLOW}正在安装依赖...${NC}"
pnpm install

echo -e "${YELLOW}正在构建项目...${NC}"
pnpm run build

echo ""
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}      安装完成！${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "${YELLOW}启动服务：${NC}"
echo -e "  ${GREEN}后端服务：${NC} cd YgET && node start-server.js"
echo -e "  ${GREEN}前端服务：${NC} cd YgET && node start-web.js"
echo ""
echo -e "${YELLOW}访问地址：${NC}"
echo -e "  ${GREEN}后端 API：${NC} http://localhost:3001"
echo -e "  ${GREEN}前端页面：${NC} http://localhost:5173"
echo -e "  ${GREEN}验证码 SDK：${NC} http://localhost:3001/yget-sdk.js"
echo ""
echo -e "${YELLOW}详细文档：${NC}"
echo -e "  请查看项目根目录的 README.md"
echo ""
echo -e "${GREEN}===========================================${NC}"