from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


def health(request):
    return JsonResponse({"status": "ok"})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def test_email_main(request):
    """Main test email endpoint without authentication issues"""
    print("📧 Testing email configuration (main endpoint)...")
    print(f"📧 Email backend: {settings.EMAIL_BACKEND}")
    print(f"📧 Email host: {settings.EMAIL_HOST}")
    print(f"📧 Email port: {settings.EMAIL_PORT}")
    print(f"📧 Email use TLS: {settings.EMAIL_USE_TLS}")
    print(f"📧 Email use SSL: {getattr(settings, 'EMAIL_USE_SSL', 'Not set')}")
    print(f"📧 Email user: {settings.EMAIL_HOST_USER}")
    print(f"📧 From email: {settings.DEFAULT_FROM_EMAIL}")
    
    config_info = {
        'backend': str(settings.EMAIL_BACKEND),
        'host': str(settings.EMAIL_HOST),
        'port': str(settings.EMAIL_PORT),
        'use_tls': str(getattr(settings, 'EMAIL_USE_TLS', 'Not set')),
        'use_ssl': str(getattr(settings, 'EMAIL_USE_SSL', 'Not set')),
        'user': str(settings.EMAIL_HOST_USER),
        'from_email': str(settings.DEFAULT_FROM_EMAIL),
    }
    
    try:
        print("\n📧 Sending test email...")
        result = send_mail(
            subject='Test Email from Hardware E-commerce',
            message='This is a test email to verify SMTP configuration.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],  # Send to self
            fail_silently=False
        )
        print(f"✅ Test email sent successfully! Result: {result}")
        return JsonResponse({
            'success': True,
            'message': 'Test email sent successfully',
            'result': result,
            'config': config_info
        })
    except Exception as e:
        print(f"❌ Test email failed: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        return JsonResponse({
            'success': False,
            'message': 'Test email failed',
            'error': str(e),
            'error_type': type(e).__name__,
            'config': config_info
        }, status=500)


def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        "message": "Hardware E-commerce API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "health": "/api/health/",
            "test-email": "/api/test-email/",
            "products": "/api/products/",
            "orders": "/api/orders/",
            "shipping": "/api/shipping/",
        },
        "docs": "https://github.com/nuelklus/hardware-ecommerce-monorepo"
    })


urlpatterns = [
    path("", api_root, name="api_root"),  # Root URL
    path("admin/", admin.site.urls),
    path("api/health/", health),  # Keep for backward compatibility
    path("api/test-email/", test_email_main),  # Main test email endpoint
    path("api/", include("apps.api_urls")),
]

# Serve media and static files in production
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
