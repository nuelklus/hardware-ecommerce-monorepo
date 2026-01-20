from rest_framework import serializers
from .models import (
    Product, Category, Brand, Warehouse, ProductImage, 
    TechnicalSpecification, WarehouseStock, ProductReview
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent', 'is_active']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website', 'is_active']

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'code', 'address', 'phone', 'email', 'is_active']

class TechnicalSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalSpecification
        fields = ['label', 'value', 'spec_type']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'sort_order']

class WarehouseStockSerializer(serializers.ModelSerializer):
    warehouse = WarehouseSerializer(read_only=True)
    
    class Meta:
        model = WarehouseStock
        fields = ['warehouse', 'quantity', 'last_updated']

class ProductReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'title', 'content', 'is_verified', 'created_at']

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'price', 'compare_price', 'discount_percentage',
            'category', 'brand', 'primary_image', 'image_url', 'stock_status',
            'is_featured', 'created_at'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return ProductImageSerializer(primary).data
        # Return first image if no primary is set
        first_image = obj.images.first()
        if first_image:
            return ProductImageSerializer(first_image).data
        return None

    def get_stock_status(self, obj):
        if not obj.track_stock:
            return {'status': 'available', 'message': 'Available'}
        elif obj.stock_quantity > obj.low_stock_threshold:
            return {'status': 'in_stock', 'message': 'In Stock'}
        elif obj.stock_quantity > 0:
            return {'status': 'low_stock', 'message': 'Low Stock'}
        else:
            return {'status': 'out_of_stock', 'message': 'Out of Stock'}

    def get_discount_percentage(self, obj):
        return obj.discount_percentage

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    specifications = TechnicalSpecificationSerializer(many=True, read_only=True)
    warehouse_stock = WarehouseStockSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    stock_status = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'barcode',
            'description', 'short_description',
            'price', 'compare_price', 'cost_price', 'discount_percentage',
            'category', 'brand', 'condition', 'weight', 'dimensions', 'image_url',
            'track_stock', 'stock_quantity', 'low_stock_threshold',
            'stock_status', 'is_active', 'is_featured', 'is_digital',
            'images', 'specifications', 'warehouse_stock', 'reviews',
            'average_rating', 'meta_title', 'meta_description',
            'created_at', 'updated_at'
        ]

    def get_stock_status(self, obj):
        if not obj.track_stock:
            return {'status': 'available', 'message': 'Available'}
        elif obj.stock_quantity > obj.low_stock_threshold:
            return {'status': 'in_stock', 'message': 'In Stock'}
        elif obj.stock_quantity > 0:
            return {'status': 'low_stock', 'message': 'Low Stock'}
        else:
            return {'status': 'out_of_stock', 'message': 'Out of Stock'}

    def get_discount_percentage(self, obj):
        return obj.discount_percentage

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / len(reviews), 1)
        return 0

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    specifications = TechnicalSpecificationSerializer(many=True, required=False)
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'description', 'short_description',
            'sku', 'barcode', 'category', 'brand',
            'price', 'compare_price', 'cost_price',
            'condition', 'weight', 'dimensions', 'image_url',
            'track_stock', 'stock_quantity', 'low_stock_threshold',
            'is_active', 'is_featured', 'is_digital',
            'meta_title', 'meta_description',
            'specifications'
        ]

    def create(self, validated_data):
        specs_data = validated_data.pop('specifications', [])
        
        product = Product.objects.create(**validated_data)
        
        # Create specifications
        for spec_data in specs_data:
            TechnicalSpecification.objects.create(product=product, **spec_data)
        
        return product

    def update(self, instance, validated_data):
        specs_data = validated_data.pop('specifications', [])
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle specifications
        if specs_data is not None:
            instance.specifications.all().delete()
            for spec_data in specs_data:
                TechnicalSpecification.objects.create(product=instance, **spec_data)
        
        return instance
