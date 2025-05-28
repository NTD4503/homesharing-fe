<template>
  <div class="container mx-auto mt-5">
    <h2 class="text-2xl font-semibold mb-4">Thống kê giao dịch & doanh thu</h2>

    <div class="flex justify-center mb-4 text-center">
      <div>
        <a-radio-group
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        >
          <a-radio-button value="lastWeek">Tuần trước</a-radio-button>
          <a-radio-button value="thisWeek">Tuần này</a-radio-button>
          <a-radio-button value="lastMonth">Tháng trước</a-radio-button>
        </a-radio-group>
        <br />
        <br />
        <div>
          <span class="font-bold">Chọn khoảng thời gian</span>
          <br />
          <a-range-picker
            v-model="dateRange"
            :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
            class="w-2/3"
          ></a-range-picker>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <a-button :loading="loading" @click="getRevenueInRange"
        >Thống kê giao dịch</a-button
      >
      <a-button type="default" @click="showPieChart">
      Thống kê lượt mua
    </a-button>
    </div>
    <br />

    <div v-if="totalRevenue !== null || transactionsInRange.length > 0" class="text-xl text-center">
      <div v-if="chartType === 'table'">
        Tổng số giao dịch:
        <span class="font-bold">{{ transactionsInRange.length }}</span>
      </div>
      <div v-if="chartType === 'column'" class="text-xl text-center">
        Tổng số doanh thu:
        <span class="font-bold">{{ formatCurrency(totalRevenue) }}</span>
      </div>
      <div v-if="chartType === 'pie'" class="text-xl text-center">
        Tổng số lượt mua:
        <span class="font-bold">{{ totalPurchaseCount }}</span>
      </div>
    </div>

    <div class="mt-8" v-if="totalRevenue !== null || transactionsInRange.length > 0">
      <label
        v-if="chartType === 'table'"
        class="text-sm font-medium text-gray-700 mr-2"
      >
        Người dùng:
      </label>
      <a-select
        v-if="chartType === 'table'"
        v-model="selectedUserId"
        class="w-1/6"
        @change="onChangeUser"
      >
        <a-select-option value="all">Tất cả</a-select-option>
        <a-select-option v-for="user in users" :key="user.id" :value="user.id">
          <div class="flex items-center">
            <img
              :src="user.avatar"
              alt="Avatar"
              class="w-6 h-6 rounded-full mr-2"
            />
            <span>{{ user.name }}</span>
          </div>
        </a-select-option>
      </a-select>

      <label
        v-if="chartType === 'table'"
        class="text-sm font-medium text-gray-700 ml-3"
        >Trạng thái:</label
      >
      <a-select
        v-model="selectedTransactionStatus"
        class="w-1/6 ml-2"
        @change="getRevenueInRange"
        v-if="chartType === 'table'"
      >
        <a-select-option value="all">Tất cả</a-select-option>
        <a-select-option value="successful">Thành công</a-select-option>
        <a-select-option value="failed">Thất bại</a-select-option>
      </a-select>
      <div class="float-right">
        <label class="block text-sm font-medium text-gray-700 mr-2"
          >Loại biểu đồ</label
        >
        <a-radio-group v-model="chartType">
          <a-radio-button value="table"
            ><i class="fa fa-table" aria-hidden="true"></i
          ></a-radio-button>
          <a-radio-button value="column"
            ><i class="fa fa-bar-chart" aria-hidden="true"></i
          ></a-radio-button>
          <a-radio-button value="pie" v-show="false"
            ><i class="fa fa-pie-chart" aria-hidden="true"></i
          ></a-radio-button>
        </a-radio-group>
      </div>
      <br />
      <br />
      <div>
        <apexchart
          v-if="chartType === 'column' && columnChartOptions"
          :options="columnChartOptions"
          :series="columnChartSeries"
          type="bar"
          height="400"
        ></apexchart>
        <div v-if="chartType === 'pie' && pieChartOptions" class="text-center">
          <p class="text-lg">
            Dịch vụ được mua nhiều nhất:
            <span class="font-bold">{{
              mostPurchasedService
                ? mostPurchasedService.serviceName +
                  " (" +
                  mostPurchasedService.purchaseCount +
                  " lượt mua)"
                : "0"
            }}</span>
          </p>
          <p class="text-lg">
            Dịch vụ được mua ít nhất:
            <span class="font-bold">{{
              leastPurchasedService
                ? leastPurchasedService.serviceName +
                  " (" +
                  leastPurchasedService.purchaseCount +
                  " lượt mua)"
                : "0"
            }}</span>
            <br /><br />
          </p>
          <div class="text-center">
            <apexchart
              :options="pieChartOptions"
              :series="pieChartSeries"
              class="ml-3"
              type="pie"
              height="400"
            ></apexchart>
          </div>
        </div>
        <a-table
          v-else-if="chartType === 'table'"
          :columns="columns"
          :data-source="filteredTransactions"
          :pagination="pagination"
          bordered
        >
          <template slot="status" slot-scope="text, record">
            <a-tag
              :style="{ color: record.status !== 'PAID' ? 'red' : 'green' }"
            >
              {{ record.status !== "PAID" ? "Thất bại" : "Thành công" }}
            </a-tag>
          </template>
          <template slot="index" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <template slot="transaction_date" slot-scope="text, record">
            {{ formatTransactionDate(text) }}
          </template>
          <template slot="amount" slot-scope="text, record">
            {{ formatCurrency(text) }}
          </template>
          <template slot="userInfo" slot-scope="text, record">
            <div class="text-center">
              <a-avatar
                :src="record.avatar"
                v-if="record.avatar"
                :size="50"
                class="cursor-pointer mb-2"
                :class="{ 'border-blue-500': record.avatar }"
                :style="{ 'border-width': record.avatar ? '2px' : '0' }"
              />
              <a-avatar
                icon="user"
                v-else
                :size="50"
                class="cursor-pointer mb-2"
              />
              <br />
              <span>{{ record.user_name }}</span>
            </div>
          </template>
        </a-table>
        <div v-if="chartType === 'pie'">
          <br /><br />
          <a-table
            :columns="pieChartColumns"
            :data-source="pieChartData"
            :pagination="false"
            bordered
          ></a-table>
        </div>
        <div v-if="chartType === 'column'">
          <br /><br />
          <a-table
            :columns="columnChartColumns"
            :data-source="columnChartData"
            :pagination="false"
            bordered
          ></a-table>
        </div>
      </div>
    </div>
    <div v-else-if="totalRevenue === null" class="flex justify-center">
      <!-- <div
        class="mt-5 w-1/2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
        role="alert"
      >
        <p class="text-center">
          Không có giao dịch nào trong khoảng thời gian từ
          {{ formatDate(dateRange[0]) }} đến {{ formatDate(dateRange[1]) }}.
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import VueApexCharts from "vue-apexcharts";
import { columns, pagination } from "./const";

