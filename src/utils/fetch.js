import axios from 'axios';
import store from '../store';
import vue from 'vue';
// import router from '../router';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000                  // 请求超时时间}
});

// request拦截器
service.interceptors.request.use(config => {
  // debugger;
  // console.log(config)
  config.url = '/api' + config.url
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error);// for debug
    vue.$Message.error({
                    message: error.message,
                    duration: 5 * 1000,
                    closable: true
                });
    return Promise.reject(error);
  }
)

// service.post = (url, params) => {
//   return new Promise((resolve, reject) => {
//     axios.post(url, params)
//       .then(response => {
//         resolve(response.data);
//       }, err => {
//         reject(err);
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })
// }

export default service;
