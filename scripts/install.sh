#!/bin/bash

set -e

YGET_DIR="/opt/YgET"
YGET_USER="yget"
YGET_GROUP="yget"
SYSTEMD_SERVICE_FILE="/etc/systemd/system/yget.service"
SYSTEMD_WEB_SERVICE_FILE="/etc/systemd/system/yget-web.service"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

title() {
  echo -e "${GREEN}"
  echo "============================================="
  echo "         YgET 验证码服务安装脚本"
  echo "============================================="
  echo -e "${NC}"
}

info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
  if [ "$(id -u)" != "0" ]; then
    error "请使用 root 用户运行此脚本"
    error "执行: sudo su - 或 sudo bash $0"
    exit 1
  fi
}

check_os() {
  if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    error "此脚本仅支持 Linux 系统"
    exit 1
  fi
}

check_command() {
  if command -v "$1" &> /dev/null; then
    return 0
  else
    return 1
  fi
}

install_dependencies() {
  info "安装必要依赖..."
  
  if command -v apt-get &> /dev/null; then
    apt-get update -y
    apt-get install -y curl git
  elif command -v yum &> /dev/null; then
    yum install -y curl git
  elif command -v dnf &> /dev/null; then
    dnf install -y curl git
  elif command -v pacman &> /dev/null; then
    pacman -S --noconfirm curl git
  else
    error "不支持的包管理器"
    exit 1
  fi
}

install_nodejs() {
  info "安装 Node.js 20.x..."
  
  if check_command node && node -v | grep -q "v20"; then
    success "Node.js 20.x 已安装"
    return
  fi
  
  if command -v apt-get &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  elif command -v yum &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs
  elif command -v dnf &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs
  elif command -v pacman &> /dev/null; then
    pacman -S --noconfirm nodejs npm
  else
    error "不支持的包管理器"
    exit 1
  fi
  
  success "Node.js 安装完成"
}

install_pnpm() {
  info "安装 pnpm..."
  
  if check_command pnpm; then
    success "pnpm 已安装"
    return
  fi
  
  npm install -g pnpm
  success "pnpm 安装完成"
}

create_user() {
  info "创建 YgET 用户..."
  
  if id "$YGET_USER" &>/dev/null; then
    success "用户 $YGET_USER 已存在"
    return
  fi
  
  groupadd -f "$YGET_GROUP"
  useradd -g "$YGET_GROUP" -s /bin/bash -d "$YGET_DIR" -m "$YGET_USER"
  success "用户 $YGET_USER 创建完成"
}

clone_or_update() {
  info "克隆/更新项目代码..."
  
  if [ -d "$YGET_DIR/.git" ]; then
    info "检测到已安装，正在更新..."
    cd "$YGET_DIR"
    git pull origin main
    success "代码更新完成"
  else
    info "首次安装，克隆代码..."
    rm -rf "$YGET_DIR"
    git clone https://github.com/ByUsiStudio/YgET.git "$YGET_DIR"
    success "代码克隆完成"
  fi
}

install_project_deps() {
  info "安装项目依赖..."
  
  cd "$YGET_DIR"
  rm -rf node_modules
  pnpm install
  success "依赖安装完成"
}

build_project() {
  info "构建项目..."
  
  cd "$YGET_DIR"
  pnpm run build
  success "项目构建完成"
}

setup_permissions() {
  info "设置文件权限..."
  
  chown -R "$YGET_USER:$YGET_GROUP" "$YGET_DIR"
  chmod +x "$YGET_DIR/start-server.js"
  chmod +x "$YGET_DIR/start-web.js"
  success "权限设置完成"
}

create_systemd_service() {
  info "创建 systemd 服务..."
  
  cat > "$SYSTEMD_SERVICE_FILE" <<EOF
[Unit]
Description=YgET 验证码后端服务
Documentation=https://github.com/ByUsiStudio/YgET
After=network.target

[Service]
Type=simple
User=$YGET_USER
Group=$YGET_GROUP
WorkingDirectory=$YGET_DIR
ExecStart=/usr/bin/node $YGET_DIR/start-server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
  
  cat > "$SYSTEMD_WEB_SERVICE_FILE" <<EOF
[Unit]
Description=YgET 验证码前端服务
Documentation=https://github.com/ByUsiStudio/YgET
After=network.target yget.service

[Service]
Type=simple
User=$YGET_USER
Group=$YGET_GROUP
WorkingDirectory=$YGET_DIR
ExecStart=/usr/bin/node $YGET_DIR/start-web.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
  
  systemctl daemon-reload
  systemctl enable yget
  systemctl enable yget-web
  
  success "systemd 服务创建完成"
}

start_services() {
  info "启动服务..."
  
  systemctl start yget
  systemctl start yget-web
  
  sleep 3
  
  if systemctl is-active --quiet yget && systemctl is-active --quiet yget-web; then
    success "服务启动成功"
  else
    error "服务启动失败，请检查日志"
    error "查看日志: journalctl -u yget -f"
    exit 1
  fi
}

show_info() {
  echo ""
  echo -e "${GREEN}=============================================${NC}"
  echo -e "${GREEN}              安装完成！${NC}"
  echo -e "${GREEN}=============================================${NC}"
  echo ""
  echo -e "${YELLOW}服务管理命令：${NC}"
  echo -e "  ${GREEN}后端服务：${NC}"
  echo -e "    systemctl start yget          # 启动"
  echo -e "    systemctl stop yget           # 停止"
  echo -e "    systemctl restart yget        # 重启"
  echo -e "    systemctl status yget         # 查看状态"
  echo -e "    journalctl -u yget -f         # 查看日志"
  echo ""
  echo -e "  ${GREEN}前端服务：${NC}"
  echo -e "    systemctl start yget-web      # 启动"
  echo -e "    systemctl stop yget-web       # 停止"
  echo -e "    systemctl restart yget-web    # 重启"
  echo -e "    systemctl status yget-web     # 查看状态"
  echo -e "    journalctl -u yget-web -f     # 查看日志"
  echo ""
  echo -e "${YELLOW}访问地址：${NC}"
  echo -e "  ${GREEN}后端 API：${NC} http://localhost:3001"
  echo -e "  ${GREEN}前端页面：${NC} http://localhost:5173"
  echo -e "  ${GREEN}验证码 SDK：${NC} http://localhost:3001/yget-sdk.js"
  echo ""
  echo -e "${YELLOW}项目目录：${NC}"
  echo -e "  ${GREEN}${YGET_DIR}${NC}"
  echo ""
  echo -e "${YELLOW}详细文档：${NC}"
  echo -e "  请查看项目目录中的 README.md"
  echo ""
  echo -e "${GREEN}=============================================${NC}"
}

main() {
  title
  
  check_root
  check_os
  
  info "开始安装 YgET 验证码服务..."
  echo ""
  
  info "【1/7】安装系统依赖"
  install_dependencies
  echo ""
  
  info "【2/7】安装 Node.js"
  install_nodejs
  echo ""
  
  info "【3/7】安装 pnpm"
  install_pnpm
  echo ""
  
  info "【4/7】创建运行用户"
  create_user
  echo ""
  
  info "【5/7】下载项目代码"
  clone_or_update
  echo ""
  
  info "【6/7】安装项目依赖并构建"
  install_project_deps
  build_project
  setup_permissions
  echo ""
  
  info "【7/7】创建 systemd 服务并启动"
  create_systemd_service
  start_services
  echo ""
  
  show_info
}

main "$@"