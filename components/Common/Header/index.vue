<template>
  <header class="w-full py-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/">
          <img :src="appLogo" alt="Logo" class="h-20 w-50" />
        </router-link>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-2xl text-gray-700 font-bold animate-pulse">
          Chào mừng bạn đến với nền tảng
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <router-link
          to="/saved-post"
          class="text-base btn hover:underline text-black"
        >
          <i class="fa fa-heart text-red-600" aria-hidden="true"></i> Yêu thích
        </router-link>
        <router-link
          v-if="!accessToken"
          to="/register"
          class="text-base btn hover:underline text-black"
        >
          <i class="fa fa-sign-in" aria-hidden="true"></i> Đăng ký
        </router-link>
        <router-link
          v-if="!accessToken"
          to="/login"
          class="text-base btn hover:underline text-black"
        >
          <i class="fa fa-user-plus" aria-hidden="true"></i> Đăng nhập
        </router-link>
        <div v-if="accessToken" class="flex items-center space-x-4">
          <div class="grid grid-cols-1 gap-2">
            <span class="ml-2">Xin chào, {{ user.userName }}</span>
            <span class="ml-2">Tài khoản: {{ formattedCurrenct }}</span>
          </div>

          <a-dropdown>
            <a-avatar
              v-if="user.avatar"
              :src="user.avatar"
              :size="48"
              style="cursor: pointer"
            />
            <a-avatar
              icon="user"
              v-else
              :size="50"
              class="cursor-pointer mb-2"
            />
            <a-menu slot="overlay">
              <a-menu-item key="manage">
                <router-link to="/manage">
                  <i class="fa fa-address-card" aria-hidden="true"></i>
                  Trang quản lý</router-link
                >
              </a-menu-item>
              <a-menu-item key="logout" @click="handleLogout">
                <i class="fa fa-sign-out" aria-hidden="true"></i> Đăng
                xuất</a-menu-item
              >
            </a-menu>
          </a-dropdown>
        </div>
        <router-link
          :to="hasToken() ? 'manage/new-post' : '/login'"
          class="btn text-white bg-custom-pink border rounded border-solid border-gray-300 px-6 py-2 hover:underline hover:text-white"
        >
          Đăng tin mới <i class="fa fa-plus-circle" aria-hidden="true"></i>
        </router-link>
      </div>
    </div>

    <br />
    <nav
      v-bind:class="{ 'fixed top-0 z-50': isNavFixed }"
      class="bg-custom-blue mx-auto py-2 w-full text-white"
    >
      <ul class="flex justify-center space-x-4">
        <li>
          <router-link
            to="/"
            class="nav-link"
            @click="setActive('')"
            :class="{ active: activeLink === 'home' }"
            >Trang chủ</router-link
          >
        </li>
        <li>
          <router-link
            to="/home"
            class="nav-link"
            @click="setActive('home')"
            :class="{ active: activeLink === 'home' }"
            >Tìm kiếm</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ path: '/search', query: { postType: 1 } }"
            class="nav-link"
            @click="setActive('phongtro')"
            :class="{ active: activeLink === 'phongtro' }"
          >
            Cho thuê
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ path: '/search', query: { postType: 2 } }"
            class="nav-link"
            @click="setActive('timoghep')"
            :class="{ active: activeLink === 'timoghep' }"
          >
            Tìm ở ghép
          </router-link>
        </li>
        <li>
          <router-link
            to="/services"
            class="nav-link"
            @click="setActive('dichvu')"
            :class="{ active: activeLink === 'dichvu' }"
            >Bảng giá dịch vụ</router-link
          >
        </li>
        <li>
          <router-link
            to="/contact"
            class="nav-link"
            @click="setActive('dichvu')"
            :class="{ active: activeLink === 'dichvu' }"
            >Liên hệ</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import appLogo from "../../../static/app-logo.png";
import { jwtDecode } from "jwt-decode";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      activeLink: null,
      appLogo,
      accessToken: null,
      user: {
        userName: null,
        avatar: null,
        balance: null,
      },
      isNavFixed: false,
    };
  },
  created() {
    if (process.browser) {
      this.accessToken = localStorage.getItem("accessToken");
      if (this.accessToken) {
        const decoded = jwtDecode(this.accessToken);
        this.user.userName = decoded.user.user_name;
        this.user.balance = decoded.user.balance;
        this.user.avatar = decoded.user.avatar;
      }
    }
  },
  computed: {
    formattedCurrenct() {
      if (this.user.balance !== null) {
        return this.user.balance.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions({
      logout: "modules/auth/logout",
    }),
    hasToken() {
      return localStorage.getItem("accessToken") !== null;
    },
    async handleLogout() {
      await this.logout();
      this.$router.push("/");
      setTimeout(() => {
        location.reload();
      }, 10);
    },
    handleScroll() {
      const header = document.querySelector(".container");
      const nav = document.querySelector("nav");

      if (header.getBoundingClientRect().bottom <= nav.offsetHeight) {
        this.isNavFixed = true;
      } else {
        this.isNavFixed = false;
      }
    },
    setActive(link) {
      this.activeLink = link;
    },
  },
};
</script>

<style>
.nav-link.active::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #fff;
}

.nav-link {
  transition: background-color 0.3s, color 0.3s, padding 0.3s;
}

.nav-link:hover {
  color: white;
  background-color: #f24b5a;
  padding-top: 14px;
  padding-bottom: 8px;
}

.nav-link.active {
  background-color: #f24b5a;
  padding-top: 14px;
  padding-bottom: 8px;
}
</style>
