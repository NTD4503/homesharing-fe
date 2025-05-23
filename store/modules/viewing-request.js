export const state = () => ({
  viewRequest: null,
  requestsByUser: [],
  allRequestForLandlord: [],
});

export const mutations = {
  SET_VIEW_REQUEST(state, viewRequest) {
    state.viewRequest = viewRequest;
  },
  SET_REQUESTS_BY_USER(state, requestsByUser) {
    state.requestsByUser = requestsByUser;
  },
  SET_ALL_REQUEST_FOR_LANDLORD(state, allRequestForLandlord) {
    state.allRequestForLandlord = allRequestForLandlord;
  },
};

export const actions = {
  createViewRequest({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request", requestData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  sendMailConfirmRequest({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request/send-confirm", requestData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  sendMailAcceptedRequest({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request/send-accepted", requestData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  sendMailRefusedRequest({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request/send-refused", requestData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  updateViewRequest({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/view-request/${requestData.id}`, requestData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  deleteViewRequest({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(`/api/v1/view-request/${requestData.id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  fetchViewRequestByPost({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request/by-post", requestData)
        .then((response) => {
          commit("SET_VIEW_REQUEST", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  fetchViewRequestsByUser({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request/by-user", requestData)
        .then((response) => {
          commit("SET_REQUESTS_BY_USER", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  getAllViewRequestForLandlord({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/view-request/for-landlord", { user_id: requestData })
        .then((response) => {
          commit("SET_ALL_REQUEST_FOR_LANDLORD", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
};
