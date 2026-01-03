const db = require('better-sqlite3')('./database.db');

console.log("初始化数据库...");

// 1. 创建 users 表
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT
    );
`);

// 2. 创建 messages 表 【关键修改】
// 先删除旧表，确保新约束生效
db.exec(`DROP TABLE IF EXISTS messages;`);

// 添加 NOT NULL 约束
// 这样当 SQL 注入条件为假(1=0)导致插入 NULL 时，数据库会报错(500)，脚本才能判断出 False
db.exec(`
    CREATE TABLE messages (
        message TEXT NOT NULL
    );
`);

// 3. 插入 Admin 用户
const stmt = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
stmt.run('admin', '114514'); 

console.log("数据库初始化完成。Admin (114514) 已创建，messages 表约束已强制生效。");