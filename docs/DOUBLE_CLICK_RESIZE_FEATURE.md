# Tính năng Double Click Auto-Resize cho Table Columns

## 📋 Tổng quan
Tính năng này cho phép người dùng double-click vào resize handle của column để tự động tính toán và điều chỉnh chiều rộng column phù hợp với nội dung.

## ✨ Các tính năng chính

### 1. Double Click Auto-Fit
- **Cách sử dụng**: Double-click vào resize handle (phần viền phải của header column)
- **Chức năng**: Tự động tính toán chiều rộng tối ưu dựa trên:
  - Độ dài của header text
  - Nội dung của tất cả cells trong column (tối đa 50 samples để tối ưu performance)
  - Các giá trị min/max width đã được cấu hình

### 2. Visual Feedback
- **Hover Effect**: Resize handle sẽ hiển thị màu xanh nhạt và rộng hơn khi hover
- **Auto-fit Animation**: Hiệu ứng xanh lá với animation pulse khi double-click
- **Visual Indicator**: Thanh dọc mờ hiển thị trong resize handle khi hover

### 3. Smart Width Calculation
- Tính toán dựa trên font size và family thực tế của table
- Xử lý các loại nội dung khác nhau:
  - Text thường
  - Numbers
  - Dates
  - Boolean values (Hoạt động/Không hoạt động)
  - Object properties (như role.name)
  - Rendered components (badges, buttons, etc.)

## 🔧 Cấu hình Column

### Column Properties
```typescript
interface Column<T> {
  key: keyof T | string;
  label: string;
  width: number;          // Chiều rộng mặc định
  minWidth: number;       // Chiều rộng tối thiểu
  maxWidth?: number;      // Chiều rộng tối đa (optional)
  resizable?: boolean;    // Có thể resize hay không (mặc định: true)
  autoWidth?: boolean;    // Tự động tính chiều rộng (mặc định: false)
  // ... other properties
}
```

### Ví dụ cấu hình
```typescript
const columns: Column<User>[] = [
  {
    key: 'fullName',
    label: 'Họ tên',
    width: 180,
    minWidth: 120,
    maxWidth: 250,
    autoWidth: true,        // Cho phép auto-calculation
    resizable: true,        // Cho phép resize (mặc định)
  },
  {
    key: 'role',
    label: 'Vai trò', 
    width: 120,
    minWidth: 100,
    resizable: false,       // Không cho phép resize
  }
];
```

## 🎯 Cách sử dụng

### 1. Manual Resize (kéo thả)
- Click và kéo resize handle để điều chỉnh chiều rộng thủ công
- Chiều rộng sẽ bị giới hạn bởi `minWidth` và `maxWidth`

### 2. Auto-Fit (double click)
- Double-click vào resize handle
- System sẽ tự động tính toán chiều rộng tối ưu
- Áp dụng ngay lập tức với animation feedback

### 3. Reset Manual Resize
- Khi double-click auto-fit, flag `manuallyResized` sẽ được reset
- Column sẽ quay về trạng thái auto-calculation

## 🔒 Restrictions

### Columns không thể resize
- Có `resizable: false` trong config
- Các columns này sẽ không hiển thị resize handle
- Không thể double-click để auto-fit

### Performance Considerations
- Auto-calculation chỉ sample tối đa 50 rows để tối ưu performance
- Sử dụng `requestAnimationFrame` để tránh lag UI
- Temporary DOM elements được cleanup tự động

## 🎨 CSS Classes

### Resize Handle States
```css
.column-resize-handle              /* Trạng thái bình thường */
.column-resize-handle:hover        /* Khi hover */
.column-resize-handle.resizing     /* Khi đang resize */
.column-resize-handle.auto-fitting /* Khi auto-fitting */
```

### Animation
```css
@keyframes auto-fit-pulse {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(1.1); background: rgb(34, 197, 94); }
  100% { transform: scaleY(1); }
}
```

## 🧪 Test Cases

### Routes để test
1. `/demo` - Demo table với test data
2. `/users-management` - User management table

### Test Scenarios
1. **Normal resize**: Click kéo resize handle
2. **Double-click auto-fit**: Double-click vào resize handle
3. **Min/Max constraints**: Kiểm tra giới hạn chiều rộng
4. **Non-resizable columns**: Thử resize columns có `resizable: false`
5. **Mixed content**: Test với various data types

## 🚀 Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- IE11: ❌ Not supported (modern features used)

## 📝 Notes
- Tính năng hoạt động tốt nhất với data đồng nhất
- Với rendered components phức tạp, có thể cần điều chỉnh thủ công
- Performance tối ưu cho tables lớn (>1000 rows)
