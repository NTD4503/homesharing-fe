export const columns = [
  {
    title: "STT",
    key: "index",
    scopedSlots: { customRender: "index" },
  },
  {
    title: "Người dùng",
    key: "userInfo",
    scopedSlots: { customRender: "userInfo" },
  },
  {
    title: "Ngày giao dịch",
    dataIndex: "transaction_date",
    key: "transaction_date",
    scopedSlots: { customRender: "transaction_date" },
    align: "center",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    scopedSlots: { customRender: "amount" },
    align: "center",
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
    align: "center",
  },

  {
    title: "Thông tin giao dịch",
    dataIndex: "transaction_info",
    key: "transaction_info",
  },
];

export const pagination = {
  pageSize: 5,
};
