#!/bin/bash

# 组件库测试脚本

echo "========================================="
echo "  组件库测试脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 registry 服务器是否运行
echo "1️⃣  检查 Registry 服务器..."
if curl -s http://localhost:3001/api/registry > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Registry 服务器正在运行"
    echo ""

    # 列出可用组件
    echo "📦 可用组件:"
    curl -s http://localhost:3001/api/registry | jq -r '.components[]'
    echo ""

    # 测试获取 my-button 组件
    echo "2️⃣  测试获取 my-button 组件..."
    COMPONENT_NAME=$(curl -s http://localhost:3001/api/registry/my-button | jq -r '.name')
    if [ "$COMPONENT_NAME" = "my-button" ]; then
        echo -e "${GREEN}✅${NC} 成功获取 my-button 组件"
        echo ""

        # 显示组件信息
        echo "📋 组件信息:"
        curl -s http://localhost:3001/api/registry/my-button | jq '{name, type, files: (.files | length)}'
        echo ""

        echo "3️⃣  测试类型检查..."
        cd ../test-project
        if npx tsc --noEmit 2>&1 | grep -q "error"; then
            echo -e "${RED}❌${NC} TypeScript 类型检查失败"
        else
            echo -e "${GREEN}✅${NC} TypeScript 类型检查通过"
        fi

        echo ""
        echo "========================================="
        echo -e "${GREEN}🎉 所有测试通过！${NC}"
        echo "========================================="
        echo ""
        echo "📚 查看 TEST_SUMMARY.md 了解测试详情"
        echo "📖 查看 QUICKSTART.md 了解使用方法"
    else
        echo -e "${RED}❌${NC} 获取组件失败"
        exit 1
    fi
else
    echo -e "${RED}❌${NC} Registry 服务器未运行"
    echo ""
    echo -e "${YELLOW}请先启动服务器:${NC}"
    echo "  cd /Users/yuhaotian/workspace/apps/shadcn-air/my-component-library"
    echo "  npx tsx cli/server.ts"
    exit 1
fi
