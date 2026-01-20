from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Test email configuration'

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            help='Email address to send test to',
            default=settings.ADMIN_EMAIL
        )

    def handle(self, *args, **options):
        to_email = options['to']
        
        self.stdout.write(f'Testing email configuration...')
        self.stdout.write(f'Email Host: {settings.EMAIL_HOST}')
        self.stdout.write(f'Email Port: {settings.EMAIL_PORT}')
        self.stdout.write(f'Email User: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'From Email: {settings.DEFAULT_FROM_EMAIL}')
        self.stdout.write(f'Admin Email: {settings.ADMIN_EMAIL}')
        self.stdout.write(f'Testing email to: {to_email}')
        
        try:
            send_mail(
                subject='Hardware E-commerce - Test Email',
                message='This is a test email from Hardware E-commerce system.\n\nIf you receive this, email configuration is working correctly!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to_email],
                html_message='''
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1>Hardware E-commerce</h1>
                        <p>Email Test</p>
                    </div>
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
                        <h2>✅ Email Configuration Working!</h2>
                        <p>This is a test email from your Hardware E-commerce system.</p>
                        <p>If you receive this, your email configuration is working correctly!</p>
                        <p><strong>Settings Verified:</strong></p>
                        <ul>
                            <li>Email Host: {settings.EMAIL_HOST}</li>
                            <li>Email Port: {settings.EMAIL_PORT}</li>
                            <li>Email Backend: {settings.EMAIL_BACKEND}</li>
                        </ul>
                    </div>
                </body>
                </html>
                '''
            )
            
            self.stdout.write(self.style.SUCCESS('SUCCESS: Test email sent successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'ERROR: Email test failed: {str(e)}'))
            self.stdout.write('Please check your email configuration in .env file')
