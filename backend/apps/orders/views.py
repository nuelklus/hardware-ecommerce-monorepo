from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import Order, OrderStatusUpdate
from .serializers import OrderSerializer, CreateOrderSerializer


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CreateOrderSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Send emails
        try:
            self.send_order_emails(order)
            print(f"✅ Emails sent successfully for order {order.order_number}")
        except Exception as e:
            # Log error but don't fail the order creation
            import traceback
            print(f"❌ Failed to send emails for order {order.order_number}: {e}")
            print(f"❌ Email configuration: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}, USER={settings.EMAIL_HOST_USER}")
            print(f"❌ Full traceback: {traceback.format_exc()}")
        
        # Return the created order
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def send_order_emails(self, order):
        """Send order confirmation emails to customer and admin"""
        print(f"📧 Email sending temporarily disabled for order {order.order_number}")
        print(f"📧 Order created successfully - emails will be enabled once SMTP is properly configured")
        
        # TODO: Re-enable email sending once SMTP environment variables are properly set
        return
        
        # Email sending code below is disabled for now
        """
        print(f"📧 Customer email: {order.email}")
        print(f"📧 Admin email: {settings.ADMIN_EMAIL}")
        
        # Check if email is properly configured
        if not hasattr(settings, 'EMAIL_HOST_USER') or not settings.EMAIL_HOST_USER:
            print("⚠️ Email not configured - skipping email sending")
            return
        
        # Email to customer
        customer_subject = f"Order Confirmation - {order.order_number}"
        customer_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': f"{order.first_name} {order.last_name}",
            'is_admin': False
        })
        
        print(f"📧 Sending customer email to {order.email}")
        try:
            send_mail(
                subject=customer_subject,
                message='',  # HTML email, so plain text is empty
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.email],
                html_message=customer_message,
                fail_silently=True  # Don't raise exceptions
            )
            print(f"✅ Customer email sent successfully")
        except Exception as e:
            print(f"❌ Failed to send customer email: {e}")
            # Don't raise exception - continue with order creation
        
        # Email to admin
        admin_subject = f"New Order Received - {order.order_number}"
        admin_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': "Admin",
            'is_admin': True
        })
        
        print(f"📧 Sending admin email to {settings.ADMIN_EMAIL}")
        try:
            send_mail(
                subject=admin_subject,
                message='',  # HTML email, so plain text is empty
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                html_message=admin_message,
                fail_silently=True  # Don't raise exceptions
            )
            print(f"✅ Admin email sent successfully")
        except Exception as e:
            print(f"❌ Failed to send admin email: {e}")
            # Don't raise exception - continue with order creation
        """


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_order_status(request, order_number):
    """Update order status (admin only)"""
    if not request.user.is_staff:
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        order = Order.objects.get(order_number=order_number)
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status not in dict(Order.ORDER_STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update order status
        order.status = new_status
        order.save()
        
        # Create status update record
        OrderStatusUpdate.objects.create(
            order=order,
            status=new_status,
            notes=notes,
            created_by=request.user
        )
        
        return Response({'message': 'Status updated successfully'})
    
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
