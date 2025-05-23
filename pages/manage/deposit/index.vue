<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <a-card class="w-3/4 p-8">
      <h1 class="text-3xl font-semibold mb-8 text-center">
        Nạp tiền vào tài khoản
      </h1>

      <div class="text-center">
        <i
          class="fa fa-qrcode text-9xl border pl-3 pr-3"
          aria-hidden="true"
        ></i>
        <br />
        <span class="text-lg font-bold">Quét mã QR</span>
      </div>

      <div class="text-end">
        <a-button type="default" @click="goToPaymentHistory">
          Lịch sử thanh toán
          <i class="fa fa-arrow-right ml-1"></i>
        </a-button>
      </div>

      <br />

      <!-- Phần thông tin người dùng -->
      <a-descriptions :bordered="true" column="1" class="mb-8">
        <a-descriptions-item label="Tên Người dùng">
          <span class="text-xl font-bold">{{ user.name }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Số điện thoại">
          <span class="text-xl font-bold">{{ user.phone }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Số dư Tài khoản">
          <span class="text-green-500 text-xl font-bold">{{
            formatCurrency(user.balance)
          }}</span>
        </a-descriptions-item>
      </a-descriptions>

      <!-- Phần chọn số tiền -->
      <a-space size="large" class="mb-8 flex justify-center items-center">
        <a-button
          :type="{ primary: formData.amount === 10000 }"
          @click="setAmount(10000, 0)"
          :class="{ 'selected-amount': selectedAmount === 0 }"
          class="w-32 h-12 text-base md:text-lg lg:text-xl font-bold rounded-lg mr-2"
        >
          {{ formatCurrency(10000) }}
        </a-button>
        <a-button
          :type="{ primary: formData.amount === 20000 }"
          @click="setAmount(20000, 1)"
          :class="{ 'selected-amount': selectedAmount === 1 }"
          class="w-32 h-12 text-base md:text-lg lg:text-xl font-bold rounded-lg mr-2"
        >
          {{ formatCurrency(20000) }}
        </a-button>
        <a-button
          :type="{ primary: formData.amount === 50000 }"
          @click="setAmount(50000, 2)"
          :class="{ 'selected-amount': selectedAmount === 2 }"
          class="w-32 h-12 text-base md:text-lg lg:text-xl font-bold rounded-lg mr-2"
        >
          {{ formatCurrency(50000) }}
        </a-button>
        <a-button
          :type="{ primary: formData.amount === 100000 }"
          @click="setAmount(100000, 3)"
          :class="{ 'selected-amount': selectedAmount === 3 }"
          class="w-32 h-12 text-base md:text-lg lg:text-xl font-bold rounded-lg mr-2"
        >
          {{ formatCurrency(100000) }}
        </a-button>
        <a-button
          :type="{ primary: formData.amount === 200000 }"
          @click="setAmount(200000, 4)"
          :class="{ 'selected-amount': selectedAmount === 4 }"
          class="w-32 h-12 text-base md:text-lg lg:text-xl font-bold rounded-lg mr-2"
        >
          {{ formatCurrency(200000) }}
        </a-button>
        <a-button
          :type="{ primary: formData.amount === 500000 }"
          @click="setAmount(500000, 5)"
          :class="{ 'selected-amount': selectedAmount === 5 }"
          class="w-32 h-12 text-base md:text-lg lg:text-xl font-bold rounded-lg mr-2"
        >
          {{ formatCurrency(500000) }}
        </a-button>
      </a-space>

      <!-- Phần nhập số tiền -->
      <div class="text-center">
        <span class="text-lg font-semibold">Tổng số tiền</span>
        <br />
        <a-input-number
          v-model="formData.amount"
          :min="1000"
          :step="10000"
          placeholder="Nhập số tiền"
          class="w-1/3 mb-8"
        ></a-input-number>
      </div>

      <!-- Nút thanh toán -->
      <div class="flex justify-center space-x-4 mb-8">
        <a-button @click="handleSubmit" class="w-1/2 lg:w-1/3"
          ><i class="fa fa-credit-card mr-2"></i> Thanh Toán</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { jwtDecode } from "jwt-decode";

export default {
  layout: "manage",
  data() {
    return {
      formData: {
        amount: 10000,
        description: "",
      },
      user: null,
      selectedAmount: null,
    };
  },
  created() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.user = {
          id: decoded.user.user_id,
          name: decoded.user.user_name,
          phone: decoded.user.phone,
          balance: decoded.user.balance,
        };
      }
    }
  },
  methods: {
    ...mapActions({
      createPayment: "modules/payment/createPayment",
    }),
    async handleSubmit() {
      if (this.formData.amount % 2 !== 0) {
        message.error("Vui lòng nhập số tiền là số chẵn");
        return;
      }

      try {
        this.formData.description = `Thanh toán ${this.formatCurrency(
          this.formData.amount
        )}`;

        let paymentUrl = await this.createPayment(this.formData);
        window.location.href = paymentUrl;
        console.log("Payment created successfully!");
      } catch (error) {
        console.error("Error creating payment:", error);
      }
    },
    setAmount(amount, index) {
      this.formData.amount = amount;
      this.selectedAmount = index;
    },
    formatCurrency(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    goToPaymentHistory() {
      this.$router.push("/manage/payment-history");
    },
  },
};
</script>

<style scoped>
.selected-amount {
  background-color: #3182ce; /* Adjust the color as needed */
  color: #fff;
}
</style>
