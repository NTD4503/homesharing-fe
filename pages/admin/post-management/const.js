import moment from "moment";

export const columns = [
  {
    title: "STT",
    key: "index",
    scopedSlots: { customRender: "index" },
  },
  {
    title: "Người đăng",
    scopedSlots: { customRender: "userInfo" },
  },
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
    scopedSlots: { customRender: "post_title" },
    width: "180px",
  },
  {
    title: "Loại bài đăng",
    dataIndex: "post_type_name",
    key: "post_type_name",
    filters: [],
    filterMultiple: false,
    onFilter: (value, record) => record.post_type_name === value,
  },
  {
    title: "Loại phòng",
    dataIndex: "room_type_name",
    key: "room_type_name",
    filters: [],
    filterMultiple: false,
    onFilter: (value, record) => record.room_type_name === value,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    scopedSlots: { customRender: "created_at" },
    width: "120px",
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "expired_in",
    key: "expired_in",
    scopedSlots: { customRender: "expired_in" },
    width: "120px",
    sorter: (a, b) => moment(a.expired_in).unix() - moment(b.expired_in).unix(),
  },
  {
    title: "Trạng thái duyệt",
    dataIndex: "is_approved",
    scopedSlots: { customRender: "is_approved" },
    align: "center",
    key: "is_approved",
    filters: [
      { text: "Đã phê duyệt", value: true },
      { text: "Chưa phê duyệt", value: false },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.is_approved === value,
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
    title: "Xem bài đăng ",
    scopedSlots: { customRender: "viewPost" },
    width: "150px",
  },
  {
    title: "Hành động",
    key: "actions",
    scopedSlots: { customRender: "actions" },
    width: "250px",
  },
];

export const pagination = {
  pageSize: 5,
};
