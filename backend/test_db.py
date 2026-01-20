import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Load from environment variables
try:
    conn = psycopg2.connect(
        host=os.getenv("SUPABASE_DB_HOST"),
        port=os.getenv("SUPABASE_DB_PORT"),
        database=os.getenv("SUPABASE_DB_NAME"),
        user=os.getenv("SUPABASE_DB_USER"),
        password=os.getenv("SUPABASE_DB_PASSWORD"),
        sslmode="require"
    )
    cur = conn.cursor()
    cur.execute("SELECT NOW();")
    print(f"✅ SUCCESS: Connected at {cur.fetchone()[0]}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"❌ STILL FAILING: {e}")
