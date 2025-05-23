<template>
  <div class="w-1/4 change-password-container bg-gray-100 p-8 rounded-lg">
    <h2 class="change-password-title text-xl font-bold mb-4">Mật khẩu mới</h2>
    <a-input-password
      v-model="password"
      type="password"
      placeholder="Mật khẩu mới"
      class="mb-4"
    />
    <br />
    <a-input-password
      v-model="confirmPassword"
      type="password"
      placeholder="Nhập lại mật khẩu"
      class="mb-4"
    />
    <br />
    <a-button @click="updatePassword" class="w-1/2 mx-auto">
      Đặt lại mật khẩu
    </a-button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      password: "",
      confirmPassword: "",
      userId: null,
    };
  },

  computed: {
    ...mapState({
      forgotPassUser: (state) => state.modules["user"].forgotPassUser,
    }),
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
        message.error("Vui lòng nhập đầy đủ mật khẩu!");
        return;
      }

      if (!this.forgotPassUser) {
        message.error("Đã có lỗi xảy ra khi đặt lại mật khẩu!");
        return;
      }

      const userData = {
        user_id: this.forgotPassUser.user_id,
        password: this.password,
      };

      await this.updateUserPassword(userData)
        .then(() => {
          sessionStorage.removeItem("otpVerified");
          message.success("Đặt lại mật khẩu thành công!");
          this.$router.push("/login");
        })
        .catch(() => {
          message.error("Đặt lại mật khẩu không thành công!");
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
