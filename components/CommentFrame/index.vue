<template>
  <a-card class="rounded bg-gray-100 flex justify-center">
    <div class="w-[900px] max-w-screen-lg my-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="mb-4">
          <div v-if="paginatedComments.length" class="space-y-4">
            <div
              v-for="(comment, index) in paginatedComments"
              :key="index"
              class="flex items-start space-x-4 border-b border-gray-200 py-4 hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <img
                :src="comment.avatar"
                alt="Avatar"
                class="w-12 h-12 rounded-full"
              />
              <div class="flex flex-col flex-grow">
                <div class="flex justify-between">
                  <p class="font-semibold text-lg text-gray-800">
                    {{ comment.user_name }}
                  </p>
                  <p class="text-gray-400 text-sm">
                    {{ formatDate(comment.created_at) }}
                  </p>
                </div>
                <p
                  class="text-gray-600 text-lg mb-2"
                  v-html="comment.content"
                ></p>
                <div class="flex items-center mt-1">
                  <template v-for="(star, index) in Math.ceil(comment.rating)">
                    <a-icon
                      type="star"
                      theme="filled"
                      class="text-yellow-500 text-xl mr-2"
                      :key="`${comment.user}-${index}`"
                    />
                  </template>
                </div>
              </div>
              <!-- Thêm nút xóa nếu comment thuộc về người dùng hiện tại -->
              <a-popconfirm
                v-if="comment.user_id === userId"
                title="Bạn có chắc chắn muốn xóa đánh giá này không?"
                okText="Có"
                cancelText="Không"
                @confirm="handleDeleteComment(comment.comment_id)"
              >
                <button
                  class="text-red-500 hover:text-red-700"
                  title="Xóa đánh giá"
                >
                  <i
                    class="fa fa-trash text-red-500 text-lg"
                    aria-hidden="true"
                  ></i>
                </button>
              </a-popconfirm>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center">Chưa có đánh giá nào về bài đăng.</p>
        </div>
        <a-pagination
          v-if="totalComments > 0"
          :total="totalComments"
          :page-size="pageSize"
          @change="handlePageChange"
          class="mb-4 flex justify-end"
        />

        <!-- If user is not logged in, show login prompt -->
        <div v-if="!userId" class="mt-4 text-center">
          <p class="text-gray-500">Bạn cần đăng nhập để đánh giá.</p>
          <a-button @click="redirectToLogin">Đăng nhập</a-button>
        </div>

        <!-- If user is logged in, show comment input -->
        <div v-else class="mt-4">
          <h3 class="text-lg font-semibold mb-2 text-center">
            Thêm đánh giá mới
          </h3>
          <div class="text-center text-lg">
            <a-rate v-model="newRating" class="mb-3 text-3xl" />
          </div>
          <a-textarea
            v-model="newCommentText"
            placeholder="Nhập đánh giá của bạn..."
            :auto-size="{ minRows: 3, maxRows: 5 }"
            class="mb-2 mx-auto border border-gray-300 rounded-md p-2 w-full"
          />
          <br />
          <br />
          <a-button @click="addComment" class="mx-auto block"
            >Gửi đánh giá</a-button
          >
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { message } from "ant-design-vue";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";
import moment from "moment";

export default {
  computed: {
    ...mapState({
      comments: (state) => state.modules["comment"].comments,
      post: (state) => state.modules["post-detail"].post,
    }),
    paginatedComments() {
      let cloneComments = _.cloneDeep(this.comments);
      const sortedComments = cloneComments.sort((a, b) => {
        if (a.user_id === this.userId) return -1;
        if (b.user_id === this.userId) return 1;
        return 0;
      });
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return sortedComments.slice(startIndex, endIndex);
    },
    totalComments() {
      return this.comments.length;
    },
  },
  data() {
    return {
      newCommentText: "",
      newRating: 0,
      currentPage: 1,
      pageSize: 3,
      userId: null,
    };
  },
  methods: {
    ...mapActions({
      getCommentsByPostId: "modules/comment/getCommentsByPostId",
      createComment: "modules/comment/createComment",
      deleteComment: "modules/comment/deleteComment",
      fetchPostById: "modules/post-detail/fetchPostById",
    }),
    async addComment() {
      if (this.newRating === 0 || this.newCommentText.trim() === "") {
        message.error("Xin hãy đánh giá và bình luận trước khi gửi.");
        return;
      }

      let formattedComment = this.newCommentText.replace(/\n/g, "<br>");

      const payload = {
        user_id: this.userId,
        post_id: this.post.post_id,
        content: formattedComment,
        rating: this.newRating,
      };
      try {
        await this.createComment(payload);
        this.newCommentText = "";
        this.newRating = 0;
        await this.getCommentsByPostId(this.post.post_id);
        message.success("Thêm đánh giá thành công");
      } catch (error) {
        console.error("Error creating comment", error);
        message.error("Thêm đánh giá thất bại");
      }
    },
    async handleDeleteComment(commentId) {
      try {
        console.log(commentId);
        await this.deleteComment(commentId);
        await this.getCommentsByPostId(this.post.post_id);
        message.success("Xóa đánh giá thành công");
      } catch (error) {
        console.error("Error deleting comment", error);
        message.error("Xóa đánh giá thất bại");
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.getCommentsByPostId(this.post.post_id);
    },
    redirectToLogin() {
      this.$router.push({ name: "login" });
    },
    formatDate(timestamp) {
      return moment(timestamp).format("llll");
    },
  },
  async mounted() {
    const postId = this.$route.params.id;
    await this.fetchPostById(postId);
    await this.getCommentsByPostId(this.post.post_id);
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.userId = decoded.user.user_id;
      }
    }
  },
};
</script>

<style scoped>
/* Add custom scoped styles if needed */
</style>
