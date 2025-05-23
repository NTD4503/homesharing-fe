<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Các Bài Đăng Của Bạn</h1>
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
    <a-table
      :columns="columns"
      :data-source="filteredPosts"
      bordered
      :pagination="pagination"
      class="w-full"
    >
      <template slot="index" slot-scope="text, record, index">{{
        index + 1
      }}</template>
      <template slot="customImage" slot-scope="text">
        <img :src="text[0]" alt="Ảnh" class="w-32 h-auto" />
      </template>
      <template slot-scope="text, record" slot="actions">
        <a-button
          class="mr-2 bg-blue-500"
          type="primary"
          @click="handleEdit(record)"
          :disabled="!record.available"
          ><i class="fa fa-edit"></i
        ></a-button>
        <a-button
          v-if="userRole !== 3"
          @click="openConfigModal(record)"
          :disabled="!record.available"
          class="mr-2"
          ><i class="fa fa-cog" aria-hidden="true"></i
        ></a-button>
        <a-popconfirm
          title="Bạn có chắc chắn muốn xóa bài đăng này không?"
          okText="Có"
          cancelText="Không"
          @confirm="handleDelete(record)"
        >
          <a-button type="danger" class="bg-red-500"
            ><i class="fa fa-trash" aria-hidden="true"></i
          ></a-button>
        </a-popconfirm>
      </template>
      <template slot-scope="text, record" slot="is_approved">
        <a-tag :color="text ? 'green' : 'red'">
          {{ text ? "Đã phê duyệt" : "Chưa phê duyệt" }}
        </a-tag>
      </template>
      <template slot="price" slot-scope="text">{{
        formatCurrency(text)
      }}</template>
      <template slot="created_at" slot-scope="text">{{
        text ? formatDate(text) : ""
      }}</template>
      <template slot="expired_in" slot-scope="text, record"
        >{{ text ? formatDate(text) : "" }}
        <a-tag v-if="record.is_approved && !record.available" color="red">
          Hết hạn
        </a-tag>
      </template>
      <!-- <template slot="title" slot-scope="text">
        {{ text }}
      </template> -->
      <template slot="description" slot-scope="text">
        <p v-html="limitDescription(text)"></p>
      </template>
    </a-table>
    <a-modal
      v-model:visible="configModalVisible"
      :footer="null"
      title="Cấu hình lịch hẹn xem phòng"
    >
      <div v-if="selectedPost" class="p-4 text-center">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2"
            >Thời gian xem phòng:</label
          >
          <a-range-picker
            v-model="modalDateRange"
            :placeholder="['Từ ngày', 'Đến ngày']"
            format="DD-MM-YYYY"
            class="mb-2"
            :disabled-date="disabledDate"
          />
        </div>

        <div class="mb-4 text-center">
          <label class="text-gray-700 text-sm font-bold mb-2"
            >Chọn khung giờ:</label
          >
          <div class="flex flex-wrap justify-center">
            <a-button
              v-for="timeSlot in availableTimeFrames"
              :key="timeSlot"
              @click="toggleTimeFrame(timeSlot)"
              :class="{
                'bg-blue-500 text-white': selectedTimeFrames.includes(timeSlot),
                'bg-gray-200': !selectedTimeFrames.includes(timeSlot),
              }"
              class="w-1/3 mb-2 mr-2 rounded-lg mt-4 ml-2"
            >
              {{ timeSlot }}
            </a-button>
          </div>
        </div>

        <div class="mt-4">
          <a-button @click="handleConfigSave">Lưu</a-button>
          <a-button @click="handleConfigCancel" class="ml-2">Hủy</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import _ from "lodash";
import { columns, pagination } from "./const";
import { message } from "ant-design-vue";
import { availableTimeSlots } from "../../../components/LandlordInfo/const";

