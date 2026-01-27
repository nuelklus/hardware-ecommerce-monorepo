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
        print(f"📧 Starting email sending for order {order.order_number}")
        print(f"📧 Customer email: {order.email}")
        print(f"📧 Admin email: {settings.ADMIN_EMAIL}")
        print(f"📧 Email configuration: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}")
        print(f"📧 Email user: {settings.EMAIL_HOST_USER}")
        print(f"📧 From email: {settings.DEFAULT_FROM_EMAIL}")
        
        # Check if email is properly configured
        if not hasattr(settings, 'EMAIL_HOST_USER') or not settings.EMAIL_HOST_USER:
            print("⚠️ Email not configured - skipping email sending")
            print("⚠️ Please set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD environment variables")
            return
        
        if not hasattr(settings, 'EMAIL_HOST_PASSWORD') or not settings.EMAIL_HOST_PASSWORD:
            print("⚠️ Email password not configured - skipping email sending")
            print("⚠️ Please set EMAIL_HOST_PASSWORD environment variable")
            return
        
        # Import here to avoid circular imports
        from django.core.mail import get_connection
        from django.core.mail.backends.console import EmailBackend as ConsoleEmailBackend
        
        # Email to customer
        customer_subject = f"Order Confirmation - {order.order_number}"
        customer_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
            'customer_name': f"{order.first_name} {order.last_name}",
            'is_admin': False
        })
        
        print(f"📧 Sending customer email to {order.email}")
        try:
            # Try to send with timeout protection
            import signal
            
            def timeout_handler(signum, frame):
                raise TimeoutError("SMTP connection timed out")
            
            # Set timeout for SMTP connection
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(10)  # 10 second timeout
            
            send_mail(
                subject=customer_subject,
                message='',  # HTML email, so plain text is empty
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.email],
                html_message=customer_message,
                fail_silently=True  # Don't raise exceptions
            )
            
            signal.alarm(0)  # Cancel timeout
            print(f"✅ Customer email sent successfully")
            
        except TimeoutError as e:
            print(f"❌ SMTP connection timed out: {e}")
            print("⚠️ Falling back to console email backend")
            # Fallback to console email
            try:
                console_backend = ConsoleEmailBackend()
                connection = console_backend.get_connection()
                from django.core.mail import EmailMessage
                email = EmailMessage(
                    subject=customer_subject,
                    body=customer_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[order.email],
                )
                email.content_subtype = 'html'
                connection.send_messages([email])
                print(f"✅ Customer email logged to console")
            except Exception as fallback_error:
                print(f"❌ Console email also failed: {fallback_error}")
                
        except Exception as e:
            signal.alarm(0)  # Cancel timeout
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
            # Set timeout for SMTP connection
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(10)  # 10 second timeout
            
            send_mail(
                subject=admin_subject,
                message='',  # HTML email, so plain text is empty
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                html_message=admin_message,
                fail_silently=True  # Don't raise exceptions
            )
            
            signal.alarm(0)  # Cancel timeout
            print(f"✅ Admin email sent successfully")
            
        except TimeoutError as e:
            print(f"❌ SMTP connection timed out: {e}")
            print("⚠️ Falling back to console email backend")
            # Fallback to console email
            try:
                console_backend = ConsoleEmailBackend()
                connection = console_backend.get_connection()
                from django.core.mail import EmailMessage
                email = EmailMessage(
                    subject=admin_subject,
                    body=admin_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[settings.ADMIN_EMAIL],
                )
                email.content_subtype = 'html'
                connection.send_messages([email])
                print(f"✅ Admin email logged to console")
            except Exception as fallback_error:
                print(f"❌ Console email also failed: {fallback_error}")
                
        except Exception as e:
            signal.alarm(0)  # Cancel timeout
            print(f"❌ Failed to send admin email: {e}")
            # Don't raise exception - continue with order creation


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
