<template>
  <a-form-model
    :form="form"
    :layout="formLayout"
    @submit.prevent="handleSubmit"
    class="max-w-md mx-auto mt-8 border p-8 rounded-lg w-full bg-gray-100"
  >
    <p class="text-2xl font-bold">Lấy lại mật khẩu</p>
    <br />
    <a-form-model-item label="Email" required>
      <a-input v-model="form.email" />
    </a-form-model-item>

    <a-form-model-item>
      <a-button :loading="loading" class="mx-auto block" html-type="submit"
        >Tiếp tục <i class="fa fa-arrow-right ml-2" aria-hidden="true"></i>
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      formLayout: "vertical",
      form: {
        email: null,
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
    ...mapMutations({}),
    ...mapActions({
      sendOTP: "modules/auth/sendOTP",
      fetchAllRoles: "modules/user/fetchAllRoles",
      fetchUserByEmail: "modules/user/fetchUserByEmail",
    }),
    async handleSubmit() {
      this.loading = true;
      if (!this.form.email) {
        message.error("Vui lòng nhập email.");
        this.loading = false;
        return;
      }
      let res = await this.fetchUserByEmail(this.form.email);
      if (res.message && res.message === "User not found") {
        message.error("Người dùng không tồn tại!");
        this.loading = false;
        return;
      }
      let typeCheck = "forgot";
      await this.sendOTP({ email: this.form.email, type_check: typeCheck });
      this.$router.push({
        path: "/verify-email",
        query: { verify_type: "forgot-password" },
      });
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
