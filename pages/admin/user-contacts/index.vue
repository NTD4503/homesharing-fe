<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Liên hệ từ người dùng</h1>

    <!-- Thêm range picker để lọc theo khoảng thời gian -->
    <a-range-picker
      v-model="dateRange"
      format="YYYY-MM-DD"
      placeholder="Chọn khoảng thời gian"
      style="margin-bottom: 16px"
      @change="handleDateRangeChange"
    ></a-range-picker>

    <a-table
      :columns="columns"
      :data-source="filteredContacts"
      bordered
      :pagination="pagination"
      class="w-full"
    >
      <template slot="index" slot-scope="text, record, index">{{
        index + 1
      }}</template>
      <template slot="created_at" slot-scope="text">{{
        formatDate(text)
      }}</template>
    </a-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { columns, pagination } from "./const";
import moment from "moment";

export default {
  layout: "admin",
  data() {
    return {
      columns,
      pagination,
      dateRange: [], // Biến để lưu khoảng thời gian lọc
    };
  },
  computed: {
    ...mapState({
      contacts: (state) => state.modules["contact"].contacts,
    }),
    // Tạo computed property để lọc dữ liệu theo khoảng thời gian
    filteredContacts() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        return this.contacts; // Nếu chưa chọn khoảng thời gian lọc, hiển thị tất cả dữ liệu
      } else {
        const startDate = moment(this.dateRange[0]).startOf("day");
        const endDate = moment(this.dateRange[1]).endOf("day");
        return this.contacts.filter((contact) => {
          const contactDate = moment(contact.created_at);
          return contactDate.isBetween(startDate, endDate, null, "[]"); // Lọc dữ liệu trong khoảng thời gian
        });
      }
    },
  },
  async created() {
    await this.fetchAllContacts();
  },
  methods: {
    ...mapActions({
      fetchAllContacts: "modules/contact/fetchAllContacts",
    }),
    formatDate(date) {
      if (date) {
        return moment(date).format("HH:mm DD-MM-YYYY");
      }
    },
    handleDateRangeChange() {
      // Xử lý sự kiện thay đổi khoảng thời gian lọc
      // Không cần làm gì nếu dữ liệu được tự động lọc qua computed property filteredContacts
    },
  },
};
</script>

<style scoped>
/* Thêm CSS scoped nếu cần */
</style>
