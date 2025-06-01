export const state = () => ({
  userTemp: null,
  user: null,
  genedOTP: null,
});

export const mutations = {
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem("accessToken", user.access_token);
    localStorage.setItem("refreshToken", user.refresh_token);
  },
  SET_EMPTY_USER(state) {
    state.user = null;
  },
  SET_USER_TEMP(state, userTemp) {
    state.userTemp = userTemp;
  },
  SET_GENED_OTP(state, genedOTP) {
    state.genedOTP = genedOTP;
  },
};

export const actions = {
  login({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/auth/login", { email, password })
        .then((response) => {
          console.log(">>> login response:", response.data);
          if (response.data.user) commit("SET_USER", response.data.user);
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },

  signUp({ commit }, { userData, userOTP, genedOTP }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/auth/signup", { userData, userOTP, genedOTP })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },

  logout({ commit }) {
    return new Promise((resolve) => {
      localStorage.clear();
      commit("SET_EMPTY_USER");
      resolve();
    });
  },

  async sendOTP({ commit }, { email, type_check }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/auth/send-otp", { email, type_check })
        .then((response) => {
          if (!response.data.message) {
            console.log(response.data)
            commit("SET_GENED_OTP", response.data.genedOTP);
          }
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error.response.data);
        });
    });
  },

  async verifyOTP({ commit }, { userOTP, genedOTP }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/auth/verify-otp", { userOTP, genedOTP })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error.response.data);
        });
    });
  },

  refreshAccessToken({ commit }) {
    const refresh_token = localStorage.getItem("refreshToken");
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/auth/refresh-token", { refresh_token })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },
};
