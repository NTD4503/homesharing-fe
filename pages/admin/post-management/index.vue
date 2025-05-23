<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mb-4">Quản lý bài đăng</h1>
    <br />
    <span class="text-xl font-semibold mb-2 mr-2">Bộ lọc</span>

    <a-space class="mb-4">
      <a-range-picker
        v-model="dateRange"
        @change="handleDateFilter"
        :placeholder="['Từ ngày', 'Đến ngày']"
        format="DD-MM-YYYY"
        class="mr-2"
      />
    </a-space>

    <a-button @click="resetFilter">
      <i class="fa fa-refresh mr-2" aria-hidden="true"></i> Đặt lại</a-button
    >
    <br />

    <div class="text-center">
      <span class="text-xl">Số bài đăng: {{ filteredPosts.length }}</span>
    </div>
    <br />

    <a-table
      :columns="columns"
      :data-source="filteredPosts"
      :pagination="pagination"
      bordered
      class="w-full"
    >
      <template slot="index" slot-scope="text, record, index">{{
        index + 1
      }}</template>
      <template slot-scope="text" slot="is_approved">
        <a-tag :color="text ? 'green' : 'red'">
          {{ text ? "Đã duyệt" : "Chưa duyệt" }}
        </a-tag>
      </template>
      <template slot-scope="text" slot="is_blocked">
        <a-tag :color="!text ? 'green' : 'red'">
          {{ !text ? "Hoạt động" : "Bị chặn" }}
        </a-tag>
      </template>
      <template slot="viewPost" slot-scope="text, record">
        <a
          :href="`/admin/preview-posts/${record.post_id}`"
          target="_blank"
          class="text-blue-500 hover:underline"
          ><i class="fa fa-eye mr-2"></i> Xem bài đăng</a
        >
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
          <a-avatar icon="user" v-else :size="50" class="cursor-pointer mb-2" />
          <br />
          <span>{{ record.user_name }}</span>
        </div>
      </template>
      <template slot="created_at" slot-scope="text"
        >{{ formatDate(text) }}
      </template>
      <template slot="expired_in" slot-scope="text, record"
        >{{ formatDate(text) }}
        <a-tag v-if="record.is_approved && !record.available" color="red">
          Hết hạn
        </a-tag>
      </template>
      <template slot="post_title" slot-scope="text">{{
        limitText(text)
      }}</template>
      <template slot-scope="text, record" slot="actions">
        <a-button
          v-if="!record.is_approved"
          class="mr-2 bg-blue-400 text-white"
          @click="updateApprovedStatus(record)"
        >
          <i class="fa fa-check mr-1"></i> Duyệt
        </a-button>
        <a-button
          class="bg-red-400 text-white"
          :disabled="!record.is_approved"
          @click="updateBlockedStatus(record)"
        >
          <i
            :class="{
              'fa fa-ban mr-1': !record.is_blocked,
              'fa fa-unlock mr-1': record.is_blocked,
            }"
          ></i>
          {{ !record.is_blocked ? "Chặn" : "Bỏ chặn" }}
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { columns, pagination } from "./const";
import _ from "lodash";
import moment from "moment";
import { message } from "ant-design-vue";

export default {
  layout: "admin",
  data() {
    return {
      columns,
      pagination,
      dateRange: null,
    };
  },
  computed: {
    ...mapState({
      allPostsForAdmin: (state) => state.modules["post"].allPostsForAdmin,
      postTypes: (state) => state.modules["post"].postTypes,
      roomTypes: (state) => state.modules["post"].roomTypes,
    }),
    filteredPosts() {
      let clonePosts = _.cloneDeep(this.allPostsForAdmin);
      // clonePosts.sort((a, b) => {
      //   if (a.is_approved === b.is_approved) {
      //     return 0;
      //   } else if (a.is_approved && !b.is_approved) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // });
      if (!this.dateRange || this.dateRange.length === 0) {
        return clonePosts;
      }

      const [startDate, endDate] = this.dateRange;
      return clonePosts.filter((post) => {
        const postDate = moment(post.created_at).startOf("day");
        return (
          postDate.isSameOrAfter(moment(startDate).startOf("day")) &&
          postDate.isSameOrBefore(endDate)
        );
      });
    },
  },
  async created() {
    await Promise.all([
      this.fetchAllPostsForAdmin(),
      this.fetchPostTypes(),
      this.fetchRoomTypes(),
    ]);

    this.columns = this.columns.map((column) => {
      if (column.dataIndex === "post_type_name") {
        return {
          ...column,
          filters: this.postTypes.map((type) => ({
            text: type.post_type_name,
            value: type.post_type_name,
          })),
        };
      }
      if (column.dataIndex === "room_type_name") {
        return {
          ...column,
          filters: this.roomTypes.map((type) => ({
            text: type.room_type_name,
            value: type.room_type_name,
          })),
        };
      }
      return column;
    });
  },
  methods: {
    ...mapActions({
      fetchAllPostsForAdmin: "modules/post/fetchAllPostsForAdmin",
      updatePostApprovedStatus: "modules/post/updatePostApprovedStatus",
      updatePostBlockedStatus: "modules/post/updatePostBlockedStatus",
      fetchPostTypes: "modules/post/fetchPostTypes",
      fetchRoomTypes: "modules/post/fetchRoomTypes",
    }),
    formatDate(date) {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }
    },
    async updateApprovedStatus(post) {
      let payload = {
        post_id: post.post_id,
        is_approved: true,
      };
      await this.updatePostApprovedStatus(payload);
      await this.fetchAllPostsForAdmin();
    },
    async updateBlockedStatus(post) {
      if (this.hasExpired(post)) {
        message.warning("Không thể chặn bài đăng đã hết hạn!");
        return;
      }
      let payload = {
        post_id: post.post_id,
        is_blocked: !post.is_blocked,
      };
      await this.updatePostBlockedStatus(payload);
      await this.fetchAllPostsForAdmin();
    },
    hasExpired(record) {
      let now = moment();
      return moment(record.expired_in).isBefore(now);
    },
    handleDateFilter() {
      // Xử lý khi người dùng thay đổi khoảng thời gian trên bộ lọc ngày
      // Nếu bạn muốn thực hiện thêm các hành động khác khi thay đổi bộ lọc, bạn có thể thêm vào đây.
    },
    limitText(text) {
      const maxLength = 3 * 20;
      const lines = text.split("\n");
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
    resetFilter() {
      this.dateRange = null;
    },
  },
};
</script>

<style scoped></style>
