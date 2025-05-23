<template>
  <div class="grid grid-cols-5 h-screen text-lg">
    <!-- Sidebar -->
    <div class="col-span-1 bg-gray-200 p-6">
      <!-- User Info -->
      <div class="flex items-center mb-6">
        <a-avatar
          :src="user.avatar"
          v-if="user.avatar"
          :size="60"
          :class="{ 'border-blue-500': user.avatar }"
          :style="{
            'border-width': user.avatar ? '2px' : '0',
            'margin-right': '20px',
          }"
        />
        <a-avatar icon="user" v-else :size="60" />
        <div>
          <div class="font-bold">{{ user.name }}</div>
        </div>
      </div>
      <!-- Sidebar Menu -->
      <nav>
        <ul class="space-y-2">
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/admin' }"
              :class="{ 'text-blue-500': $route.path === '/admin' }"
              ><i class="fa fa-home" aria-hidden="true"></i> Trang quản
              lý</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/admin/post-management' }"
              :class="{
                'text-blue-500': $route.path === '/admin/post-management',
              }"
              ><i class="fa fa-file-text-o mr-2"></i>Quản lý tin
              đăng</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/admin/user-management' }"
              :class="{
                'text-blue-500': $route.path === '/admin/user-management',
              }"
              ><i class="fa fa-users mr-2" aria-hidden="true"></i> Quản lý người
              dùng</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/admin/revenue-stats' }"
              :class="{
                'text-blue-500': $route.path === '/admin/revenue-stats',
              }"
              ><i class="fa fa-exchange mr-2" aria-hidden="true"></i> Quản lý
              giao dịch</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/admin/service-conf' }"
              :class="{
                'text-blue-500': $route.path === '/admin/service-conf',
              }"
              ><i class="fa fa-cog mr-2" aria-hidden="true"></i> Cấu hình dịch
              vụ</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/admin/user-contacts' }"
              :class="{
                'text-blue-500': $route.path === '/admin/user-contacts',
              }"
              ><i class="fa fa-address-book mr-2" aria-hidden="true"></i> Liên
              hệ từ người dùng</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <span
              @click="handleLogout"
              class="text-red-500 hover:text-red-700 cursor-pointer"
              ><i class="fa fa-sign-out mr-2"></i>Thoát</span
            >
          </li>
        </ul>
      </nav>
    </div>
    <div class="col-span-4 p-6">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      user: {
        name: null,
        phone: null,
        balance: null,
        avatar: null,
      },
    };
  },
  async created() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.user = {
          name: decoded.user.user_name,
          phone: decoded.user.phone,
          balance: decoded.user.balance,
          avatar: decoded.user.avatar,
        };
      }
    }
  },
  computed: {
    ...mapState({}),
    formattedCurrenct() {
      if (this.user.balance != null) {
        return this.user.balance.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      }
    },
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

<style scoped></style>
