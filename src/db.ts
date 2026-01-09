import { Pool } from "pg";

// 创建数据库连接池
const pool = new Pool({
  host: "localhost", // 数据库在本地
  port: 5432, // PostgreSQL 默认端口
  database: "securevault", // 你创建的数据库名
  user: "postgres", // 你的 Mac 用户名
});

// 当连接成功时
pool.on("connect", () => {
  console.log("✅ Database connected");
});

// 当连接出错时
pool.on("error", (err) => {
  console.error("❌ Database error:", err);
});

// 导出 pool，其他文件可以用它查询数据库
export default pool;
