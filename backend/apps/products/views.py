from rest_framework import generics, status, filters, pagination
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.db.models import Q, Avg, Count
from django.core.files.storage import default_storage
from django.conf import settings
import os
import uuid
from .models import Product, Category, Brand, Warehouse, ProductReview
from .serializers import (
    ProductListSerializer, ProductDetailSerializer, ProductCreateUpdateSerializer,
    CategorySerializer, BrandSerializer, WarehouseSerializer, ProductReviewSerializer
)

class ProductPagination(pagination.PageNumberPagination):
    """Custom pagination for products"""
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductListView(generics.ListAPIView):
    """List all products with filtering and search"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'condition', 'is_featured']
    search_fields = ['name', 'description', 'short_description', 'sku', 'brand__name']
    ordering_fields = ['price', 'created_at', 'name', 'stock_quantity']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Stock filtering
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(
                Q(track_stock=False) | Q(stock_quantity__gt=0)
            )
        
        # Price range filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Category filtering by slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Brand filtering by slug
        brand_slug = self.request.query_params.get('brand_slug')
        if brand_slug:
            queryset = queryset.filter(brand__slug=brand_slug)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    """Get product details"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

class ProductCreateView(generics.CreateAPIView):
    """Create new product (admin only)"""
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [IsAdminUser]

class ProductUpdateView(generics.UpdateAPIView):
    """Update product (admin only)"""
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'

class ProductDeleteView(generics.DestroyAPIView):
    """Delete product (admin only)"""
    queryset = Product.objects.all()
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'

@api_view(['GET'])
def product_search_suggestions(request):
    """Get search suggestions for autocomplete"""
    query = request.GET.get('q', '').strip()
    if not query or len(query) < 2:
        return Response({'suggestions': []})
    
    # Search products
    products = Product.objects.filter(
        is_active=True,
        name__icontains=query
    ).values('id', 'name', 'slug', 'sku')[:10]
    
    # Search categories
    categories = Category.objects.filter(
        is_active=True,
        name__icontains=query
    ).values('id', 'name', 'slug')[:5]
    
    # Search brands
    brands = Brand.objects.filter(
        is_active=True,
        name__icontains=query
    ).values('id', 'name', 'slug')[:5]
    
    return Response({
        'products': list(products),
        'categories': list(categories),
        'brands': list(brands)
    })

@api_view(['GET'])
def featured_products(request):
    """Get featured products"""
    products = Product.objects.filter(is_active=True, is_featured=True)[:12]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product_categories(request):
    """Get all categories with product counts"""
    categories = Category.objects.filter(is_active=True).annotate(
        product_count=Count('products', filter=Q(products__is_active=True))
    ).order_by('name')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product_brands(request):
    """Get all brands with product counts"""
    brands = Brand.objects.filter(is_active=True).annotate(
        product_count=Count('products', filter=Q(products__is_active=True))
    ).order_by('name')
    serializer = BrandSerializer(brands, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def warehouses(request):
    """Get all warehouses"""
    warehouses = Warehouse.objects.filter(is_active=True)
    serializer = WarehouseSerializer(warehouses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def category_products(request, slug):
    """Get products by category"""
    try:
        category = Category.objects.get(slug=slug, is_active=True)
        products = Product.objects.filter(is_active=True, category=category)
        
        # Apply same filtering as ProductListView
        filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
        for backend in filter_backends:
            products = backend().filter_queryset(request, products, self)
        
        serializer = ProductListSerializer(products, many=True)
        return Response({
            'category': CategorySerializer(category).data,
            'products': serializer.data
        })
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=404)

@api_view(['GET'])
def brand_products(request, slug):
    """Get products by brand"""
    try:
        brand = Brand.objects.get(slug=slug, is_active=True)
        products = Product.objects.filter(is_active=True, brand=brand)
        
        # Apply same filtering as ProductListView
        filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
        for backend in filter_backends:
            products = backend().filter_queryset(request, products, self)
        
        serializer = ProductListSerializer(products, many=True)
        return Response({
            'brand': BrandSerializer(brand).data,
            'products': serializer.data
        })
    except Brand.DoesNotExist:
        return Response({'error': 'Brand not found'}, status=404)

class ProductReviewListCreateView(generics.ListCreateAPIView):
    """List and create product reviews"""
    serializer_class = ProductReviewSerializer
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(
            product_id=product_id, 
            is_approved=True
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        serializer.save(
            user=self.request.user,
            product_id=product_id
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product_review(request, product_id):
    """Add a review for a product"""
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        
        # Check if user already reviewed
        if ProductReview.objects.filter(product=product, user=request.user).exists():
            return Response(
                {'error': 'You have already reviewed this product'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ProductReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def product_stats(request):
    """Get product statistics (admin only)"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=403)
    
    stats = {
        'total_products': Product.objects.count(),
        'active_products': Product.objects.filter(is_active=True).count(),
        'featured_products': Product.objects.filter(is_featured=True).count(),
        'out_of_stock': Product.objects.filter(
            track_stock=True, stock_quantity=0
        ).count(),
        'low_stock': Product.objects.filter(
            track_stock=True, 
            stock_quantity__lte=models.F('low_stock_threshold'),
            stock_quantity__gt=0
        ).count(),
    }
    return Response(stats)


@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def upload_product_image(request):
    """
    Upload a product image and return the URL
    """
    try:
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {'error': 'No image file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response(
                {'error': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        if image_file.size > max_size:
            return Response(
                {'error': 'File too large. Maximum size is 5MB.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate unique filename
        file_extension = os.path.splitext(image_file.name)[1]
        unique_filename = f"products/{uuid.uuid4()}{file_extension}"
        
        # Save file
        file_path = default_storage.save(unique_filename, image_file)
        image_url = default_storage.url(file_path)
        
        return Response({
            'success': True,
            'image_url': image_url,
            'message': 'Image uploaded successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Upload failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
