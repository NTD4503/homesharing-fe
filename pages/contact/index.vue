<template>
  <div class="flex justify-center py-12">
    <div class="w-full rounded-lg bg-gray-100 shadow-xl p-8 flex gap-8">
      <!-- Thông tin liên hệ -->
      <div class="w-1/2 p-8 bg-blue-100 rounded-lg relative">
        <div
          class="absolute inset-0 bg-cover bg-center z-0 rounded"
          style="
            background-image: url('https://okyagency.com/wp-content/uploads/2021/07/banner-lien-he-oky-agency.jpg');
            opacity: 0.6;
          "
        ></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-bold mb-4">Thông tin liên hệ</h2>
          <p class="text-lg text-gray-800 mb-4">
            Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào:
          </p>
          <ul class="mt-4 text-lg">
            <li class="mb-2">
              <span class="font-semibold">Họ và tên:</span> Nguyễn Tiến Đạt
            </li>
            <li class="mb-2">
              <span class="font-semibold">Số điện thoại:</span> 0123 456 789
            </li>
            <li class="mb-2">
              <span class="font-semibold">Email:</span> supporter@rental.com
            </li>
            <li>
              <span class="font-semibold">Địa chỉ:</span> Giải Phóng,Thanh
              Xuân,Hà Nội.
            </li>
          </ul>
        </div>
      </div>

      <!-- Form liên hệ -->
      <div class="w-1/2 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-center">
          Liên hệ với chúng tôi
        </h2>
        <a-form :form="form" @submit.prevent="handleSubmit">
          <a-form-item label="Họ và tên" required>
            <a-input v-model:value="form.fullName" />
          </a-form-item>
          <a-form-item label="Email" required>
            <a-input v-model:value="form.email" />
          </a-form-item>
          <a-form-item label="Số điện thoại" required>
            <a-input v-model:value="form.phone" />
          </a-form-item>
          <a-form-item label="Nội dung" required>
            <a-textarea v-model:value="form.message" :rows="3" :max-rows="6" />
          </a-form-item>
          <a-form-item class="text-center">
            <a-button :loading="loading" html-type="submit"
              ><i class="fa fa-paper-plane mr-2" aria-hidden="true"></i>
              Gửi</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { message as antMessage } from "ant-design-vue";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      form: {
        fullName: null,
        phone: null,
        email: null,
        message: null,
      },
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      createContact: "modules/contact/createContact",
    }),
    async handleSubmit() {
      let { form } = this;
      this.loading = true;
      if (!form.email || !form.fullName || !form.phone || !form.message) {
        antMessage.error("Vui lòng nhập đầy đủ thông tin");
        this.loading = false;
      } else {
        await this.createContact(form);
        antMessage.success("Gửi liên hệ thành công!");
        this.resetForm();
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        fullName: null,
        phone: null,
        email: null,
        message: null,
      };
    },
  },
};
</script>

<style scoped>
/* Tailwind CSS classes can be used directly */
</style>
