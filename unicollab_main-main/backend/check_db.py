import sqlite3
import uuid

conn = sqlite3.connect('unicollab_v2.db')
cursor = conn.cursor()

print("Projects in database:")
cursor.execute("SELECT id, title, status FROM projects")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
