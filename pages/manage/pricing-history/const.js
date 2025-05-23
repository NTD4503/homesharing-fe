export const columns = [
  {
    title: "STT",
    dataIndex: "",
    key: "no",
    customRender: (text, record, index) => index + 1,
  },
  {
    title: "Gói dịch vụ",
    dataIndex: "service_name",
    key: "service_name",
    scopedSlots: { customRender: "service_name" },
    align: "center",
  },
  {
    title: "Ngày đăng ký",
    dataIndex: "purchase_date",
    key: "purchase_date",
    scopedSlots: { customRender: "purchase_date" },
    align: "center",
    sorter: (a, b) => new Date(a.purchase_date) - new Date(b.purchase_date),
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "service_expiry_date",
    key: "service_expiry_date",
    scopedSlots: { customRender: "service_expiry_date" },
    align: "center",
    sorter: (a, b) =>
      new Date(a.service_expiry_date) - new Date(b.service_expiry_date),
  },
];

export const pagination = {
  pageSize: 5,
};
