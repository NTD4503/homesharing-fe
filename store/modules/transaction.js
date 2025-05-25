export const state = () => ({
  transactions: [],
  transactionsInRange: [],
  revenueInRange: [],
});

export const mutations = {
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions;
  },
  SET_TRANSACTIONS_IN_RANGE(state, transactionsInRange) {
    state.transactionsInRange = transactionsInRange;
  },
  SET_REVENUE_IN_RANGE(state, revenueInRange) {
    state.revenueInRange = revenueInRange;
  },
};

export const actions = {
  fetchTransactionsByUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/transactions/${userId}`)
        .then((response) => {
          console.log("Transactions fetched:", response.data);
          commit("SET_TRANSACTIONS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error favor post`, error);
          reject(error);
        });
    });
  },
  fetchTransactionsInRange({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/transactions/admin/in-range", payload)
        .then((response) => {

          commit("SET_TRANSACTIONS_IN_RANGE", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error favor post`, error);
          reject(error);
        });
    });
  },
  fetchRevenueInRange({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/transactions/admin/revenue-in-range", payload)
        .then((response) => {
          commit("SET_REVENUE_IN_RANGE", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error favor post`, error);
          reject(error);
        });
    });
  },
};
