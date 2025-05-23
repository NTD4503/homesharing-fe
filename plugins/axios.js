import { jwtDecode } from "jwt-decode";

export default function ({ $axios, store }) {
  $axios.onRequest(async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const tokenExpiration = jwtDecode(accessToken).exp * 1000;
      const now = new Date().getTime();

      if (tokenExpiration < now) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await $axios.post("/api/v1/auth/refresh-token", {
            refresh_token: refreshToken,
          });

          accessToken = response.data.accessToken;
          localStorage.setItem("accessToken", accessToken);
        } catch (error) {
          console.error("Token refresh failed", error);
        }
      }

      config.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  });

  $axios.onError(async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const refreshResponse = await $axios.post(
            "/api/v1/auth/refresh-token",
            { refresh_token: refreshToken }
          );
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          response.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return $axios(response.config);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
        }
      }
    }

    return Promise.reject(error);
  });
}
