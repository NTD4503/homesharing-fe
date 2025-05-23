<template>
  <div>
    <h1 class="text-bold text-3xl">Cấu hình dịch vụ</h1>
    <br />
    <a-table
      :columns="columns"
      :data-source="services"
      :pagination="false"
      bordered
    >
      <template slot="advantages" slot-scope="text, record">
        <p v-html="text"></p>
      </template>

      <template slot="price_per_day" slot-scope="text, record">
        {{ formatCurrency(text) }}
      </template>

      <template slot="price_per_week" slot-scope="text, record">
        {{ formatCurrency(text) }}
      </template>

      <template slot="price_per_month" slot-scope="text, record">
        {{ formatCurrency(text) }}
      </template>

      <template slot="title_color" slot-scope="text, record">
        <a-input type="color" :value="text" disabled />
      </template>

      <template slot="period" slot-scope="text, record">
        {{ convertPeriodToVietnamese(text) }}
      </template>

      <template slot="auto_approval" slot-scope="text, record">
        <i
          :class="{
            'fa fa-check text-green-500 text-xl': text,
            'fa fa-times text-red-500 text-xl': !text,
          }"
        ></i>
      </template>

      <template slot="prominent_badge" slot-scope="text, record">
        <i
          :class="{
            'fa fa-check text-green-500 text-xl': text,
            'fa fa-times text-red-500 text-xl': !text,
          }"
        ></i>
      </template>

      <template slot="action" slot-scope="text, record">
        <a-button @click="handleEdit(record)"
          ><i class="fa fa-cog mr-2" aria-hidden="true"></i> Cấu hình</a-button
        >
      </template>
    </a-table>

    <a-modal
      v-model:visible="modalVisible"
      title="Cấu hình"
      @ok="saveChanges"
      class="p-6 bg-white rounded-lg shadow-md"
    >
      <a-form v-if="editedService" :model="editedService" class="space-y-4">
        <a-form-item label="Tên dịch vụ">
          <a-input
            v-model="editedService.service_name"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </a-form-item>
        <a-form-item label="Giá theo ngày">
          <a-input
            v-model="editedService.price_per_day"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </a-form-item>
        <a-form-item label="Giá theo tuần">
          <a-input
            v-model="editedService.price_per_week"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </a-form-item>
        <a-form-item label="Giá theo tháng">
          <a-input
            v-model="editedService.price_per_month"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </a-form-item>
        <a-form-item label="Ưu điểm">
          <a-textarea
            :auto-size="{ minRows: 5, maxRows: 10 }"
            v-model="editedService.advantages"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </a-form-item>
        <a-form-item label="Thời hạn bài đăng">
          <div class="flex items-center space-x-2">
            <a-input-number
              v-model="periodNumber"
              :min="1"
              class="w-1/2 border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <a-radio-group
              v-model="periodUnit"
              class="flex items-center space-x-2"
            >
              <a-radio-button value="day">Ngày</a-radio-button>
              <a-radio-button value="week">Tuần</a-radio-button>
              <a-radio-button value="month">Tháng</a-radio-button>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item label="Màu tiêu đề">
          <a-input
            v-model="editedService.title_color"
            type="color"
            @change="handleColorChange"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </a-form-item>
        <a-form-item label="Tự động phê duyệt">
          <a-radio-group v-model="editedService.auto_approval">
            <a-radio-button :value="true">Có</a-radio-button>
            <a-radio-button :value="false">Không</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Huy hiệu nổi bật">
          <a-radio-group v-model="editedService.prominent_badge">
            <a-radio-button :value="true">Có</a-radio-button>
            <a-radio-button :value="false">Không</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { columns } from "./const";

export default {
  layout: "admin",
  data() {
    return {
      columns,
      modalVisible: false,
      editedService: null,
      periodNumber: null,
      periodUnit: null,
    };
  },
  computed: {
    ...mapState({
      services: (state) => state.modules["service"].services,
    }),
    editedServicePeriod() {
      if (this.editedService && this.editedService.period) {
        const [number, unit] = this.editedService.period.split(" ");
        return { number: parseInt(number), unit };
      }
      return { number: null, unit: null };
    },
  },
  methods: {
    ...mapActions({
      fetchAllServices: "modules/service/fetchAllServices",
      updateService: "modules/service/updateService",
    }),
    handleEdit(record) {
      this.editedService = { ...record };
      this.editedService.advantages = this.editedService.advantages.replace(
        /<br>/g,
        "\n"
      );
      this.modalVisible = true;
    },
    handleColorChange(event) {
      const selectedColor = event.target.value;
      this.editedService.title_color = selectedColor;
    },
    async saveChanges() {
      try {
        this.editedService.advantages = this.editedService.advantages.replace(
          /\n/g,
          "<br>"
        );
        this.editedService.period = `${this.periodNumber} ${this.periodUnit}`;
        await this.updateService(this.editedService);
        await this.fetchAllServices();
        this.modalVisible = false;
      } catch (error) {
        console.error("Error updating service:", error);
      }
    },
    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      return formatter.format(amount);
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
  watch: {
    editedServicePeriod: {
      handler(newValue) {
        this.periodNumber = newValue.number;
        this.periodUnit = newValue.unit;
      },
      immediate: true,
    },
  },
  async created() {
    try {
      await this.fetchAllServices();
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  },
};
</script>

<style scoped>
/* Các styles tùy chỉnh có thể được thêm ở đây */
</style>
