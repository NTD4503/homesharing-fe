import Vue from 'vue'

export const state = () => ({
  currentUser: null,
  forgotPassUser: null,
  users: [],
  roles: [],
  balance: 0,
  userCache: {},
});

export const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },
  SET_FORGOT_PASS_USER(state, user) {
    state.forgotPassUser = user;
  },
  SET_BALANCE(state, balance) {
    state.balance = balance;
  },
  CACHE_USER(state, user) {
    Vue.set(state.userCache, user.user_id, user)
  },
};

export const actions = {
  fetchAllUsers({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/users")
        .then((response) => {
          commit("SET_USERS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  fetchAllRoles({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/users/roles/all")
        .then((response) => {
          commit("SET_ROLES", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  fetchUserById({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/users/${userId}`)
        .then((response) => {
          commit("SET_CURRENT_USER", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  fetchTotalUsers({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/users/count/total`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  fetchUserByEmail({ commit }, email) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/users/by-email`, { email: email })
        .then((response) => {
          if (!response.data.message) {
            console.log(response.data)
            commit("SET_FORGOT_PASS_USER", response.data);
          }
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  updateUser({ commit }, userData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/users/${userData.user_id}`, userData)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  updateUserForAdmin({ commit }, userData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/users/${userData.user_id}/admin`, userData)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  updateUserPassword({ commit }, userData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/users/${userData.user_id}/password`, userData)
        .then(() => resolve())
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  updateUserBlockedStatus({ commit }, userData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/users/${userData.user_id}/blocked`, userData)
        .then(() => resolve())
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  updateUserService({ commit }, userData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/users/${userData.user_id}/service`, userData)
        .then(() => resolve())
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  saveUser({ commit }, userData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/users`, userData)
        .then((response) => resolve(response.data.userId))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  deleteUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(`/api/v1/users/${userId}`)
        .then(() => resolve())
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  fetchUserBalance({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/users/${userId}/balance`)
        .then((response) => {
          commit("SET_BALANCE", response.data.balance);
          resolve(response.data.balance);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  fetchSingleUserById({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/users/${userId}`)
        .then((response) => {
          commit("CACHE_USER", response.data);
          console.log("User fetched:", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("❌ [fetchSingleUserById] Failed to fetch user:", error);
          reject(error);
        });
    });
  }
};

