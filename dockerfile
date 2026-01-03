FROM node:16-buster

WORKDIR /app

# 1. 安装依赖
COPY package.json .
RUN npm install --registry=https://registry.npmmirror.com

# 2. 复制所有文件
# 这一步会将你本地准备好的 publickey.pem, privatekey.pem, flag.txt 和 system.log 全部拷进去
COPY . .

# 3. 初始化数据库
RUN node init_db.js

EXPOSE 8080
CMD ["node", "app.js"]