export const state = () => ({});

export const mutations = {};

export const actions = {
  createPayment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/create-payment-link`, payload)
        .then((response) => {
          resolve(response.data.checkoutUrl);
        })
        .catch((error) => {
          console.error(`Error payment action`, error);
          reject(error);
        });
    });
  },
  storePaymentReturn({ commit }, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/payment-return`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error payment action`, error);
          reject(error);
        });
    });
  },
};
