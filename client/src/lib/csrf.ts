import localforage from "localforage";
import apiClient from "lib/apiClient";

async function requestCsrf() {
  console.info("Requesting CSRF token to the backend");
  const res = await apiClient.get("/getcsrf", { withCredentials: true });
  const csrf = res.headers["x-csrftoken"];
  if (csrf) return await localforage.setItem<string>("csrftoken", csrf);
  return "";
}

async function clearCsrf() {
  console.info("CSRF token cleared in client");
  return await localforage.setItem("csrftoken", "");
}

async function getCsrf() {
  let csrf = await localforage.getItem<string>("csrftoken");
  if (!csrf) csrf = "";
  return csrf;
}

export { getCsrf, clearCsrf, requestCsrf };
