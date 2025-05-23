<template>
  <div class="container mx-auto px-4">
    <!-- Header -->
    <h1 class="text-3xl text-start font-bold mb-8">Đăng ký dịch vụ</h1>

    <!-- Hiển thị gói dịch vụ hiện tại của người dùng -->
    <div class="mb-8 text-center" v-if="currentService">
      <h2 class="text-xl font-semibold mb-4">Gói dịch vụ hiện tại của bạn:</h2>
      <div class="text-center">
        <p>
          {{ currentService.service_name }}
          <a-tag
            v-if="currentService.service_name === 'VIP 4'"
            class="text-base ml-2"
            color="blue"
            >Gói mặc định</a-tag
          >
          <a-tag v-else class="text-base ml-[20px]" color="green"
            >Ngày hết hạn : {{ formatDate(this.serviceExpiredDate) }}</a-tag
          >
        </p>
      </div>
    </div>

    <div class="mb-8 flex justify-end">
      <div class="p-4 bg-yellow-200 border border-yellow-400 rounded-md w-1/3">
        <p class="text-yellow-900 font-semibold">
          Khi gói dịch vụ hiện tại của bạn hết hạn, tài khoản của bạn sẽ quay
          trở lại gói dịch vụ mặc định (VIP 4).
        </p>
      </div>
    </div>

    <!-- Chọn loại dịch vụ -->
    <div
      class="flex justify-center mb-8 grid grid-cols-1 md:grid-cols-4 gap-10"
    >
      <div
        v-for="(service, index) in services"
        :key="index"
        @click="service.service_name !== 'VIP 4' && selectService(service)"
        :class="{
          'selected-card':
            selectedService &&
            selectedService.service_id === service.service_id,
          'cursor-not-allowed opacity-50': service.service_name === 'VIP 4',
        }"
        class="rounded-lg border shadow-lg cursor-pointer transition duration-300 transform hover:scale-105 bg-white"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">{{ service.service_name }}</h3>
          <br />
          <div class="ml-[40px]">
            <div class="flex items-center mr-2">
              <p class="text-sm mr-2">
                Ngày:
                <span class="font-bold mr-2">{{
                  formatCurrency(service.price_per_day)
                }}</span>
              </p>
              <p class="text-sm mr-2">
                Tuần:
                <span class="font-bold">{{
                  formatCurrency(service.price_per_week)
                }}</span>
              </p>
              <p class="text-sm mr-2">
                Tháng:
                <span class="font-bold">{{
                  formatCurrency(service.price_per_month)
                }}</span>
              </p>
            </div>
          </div>
          <br />
          <div class="mb-8">
            <p class="text-sm font-semibold">Ưu điểm:</p>
            <p v-html="service.advantages" class="text-sm"></p>
          </div>
          <div class="text-center">
            <a-tag
              v-if="service.service_name === 'VIP 4'"
              class="text-base ml-2"
              color="blue"
              >Gói mặc định</a-tag
            >
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <div class="mb-8">
        <router-link
          target="_blank"
          to="/services"
          class="text-blue-500 underline"
        >
          Xem chi tiết bảng giá dịch vụ
        </router-link>
      </div>

      <!-- Chọn độ dài dịch vụ -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">
          Chọn thời gian hiệu lực dịch vụ:
        </h2>
        <a-radio-group size="large" v-model="selectedDuration">
          <a-radio-button value="1 day">1 Ngày</a-radio-button>
          <a-radio-button value="1 week">1 Tuần</a-radio-button>
          <a-radio-button value="1 month">1 Tháng</a-radio-button>
        </a-radio-group>
      </div>

      <!-- Tổng tiền -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Tổng tiền cần thanh toán:</h2>
        <p class="text-lg font-bold">{{ calculateTotalPrice() }}</p>
      </div>

      <!-- Nút Submit -->
      <button
        :loading="loading"
        :disabled="selectedService && selectedService.service_name === 'VIP 4'"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
        @click="handleRegisterSevice"
      >
        <i class="fa fa-credit-card mr-2" aria-hidden="true"></i>
        Thanh toán
      </button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import { message } from "ant-design-vue";

export default {
  layout: "manage",
  data() {
    return {
      selectedService: null,
      selectedDuration: "1 day",
      user: null,
      currentService: null,
      loading: false,
      serviceExpiredDate: null,
      filteredService: [],
    };
  },
  computed: {
    ...mapState({
      services: (state) => state.modules["service"].services,
    }),
    totalPrice() {
      if (!this.selectedService) return 0;
      let price = 0;
      if (this.selectedDuration === "1 day") {
        price = this.selectedService.price_per_day;
      } else if (this.selectedDuration === "1 week") {
        price = this.selectedService.price_per_week;
      } else if (this.selectedDuration === "1 month") {
        price = this.selectedService.price_per_month;
      }
      return price;
    },
  },
  async created() {
    await this.fetchAllServices();
    if (process.browser) {
      const newAccessToken = await this.refreshAccessToken();
      localStorage.setItem("accessToken", newAccessToken);
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.user = decoded.user;
        let userService = this.services.find(
          (service) => service.service_id === this.user.service_id
        );
        this.serviceExpiredDate = this.user.service_expiry_date;
        this.selectedService = userService;
      }
      this.currentService = this.services.find(
        (sev) => sev.service_id === this.user.service_id
      );
      console.log(this.currentService);
    }
  },
  methods: {
    ...mapActions({
      fetchAllServices: "modules/service/fetchAllServices",
      savePurchaseHistory: "modules/service/savePurchaseHistory",
      updateUserService: "modules/user/updateUserService",
      refreshAccessToken: "modules/auth/refreshAccessToken",
    }),
    selectService(service) {
      this.selectedService = service;
    },
    async handleRegisterSevice() {
      this.loading = true;
      try {
        if (!this.selectedService) {
          message.error("Vui lòng chọn dịch vụ");
          this.loading = false;
          return;
        }

        if (this.user.balance < this.totalPrice) {
          message.error(
            <span>
              Tài khoản của bạn không đủ để đăng ký gói dịch vụ.
              <br />
              Vui lòng nạp thêm tiền vào tài khoản!
            </span>
          );
          this.loading = false;
          return;
        }

        let serviceExpiryDate = moment();
        if (this.selectedDuration === "1 day") {
          serviceExpiryDate.add(1, "day");
        } else if (this.selectedDuration === "1 week") {
          serviceExpiryDate.add(1, "week");
        } else if (this.selectedDuration === "1 month") {
          serviceExpiryDate.add(1, "month");
        }

        let payload = {
          user_id: this.user.user_id,
          service_id: this.selectedService.service_id,
          amount_to_sub: this.totalPrice,
          service_expiry_date: serviceExpiryDate.toISOString(),
        };

        let history = {
          user_id: this.user.user_id,
          service_id: this.selectedService.service_id,
          service_expiry_date: serviceExpiryDate.toISOString(),
        };
        await this.savePurchaseHistory(history);

        await this.updateUserService(payload);
        message.success("Thanh toán thành công");
        const newAccessToken = await this.refreshAccessToken();
        localStorage.setItem("accessToken", newAccessToken);
        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (error) {
        message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
      } finally {
        this.loading = false;
      }
    },
    calculateTotalPrice() {
      return this.formatCurrency(this.totalPrice);
    },
    formatCurrency(amount) {
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    formatDate(date) {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }
    },
  },
};
</script>

<style scoped>
.selected-card {
  border: 2px solid #1890ff;
}
</style>
