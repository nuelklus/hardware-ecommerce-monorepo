from django.core.management.base import BaseCommand
from apps.products.models import Category, Brand

class Command(BaseCommand):
    help = 'Create test categories and brands for upload testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating test categories and brands...')
        
        # Create categories
        categories_data = [
            {'name': 'Power Tools', 'slug': 'power-tools'},
            {'name': 'Hand Tools', 'slug': 'hand-tools'},
            {'name': 'Building Materials', 'slug': 'building-materials'},
        ]
        
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'  Created category: {category.name} (ID: {category.id})')
            else:
                self.stdout.write(f'  Category exists: {category.name} (ID: {category.id})')
        
        # Create brands
        brands_data = [
            {'name': 'Test Brand', 'slug': 'test-brand'},
            {'name': 'Hardware Pro', 'slug': 'hardware-pro'},
        ]
        
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults=brand_data
            )
            if created:
                self.stdout.write(f'  Created brand: {brand.name} (ID: {brand.id})')
            else:
                self.stdout.write(f'  Brand exists: {brand.name} (ID: {brand.id})')
        
        self.stdout.write('Test data creation complete!')
        
        # Show what's available
        self.stdout.write('\nAvailable Categories:')
        for cat in Category.objects.all():
            self.stdout.write(f'  ID {cat.id}: {cat.name}')
            
        self.stdout.write('\nAvailable Brands:')
        for brand in Brand.objects.all():
            self.stdout.write(f'  ID {brand.id}: {brand.name}')
