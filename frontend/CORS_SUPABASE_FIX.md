# 🔧 Supabase CORS Error & Backend Upload Flow

## ❌ Problem 1: Supabase CORS Error
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://eu-west-1.supabase.co/storage/v1/object/product-images/...
StorageUnknownError: NetworkError when attempting to fetch resource.
```

## ✅ Solution 1: Fix Supabase CORS

### Step 1: Go to Supabase Dashboard
1. Login to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Storage** → **Settings**

### Step 2: Configure CORS
In the **CORS** section, add:
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "headers": ["*"],
    "credentials": true
  }
]
`

### Step 3: Save Settings
Click **Save** to apply the CORS configuration.

---

## 📋 Backend Upload Product Flow Breakdown

### 🔄 Complete Upload Process

#### 1. Frontend Upload Flow
```typescript
// Step 1: Upload image to Supabase
const imageUrl = await uploadProductImage(file);

// Step 2: Send product data to backend
const product = await apiClient.createProduct({
  name: "Product Name",
  price: "29.99",
  category: 1,
  brand: 1,
  image_url: imageUrl, // URL from Supabase
  // ... other fields
});
```

#### 2. Backend API Endpoint
```python
# URL: POST /api/products/create/
class ProductCreateView(generics.CreateAPIView):
    """Create new product (admin only)"""
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [IsAdminUser]  # Only admin users
```

#### 3. Backend Validation & Processing
```python
class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    # Validates all incoming data
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'description', 'short_description',
            'sku', 'barcode', 'category', 'brand',
            'price', 'compare_price', 'cost_price',
            'condition', 'weight', 'dimensions',
            'track_stock', 'stock_quantity', 'low_stock_threshold',
            'is_active', 'is_featured', 'is_digital',
            'meta_title', 'meta_description',
            'images', 'specifications'
        ]

    def create(self, validated_data):
        # Extract related data
        images_data = validated_data.pop('images', [])
        specs_data = validated_data.pop('specifications', [])
        
        # Create main product
        product = Product.objects.create(**validated_data)
        
        # Create related images
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
        
        # Create specifications
        for spec_data in specs_data:
            TechnicalSpecification.objects.create(product=product, **spec_data)
        
        return product
```

#### 4. Database Storage
```python
# Product table
Product.objects.create(
    name="Product Name",
    price="29.99",
    category=Category.objects.get(id=1),
    brand=Brand.objects.get(id=1),
    # ... all other fields
)

# ProductImage table (if multiple images)
ProductImage.objects.create(
    product=product,
    image="https://eu-west-1.supabase.co/...",
    alt_text="Product image",
    is_primary=True
)

# TechnicalSpecification table
TechnicalSpecification.objects.create(
    product=product,
    label="Voltage",
    value="18V",
    spec_type="voltage"
)
```

---

## 🔍 Step-by-Step Upload Flow

### Frontend Side:
1. **User selects image** → File object
2. **Upload to Supabase** → Get public URL
3. **Fill product form** → Collect product data
4. **Send to backend** → API call with image URL
5. **Handle response** → Show success/error

### Backend Side:
1. **Receive request** → Validate authentication (admin only)
2. **Validate data** → Check required fields, relationships
3. **Create product** → Save to Product table
4. **Create related records** → Images, specifications
5. **Return response** → Created product data

### Database Side:
1. **Product record** → Main product information
2. **Image records** → Links to Supabase images
3. **Specification records** → Technical specs
4. **Stock records** → Warehouse quantities

---

## 🛠 Troubleshooting Guide

### Issue 1: CORS Error
**Solution**: Configure Supabase Storage CORS settings

### Issue 2: Authentication Error
**Check**: User is logged in as admin
**Code**: `permission_classes = [IsAdminUser]`

### Issue 3: Validation Error
**Check**: All required fields are present
**Fields**: name, price, category, brand are required

### Issue 4: Image Upload Error
**Check**: Supabase credentials in .env.local
**Verify**: Bucket exists and permissions are correct

---

## 📊 Required Fields for Product Creation

```typescript
{
  name: string,           // Required
  price: string,          // Required  
  category: number,       // Required (category ID)
  brand: number,          // Required (brand ID)
  image_url: string,      // Required (from Supabase)
  description?: string,   // Optional
  sku?: string,          // Optional
  condition: string,      // Required
  dimensions: string,     // Required
  track_stock: boolean,   // Required
  stock_quantity: number, // Required
  low_stock_threshold: number, // Required
  is_active: boolean,     // Required
  is_featured: boolean,   // Required
  is_digital: boolean,    // Required
}
```

---

## ✅ Quick Fix Steps

1. **Fix Supabase CORS** (5 minutes)
2. **Test image upload** → Should work
3. **Test product creation** → Should save to database
4. **Verify in admin** → Product should appear

**The CORS issue is the main blocker - once fixed, the upload flow should work perfectly!** 🚀
