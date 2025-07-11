// sắp xếp sản phẩm
export const ProductSortOption = [
    {
        id: 1,
        value: "name_vn",
        text: "Theo bảng chữ cái, A-Z"
    },
    {
        id: 2,
        value: "-name_vn",
        text: "Theo bảng chữ cái, Z-A"
    },
    {
        id: 3,
        value: "-price_reference",
        text: "Giá từ cao đến thấp"
    },
    {
        id: 4,
        value: "price_reference",
        text: "Giá từ thấp đến cao"
    },
    {
        id: 5,
        value: "-createdAt",
        text: "Ngày, mới đến cũ"
    },
    {
        id: 6,
        value: "-sold",
        text: "Theo lượt mua"
    },
]
// Đánh giá
export const VoteStar = [
    {
        id: 1,
        text: 'Tệ'
    },
    {
        id: 2,
        text: 'Trung bình'
    },
    {
        id: 3,
        text: 'Khá'
    },
    {
        id: 4,
        text: 'Tốt'
    },
    {
        id: 5,
        text: 'Xuất sắc'
    },
]
// kích thước sidebar
export const SIDEBAR_WIDTH = '15%';
// thu nhỏ kích thước sidebar
export const COLLAPSED_WIDTH = 72;

// kích thước header
export const HEADER_HEIGHT = 64;

