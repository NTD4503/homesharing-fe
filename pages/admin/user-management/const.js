import moment from "moment";

export const columns = [
  {
    title: "STT",
    scopedSlots: { customRender: "index" },
    key: "index",
  },
  {
    title: "Người dùng",
    scopedSlots: { customRender: "userInfo" },
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
    title: "Loại tài khoản",
    dataIndex: "role_name",
    key: "role_name",
    scopedSlots: { customRender: "role_name" },
    filters: [],
    filterMultiple: false,
    onFilter: (value, record) => record.role_name === value,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    scopedSlots: { customRender: "created_at" },
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    title: "Gói dịch vụ",
    dataIndex: "service_name",
    key: "service_name",
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "service_expiry_date",
    key: "service_expiry_date",
    scopedSlots: { customRender: "service_expiry_date" },
    sorter: (a, b) =>
      moment(a.service_expiry_date).unix() -
      moment(b.service_expiry_date).unix(),
  },
  {
    title: "Trạng thái hoạt động",
    dataIndex: "is_blocked",
    key: "is_blocked",
    scopedSlots: { customRender: "is_blocked" },
    filters: [
      { text: "Hoạt động", value: false },
      { text: "Bị chặn", value: true },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.is_blocked === value,
  },
  {
    title: "Hành động",
    key: "actions",
    scopedSlots: { customRender: "actions" },
  },
];

export const pagination = {
  pageSize: 6,
};
