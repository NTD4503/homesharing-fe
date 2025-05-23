const HOST_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data";

export const state = () => ({
  provinces: [],
  districts: [],
  wards: [],
});

export const mutations = {
  SET_PROVINCES(state, provinces) {
    state.provinces = provinces;
  },
  SET_DISTRICTS(state, districts) {
    state.districts = districts;
  },
  SET_WARDS(state, wards) {
    state.wards = wards;
  },
};

export const actions = {
  getProvinces({ commit }) {
    return new Promise((resolve, reject) => {
      fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Token: "0a14904c-2276-11ef-951e-1e3eb737352a",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          let reversedData = data.data.reverse();
          commit("SET_PROVINCES", reversedData); // Assuming the response has a 'data' property
          resolve(reversedData);
        })
        .catch((error) => {
          console.error("Error fetching provinces:", error);
          reject(error);
        });
    });
  },
  getDistricts({ commit }, provinceId) {
    return new Promise((resolve, reject) => {
      fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "0a14904c-2276-11ef-951e-1e3eb737352a",
          },
          body: JSON.stringify({
            province_id: provinceId,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let reversedData = data.data.reverse();
          commit("SET_DISTRICTS", reversedData);
          resolve(reversedData);
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
          reject(error);
        });
    });
  },
  getWards({ commit }, districtId) {
    return new Promise((resolve, reject) => {
      fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "0a14904c-2276-11ef-951e-1e3eb737352a",
          },
          body: JSON.stringify({
            district_id: districtId,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          let reversedData = data.data.reverse();
          commit("SET_WARDS", reversedData);
          resolve(reversedData);
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
          reject(error);
        });
    });
  },
};
