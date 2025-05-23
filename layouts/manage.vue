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
        <a-avatar style="margin-right: 20px" icon="user" v-else :size="60" />
        <div>
          <div class="font-bold">{{ user.name }}</div>
          <div>SĐT : {{ user.phone }}</div>
          <div>Tài khoản: {{ formattedCurrenct }}</div>
        </div>
      </div>
      <!-- Sidebar Menu -->
      <nav>
        <ul class="space-y-2">
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/manage' }"
              :class="{ 'text-blue-500': $route.path === '/manage' }"
              ><i class="fa fa-home" aria-hidden="true"></i> Trang quản
              lý</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/manage/posts' }"
              :class="{ 'text-blue-500': $route.path === '/manage/posts' }"
              ><i class="fa fa-file-text-o mr-2"></i>Quản lý tin
              đăng</router-link
            >
          </li>
          <li
            v-if="user.roleId !== 3"
            class="border-b border-dashed border-gray-300"
          >
            <router-link
              :to="{ path: '/manage/viewing-requests' }"
              :class="{
                'text-blue-500': $route.path === '/manage/viewing-requests',
              }"
              ><i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Quản lý
              lịch hẹn xem phòng</router-link
            >
          </li>
          <li
            v-if="user.roleId !== 2"
            class="border-b border-dashed border-gray-300"
          >
            <router-link
              :to="{ path: '/manage/sent-requests' }"
              :class="{
                'text-blue-500': $route.path === '/manage/sent-requests',
              }"
              ><i class="fa fa-clock-o mr-2" aria-hidden="true"></i>Yêu cầu xem
              phòng</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/manage/edit-profile' }"
              :class="{
                'text-blue-500': $route.path === '/manage/edit-profile',
              }"
              ><i class="fa fa-user mr-2"></i>Sửa thông tin cá nhân</router-link
            >
          </li>
          <li
            v-if="user.roleId !== 3"
            class="border-b border-dashed border-gray-300"
          >
            <router-link
              :to="{ path: '/manage/deposit' }"
              :class="{ 'text-blue-500': $route.path === '/manage/deposit' }"
              ><i class="fa fa-money mr-2"></i>Nạp tiền vào tài
              khoản</router-link
            >
          </li>
          <li
            v-if="user.roleId !== 3"
            class="border-b border-dashed border-gray-300"
          >
            <router-link
              :to="{ path: '/manage/payment-history' }"
              :class="{
                'text-blue-500': $route.path === '/manage/payment-history',
              }"
              ><i class="fa fa-history mr-2"></i>Lịch sử nạp tiền</router-link
            >
          </li>
          <li
            v-if="user.roleId !== 3"
            class="border-b border-dashed border-gray-300"
          >
            <router-link
              :to="{ path: '/manage/pricing' }"
              :class="{ 'text-blue-500': $route.path === '/manage/pricing' }"
              ><i class="fa fa-registered mr-2"></i>Đăng ký dịch vụ</router-link
            >
          </li>
          <li
            v-if="user.roleId !== 3"
            class="border-b border-dashed border-gray-300"
          >
            <router-link
              :to="{ path: '/manage/pricing-history' }"
              :class="{
                'text-blue-500': $route.path === '/manage/pricing-history',
              }"
              ><i class="fa fa-history mr-2"></i>Lịch sử đăng ký dịch
              vụ</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <router-link
              :to="{ path: '/contact' }"
              :class="{ 'text-blue-500': $route.path === '/manage/contact' }"
              ><i class="fa fa-phone mr-2"></i>Liên hệ</router-link
            >
          </li>
          <li class="border-b border-dashed border-gray-300">
            <a
              @click="handleLogout"
              class="text-red-500 hover:text-red-700 cursor-pointer"
              ><i class="fa fa-sign-out mr-2"></i>Thoát</a
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
        roleId: null,
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
          roleId: decoded.user.role_id,
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
