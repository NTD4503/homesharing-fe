export const columns = [
  {
    title: "Thông tin",
    dataIndex: "title",
    key: "title",
    scopedSlots: { customRender: "title" },
    align: "center",
  },
  {
    title: "Mô tả",
    dataIndex: "value",
    key: "value",
    scopedSlots: { customRender: "value" },
    align: "center",
  },
];
