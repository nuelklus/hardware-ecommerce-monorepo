from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('create/', views.CreateOrderView.as_view(), name='create-order'),
    path('list/', views.OrderListView.as_view(), name='order-list'),
    path('<str:order_number>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_number>/update-status/', views.update_order_status, name='update-status'),
]
