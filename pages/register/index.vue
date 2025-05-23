<template>
  <a-form-model
    :form="form"
    :layout="formLayout"
    @submit.prevent="handleSubmit"
    class="max-w-md mx-auto mt-8 border p-8 bg-gray-100 rounded-lg w-full"
  >
    <p class="text-2xl font-bold">Tạo tài khoản mới</p>
    <br />
    <a-form-model-item label="Họ Tên" required>
      <a-input v-model="form.userName" />
    </a-form-model-item>
    <a-form-model-item label="Email" required>
      <a-input v-model="form.email" />
    </a-form-model-item>
    <a-form-model-item label="Số Điện Thoại" required>
      <a-input v-model="form.phone" />
    </a-form-model-item>
    <a-form-model-item label="Mật Khẩu" required>
      <a-input-password type="password" v-model="form.password" />
    </a-form-model-item>
    <a-form-model-item label="Loại Tài Khoản">
      <a-radio-group v-model="form.roleId">
        <a-radio
          v-for="role in roles"
          :value="role.role_id"
          :key="role.role_id"
        >
          {{
            role.role_name === "tenant"
              ? "Người thuê"
              : role.role_name === "landlord"
              ? "Cho thuê"
              : role.role_name
          }}
        </a-radio>
      </a-radio-group>
    </a-form-model-item>

    <a-form-model-item>
      <a-button :loading="loading" class="mx-auto block" html-type="submit"
        >Tạo Tài Khoản</a-button
      >
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      formLayout: "vertical",
      form: {
        userName: "",
        phone: "",
        email: "",
        password: "",
        roleId: 2,
      },
      loading: false,
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.modules["user"].roles,
    }),
  },
  async created() {
    await this.fetchAllRoles();
  },
  methods: {
    ...mapMutations({
      SET_USER_TEMP: "modules/auth/SET_USER_TEMP",
    }),
    ...mapActions({
      sendOTP: "modules/auth/sendOTP",
      fetchAllRoles: "modules/user/fetchAllRoles",
    }),
    validateInputs() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,11}$/; // Adjust according to phone format
      const passwordRegex = /^[A-Za-z0-9]{6,}$/; // Adjust based on password policy
      const nameRegex = /^[\p{L}a-zA-Z\s]+$/u; // Unicode-alphabetic characters, including space

      if (!this.form.userName.match(nameRegex)) {
        message.error("Họ Tên không hợp lệ, vui lòng nhập lại!");
        return false;
      }
      if (!this.form.email.match(emailRegex)) {
        message.error("Email không hợp lệ, vui lòng nhập lại!");
        return false;
      }
      if (!this.form.phone.match(phoneRegex)) {
        message.error("Số Điện Thoại không hợp lệ, vui lòng nhập lại!");
        return false;
      }
      if (!this.form.password.match(passwordRegex)) {
        message.error("Mật Khẩu không hợp lệ, vui lòng nhập lại!");
        return false;
      }
      return true;
    },
    async handleSubmit() {
      this.loading = true;
      if (
        !this.form.userName ||
        !this.form.email ||
        !this.form.phone ||
        !this.form.password
      ) {
        message.error("Vui lòng điền đầy đủ thông tin!");
        this.loading = false;
        return;
      }

      // Perform regex validation
      if (!this.validateInputs()) {
        this.loading = false;
        return;
      }

      let typeCheck = "register";

      let res = await this.sendOTP({
        email: this.form.email,
        type_check: typeCheck,
      });
      if (res.message) {
        message.error("Email đã được sử dụng,vui lòng sử dụng email khác!");
      } else {
        this.SET_USER_TEMP(this.form);
        this.$router.push("/verify-email");
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
