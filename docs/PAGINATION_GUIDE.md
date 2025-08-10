# Pagination Components - Hướng dẫn sử dụng

## 📋 Tổng quan
Dự án cung cấp 3 variant pagination với mức độ phức tạp khác nhau để phù hợp với từng use case.

## 🔢 Các Variant Pagination

### 1. **GenericPagination** - Full Features
**📊 Sử dụng khi**: Cần đầy đủ tính năng, hiển thị nhiều thông tin

#### ✨ Features:
- ✅ Hiển thị đầy đủ thông tin: "Hiển thị 1 đến 10 trong số 100 kết quả"
- ✅ Items per page selector với label
- ✅ Page numbers với ellipsis logic
- ✅ Responsive: full trên desktop, simplified trên mobile
- ✅ Customizable text (Vietnamese/English)

#### 🎯 Use Cases:
- Admin dashboards
- Data management pages
- Complex tables với nhiều data

```tsx
<GenericPagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  // Custom text
  showText="Hiển thị"
  toText="đến"
  ofText="trong số"
  resultsText="kết quả"
/>
```

---

### 2. **SimplePagination** - Balanced ⭐ (Recommended)
**📊 Sử dụng khi**: Cần balance giữa tính năng và đơn giản

#### ✨ Features:
- ✅ Info ngắn gọn: "1-10 / 100"
- ✅ Items per page selector compact
- ✅ Page indicator với current/total
- ✅ Clean design với background styling
- ✅ Responsive friendly

#### 🎯 Use Cases:
- User-facing tables
- Product lists
- General data tables

```tsx
<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  showItemsPerPage={true}
/>
```

---

### 3. **MinimalPagination** - Ultra Simple
**📊 Sử dụng khi**: Cần tối giản tuyệt đối, ít không gian

#### ✨ Features:
- ✅ Chỉ có previous/next buttons
- ✅ Page indicator đơn giản: "1 / 5"
- ✅ Icon-only buttons
- ✅ Ultra compact design
- ✅ Perfect cho mobile

#### 🎯 Use Cases:
- Mobile-first designs
- Simple lists
- Space-constrained layouts
- Gallery/carousel navigation

```tsx
<MinimalPagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

## 🎨 Visual Comparison

### GenericPagination (Full)
```
[Hiển thị 1 đến 10 trong số 100 kết quả] [Hiển thị: [10▼] / trang]    [◀ Trước] [1] [2] [3] [...] [10] [Sau ▶]
```

### SimplePagination (Balanced) ⭐
```
[1-10 / 100] [Hiển thị: [10▼]]                                         [◀] [1 / 10] [▶]
```

### MinimalPagination (Ultra Simple)
```
                                    [◀] [1 / 10] [▶]
```

## 📱 Responsive Behavior

### Desktop (≥768px)
- **GenericPagination**: Full features, all page numbers
- **SimplePagination**: Horizontal layout, compact
- **MinimalPagination**: Unchanged

### Mobile (<768px)
- **GenericPagination**: Auto-simplifies, stacks vertically
- **SimplePagination**: Maintains layout, responsive text
- **MinimalPagination**: Perfect for mobile

## 🔧 Props Comparison

| Feature | Generic | Simple | Minimal |
|---------|---------|---------|---------|
| Page navigation | ✅ Full | ✅ Basic | ✅ Basic |
| Items per page | ✅ Full | ✅ Compact | ❌ |
| Total items info | ✅ Verbose | ✅ Compact | ❌ |
| Page numbers | ✅ All | ✅ Current only | ✅ Current only |
| Custom text | ✅ Full | ✅ Limited | ❌ |
| Bundle size | 📦 Large | 📦 Medium | 📦 Tiny |

## 🚀 Migration Guide

### Từ GenericPagination sang SimplePagination
```tsx
// Before
import { GenericPagination } from './generic';

<GenericPagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
/>

// After  
import { SimplePagination } from './generic';

<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
/>
```

### Sang MinimalPagination
```tsx
// Minimal - chỉ cần 3 props cơ bản
import { MinimalPagination } from './generic';

<MinimalPagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

## 💡 Best Practices

### Khi nào dùng variant nào?

#### 🖥️ **Admin/Dashboard** → GenericPagination
- Cần thông tin chi tiết
- Không gian đủ rộng
- Power users

#### 👥 **User-facing** → SimplePagination ⭐
- Balance tốt nhất
- Clean và professional
- Responsive tốt

#### 📱 **Mobile/Embedded** → MinimalPagination
- Không gian hạn chế
- Simple use cases
- Touch-friendly

### Styling Tips
```tsx
// Add custom spacing
<SimplePagination className="py-3" />

// Remove border
<MinimalPagination className="border-t-0" />

// Custom background
<SimplePagination className="bg-gray-50" />
```

## 🔄 Current Usage

### ✅ Đã Migration
- ✅ `UserTable` → SimplePagination
- ✅ `demo.tsx` → SimplePagination

### 📝 Recommendations
- **Users Management**: Giữ SimplePagination (perfect fit)
- **Mobile components**: Consider MinimalPagination
- **Admin heavy tables**: Có thể quay lại GenericPagination nếu cần

Tất cả 3 variants đều sẵn sàng sử dụng và đã được optimized cho responsive! 🎉
