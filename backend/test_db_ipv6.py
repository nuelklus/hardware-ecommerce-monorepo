import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    print("DATABASE_URL not found in .env")
    exit(1)

# Parse the DATABASE_URL and replace hostname with IPv6 address
# Original: postgresql://postgres:password@db.xachljqxtnhnmbpcnymt.supabase.co:5432/postgres?sslmode=require
# Using IPv6 from nslookup: 2a05:d018:135e:1614:4cd3:f243:bf48:eadb

parsed = DATABASE_URL.replace("db.xachljqxtnhnmbpcnymt.supabase.co", "[2a05:d018:135e:1614:4cd3:f243:bf48:eadb]")
print(f"Testing connection via IPv6: {parsed.split('@')[1].split('/')[0]}")

try:
    # Connect using IPv6 address
    conn = psycopg2.connect(parsed)
    cur = conn.cursor()
    
    # Test query: get current database time
    cur.execute("SELECT NOW();")
    db_time = cur.fetchone()[0]
    print(f"✅ IPv6 connection successful. Database time: {db_time}")
    
    # Optional: show connection info
    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    print(f"PostgreSQL version: {version.split(',')[0]}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ IPv6 connection failed: {e}")