// Thông tin nhà sản xuất
export const Origin = [{
    _id: 'Rynan Smart Agriculture',
    name: 'Rynan Smart Agriculture',
}]
export const isActive = [{
    _id: 'Đang bán',
    name: 'Đang bán',
},{
    _id: 'Ngừng bán',
    name: 'Ngừng bán'
}]
export const isActiveSupplier = [{
    _id: 'Hoạt động',
    name: 'Hoạt động',
},{
    _id: 'Ngừng Hoạt động',
    name: 'Ngừng Hoạt động'
}]
// Các loại giá của một sản phẩm
export const PriceType = [
    {
        _id: 'dealerPrice',
        name: 'Giá đại lý'
    },
    {
        _id: 'storePrice',
        name: 'Giá cửa hàng'
    },
    {
        _id: 'retailPrice',
        name: 'Giá bán lẻ'
    },
    {
        _id: 'promotionPrice',
        name: 'Giá khuyến mãi'
    },
    {
        _id: 'internalPrice',
        name: 'Giá nội bộ'
    },
    {
        _id: 'listedPrice',
        name: 'Giá niêm yết'
    },
    {
        _id: 'offeringPrice',
        name: 'Giá chào bán'
    },
    {
        _id: 'referencePrice',
        name: 'Giá lẽ tham khảo'
    },
]
// Loại khách hàng
export const CustomerType = [
    {
        _id: "Khách hàng lẽ",
        name: "Khách hàng lẽ"
    },
    {
        _id: "Cửa hàng",
        name: "Cửa hàng"
    },
    {
        _id: "HTX",
        name: "HTX"
    },
    {
        _id: "Nhà vườn",
        name: "Nhà vườn"
    },
    {
        _id: "Nhà phân phối",
        name: "Nhà phân phối"
    },
    {
        _id: "Khách hàng dự án ",
        name: "Khách hàng dự án"
    },
    {
        _id: "Khách hàng dự Vip",
        name: "Khách hàng dự Vip"
    },
]
// Nguồn khách hàng
export const CustomerSource = [
    {
        _id: "Điện Thoại",
        name: "Điện Thoại"
    },
    {
        _id: "Email",
        name: "Email"
    },
    {
        _id: "Trực Tiếp",
        name: "Trực Tiếp"
    },
    {
        _id: "Website",
        name: "Website"
    },
    {
        _id: "Mobile App",
        name: "Mobile App"
    },
    {
        _id: "Đối tác giới thiệu ",
        name: "Đối tác giới thiệu"
    },
    {
        _id: "Internet",
        name: "Internet"
    },
    {
        _id: "Khác",
        name: "Khác"
    },
    {
        _id: "Công tác",
        name: "Công tác"
    },
    {
        _id: "Facebook",
        name: "Facebook"
    },
    {
        _id: "Zalo",
        name: "Zalo"
    },
    {
        _id: "Hội nghị/Hội thảo",
        name: "Hội nghị/Hội thảo"
    },
    {
        _id: "Khách tham quan",
        name: "Khách tham quan"
    },
    {
        _id: "Khách từ Chú Mỹ ",
        name: "Khách từ Chú Mỹ"
    },
     
]
export const CustomerGender = [
    {
    _id: 'male',
    name: 'Nam'
    },
    {
    _id: 'female',
    name: 'Nữ'
    },
    {
    _id: 'order',
    name: 'Khác'
    },
]
// Cung cấp dinh duỡng
export const Nutrition = [
    {
        _id: '1 tháng',
        name: '1 tháng'
    },
    {
        _id: '2 tháng',
        name: '2 tháng'
    },
    {
        _id: '3 tháng',
        name: '3 tháng'
    },
    {
        _id: '4 tháng',
        name: '4 tháng'
    },
    {
        _id: '5 tháng',
        name: '5 tháng'
    },
    {
        _id: '6 tháng',
        name: '6 tháng'
    },
    {
        _id: '7 tháng',
        name: '7 tháng'
    },
    {
        _id: '8 tháng',
        name: '8 tháng'
    },
    {
        _id: '9 tháng',
        name: '9 tháng'
    },
    {
        _id: '10 tháng',
        name: '10 tháng'
    },
    {
        _id: '11 tháng',
        name: '11 tháng'
    },
    {
        _id: '12 tháng',
        name: '12 tháng'
    },
    {
        _id: '13 tháng',
        name: '13 tháng'
    },
    {
        _id: '14 tháng',
        name: '14 tháng'
    },
    {
        _id: '15 tháng',
        name: '15 tháng'
    },
    {
        _id: '16 tháng',
        name: '16 tháng'
    },
    {
        _id: '17 tháng',
        name: '17 tháng'
    },
    {
        _id: '18 tháng',
        name: '18 tháng'
    },
    {
        _id: '19 tháng',
        name: '19 tháng'
    },
    {
        _id: '20 tháng',
        name: '20 tháng'
    },
    {
        _id: '21 tháng',
        name: '21 tháng'
    },
    {
        _id: '22 tháng',
        name: '22 tháng'
    },
    {
        _id: '23 tháng',
        name: '23 tháng'
    },
    {
        _id: '24 tháng',
        name: '24 tháng'
    },
]
// Phân biệt quy cách đóng gói
export const SpecificationType = [
    {
        _id: 'Quy cách đóng gói',
        name: 'Quy cách đóng gói'
    },
    {
        _id: 'Chi tiết đóng gói',
        name: 'Chi tiết đóng gói'
    },
]
// Trạng thái đơn hàng
export const OrderStatus = [
    {
        _id: 'Cancelled',
        name: 'Hủy đơn hàng' 
    }, 
    {
        _id: 'Processing', 
        name: 'Đang xử lý' 
    }, 
    {
        _id: 'Delivering', 
        name: 'Đang giao hàng' 
    },
    {
        _id: 'Received', 
        name: 'Đã nhận hàng' 
    },  
    {
        _id: 'Succeed', 
        name: 'Nhận hàng thành công' 
    },  
]
// Phương thức thanh toán
export const PaymentMethods = [
  { _id: 'COD', name: 'Tiền mặt' },
  { _id: 'BANK_TRANSFER', name: 'Chuyển khoản' },
  { _id: 'SCOD', name: 'SCOD' },
  { _id: 'ATM', name: 'Thẻ ATM nội địa' },
  { _id: 'CREDIT_CARD', name: 'Thẻ tín dụng / Ghi nợ' }
] 
// Trạng thái thanh toán
export const PaymentStatuses = [
  { _id: 'PAID', name: 'Đã thanh toán' },
  { _id: 'UNPAID', name: 'Chưa thanh toán' },
  { _id: 'PARTIALLY_PAID', name: 'Thanh toán một phần' }
] 
// Thông tin ngân hàng
export const BANK_LIST = [
  { _id: "vietcombank", name: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)" },
  { _id: "vietinbank", name: "Ngân hàng TMCP Công thương Việt Nam (VietinBank)" },
  { _id: "bidv", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)" },
  { _id: "agribank", name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)" },
  { _id: "techcombank", name: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" },
  { _id: "vpbank", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)" },
  { _id: "acb", name: "Ngân hàng TMCP Á Châu (ACB)" },
  { _id: "mbbank", name: "Ngân hàng TMCP Quân đội (MB Bank)" },
  { _id: "sacombank", name: "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)" },
  { _id: "shb", name: "Ngân hàng TMCP Sài Gòn – Hà Nội (SHB)" },
  { _id: "tpbank", name: "Ngân hàng TMCP Tiên Phong (TPBank)" },
  { _id: "hdbank", name: "Ngân hàng TMCP Phát triển TP.HCM (HDBank)" },
  { _id: "vib", name: "Ngân hàng TMCP Quốc tế Việt Nam (VIB)" },
  { _id: "ocb", name: "Ngân hàng TMCP Phương Đông (OCB)" },
  { _id: "eximbank", name: "Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam (Eximbank)" },
  { _id: "seabank", name: "Ngân hàng TMCP Đông Nam Á (SeABank)" },
  { _id: "baovietbank", name: "Ngân hàng TMCP Bảo Việt (BaoVietBank)" },
  { _id: "pgbank", name: "Ngân hàng TMCP Xăng dầu Petrolimex (PGBank)" },
  { _id: "namabank", name: "Ngân hàng TMCP Nam Á (Nam A Bank)" },
  { _id: "lpbank", name: "Ngân hàng TMCP Bưu điện Liên Việt (LPBank)" }
];
// Xử lý duyệt
export const ReceiptStatus = [
  { _id: 'pending', name: 'Chờ xử lý' },
  { _id: 'confirmed', name: 'Đã duyệt' },
  { _id: 'cancelled', name: 'Đã hủy' }
];
// Hình thức vận chuyển
export const deliveryMethods = [
  { _id: 'pickup', name: 'Tự đến lấy hàng' },
  { _id: 'ship', name: 'Giao hàng bởi công ty' },
  { _id: 'third_party', name: 'Giao hàng bởi bên thứ ba' },
  { _id: 'cod', name: 'Giao hàng và thu tiền (COD)' },
  { _id: 'express', name: 'Giao hàng hỏa tốc' },
  { _id: 'logistics', name: 'Vận chuyển qua đối tác logistics' },
];
export const shelfLocation = [
  { _id: 'A', name: 'A' },
  { _id: 'B', name: 'B' },
  { _id: 'C', name: 'C' },
  { _id: 'D', name: 'D' },
  { _id: 'E', name: 'E' },
  { _id: 'F', name: 'F' },
  { _id: 'G', name: 'G' },
  { _id: 'H', name: 'H' },
  { _id: 'I', name: 'I' },
  { _id: 'J', name: 'J' },
  { _id: 'K', name: 'K' },
  { _id: 'L', name: 'L' },
  { _id: 'M', name: 'M' },
  { _id: 'N', name: 'N' },
  { _id: 'O', name: 'O' },
  { _id: 'P', name: 'P' },
  { _id: 'Q', name: 'Q' },
  { _id: 'R', name: 'R' },
  { _id: 'S', name: 'S' },
  { _id: 'T', name: 'T' },
  { _id: 'U', name: 'U' },
  { _id: 'V', name: 'V' },
  { _id: 'W', name: 'W' },
  { _id: 'X', name: 'X' },
  { _id: 'Y', name: 'Y' },
  { _id: 'Z', name: 'Z' }
];

// Số trang sản phẩm
export const PRODUCTS_PER_PAGE = 12;
