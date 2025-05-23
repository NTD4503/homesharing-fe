export const columns = [
  {
    title: "STT",
    dataIndex: "",
    key: "no",
    customRender: (text, record, index) => index + 1,
  },
  {
    title: "Mã giao dịch",
    dataIndex: "transaction_code",
    key: "transaction_code",
    scopedSlots: { customRender: "transaction_code" },
  },
  {
    title: "Ngày nạp",
    dataIndex: "transaction_date",
    key: "transaction_date",
    scopedSlots: { customRender: "transaction_date" },
    sorter: (a, b) =>
      new Date(a.transaction_date) - new Date(b.transaction_date),
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    scopedSlots: { customRender: "amount" },
  },
  {
    title: "Ghi chú",
    dataIndex: "transaction_info",
    scopedSlots: { customRender: "transaction_info" },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    filters: [
      { text: "Đã thanh toán", value: "PAID" },
      { text: "Đã hủy", value: "CANCELLED" },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.status === value,
  },
];

export const pagination = {
  pageSize: 5,
};
