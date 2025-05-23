<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-center text-3xl font-bold mb-8 text-gray-800">
      Trang quản lý dành cho quản trị viên
    </h1>
    <nav class="flex justify-center">
      <ul
        class="w-full max-w-md bg-white rounded-lg shadow-lg divide-y divide-gray-200"
      >
        <li class="p-4">
          <router-link
            to="/admin/post-management"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i class="fa fa-file-text-o mr-2"></i> Quản lý tin đăng
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/admin/user-management"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i class="fa fa-users mr-2"></i> Quản lý người dùng
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/admin/revenue-stats"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i class="fa fa-exchange mr-2" aria-hidden="true"></i> Quản lý giao
            dịch
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/admin/service-conf"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i class="fa fa-cog mr-2"></i> Cấu hình dịch vụ
          </router-link>
        </li>
        <li class="p-4">
          <router-link
            to="/admin/user-contacts"
            class="text-base font-medium text-gray-700 py-2 px-4 block hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i class="fa fa-address-book mr-2"></i> Liên hệ từ người dùng
          </router-link>
        </li>
        <li class="p-4">
          <span
            @click="handleLogout"
            class="text-red-500 hover:text-red-700 cursor-pointer text-base font-medium py-2 px-4 block hover:bg-gray-100 rounded-lg flex items-center"
          >
            <i class="fa fa-sign-out mr-2"></i> Thoát
          </span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  layout: "admin",
  methods: {
    ...mapActions({
      logout: "modules/auth/logout",
    }),
    async handleLogout() {
      await this.logout();
      this.$router.push("/login");
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
