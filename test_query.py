import sqlite3

# 1. 连接你建好的数据库
conn = sqlite3.connect('my_project.db')
cursor = conn.cursor()

# 2. 插入点假数据，这样查询才不会空白
cursor.execute("DELETE FROM fact_order;")
cursor.execute("DELETE FROM dim_goods;")
cursor.execute("DELETE FROM dim_time;")

cursor.execute("INSERT INTO dim_goods VALUES (1, 'iPhone', '手机');")
cursor.execute("INSERT INTO dim_goods VALUES (2, 'iPad', '平板');")
cursor.execute("INSERT INTO dim_time VALUES (1, '2026-11-01', 2026, 11, 1, 'Sunday');")
cursor.execute("INSERT INTO dim_time VALUES (2, '2026-11-02', 2026, 11, 2, 'Monday');")

cursor.execute("INSERT INTO fact_order VALUES (1001, 1, 1, '2026-11-01', 2, 10000, 5000);")
cursor.execute("INSERT INTO fact_order VALUES (1002, 2, 2, '2026-11-01', 1, 5000, 5000);")
cursor.execute("INSERT INTO fact_order VALUES (1003, 3, 1, '2026-11-02', 3, 15000, 5000);")
conn.commit()

# 3. 执行课件里的 3 条查询
print("=== 查询结果如下 ===")
cursor.execute("SELECT count(*) AS total_orders FROM fact_order;")
print(f"1. 总订单数: {cursor.fetchone()[0]} 单")

cursor.execute("""
SELECT g.goods_name, SUM(f.quantity) AS qty
FROM fact_order f JOIN dim_goods g ON f.goods_id = g.goods_id
GROUP BY g.goods_name ORDER BY qty DESC LIMIT 5;
""")
print("2. 按商品分组的总销量 Top 5:")
for row in cursor.fetchall():
    print(f"   - {row[0]} 销量: {row[1]}")

cursor.execute("""
SELECT t.full_date, COUNT(*) AS order_cnt
FROM fact_order f JOIN dim_time t ON f.time_id = t.time_id
GROUP BY t.full_date ORDER BY t.full_date;
""")
print("3. 按日期分组的下单量:")
for row in cursor.fetchall():
    print(f"   - {row[0]} 下单量: {row[1]} 单")

conn.close()