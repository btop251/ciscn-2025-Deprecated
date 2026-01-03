# CISCN Web Challenge - Deprecated Site

这是一个模拟的 CTF Web 题目环境，包含 **JWT 算法混淆 (Algorithm Confusion)** 和 **SQLite 注入** 漏洞。
本题目环境已封装为 Docker，可一键部署。

## 🚀 快速启动 (Quick Start)

### 方法一：使用 Docker (推荐)

你需要先安装 [Docker](https://www.docker.com/)。

1.  **克隆仓库**
    ```bash
    git clone https://github.com/btop251/ciscn-2025-Deprecated.git
    cd ciscn-2025-Deprecated
    ```

2.  **构建镜像**
    
    ```bash
    # 注意：构建过程中会自动初始化数据库
    docker build -t ciscn_web_challenge .
    ```
    
3.  **运行容器**
    ```bash
    # 将容器的 8080 端口映射到本地的 8081 端口
    docker run -d -p 8081:8080 --name ciscn_web ciscn_web_challenge
    ```

4.  **访问题目**
    打开浏览器访问：`http://localhost:8081/auth`

---

### 方法二：本地开发环境运行

如果你想调试源码，也可以在本地直接运行（需要 Node.js 环境）。

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **初始化数据库**
    首次运行前，必须手动执行初始化脚本来创建表和预埋管理员账号。
    ```bash
    node init_db.js
    ```

3.  **启动服务**
    ```bash
    node app.js
    ```
    访问 `http://localhost:8081` 即可。
    
    
