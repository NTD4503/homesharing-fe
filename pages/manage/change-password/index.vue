<template>
  <div class="flex justify-center items-center">
    <div class="change-password-container border rounded-lg p-8 w-1/2">
      <h2 class="change-password-title">Đổi mật khẩu</h2>
      <a-input-password
        v-model="password"
        type="password"
        placeholder="Mật khẩu mới"
        class="mb-4 w-1/3"
      />
      <br />
      <a-input-password
        v-model="confirmPassword"
        type="password"
        placeholder="Nhập lại mật khẩu mới"
        class="mb-4 w-1/3"
      />
      <br />
      <a-button @click="updatePassword" class=""
        >Đổi mật khẩu</a-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { message } from "ant-design-vue";
import { jwtDecode } from "jwt-decode";

export default {
  layout: "manage",
  data() {
    return {
      password: "",
      confirmPassword: "",
      userId: null,
    };
  },

  computed: {
    ...mapState({}),
  },
  mounted() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.userId = decoded.user.user_id;
      }
    }
  },
  methods: {
    ...mapActions({
      updateUserPassword: "modules/user/updateUserPassword",
    }),
    async updatePassword() {
      if (this.password !== this.confirmPassword) {
        message.error("Mật khẩu nhập lại không khớp!");
        return;
      }

      if (!this.password || !this.confirmPassword) {
        message.error("Vui lòng nhập mật khẩu!");
        return;
      }

      const userData = {
        user_id: this.userId,
        password: this.password,
      };

      await this.updateUserPassword(userData)
        .then(() => {
          message.success("Đổi mật khẩu thành công");
          this.$router.push("edit-profile");
        })
        .catch((error) => {
          message.error("Đổi mật khẩu không thành công!");
        });
    },
  },
};
</script>

<style scoped>
.change-password-container {
  text-align: center;
}

.change-password-title {
  margin-bottom: 20px;
}
</style>
