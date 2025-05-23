<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Lịch sử nạp tiền</h1>
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
      :data-source="filteredTransactions"
      :row-key="customRowKey"
      :customRow="customRow"
      :pagination="pagination"
      bordered
      class="w-full"
    >
      <template slot="transaction_date" slot-scope="text">
        {{ formatDate(text) }}
      </template>
      <template slot="amount" slot-scope="text">
        {{ formatCurrency(text) }}
      </template>
      <template slot="status" slot-scope="text">
        <a-tag :class="text === 'PAID' ? 'text-green-600' : 'text-red-600'">
          {{ text === "PAID" ? "Thành công" : "Thất bại" }}
        </a-tag>
      </template>
    </a-table>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import { columns, pagination } from "./const";
import { errorCodeMessages } from "../deposit/return-url/const";

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
      transactions: (state) => state.modules["transaction"].transactions,
    }),
    filteredTransactions() {
      let cloneTransactions = _.cloneDeep(this.transactions);

      if (!this.dateRange) {
        return cloneTransactions;
      }

      const [startDate, endDate] = this.dateRange;
      return cloneTransactions.filter((transaction) => {
        const transactionDate = moment(transaction.transaction_date).startOf("day");
        return (
          transactionDate.isSameOrAfter(moment(startDate).startOf("day")) &&
          transactionDate.isSameOrBefore(endDate)
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
        await this.fetchTransactionsByUser(this.userId);
      }
    }
  },
  methods: {
    ...mapActions({
      fetchTransactionsByUser: "modules/transaction/fetchTransactionsByUser",
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
    formatCurrency(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    resetFilter() {
      this.dateRange = null;
    },
  },
};
</script>

<style scoped></style>
