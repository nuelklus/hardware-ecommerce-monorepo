from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from apps.orders.models import Order, OrderItem
from apps.products.models import Product


class Command(BaseCommand):
    help = 'Test order email with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Testing Order Email with Sample Data')
        self.stdout.write('=' * 50)
        
        try:
            # Create a sample order for testing
            order = Order(
                order_number='TEST-1001',
                first_name='John',
                last_name='Doe',
                email='nuelklus@gmail.com',
                phone='0201234567',
                shipping_address='123 Test Street, Test Area',
                city='Accra',
                region='Greater Accra',
                postal_code='00233',
                order_notes='Please deliver after 5pm',
                total_amount=100.00,
                shipping_cost=10.00,
                tax_amount=5.00,
                payment_method='cod',
                payment_status='pending',
                status='pending'
            )
            order.save()
            
            # Add sample order items
            product = Product.objects.first()
            if product:
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    product_sku=product.sku,
                    price=product.price,
                    quantity=2
                )
            
            self.stdout.write(f'Created test order: {order.order_number}')
            self.stdout.write(f'Order items: {order.items.count()}')
            
            # Test email template rendering
            self.stdout.write('\nTesting email template rendering...')
            
            customer_message = render_to_string('emails/order_confirmation.html', {
                'order': order,
                'customer_name': f"{order.first_name} {order.last_name}",
                'is_admin': False
            })
            
            self.stdout.write('Customer email template rendered successfully')
            
            # Send test email
            self.stdout.write('\nSending customer email...')
            send_mail(
                subject=f'Order Confirmation - {order.order_number}',
                message='',  # HTML email, so plain text is empty
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.email],
                html_message=customer_message,
                fail_silently=False
            )
            
            self.stdout.write(self.style.SUCCESS(f'SUCCESS: Customer email sent to {order.email}'))
            
            # Send admin email
            admin_message = render_to_string('emails/order_confirmation.html', {
                'order': order,
                'customer_name': "Admin",
                'is_admin': True
            })
            
            self.stdout.write('\nSending admin email...')
            send_mail(
                subject=f'New Order Received - {order.order_number}',
                message='',  # HTML email, so plain text is empty
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                html_message=admin_message,
                fail_silently=False
            )
            
            self.stdout.write(self.style.SUCCESS(f'SUCCESS: Admin email sent to {settings.ADMIN_EMAIL}'))
            
            # Clean up test order
            order.delete()
            self.stdout.write('Test order cleaned up')
            
        except Exception as e:
            import traceback
            self.stdout.write(self.style.ERROR(f'ERROR: {str(e)}'))
            self.stdout.write(f'Full traceback: {traceback.format_exc()}')
