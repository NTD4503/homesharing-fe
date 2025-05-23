export const state = () => ({
  geolocation: {},
  post: {},
});

export const mutations = {
  SET_GEOLOCATION(state, data) {
    state.geolocation = data;
  },
  SET_POST(state, post) {
    state.post = post;
  },
};

export const actions = {
  fetchPostById({ commit }, postId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/posts/${postId}`)
        .then((response) => {
          commit("SET_POST", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error fetching post with id ${postId}:`, error);
          reject(error);
        });
    });
  },

  getGeolocation({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.append("q", payload.address);
        url.searchParams.append("format", "json");
        url.searchParams.append("addressdetails", "1");
        url.searchParams.append("limit", "1");

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data && data.length > 0) {
          const geometry = {
            location: {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            },
          };
          commit("SET_GEOLOCATION", geometry);
          resolve(geometry);
        } else {
          const match = payload.address.match(/(?:Đường|Phố|\d+)(.*)/);
          let simpleAddress = match ? match[1].trim() : null;
          console.log(simpleAddress);
          if (simpleAddress) {
            const simplifiedPayload = { address: simpleAddress };
            const geometry = await actions.getGeolocation(
              { commit },
              simplifiedPayload
            );
            resolve(geometry);
          } else {
            reject(new Error("No results found"));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        reject(error);
      }
    });
  },
};
