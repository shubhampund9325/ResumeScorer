# test_connection.py
from django.db import connection
try:
    connection.database.client.server_info()
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print(f"❌ Connection failed: {e}")