export const columns = [
  {
    title: "Tên Dịch Vụ",
    dataIndex: "service_name",
    key: "service_name",
  },
  {
    title: "Giá mỗi Ngày",
    dataIndex: "price_per_day",
    key: "price_per_day",
  },
  {
    title: "Giá mỗi Tuần",
    dataIndex: "price_per_week",
    key: "price_per_week",
  },
  {
    title: "Giá mỗi Tháng",
    dataIndex: "price_per_month",
    key: "price_per_month",
  },
  {
    title: "Ưu Điểm",
    dataIndex: "advantages",
    key: "advantages",
    scopedSlots: { customRender: "advantages" },
  },
  {
    title: "Thời hạn bài đăng",
    dataIndex: "period",
    key: "period",
    scopedSlots: { customRender: "period" },
  },
  {
    title: "Màu Tiêu Đề",
    dataIndex: "title_color",
    key: "title_color",
    scopedSlots: { customRender: "title_color" },
  },
  {
    title: "Tự Động Phê Duyệt",
    dataIndex: "auto_approval",
    key: "auto_approval",
    scopedSlots: { customRender: "auto_approval" },
  },
  {
    title: "Huy Hiệu Nổi Bật",
    dataIndex: "prominent_badge",
    key: "prominent_badge",
    scopedSlots: { customRender: "prominent_badge" },
  },
];

export const colorNames = {
  "#FF0000": "ĐỎ",
  "#00FF00": "XANH LÁ CÂY",
  "#0000FF": "XANH DƯƠNG",
  "#FFFF00": "VÀNG",
  "#FF00FF": "HỒNG",
  "#00FFFF": "XANH DƯƠNG NHẠT",
  "#000000": "ĐEN",
  "#FFFFFF": "TRẮNG",
};
