<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-center text-3xl font-bold mb-8 text-gray-800">
      Trang quản lý
    </h1>
    <nav class="flex justify-center">
      <ul
        class="w-full max-w-md bg-white rounded-lg shadow-lg divide-y divide-gray-200"
      >
        <li class="p-4">
          <router-link
            to="/manage/new-post"
            class="btn bg-custom-pink border rounded border-solid border-gray-300 px-6 py-2 hover:underline hover:text-white flex justify-between items-center"
          >
            <span class="text-white">Đăng tin mới</span>
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-home mr-2" aria-hidden="true"></i>
            Trang chủ
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/manage/posts"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-file-text-o mr-2"></i> Quản lý tin đăng
          </router-link>
        </li>
        <li class="p-4" v-if="roleId !== 3">
          <router-link
            to="/manage/viewing-requests"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Quản lý lịch
            hẹn xem phòng
          </router-link>
        </li>
        <li v-if="roleId !== 2" class="p-4">
          <router-link
            to="/manage/sent-requests"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Yêu cầu xem
            phòng
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/manage/edit-profile"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-user mr-2"></i> Sửa thông tin cá nhân
          </router-link>
        </li>
        <li v-if="roleId !== 3" class="p-4">
          <router-link
            to="/manage/deposit"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-money mr-2"></i> Nạp tiền vào tài khoản
          </router-link>
        </li>
        <li v-if="roleId !== 3" class="p-4">
          <router-link
            to="/manage/payment-history"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-history mr-2"></i> Lịch sử thanh toán
          </router-link>
        </li>
        <li v-if="roleId !== 3" class="p-4">
          <router-link
            to="/manage/pricing"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-registered mr-2"></i> Đăng ký dịch vụ
          </router-link>
        </li>
        <li v-if="roleId !== 3" class="p-4">
          <router-link
            to="/manage/pricing-history"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-history mr-2"></i> Lịch sử đăng ký dịch vụ
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/contact"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg"
          >
            <i class="fa fa-phone mr-2"></i> Liên hệ
          </router-link>
        </li>
        <li
          @click="handleLogout"
          class="ml-3 cursor-pointer text-red-500 hover:text-red-700 text-lg font-medium py-2 px-4 block hover:bg-gray-100 rounded-lg"
        >
          <i class="fa fa-sign-out mr-2"></i> Thoát
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import { mapActions, mapState } from "vuex";

export default {
  layout: "manage",
  data() {
    return {
      roleId: null,
    };
  },
  mounted() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.roleId = decoded.user.role_id;
      }
    }
  },
  methods: {
    ...mapActions({
      logout: "modules/auth/logout",
    }),
    async handleLogout() {
      await this.logout();
      this.$router.push("/");
      setTimeout(() => {
        location.reload();
      }, 10);
    },
  },
};
</script>

<style scoped>
.space-y-2 > ul > li > a:hover {
  @apply bg-gray-100 text-gray-900;
}
</style>