export default {
  layout: "manage",
  components: {},
  data() {
    return {
      columns,
      pagination,
      availableTimeFrames: availableTimeSlots,
      configModalVisible: false,
      modalDateRange: null,
      selectedTimeFrames: [],
      selectedPost: null,
      userRole: null,
      dateRange: null,
    };
  },
  computed: {
    ...mapState({
      postsByUser: (state) => state.modules["post"].postsByUser,
    }),
    filteredPosts() {
      let clonePosts = _.cloneDeep(this.postsByUser);
      clonePosts.sort((a, b) => {
        if (a.is_approved === b.is_approved) {
          return 0;
        } else if (a.is_approved && !b.is_approved) {
          return -1;
        } else {
          return 1;
        }
      });
      if (!this.dateRange) {
        return clonePosts;
      }

      const [startDate, endDate] = this.dateRange;
      return clonePosts.filter((post) => {
        const postDate = moment(post.created_at).startOf("day");
        return (
          postDate.isSameOrAfter(moment(startDate).startOf("day")) && postDate.isSameOrBefore(endDate)
        );
      });
    },
  },
  async created() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.userRole = decoded.user.role_id;
        console.log(this.userRole);
        await this.fetchPostsByUser(decoded.user.user_id);
      }
    }
  },
  methods: {
    ...mapActions({
      fetchPostsByUser: "modules/post/fetchPostsByUser",
      deletePost: "modules/post/deletePost",
      updatePostRange: "modules/post/updatePostRange",
    }),
    handleEdit(post) {
      this.$router.push(`/manage/posts/${post.post_id}`);
    },
    openConfigModal(record) {
      this.configModalVisible = true;
      this.modalDateRange = null;
      this.selectedTimeFrames = [];

      this.selectedPost = record;

      if (this.selectedPost.date_range && this.selectedTimeFrames) {
        const [start, end] = this.selectedPost.date_range.split(" - ");
        const startDate = moment(start, "DD/MM/YYYY").format("YYYY-MM-DD");
        const endDate = moment(end, "DD/MM/YYYY").format("YYYY-MM-DD");

        this.modalDateRange = [moment(startDate), moment(endDate)];
        this.selectedTimeFrames = this.selectedPost.time_frame;
      }
    },

    handleConfigCancel() {
      this.selectedPost = null;
      this.configModalVisible = false;
    },
    disabledDate(time) {
      let now = moment().startOf("day");
      return time.isSameOrBefore(now);
    },
    async handleDelete(post) {
      try {
        await this.deletePost(post.post_id);
        await this.fetchPostsByUser(post.user_id);
        message.success("Bài đăng đã được xóa thành công!");
      } catch (error) {
        message.error("Đã có lỗi xảy ra khi xóa bài đăng.");
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    resetFilter() {
      this.dateRange = null;
    },
    hasExpired(record) {
      let now = moment();
      return moment(record.expired_in).isBefore(now);
    },
    limitDescription(description) {
      const maxLength = 3 * 20;
      const lines = description.split("\n");
      let result = "";

      for (let i = 0; i < lines.length; i++) {
        if (result.length + lines[i].length <= maxLength) {
          result += lines[i] + "\n";
        } else {
          const remainingLength = maxLength - result.length;
          result += lines[i].substring(0, remainingLength) + "...";
          break;
        }
      }

      return result;
    },
    toggleTimeFrame(timeSlot) {
      const index = this.selectedTimeFrames.indexOf(timeSlot);
      if (index === -1) {
        this.selectedTimeFrames.push(timeSlot);
      } else {
        this.selectedTimeFrames.splice(index, 1);
      }
    },
    async handleConfigSave() {
      const startDate = moment(this.modalDateRange[0]).format("DD/MM/YYYY");
      const endDate = moment(this.modalDateRange[1]).format("DD/MM/YYYY");

      const formattedDateRange = `${startDate} - ${endDate}`;
      const postId = this.selectedPost.post_id;
      const timeFrames = this.selectedTimeFrames;
      await this.updatePostRange({
        postId,
        dateRange: formattedDateRange,
        timeFrames,
      });
      this.configModalVisible = false;
    },
  },
};
</script>

<style scoped>
.selected {
  background-color: #f0f0f0; /* Apply your desired styling */
}
</style>
