<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Các lịch hẹn xem phòng</h1>
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
    <a-table
      :columns="columns"
      :data-source="filteredRequests"
      bordered
      :pagination="false"
      class="w-full"
    >
      <template slot="index" slot-scope="text, record, index"
        >{{ index + 1 }}
      </template>
      <template slot="request_date" slot-scope="text">
        <span class="text-gray-600">{{ formatDate(text) }}</span>
      </template>
      <template slot-scope="text, record" slot="userInfo">
        <div class="text-center">
          <a-avatar
            :src="record.avatar"
            v-if="record.avatar"
            :size="50"
            class="cursor-pointer mb-2"
            :class="{ 'border-blue-500': record.avatar }"
            :style="{ 'border-width': record.avatar ? '2px' : '0' }"
          />
          <br v-if="record.avatar" />
          <span>{{ record.user_name }}</span>
        </div>
      </template>
      <template slot="is_approved" slot-scope="text, record">
        <span v-if="text" class="text-green-500">
          <i class="fa fa-check mr-2" aria-hidden="true"></i> Đã phê duyệt
        </span>
        <span v-else-if="record.is_cancelled" class="text-red-500">
          <i class="fa fa-times mr-2" aria-hidden="true"></i> Đã từ chối
        </span>
        <span v-else-if="isRequestExpired(record)">
          <span class="text-red-500">Yêu cầu đã quá hạn</span>
        </span>
        <span v-else class="text-yellow-500">
          <i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Đang chờ phê
          duyệt
        </span>
      </template>
      <!-- <template slot="cancelled_reason" slot-scope="text, record"> </template> -->
      <template slot="actions" slot-scope="text, record">
        <a-button
          :disabled="record.is_approved || record.is_cancelled"
          type="danger"
          class="text-gray-600"
          @click="confirmDeleteRequest(record)"
        >
          <i class="fa fa-trash mr-2" aria-hidden="true"></i> Hủy
        </a-button>
      </template>
      <template slot="post_id" slot-scope="text, record">
        <a
          :href="`/${record.post_id}`"
          target="_blank"
          class="text-blue-500 hover:underline"
          >Xem bài đăng</a
        >
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { message, Modal } from "ant-design-vue";
import { columns } from "./const";
import _ from "lodash";

export default {
  layout: "manage",
  components: {},
  data() {
    return {
      dateRange: null,
      userId: null,
      columns,
      isCancelModalVisible: false,
      cancelReason: "",
      recordToCancel: null,
    };
  },

  computed: {
    ...mapState({
      requestsByUser: (state) =>
        state.modules["viewing-request"].requestsByUser,
    }),
    filteredRequests() {
      let cloneRequests = _.cloneDeep(this.requestsByUser);
      cloneRequests.sort((a, b) => {
        if (!a.is_approved && (b.is_approved || b.is_cancelled)) {
          return -1;
        } else if ((a.is_approved || a.is_cancelled) && !b.is_approved) {
          return 1;
        } else {
          return 0;
        }
      });
      if (!this.dateRange) {
        return cloneRequests;
      }

      const [startDate, endDate] = this.dateRange;
      return cloneRequests.filter((request) => {
        const requestDate = moment(request.request_date).startOf("day");
        return (
          requestDate.isSameOrAfter(moment(startDate).startOf("day")) &&
          requestDate.isSameOrBefore(endDate)
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
        await this.fetchViewRequestsByUser({ user_id: this.userId });
        console.log(this.requestsByUser);
      }
    }
  },
  methods: {
    ...mapActions({
      fetchViewRequestsByUser:
        "modules/viewing-request/fetchViewRequestsByUser",
      deleteViewRequest: "modules/viewing-request/deleteViewRequest",
    }),
    resetFilter() {
      this.dateRange = null;
    },
    formatDate(dateString) {
      return moment(dateString).format("DD-MM-YYYY");
    },
    async handleDeleteRequest(record) {
      try {
        const requestData = {
          id: record.request_id,
        };
        await this.deleteViewRequest(requestData);
        await this.refreshViewRequestData();
        this.modalVisible = false;
        message.success("Yêu cầu xem phòng đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting view request:", error);
        message.error("Đã xảy ra lỗi khi xóa yêu cầu xem phòng.");
      }
    },
    async refreshViewRequestData() {
      await this.fetchViewRequestsByUser({
        user_id: this.userId,
      });
    },
    confirmDeleteRequest(record) {
      Modal.confirm({
        title: "Xác nhận hủy",
        content: "Bạn có chắc chắn muốn hủy yêu cầu xem phòng này không?",
        onOk: () => this.handleDeleteRequest(record),
      });
    },
    isRequestExpired(record) {
      const now = moment();
      const formattedNow = now.format("HH:mm");
      const requestDate = moment(record.request_date);
      const [startHour, endHour] = record.time_frame.split("-");
      return startHour > formattedNow && now.isAfter(requestDate.endOf("day"));
    },
  },
};
</script>

<style scoped>
/* You can add custom scoped styles here if needed */
</style>