export default {
  layout: "admin",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      dateRange: [null, null],
      chartType: "table",
      columnChartOptions: null,
      columnChartSeries: [],
      pieChartOptions: null,
      pieChartSeries: [],
      loading: false,
      columns,
      pagination,
      users: [],
      selectedUserId: "all",
      selectedTimeRange: "lastWeek",
      selectedTransactionStatus: "all",
      totalRevenue: null,
      totalPurchaseCount: null,
      mostPurchasedService: null,
      leastPurchasedService: null,
    };
  },
  async created() {
    this.dateRange = [
      moment().subtract(1, "weeks").startOf("week"),
      moment().subtract(1, "weeks").endOf("week"),
    ];
    await Promise.all([this.fetchAllServices(), this.getRevenueInRange()]);
  },
  computed: {
    ...mapState({
      transactionsInRange: (state) =>
        state.modules["transaction"].transactionsInRange,
      revenueInRange: (state) => state.modules["transaction"].revenueInRange,
      services: (state) => state.modules["service"].services,
      purchaseCountInRange: (state) =>
        state.modules["service"].purchaseCountInRange,
    }),
    filteredTransactions() {
      if (this.selectedTransactionStatus === "all") {
        return this.transactionsInRange;
      }
      const isSuccess = this.selectedTransactionStatus === "successful";
      return this.transactionsInRange.filter(
        (transaction) => (transaction.status === "PAID") === isSuccess
      );
    },
    pieChartData() {
      return this.purchaseCountInRange.map((purchase) => ({
        serviceName: "Gói dịch vụ " + purchase.serviceName,
        purchaseCount: purchase.purchaseCount,
      }));
    },
    pieChartColumns() {
      return [
        {
          title: "Tên gói dịch vụ",
          dataIndex: "serviceName",
          key: "serviceName",
        },
        {
          title: "Số lượt mua",
          dataIndex: "purchaseCount",
          key: "purchaseCount",
        },
      ];
    },
    columnChartData() {
      return this.revenueInRange.map((item) => ({
        transactionDate: this.formatDate(item.transaction_date),
        totalRevenue: item.totalrevenue,
      }));
    },
    columnChartColumns() {
      return [
        {
          title: "Ngày giao dịch",
          dataIndex: "transactionDate",
          key: "transactionDate",
        },
        {
          title: "Tổng doanh thu",
          dataIndex: "totalRevenue",
          key: "totalRevenue",
          render: (text) => this.formatCurrency(text),
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      fetchRevenueInRange: "modules/transaction/fetchRevenueInRange",
      fetchAllServices: "modules/service/fetchAllServices",
      fetchTransactionsInRange: "modules/transaction/fetchTransactionsInRange",
      fetchPurchaseCountInRange: "modules/service/fetchPurchaseCountInRange",
    }),
    async getRevenueInRange() {
      this.chartType = "table";
      this.selectedUserId = "all";
      this.loading = true;
      const fetchFunctions = [
        this.fetchRevenueInRange,
        this.fetchPurchaseCountInRange,
        this.fetchTransactionsInRange,
      ];

      const promises = fetchFunctions.map((fetchFunction) => {
        return fetchFunction({
          startDate: this.dateRange[0],
          endDate: this.dateRange[1],
        });
      });

      await Promise.all(promises);

      this.users = this.getUsers();
      this.prepareChartData();
      this.loading = false;
    },
    getUsers() {
      const uniqueUsers = {};
      this.transactionsInRange.forEach((item) => {
        uniqueUsers[item.user_id] = {
          id: item.user_id,
          name: item.user_name,
          avatar: item.avatar,
        };
      });
      return Object.values(uniqueUsers);
    },
    async onChangeUser() {
      await this.fetchTransactionsByUserId();
    },
    async fetchTransactionsByUserId() {
      let payload = {
        startDate: this.dateRange[0],
        endDate: this.dateRange[1],
        userId: this.selectedUserId,
      };
      await this.fetchTransactionsInRange(payload);
    },
    async handleTimeRangeChange(valueObject) {
      switch (valueObject.target.value) {
        case "lastWeek":
          this.dateRange = [
            moment().subtract(1, "weeks").startOf("week"),
            moment().subtract(1, "weeks").endOf("week"),
          ];
          break;
        case "thisWeek":
          this.dateRange = [moment().startOf("week"), moment().endOf("week")];
          break;
        case "lastMonth":
          this.dateRange = [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ];
          break;
        case "other":
          break;
        default:
          break;
      }
      await this.getRevenueInRange();
    },
    prepareChartData() {
      this.totalRevenue = this.revenueInRange.reduce(
        (sum, item) => sum + item.totalrevenue,
        0
      );
      this.totalPurchaseCount = this.purchaseCountInRange.reduce(
        (sum, purchase) => sum + parseInt(purchase.purchaseCount),
        0
      );

      // Find most and least purchased services
      if (this.purchaseCountInRange.length > 0) {
        this.mostPurchasedService = this.purchaseCountInRange.reduce(
          (max, purchase) =>
            parseInt(purchase.purchaseCount) > parseInt(max.purchaseCount)
              ? purchase
              : max
        );
        this.leastPurchasedService = this.purchaseCountInRange.reduce(
          (min, purchase) =>
            parseInt(purchase.purchaseCount) < parseInt(min.purchaseCount)
              ? purchase
              : min
        );
      } else {
        this.mostPurchasedService = null;
        this.leastPurchasedService = null;
      }

      this.columnChartOptions = {
        chart: {
          height: 500,
          type: "bar",
        },
        xaxis: {
          categories: this.revenueInRange.map((item) =>
            this.formatDate(item.transaction_date)
          ),
        },
        title: {
          text: "Biểu đồ doanh thu theo ngày",
          align: "center",
        },
        tooltip: {
          y: {
            formatter: function (value) {
              let self = this;
              return self.formatCurrency(value);
            }.bind(this),
          },
        },
      };

      this.columnChartSeries = [
        {
          name: "Doanh thu",
          data: this.revenueInRange.map((item) => item.totalrevenue),
        },
      ];

      this.pieChartOptions = {
        chart: {
          height: 350,
          type: "pie",
        },
        labels: this.purchaseCountInRange.map(
          (purchase) => "Gói dịch vụ " + purchase.serviceName
        ),
        // title: {
        //   text: "Biểu đồ thống kê số lượt mua theo gói dịch vụ",
        //   align: "center",
        // },
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              return value + " lượt mua";
            },
          },
        },
      };

      this.pieChartSeries = this.purchaseCountInRange.map((purchase) =>
        parseInt(purchase.purchaseCount)
      );
    },

    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    formatTransactionDate(date) {
      return moment(date).format("HH:mm DD-MM-YYYY");
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    },
    showPieChart() {
  this.chartType = 'pie';
},
  },
};

</script>

<style scoped>
/* Add Tailwind CSS styles here */
</style>
