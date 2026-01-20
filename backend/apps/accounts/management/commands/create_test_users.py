from django.core.management.base import BaseCommand
from apps.accounts.services import AuthService


class Command(BaseCommand):
    help = 'Create test users for development'
    
    def handle(self, *args, **options):
        self.stdout.write("🔧 Creating test users...")
        
        # Create test customer
        try:
            customer, tokens = AuthService.register_user(
                username="testcustomer",
                email="customer@test.com",
                password="TestPass123!",
                role="CUSTOMER",
                phone_number="+233501234567"
            )
            self.stdout.write(
                self.style.SUCCESS(f"✅ Created customer: {customer.username}")
            )
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f"⚠️ Customer already exists or error: {e}")
            )
        
        # Create test pro-contractor
        try:
            pro_contractor, tokens = AuthService.register_user(
                username="testpro",
                email="pro@test.com",
                password="TestPass123!",
                role="PRO_CONTRACTOR",
                phone_number="+233501234568"
            )
            self.stdout.write(
                self.style.SUCCESS(f"✅ Created pro-contractor: {pro_contractor.username}")
            )
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f"⚠️ Pro-contractor already exists or error: {e}")
            )
        
        # Create test admin
        try:
            admin, tokens = AuthService.register_user(
                username="testadmin",
                email="admin@test.com",
                password="TestPass123!",
                role="ADMIN",
                phone_number="+233501234569"
            )
            self.stdout.write(
                self.style.SUCCESS(f"✅ Created admin: {admin.username}")
            )
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f"⚠️ Admin already exists or error: {e}")
            )
        
        self.stdout.write(self.style.SUCCESS("🎉 Test users creation complete!"))
