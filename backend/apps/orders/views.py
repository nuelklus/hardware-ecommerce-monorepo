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
        """Send order confirmation emails using Resend API"""
        print(f"📧 Starting email sending for order {order.order_number}")
        print(f"📧 Customer email: {order.email}")
        print(f"📧 Admin email: {settings.ADMIN_EMAIL}")
        print(f"📧 Using Resend API for email delivery")
        
        # Check if Resend API key is configured
        if not hasattr(settings, 'RESEND_API_KEY') or not settings.RESEND_API_KEY:
            print("⚠️ Resend API key not configured - falling back to console email")
            self._send_console_emails(order)
            return
        
        # Import Resend
        try:
            import resend
            resend.api_key = settings.RESEND_API_KEY
            print(f"✅ Resend API configured successfully")
        except ImportError:
            print("⚠️ Resend package not installed - falling back to console email")
            self._send_console_emails(order)
            return
        
        # Email to customer
        customer_subject = f"Order Confirmation - {order.order_number}"
        customer_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': f"{order.first_name} {order.last_name}",
            'is_admin': False
        })
        
        print(f"📧 Sending customer email to {order.email}")
        # For Resend free tier, send customer emails to your verified address
        # In production, verify a domain to send to any email
        customer_email = order.email if hasattr(settings, 'RESEND_DOMAIN_VERIFIED') and settings.RESEND_DOMAIN_VERIFIED else settings.ADMIN_EMAIL
        
        try:
            params = {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [customer_email],
                "subject": customer_subject,
                "html": customer_message,
            }
            
            result = resend.Emails.send(params)
            print(f"✅ Customer email sent successfully via Resend. ID: {result.get('id')}")
            if customer_email != order.email:
                print(f"⚠️ Note: Email sent to {customer_email} instead of {order.email} (Resend free tier limitation)")
            
        except Exception as e:
            print(f"❌ Failed to send customer email via Resend: {e}")
            print(f"❌ Error type: {type(e).__name__}")
            # Don't raise exception - continue with order creation
        
        # Add delay before sending admin email
        import time
        print("⏳ Waiting 1 second before sending admin email...")
        time.sleep(1)
        
        # Email to admin
        admin_subject = f"New Order Received - {order.order_number}"
        admin_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': "Admin",
            'is_admin': True
        })
        
        print(f"📧 Sending admin email to {settings.ADMIN_EMAIL}")
        try:
            params = {
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [settings.ADMIN_EMAIL],
                "subject": admin_subject,
                "html": admin_message,
            }
            
            result = resend.Emails.send(params)
            print(f"✅ Admin email sent successfully via Resend. ID: {result.get('id')}")
            
        except Exception as e:
            print(f"❌ Failed to send admin email via Resend: {e}")
            print(f"❌ Error type: {type(e).__name__}")
            # Don't raise exception - continue with order creation
    
    def _send_console_emails(self, order):
        """Fallback method to send emails to console when Resend is not available"""
        print("📧 Using console email fallback...")
        
        # Customer email
        customer_subject = f"Order Confirmation - {order.order_number}"
        customer_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': f"{order.first_name} {order.last_name}",
            'is_admin': False
        })
        
        print(f"\n{'='*50}")
        print(f"📧 CUSTOMER EMAIL")
        print(f"{'='*50}")
        print(f"To: {order.email}")
        print(f"Subject: {customer_subject}")
        print(f"From: {settings.DEFAULT_FROM_EMAIL}")
        print(f"\n{customer_message}")
        print(f"{'='*50}")
        
        # Admin email
        admin_subject = f"New Order Received - {order.order_number}"
        admin_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': "Admin",
            'is_admin': True
        })
        
        print(f"\n{'='*50}")
        print(f"📧 ADMIN EMAIL")
        print(f"{'='*50}")
        print(f"To: {settings.ADMIN_EMAIL}")
        print(f"Subject: {admin_subject}")
        print(f"From: {settings.DEFAULT_FROM_EMAIL}")
        print(f"\n{admin_message}")
        print(f"{'='*50}")
        
        print("✅ Console emails sent successfully")


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
