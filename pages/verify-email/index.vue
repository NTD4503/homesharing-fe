<template>
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
    console.log(this.forgotPassUser);
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
        const response = await this.signUp({
          userData: this.userTemp,
          userOTP: this.userOTP,
          genedOTP: this.genedOTP,
        });
        if (typeof response !== "string") {
          message.success("Xác nhận OTP thành công!");
          this.$router.push("/");
          setTimeout(() => {
            location.reload();
          }, 10);
        } else {
          message.error(response);
        }
      }
    },

    async resendOTP() {
      let typeCheck = "";
      console.log(this.userTemp);
      if (!this.forgotPassUser) {
        typeCheck = "register";
        await this.sendOTP({
          email: this.userTemp.email,
          type_check: typeCheck,
        });
      } else {
        typeCheck = "forgot";
        await this.sendOTP({
          email: this.forgotPassUser.email,
          type_check: typeCheck,
        });
      }
      message.info("Gửi lại OTP thành công!");
      this.resendDisabled = true;
      this.countdown = 60;
      this.startCountdown();
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
.verify-otp {
  padding: 20px;
}
</style>
