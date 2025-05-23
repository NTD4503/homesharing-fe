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
      <template slot-scope="text, record" slot="actions">
        <template>
          <div class="flex justify-center">
            <a-button
              :disabled="
                isRequestExpired(record) ||
                record.is_approved ||
                record.is_cancelled
              "
              @click="handleApprove(record, 'approved')"
              class="text-white mr-2 bg-blue-500 hover:bg-blue-700 font-bold rounded"
            >
              <i class="fa fa-check mr-1" aria-hidden="true"></i>
              <span> Phê Duyệt </span>
            </a-button>

            <a-button
              :disabled="
                isRequestExpired(record) ||
                record.is_approved ||
                record.is_cancelled
              "
              @click="showCancelModal(record)"
              class="text-white mr-2 bg-red-500 hover:bg-red-700 font-bold rounded"
            >
              <i class="fa fa-times mr-1" aria-hidden="true"></i>
              <span>Từ chối</span>
            </a-button>
          </div>
        </template>
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
    <template>
      <a-modal
        v-model="isCancelModalVisible"
        title="Lý do từ chối"
        :footer="null"
        :okButtonProps="{ loading: cancelLoading }"
      >
        <a-textarea
          v-model="cancelReason"
          rows="4"
          placeholder="Nhập lý do từ chối"
        />
        <br />
        <br />
        <div class="text-center">
          <a-button :loading="cancelLoading" class="mr-2" @click="handleCancel"
            >Ok</a-button
          >
          <a-button @click="closeCancelModal">Hủy</a-button>
        </div>
      </a-modal>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { message } from "ant-design-vue";
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
      cancelLoading: false,
    };
  },

  computed: {
    ...mapState({
      allRequestForLandlord: (state) =>
        state.modules["viewing-request"].allRequestForLandlord,
    }),
    filteredRequests() {
      let cloneRequests = _.cloneDeep(this.allRequestForLandlord);
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
      console.log(cloneRequests);
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
        await this.getAllViewRequestForLandlord(this.userId);
      }
    }
  },
  methods: {
    ...mapActions({
      getAllViewRequestForLandlord:
        "modules/viewing-request/getAllViewRequestForLandlord",
      updateViewRequest: "modules/viewing-request/updateViewRequest",
      cancelApproval: "modules/viewing-request/cancelApproval",
      sendMailRefusedRequest: "modules/viewing-request/sendMailRefusedRequest",
      sendMailAcceptedRequest:
        "modules/viewing-request/sendMailAcceptedRequest",
    }),
    resetFilter() {
      this.dateRange = null;
    },
    showCancelModal(record) {
      this.recordToCancel = record;
      this.isCancelModalVisible = true;
    },
    async handleCancel() {
      this.cancelLoading = true;
      if (!this.cancelReason) {
        message.error("Vui lòng nhập lý do từ chối");
        this.cancelLoading = false;
        return;
      }
      const requestData = {
        id: this.recordToCancel.request_id,
        type: "cancelled",
        reason: this.cancelReason,
      };
      const mailData = {
        postId: this.recordToCancel.post_id,
        email: this.recordToCancel.email,
        requestDate: this.formatDate(this.recordToCancel.request_date),
        timeFrame: this.recordToCancel.time_frame,
        note: this.recordToCancel.note,
        cancelledReason: this.cancelReason,
      };
      await Promise.all([
        this.updateViewRequest(requestData),
        this.sendMailRefusedRequest(mailData),
      ]);
      await this.getAllViewRequestForLandlord(this.userId);
      this.closeCancelModal();
      this.cancelLoading = false;
      message.success("Yêu cầu đã bị từ chối");
    },
    closeCancelModal() {
      this.isCancelModalVisible = false;
      this.cancelReason = "";
      this.recordToCancel = null;
    },
    async handleApprove(record, type) {
      const requestData = {
        id: record.request_id,
        type: type,
      };
      const mailData = {
        postId: record.post_id,
        email: record.email,
        requestDate: this.formatDate(record.request_date),
        timeFrame: record.time_frame,
        note: record.note,
      };
      await this.updateViewRequest(requestData);
      await Promise.all([
        this.sendMailAcceptedRequest(mailData),
        this.getAllViewRequestForLandlord(this.userId),
      ]);
      message.success("Phê duyệt thành công");
    },
    formatDate(dateString) {
      return new moment(dateString).format("DD-MM-YYYY");
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
