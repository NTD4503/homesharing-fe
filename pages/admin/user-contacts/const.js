export const columns = [
  {
    title: "STT",
    scopedSlots: { customRender: "index" },
    key: "index",
  },
  {
    title: "Người dùng",
    dataIndex: "full_name",
    key: "full_name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Nội dung",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Ngày gửi",
    dataIndex: "created_at",
    key: "created_at",
    scopedSlots: { customRender: "created_at" },
  },
];

export const pagination = {
  pageSize: 6,
};
