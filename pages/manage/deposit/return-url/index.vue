<template>
  <div class="text-center">
    <h1 class="text-2xl font-semibold mb-4">Thông tin giao dịch</h1>
    <div style="margin-left: 800px">
      <a-button @click="$router.push('/manage/deposit')"
        ><i class="fa mr-2 fa-sign-in" aria-hidden="true"></i>
        <span>Trang nạp tiền</span>
      </a-button>
    </div>
    <div :class="getMessageClass()">
      <i v-if="isSuccessCode" class="fa fa-check-circle" aria-hidden="true"></i>
      <i v-else class="fa fa-times-circle" aria-hidden="true"></i>
      {{ getMessage() }}
    </div>
    <br />
    <div class="flex justify-center">
      <a-table
        class="w-2/3"
        :columns="columns"
        :dataSource="data"
        bordered
        :pagination="false"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { columns } from "./const";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

export default {
  layout: "manage",
  data() {
    return {
      columns,
      data: [],
      userId: null,
      successMessage: "Nạp tiền thành công",
      failureMessage: "Nạp tiền thất bại",
    };
  },
  computed: {
    isSuccessCode() {
      return this.$route.query.status === "PAID";
    },
  },
  methods: {
    ...mapActions({
      storePaymentReturn: "modules/payment/storePaymentReturn",
      refreshAccessToken: "modules/auth/refreshAccessToken",
    }),
    formatDate() {
      return moment().format("HH:mm DD-MM-YYYY");
    },
    getMessage() {
      return this.$route.query.status === "PAID"
        ? this.successMessage
        : this.failureMessage;
    },
    getMessageClass() {
      return this.isSuccessCode ? "text-green-600" : "text-red-600";
    },
  },
  async created() {
    const queryString = this.$route.query;
    this.data = [
      {
        title: "Mã giao dịch",
        value: queryString.id,
      },
      {
        title: "Trạng thái",
        value:
          queryString.status === "PAID"
            ? "Giao dịch thành công"
            : "Giao dịch thất bại",
      },
      {
        title: "Ngày chuyển tiền",
        value: this.formatDate(),
      },
    ];

    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.userId = decoded.user.user_id;
        const payload = {
          user_id: this.userId,
          transaction_id: queryString.id,
          status: queryString.status,
        };
          if (queryString.status === "PAID") {
          const newAccessToken = await this.refreshAccessToken();
          localStorage.setItem("accessToken", newAccessToken);
        }
      }
    }
  },
};
</script>
