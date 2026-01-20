from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static


def health(request):
    return JsonResponse({"status": "ok"})


def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        "message": "Hardware E-commerce API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "health": "/api/health/",
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
    path("api/", include("apps.api_urls")),
]

# Serve media and static files in production
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
