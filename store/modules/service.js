export const state = () => ({
  services: [],
  purchaseHistories: [],
  purchaseHistoriesByUser: [],
  purchaseCountInRange: [],
});

export const mutations = {
  SET_SERVICES(state, services) {
    state.services = services;
  },
  SET_PURCHASE_HISTORIES(state, purchaseHistories) {
    state.purchaseHistories = purchaseHistories;
  },
  SET_PURCHASE_HISTORIES_BY_USER(state, purchaseHistoriesByUser) {
    state.purchaseHistoriesByUser = purchaseHistoriesByUser;
  },
  SET_PURCHASE_COUNT_IN_RANGE(state, purchaseCountInRange) {
    state.purchaseCountInRange = purchaseCountInRange;
  },
};

export const actions = {
  fetchAllServices({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/services`)
        .then((response) => {
          commit("SET_SERVICES", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error getting services`, error);
          reject(error);
        });
    });
  },

  fetchAllPurchaseHistory({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/services/purchase-history`)
        .then((response) => {
          commit("SET_PURCHASE_HISTORIES", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error getting services`, error);
          reject(error);
        });
    });
  },

  fetchPurchaseHistoryByUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/services/purchase-history/${userId}`)
        .then((response) => {
          commit("SET_PURCHASE_HISTORIES_BY_USER", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error getting services`, error);
          reject(error);
        });
    });
  },

  fetchPurchaseCountInRange({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/services/purchase-history/count-in-range`, payload)
        .then((response) => {
          commit("SET_PURCHASE_COUNT_IN_RANGE", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error getting services`, error);
          reject(error);
        });
    });
  },

  savePurchaseHistory({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/services/purchase-history`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error getting services`, error);
          reject(error);
        });
    });
  },

  updateService({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/services/${payload.service_id}`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error update service `, error);
          reject(error);
        });
    });
  },
};
