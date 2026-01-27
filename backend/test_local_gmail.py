#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.dev')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_local_gmail():
    print("📧 Testing Gmail SMTP locally...")
    print(f"📧 Email backend: {settings.EMAIL_BACKEND}")
    print(f"📧 Email host: {settings.EMAIL_HOST}")
    print(f"📧 Email port: {settings.EMAIL_PORT}")
    print(f"📧 Email user: {settings.EMAIL_HOST_USER}")
    print(f"📧 From email: {settings.DEFAULT_FROM_EMAIL}")
    
    try:
        print("\n📧 Sending test email...")
        result = send_mail(
            subject='Test Email from Local Hardware E-commerce',
            message='This is a test email to verify local Gmail SMTP configuration.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],  # Send to self
            fail_silently=False
        )
        print(f"✅ Local test email sent successfully! Result: {result}")
        return True
    except Exception as e:
        print(f"❌ Local test email failed: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        return False

if __name__ == '__main__':
    test_local_gmail()
