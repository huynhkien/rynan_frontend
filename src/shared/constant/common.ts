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
