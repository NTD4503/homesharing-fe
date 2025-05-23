export const landlordColumns = [
  {
    dataIndex: "icon",
    key: "icon",
    scopedSlots: { customRender: "icon" },
    width: "10%",
  },
  {
    title: "Thông tin liên hệ",
    dataIndex: "text",
    key: "text",
    scopedSlots: { customRender: "info" },
    align: "center",
  },
];

export const landlordTableFields = ["Liên hệ:", "Điện thoại:", "Zalo:"];
