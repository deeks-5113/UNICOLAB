import sqlite3

conn = sqlite3.connect('unicollab_v2.db')
cursor = conn.cursor()

print("Users in database:")
cursor.execute("SELECT id, email FROM users")
print(cursor.fetchall())

print("\nProfiles in database:")
cursor.execute("SELECT id, full_name, email FROM profiles")
print(cursor.fetchall())

conn.close()
