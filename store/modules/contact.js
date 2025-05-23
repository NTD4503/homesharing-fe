export const state = () => ({
  contacts: [],
});

export const mutations = {
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts;
  },
};

export const actions = {
  createContact({ commit }, payload) {
    console.log(payload)
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/contacts`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error create contact:`, error);
          reject(error);
        });
    });
  },
  fetchAllContacts({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/contacts`)
        .then((response) => {
          commit("SET_CONTACTS", response.data.contacts);
          resolve(response.data.contacts);
        })
        .catch((error) => {
          console.error(`Error unfavor post`, error);
          reject(error);
        });
    });
  },
};
