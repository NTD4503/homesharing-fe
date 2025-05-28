<template>
  <div class="border border-gray-300 rounded-xl p-6 flex flex-col items-center w-full shadow-sm">
    <img
      :src="avatar"
      alt="Landlord Avatar"
      class="w-20 h-20 rounded-full mb-3 object-cover border border-gray-200"
    />
    <p class="text-xl font-semibold text-gray-800">{{ userName }}</p>

    <div class="flex flex-col gap-3 mt-5 w-full">
      <!-- Nút gọi điện -->
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2"
      >
        <i class="fa fa-phone" aria-hidden="true"></i>
        <span>{{ phone }}</span>
      </button>

      <!-- Nút nhắn tin -->
      <a-button
        type="primary"
        @click="handleNewChat"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2"
      >
      <i class="fa fa-comments" aria-hidden="true"></i>
        <span>Nhắn tin</span>
      </a-button>

      <!-- Nút nhắn Zalo
      <button
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2"
      >
        <img
          class="w-5 h-5"
          src="../../static/icon-zalo.png"
          alt="Zalo Icon"
        />
        <a :href="`https://zalo.me/${phone}`" target="_blank" class="text-white no-underline">
          Nhắn Zalo
        </a>
      </button> -->

      <!-- Nút yêu thích -->
      <button
        @click="toggleFavorite"
        class="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2"
      >
        <i
          class="fa fa-heart"
          :class="{ 'text-red-500': isFavorite }"
          aria-hidden="true"
        ></i>
        <span>{{ isFavorite ? "Đã Thích" : "Yêu Thích" }}</span>
      </button>
      <br />

      <div v-if="postTypeId === 1 && userRole === 3">
        <a-date-picker
          v-model="selectedDate"
          format="DD-MM-YYYY"
          :locale="locale"
          :disabled-date="disabledDate"
          placeholder="Chọn ngày xem phòng"
          size="large"
          class="mb-4 w-full"
        />
      </div>

      <div class="mt-4" v-if="postTypeId === 1 && userRole === 3">
        <a-popover
          v-model:visible="modalVisible"
          title="Chọn Ngày và Thời Gian"
          trigger="click"
          class="bg-white w-full rounded shadow-md border border-gray-300"
        >
          <a-button
            class="view-request-button font-bold rounded flex items-center justify-center w-full"
          >
            <span class="text-base">
              <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>
              <span>
                {{ !viewRequest ? "Đặt lịch xem phòng" : "Sửa lịch hẹn" }}
              </span>
            </span>
          </a-button>
          <template #content>
            <div class="p-4">
              <a-date-picker
                v-model="selectedDate"
                format="DD-MM-YYYY"
                :locale="locale"
                :disabled-date="disabledDate"
                class="mb-4 w-full"
              />
              <div class="mb-4">
                <label for="timeSlot1" class="text-gray-700 block"
                  >Chọn khung giờ:</label
                >
                <div id="timeSlot1" class="grid grid-cols-3 items-center">
                  <a-button
                    v-for="timeSlot in postTimeFrames"
                    :key="timeSlot"
                    :class="{
                      'mr-2': !isLastSlot(timeSlot),
                      'active-time-slot':
                        isActiveTimeSlot(timeSlot) && !isPastTimeSlot(timeSlot),
                      'disabled-time-slot': isPastTimeSlot(timeSlot),
                    }"
                    class="mt-2"
                    @click="selectTimeSlot(timeSlot)"
                    :disabled="isPastTimeSlot(timeSlot) || !selectedDate"
                  >
                    {{ timeSlot }}
                  </a-button>
                </div>
              </div>
              <div class="mb-4">
                <label for="note" class="text-gray-700 block mb-2"
                  >Ghi chú:</label
                >
                <a-textarea
                  id="note"
                  v-model="note"
                  :auto-size="{ minRows: 3, maxRows: 6 }"
                  placeholder="Thêm ghi chú..."
                />
              </div>
              <a-button
                :loading="loading"
                v-if="!viewRequest || viewRequest.is_cancelled"
                @click="handleCreateRequest"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
              >
                Tạo yêu cầu
              </a-button>
              <a-button
                v-else
                :loading="loading"
                @click="handleUpdateRequest"
                class="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
              >
                Sửa yêu cầu
              </a-button>
            </div>
          </template>
        </a-popover>
        <div
          v-if="viewRequest"
          class="mt-4 bg-gray-100 p-4 rounded-lg shadow-md w-full"
        >
          <div class="container mx-auto p-4">
            <h3 class="text-xl font-bold text-gray-900 mb-4">
              <span v-if="!viewRequest.is_approved">
                <span v-if="isRequestExpired(viewRequest)">
                  Lịch hẹn đã quá hạn. <br />Vui lòng hủy lịch hẹn hoặc sửa đổi
                  lịch hẹn.
                </span>
                <span v-else-if="viewRequest.is_cancelled">
                  Lịch hẹn đã bị từ chối. <br />
                  <span class="text-red-600"
                    >Lý do từ chối: {{ viewRequest.cancelled_reason }}</span
                  ><br />
                  Vui lòng tạo lịch hẹn khác.
                </span>
                <span v-else> Lịch hẹn đang chờ duyệt </span>
              </span>
              <span v-else> Lịch hẹn đã được phê duyệt </span>
            </h3>
            <div
              class="flex flex-col items-center bg-white p-4 rounded shadow-md"
            >
              <span class="text-lg font-semibold text-gray-800 mb-2">
                Ngày: {{ formattedRequestDate }}
              </span>
              <span class="text-lg font-semibold text-gray-800 mb-4">
                Khung giờ: {{ viewRequest.time_frame }}
              </span>
              <a-popconfirm
                title="Bạn có chắc chắn muốn hủy yêu cầu này không?"
                okText="Có"
                cancelText="Không"
                @confirm="handleDeleteRequest"
              >
                <button
                  v-if="!viewRequest.is_approved"
                  title="Hủy lịch hẹn"
                  class="mt-4 bg-gray-300 hover:bg-red-500 text-red-600 font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                >
                  <i class="fa fa-trash mr-2" aria-hidden="true"></i> Hủy lịch
                  hẹn
                </button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { vi_VN } from "../../utils/locale";
