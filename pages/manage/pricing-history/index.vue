<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Lịch sử đăng ký gói dịch</h1>
    <br />
    <span class="text-xl font-semibold mb-2 mr-2">Bộ lọc</span>

    <a-space class="mb-4">
      <a-range-picker
        v-model="dateRange"
        :placeholder="['Từ ngày', 'Đến ngày']"
        format="DD-MM-YYYY"
        class="mr-2"
      />
    </a-space>

    <a-button @click="resetFilter">
      <i class="fa fa-refresh mr-2" aria-hidden="true"></i> Đặt lại</a-button
    >
    <br />
    <br />
    <a-table
      :columns="columns"
      :data-source="filteredHistories"
      :row-key="customRowKey"
      :customRow="customRow"
      :pagination="pagination"
      bordered
      class="w-full"
    >
      <template slot="purchase_date" slot-scope="text">
        {{ formatDate(text) }}
      </template>
      <template slot="service_expiry_date" slot-scope="text">
        {{ formatDate(text) }}
      </template>
    </a-table>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import { columns, pagination } from "./const";

export default {
  layout: "manage",
  data() {
    return {
      columns,
      pagination,
      userId: null,
      dateRange: null,
    };
  },
  computed: {
    ...mapState({
      purchaseHistoriesByUser: (state) =>
        state.modules["service"].purchaseHistoriesByUser,
    }),
    filteredHistories() {
      let cloneHistories = _.cloneDeep(this.purchaseHistoriesByUser);

      if (!this.dateRange) {
        return cloneHistories;
      }

      const [startDate, endDate] = this.dateRange;
      return cloneHistories.filter((transaction) => {
        const purchaseDate = moment(transaction.purchase_date).startOf("day");
        return (
          purchaseDate.isSameOrAfter(moment(startDate).startOf("day")) &&
          purchaseDate.isSameOrBefore(endDate)
        );
      });
    },
  },
  async created() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.userId = decoded.user.user_id;
        await this.fetchPurchaseHistoryByUser(this.userId);
      }
    }
  },
  methods: {
    ...mapActions({
      fetchPurchaseHistoryByUser: "modules/service/fetchPurchaseHistoryByUser",
    }),
    formatDate(date) {
      return moment(date).format("HH:mm DD/MM/YYYY");
    },
    customRow(record, index) {
      return { props: { rowKey: index } };
    },
    customRowKey(record) {
      return record.transaction_id;
    },
    resetFilter() {
      this.dateRange = null;
    },
  },
};
</script>

<style scoped></style>
