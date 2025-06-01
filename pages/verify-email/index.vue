<template>
  <div class="overlay">
  <div
    class="w-1/3 h-[300px] p-8 rounded border bg-gray-100 verify-otp flex flex-col items-center justify-center"
  >
    <h1 class="text-center text-2xl font-bold">Xác nhận OTP</h1>
    <div class="rounded-md p-6 w-full max-w-md">
      <label class="text-gray-700" for="otp-input">Mã OTP:</label>
      <br />
      <a-input
        v-model="userOTP"
        id="otp-input"
        placeholder="Nhập mã OTP"
        class="mb-4 w-full"
      />
      <p v-if="otpError" class="text-red-500 text-sm mt-1">{{ otpError }}</p>
      <div class="flex justify-between">
        <a-button @click="submitOTP" class="w-1/2 mr-2"> Xác nhận </a-button>
        <a-button type="default" class="w-3/4 ml-2" @click="resendOTP">
          <span class="text-blue-500" v-if="resendDisabled"
            >Gửi lại OTP sau {{ countdown }} giây</span
          >
          <span v-else>Gửi lại OTP</span>
        </a-button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { Input, Button, message } from "ant-design-vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    "a-input": Input,
    "a-button": Button,
  },
  data() {
    return {
      userOTP: "",
      resendDisabled: true,
      countdown: 60,
      timer: null,
      otpError: "",
    };
  },
  computed: {
    ...mapState({
      userTemp: (state) => state.modules["auth"].userTemp,
      user: (state) => state.modules["auth"].user,
      genedOTP: (state) => state.modules["auth"].genedOTP,
      forgotPassUser: (state) => state.modules["user"].forgotPassUser,
    }),
  },
  mounted() {
    // console.log(this.forgotPassUser);
    const stored = sessionStorage.getItem("genedOTP");
    if (stored) {
      const parsed = JSON.parse(stored);
      this.$store.commit("modules/auth/SET_GENED_OTP", parsed);
    }
    this.startCountdown();
  },
  methods: {
    ...mapActions({
      signUp: "modules/auth/signUp",
      verifyOTP: "modules/auth/verifyOTP",
      sendOTP: "modules/auth/sendOTP",
    }),
  async submitOTP() {
  if (!this.userOTP) {
    message.warning("Vui lòng nhập mã OTP!");
    return;
  }

  if (this.$route.query.verify_type === "forgot-password") {
    const response = await this.verifyOTP({
      userOTP: this.userOTP,
      genedOTP: this.genedOTP,
    });
    if (response.message === "OTP matched") {
      sessionStorage.setItem("otpVerified", "true");
      message.success("Xác nhận OTP thành công!");
      this.$router.push("/reset-password");
    } else {
      message.error(response.message);
    }
  } else {
    try {
      const response = await this.signUp({
        userData: this.userTemp,
        userOTP: this.userOTP,
        genedOTP: this.genedOTP,
      });
      if (response?.newUser) {
        message.success("Đăng ký thành công!");
        this.$router.push("/login"); 
      } else {
        message.error(response?.message || "OTP không hợp lệ!");
      }
    } catch (error) {
      message.error(error.message || "OTP không hợp lệ!");
    }
  }
},

    async resendOTP() {
      let typeCheck = "";
      let email = "";
      if (!this.forgotPassUser) {
        typeCheck = "register";
        email = this.userTemp.email;
      } else {
        typeCheck = "forgot";
        email = this.forgotPassUser.email;
      }
      try {
        const response = await this.sendOTP({
          email,
          type_check: typeCheck,
        });

        if (response?.genedOTP) {
          sessionStorage.setItem("genedOTP", JSON.stringify(response.genedOTP));
          this.$store.commit("modules/auth/SET_GENED_OTP", response.genedOTP);
        }
        message.info("Gửi lại OTP thành công!");
        this.resendDisabled = true;
        this.countdown = 60;
        this.startCountdown();
      } catch (err) {
        message.error(err?.response?.data?.message || "Gửi lại OTP thất bại!");
      }
    },

    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.resendDisabled = false;
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5); /* nền mờ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.verify-otp {
  padding: 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  border-radius: 8px;
}
</style>
