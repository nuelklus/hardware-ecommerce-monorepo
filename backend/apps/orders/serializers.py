from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusUpdate


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(read_only=True)
    product_sku = serializers.CharField(read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku', 
            'price', 'quantity', 'subtotal'
        ]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = OrderStatusUpdate
        fields = ['status', 'notes', 'created_at', 'created_by']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_updates = OrderStatusUpdateSerializer(many=True, read_only=True)
    grand_total = serializers.ReadOnlyField()
    order_number = serializers.CharField(read_only=True)
    
    # Read-only fields
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'first_name', 'last_name', 
            'email', 'phone', 'shipping_address', 'city', 'region', 
            'postal_code', 'order_notes', 'total_amount', 'shipping_cost', 
            'tax_amount', 'grand_total', 'payment_method', 'payment_status', 
            'status', 'created_at', 'updated_at', 'tracking_number', 
            'estimated_delivery', 'items', 'status_updates'
        ]
        read_only_fields = [
            'id', 'order_number', 'user', 'grand_total', 'created_at', 
            'updated_at', 'tracking_number', 'estimated_delivery'
        ]


class CreateOrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )

    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 'phone', 
            'shipping_address', 'city', 'region', 'postal_code', 
            'order_notes', 'total_amount', 'payment_method', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Create order
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item_data['product_id'],
                product_name=item_data['product_name'],
                product_sku=item_data['product_sku'],
                price=item_data['price'],
                quantity=item_data['quantity']
            )
        
        # Create initial status update
        OrderStatusUpdate.objects.create(
            order=order,
            status='pending',
            notes='Order placed successfully'
        )
        
        return order
