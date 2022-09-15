import axios from "axios";
import { getDomain } from "../utils/usual";
if (typeof window !== "undefined") {
  NProgress && NProgress.configure({ easing: "ease", speed: 300 });
}
let showProgress = true;
const requestInstance = axios.create({
  baseURL: getDomain(),
  timeout: 9000,
});
requestInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    if (showProgress) {
      NProgress && NProgress.start();
    }
  }
  return config;
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  };
});
requestInstance.interceptors.response.use((response) => {
  if (typeof window !== "undefined") {
    if (showProgress) {
      NProgress && NProgress.done();
    }
  }
  const res = response.data;
  if (res.code === 200) {
    return res;
  }
});
const request = function (data, options = {}) {
  const { progress = true } = options;
  showProgress = progress;
  return requestInstance(data);
};
export { request, requestInstance };
