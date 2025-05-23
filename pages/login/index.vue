<template>
  <a-form-model
    :form="form"
    :layout="formLayout"
    @submit.prevent="handleLogin"
    class="max-w-md mx-auto mt-8 border p-8 bg-gray-100 rounded-lg w-full"
  >
    <p class="text-2xl font-bold">Đăng nhập</p>
    <br />
    <a-form-model-item label="Email" required>
      <a-input v-model="form.email" />
    </a-form-model-item>
    <a-form-model-item label="Mật Khẩu" required>
      <a-input-password type="password" v-model="form.password" />
    </a-form-model-item>
    <a-form-model-item>
      <a-button class="mx-auto block" html-type="submit">Đăng nhập</a-button>
    </a-form-model-item>
    <div>
      <router-link class="float-right" to="/forgot-password">
        Bạn quên mật khẩu?
      </router-link>
      <router-link to="/register"> Tạo tài khoản mới </router-link>
    </div>
  </a-form-model>
</template>

<script>
import { mapActions } from "vuex";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      formLayout: "vertical",
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions({
      login: "modules/auth/login",
    }),
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    async handleLogin() {
      try {
        if (this.form.email === "" || this.form.password === "") {
          message.warning("Vui lòng nhập đầy đủ thông tin!");
          return;
        }
        if (
          !this.isValidEmail(this.form.email) &&
          !this.form.email.includes("admin")
        ) {
          message.warning("Email không hợp lệ!");
          return;
        }
        const { message: errorMessage } = await this.login({
          email: this.form.email,
          password: this.form.password,
        });

        switch (errorMessage) {
          case "Invalid":
            message.error("Tên người dùng hoặc mật khẩu không hợp lệ");
            break;
          case "Blocked":
            message.error("Tài khoản của bạn đã bị khóa");
            break;
          case "Not Found":
            message.error("Tài khoản không tồn tại");
            break;
          default:
            this.$router.push("/");
            setTimeout(() => {
              location.reload();
            }, 10);
            break;
        }
      } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        message.error("Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại sau");
      }
    },
  },
};
</script>

<style scoped></style>
