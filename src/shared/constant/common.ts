// sắp xếp sản phẩm
export const ProductSortOption = [
    {
        id: 1,
        value: "name",
        text: "Theo bảng chữ cái, A-Z"
    },
    {
        id: 2,
        value: "-name",
        text: "Theo bảng chữ cái, Z-A"
    },
    {
        id: 3,
        value: "-price",
        text: "Giá từ cao đến thấp"
    },
    {
        id: 4,
        value: "price",
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
export const SIDEBAR_WIDTH = 280;
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