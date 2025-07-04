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
];

export const pagination = {
  pageSize: 5,
};
