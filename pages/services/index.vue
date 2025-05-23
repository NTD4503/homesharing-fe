<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8 text-center">Bảng giá dịch vụ</h1>
    <div class="text-center">
      <p>Áp dụng từ ngày 12/05/2024</p>
      <br />
      <p>
        Phongtro123 xin quý khách hàng thân thương được phép điều chỉnh giá dịch
        vụ.
      </p>
      <br />
      <p>
        Chúng tôi luôn mong muốn đem lại trải nghiệm tốt hơn, hoàn hảo hơn cho
        quý khách hàng trong suốt thời gian gắn bó. Chúng tôi quyết định điều
        chỉnh giá, để tồn tại và trên cả là phục vụ hết mình vì quý khách hàng
        đã, đang và sẽ đồng hành tại website.
      </p>
    </div>
    <br /><br />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="bg-white border-2 rounded-lg shadow-md p-6 transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl"
      >
        <h2 class="text-xl font-bold mb-4 text-center text-yellow-500">
          {{ service.service_name }}
        </h2>

        <div class="text-center">
          <p class="mb-2">
            <span class="font-bold">Giá mỗi Ngày:</span>
            {{ formatCurrency(service.price_per_day) }}
          </p>
          <p class="mb-2">
            <span class="font-bold">Giá mỗi Tuần:</span>
            {{ formatCurrency(service.price_per_week) }}
          </p>
          <p class="mb-2">
            <span class="font-bold">Giá mỗi Tháng:</span>
            {{ formatCurrency(service.price_per_month) }}
          </p>
          <br>
          <p class="mb-2">
            <span class="font-bold">Ưu Điểm:</span> <p v-html="service.advantages"> 
            </p>
          </p> 
          <br>
          <p class="mb-2">
            <span class="font-bold">Thời hạn bài đăng:</span>
            {{ convertPeriodToVietnamese(service.period) }}
          </p>
          <p class="mb-2">
            <span class="font-bold">Màu Tiêu Đề:</span>
            <span
              v-if="service.service_id !== 4"
              :style="{ color: service.title_color }"
            >
              IN HOA
            </span>
            <span v-else style="color: #8cb9f5"
              >Tiêu đề màu mặc định, viết thường</span
            >
          </p>
          <p class="mb-2">
            <span class="font-bold">Tự Động Phê Duyệt:</span>
            <a-icon
              v-if="service.auto_approval"
              type="check-circle"
              theme="filled"
              class="text-xl text-green-500"
            />
            <a-icon
              v-else
              class="text-xl text-red-500"
              type="close-circle"
              theme="filled"
            />
          </p>
          <p class="mb-2">
            <span class="font-bold">Huy Hiệu Nổi Bật:</span>
            <a-icon
              v-if="service.prominent_badge"
              type="check-circle"
              theme="filled"
              class="text-xl text-green-500"
            />
            <a-icon
              v-else
              class="text-xl text-red-500"
              type="close-circle"
              theme="filled"
            />
          </p>
          <br />
          <a-tag
            v-if="service.service_name === 'VIP 4'"
            class="text-base ml-2"
            color="blue"
            >Gói mặc định</a-tag
          >
        </div>
      </div>
    </div>
    <br />
    <a-button
    v-if="roleId !== 3"
    class="mx-auto block my-4 bg-blue-500 font-bold rounded text-white"
    @click="handleRouter"
  >
    Đăng ký gói dịch vụ ngay!
  </a-button>
  </div>
</template>

<script>
import { Table, Icon } from "ant-design-vue";
import { mapActions, mapState } from "vuex";
import { columns, colorNames } from "./const";
import { jwtDecode } from "jwt-decode";

export default {
  components: {
    "a-table": Table,
    "a-icon": Icon,
  },
  data() {
    return {
      roleId: null,
      columns,
      colorNames,
    };
  },
  async created() {
    await this.fetchAllServices();
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.roleId = decoded.user.role_id;
      }
    }
  },
  computed: {
    ...mapState({
      services: (state) => state.modules["service"].services,
    }),
  },
  methods: {
    ...mapActions({
      fetchAllServices: "modules/service/fetchAllServices",
    }),
    formatCurrency(amount) {
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    handleRouter() {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        this.$router.push('/login');
      } else {
        if (this.roleId !== 3) {
          this.$router.push('/manage/pricing');
        }
      }
    },
    convertPeriodToVietnamese(period) {
      const [number, unit] = period.split(" ");
      let vietnameseUnit = "";

      switch (unit) {
        case "day":
          vietnameseUnit = "Ngày";
          break;
        case "week":
          vietnameseUnit = "Tuần";
          break;
        case "month":
          vietnameseUnit = "Tháng";
          break;
        default:
          vietnameseUnit = unit;
          break;
      }

      return `${number} ${vietnameseUnit}`;
    },
  },
};
</script>

<style scoped></style>