import { DATE_FORMAT } from "../../utils/const";
import { message } from "ant-design-vue";
import { availableTimeSlots } from "./const";

export default {
  name: "LandlordInfo",
  props: {
    avatar: {
      required: true,
    },
    userName: {
      required: true,
    },
    phone: {
      required: true,
    },
        userID: {
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false,
      modalVisible: false,
      selectedDate: null,
      selectedTimeSlot: null,
      note: "",
      locale: vi_VN,
      userId: null,
      postId: null,
      userRole: null,
      userEmail: null,
      dateFormat: DATE_FORMAT,
      loading: false,
      postTypeId: null,
      availableTimeSlots,
      postTimeFrames: [],
      newUser1: null,
      newUser2: null,
    };
  },
  computed: {
    ...mapState({
      viewRequest: (state) => state.modules["viewing-request"].viewRequest,
      favorite: (state) => state.modules["favorite"].favorite,
      post: (state) => state.modules["post-detail"].post,
    }),
    isActiveTimeSlot() {
      return (timeSlot) => timeSlot === this.selectedTimeSlot;
    },
    formattedRequestDate() {
      return moment(this.viewRequest.request_date).format(this.dateFormat);
    },
  },
  async mounted() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.userId = decoded.user.user_id;
        this.userEmail = decoded.user.email;
        this.postId = this.$route.params.id;
        this.userRole = decoded.user.role_id;

        await this.fetchPostById(this.postId);
        this.postTimeFrames = this.post.time_frame
          ? this.post.time_frame
          : this.availableTimeSlots;
        this.postTypeId = this.post.post_type_id;

        let requestData = {
          post_id: this.postId,
          user_id: this.userId,
        };

        await Promise.all([
          this.fetchViewRequestByPost(requestData),
          this.fetchFavoriteByPost(requestData),
        ]);

        if (
          this.viewRequest &&
          !this.isRequestExpired(this.viewRequest) &&
          !this.viewRequest.is_cancelled
        ) {
          this.selectedDate = this.viewRequest.request_date;
          this.selectedTimeSlot = this.viewRequest.time_frame;
          this.note = this.viewRequest.note;
        }
        if (this.favorite) {
          this.isFavorite = true;
        }
      }
    }
  },
  methods: {
    ...mapActions({
      createViewRequest: "modules/viewing-request/createViewRequest",
      sendMailConfirmRequest: "modules/viewing-request/sendMailConfirmRequest",
      updateViewRequest: "modules/viewing-request/updateViewRequest",
      deleteViewRequest: "modules/viewing-request/deleteViewRequest",
      fetchViewRequestByPost: "modules/viewing-request/fetchViewRequestByPost",
      favorPost: "modules/favorite/favorPost",
      unfavorPost: "modules/favorite/unfavorPost",
      fetchFavoriteByPost: "modules/favorite/fetchFavoriteByPost",
      fetchPostById: "modules/post-detail/fetchPostById",
      createConversationAction: 'modules/message/createConversation',
      fetchConversations: 'modules/message/fetchConversations',
    }),
    
async handleNewChat() {
  const payload = {
    user1_id: this.userId,
    user2_id: this.userID,
  }

  try {
    const conversation = await this.createConversationAction(payload)

    // 🔁 Cập nhật danh sách trước khi mở
    await this.fetchConversations(this.userId)

    this.$store.commit('modules/message/setCurrentConversationId', conversation.id)

    // Gửi event để mở ChatWindow
    window.dispatchEvent(new CustomEvent('open-chat', {
      detail: { conversationId: conversation.id }
    }))
  } catch (err) {
    console.error('Lỗi tạo cuộc trò chuyện:', err)
  }
},

    async toggleFavorite() {
      if (!this.userId) {
        this.$router.push("/login");
        return;
      }
      try {
        let requestData = {
          post_id: this.postId,
          user_id: this.userId,
        };
        if (this.isFavorite) {
          await this.unfavorPost(requestData);
        } else {
          await this.favorPost(requestData);
        }
        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },

    showDatePicker() {
      this.modalVisible = true;
    },
    hideDatePicker() {
      this.modalVisible = false;
    },
    async handleCreateRequest() {
      this.loading = true;
      try {
        if (!this.selectedDate || !this.selectedTimeSlot) {
          message.error("Vui lòng chọn ngày, khung giờ khi tạo yêu cầu.");
          this.loading = false;
          return;
        }
        let requestData = {
          postId: this.postId,
          userId: this.userId,
          email: this.userEmail,
          requestDate: moment(this.selectedDate).format("YYYY-MM-DD"),
          timeFrame: this.selectedTimeSlot,
          note: this.note,
        };

        await Promise.all([
          this.createViewRequest(requestData),
          this.sendMailConfirmRequest(requestData),
        ]);
        if (this.viewRequest) {
          await this.handleDeleteRequest();
        }
        await this.refreshViewRequestData();
        this.modalVisible = false;
        message.success("Yêu cầu xem phòng đã được tạo thành công!");
        this.loading = false;
      } catch (error) {
        console.error("Error creating view request:", error);
        message.error("Đã xảy ra lỗi khi tạo yêu cầu xem phòng.");
      }
    },

    async handleUpdateRequest() {
      this.loading = true;
      try {
        if (!this.selectedDate || !this.selectedTimeSlot) {
          message.error(
            "Vui lòng chọn ngày, khung giờ trước khi cập nhật yêu cầu."
          );
          this.loading = false;
          return;
        }
        const requestData = {
          postId: this.postId,
          email: this.userEmail,
          userId: this.userId,
          id: this.viewRequest.request_id,
          requestDate: moment(this.selectedDate).format("YYYY-MM-DD"),
          timeFrame: this.selectedTimeSlot,
          note: this.note,
        };
        await Promise.all([
          this.updateViewRequest(requestData),
          this.sendMailConfirmRequest(requestData),
        ]);
        await this.refreshViewRequestData();
        this.modalVisible = false;
        this.loading = false;
        message.success("Yêu cầu xem phòng đã được cập nhật thành công!");
      } catch (error) {
        console.error("Error updating view request:", error);
        message.error("Đã xảy ra lỗi khi cập nhật yêu cầu xem phòng.");
      }
    },

    async handleDeleteRequest() {
      try {
        const requestData = {
          id: this.viewRequest.request_id,
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
      await this.fetchViewRequestByPost({
        post_id: this.postId,
        user_id: this.userId,
      });
      this.selectedDate = this.viewRequest.request_date;
      this.selectedTimeSlot = this.viewRequest.time_frame;
      this.note = this.viewRequest.note;
    },
    disabledDate(time) {
      if (this.post.date_range) {
        let [startDate, endDate] = this.post.date_range
          .split(" - ")
          .map((dateStr) => moment(dateStr, "DD/MM/YYYY"));

        const today = moment().startOf("day");
        console.log(endDate);
        if (endDate.isBefore(today)) {
          console.log("flag");
          return time.isBefore(today);
        }
        if (startDate.isBefore(today)) {
          startDate = today;
        }

        return time.isBefore(startDate) || time.isAfter(endDate.endOf("day"));
      } else {
        const todayStart = moment().startOf("day");
        return time.isBefore(todayStart);
      }
    },
    isPastTimeSlot(timeSlot) {
      const currentTime = moment().format("HH:mm");
      const [startHour, endHour] = timeSlot.split("-");

      const isToday = moment(this.selectedDate).isSame(moment(), "day");

      if (isToday) {
        return moment(currentTime, "HH:mm").isAfter(moment(endHour, "HH:mm"));
      }

      return false;
    },
    isLastSlot(timeSlot) {
      return timeSlot === this.postTimeFrames[this.postTimeFrames.length - 1];
    },
    isRequestExpired(record) {
      const now = moment();
      const formattedNow = now.format("HH:mm");
      const requestDate = moment(record.request_date);
      const [startHour, endHour] = record.time_frame.split("-");
      return startHour > formattedNow && now.isAfter(requestDate.endOf("day"));
    },
    selectTimeSlot(timeSlot) {
      this.selectedTimeSlot = timeSlot;
    },
  },
};
</script>

<style scoped>
.contact-button {
  transition: background-color 0.3s ease;
}

.favorite-button,
.view-request-button {
  transition: background-color 0.3s ease;
}

.a-popover-wrapper {
  z-index: 50;
}

.a-popover {
  animation: scale-in 0.3s ease;
}

/* Tailwind CSS's bg-blue-300 color */
.active-time-slot {
  background-color: #93c5fd; 
}


@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
