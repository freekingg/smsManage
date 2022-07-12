import axios from 'axios';
import Config from '../config';
import {Alert, Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Storage from '../public/Storage';
import store from '../store';
import {SET_LOGIND} from '../store/action/Actions';
import qs from 'qs';

let baseURL = Config.baseURL

// axios 实例
const service = axios.create({
  baseURL: baseURL,
  timeout: 1000 * 10,
  withCredentials: true,
});

//请求拦截
service.interceptors.request.use(
  async function (config) {
    let token = null;
    try {
      token = await Storage.getItem('token');
    } catch (error) {
      token = '';
    }

    config.headers.token = token;
    if (config.method === 'post' || config.method === 'put') {
      config.data = {
        ...config.data,
      };
    } else if (config.method === 'get') {
      config.params = {
        ...config.params,
      };
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['Content-Type'])) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

//响应拦截
service.interceptors.response.use(
  function (response) {
    console.log('response: ', response);
    /*
     * 10020 未授权
     * 10021 token失效
     * 410 网站维护
     * 403 访问受限
     */

    if (response.status.toString().charAt(0) === '2') {
      return response.data
    }else {
      return Promise.reject(response);
    }
  },
  function (error) {
    // console.warn('响应Error', error);
    return Promise.reject(error);
  },
);
export default service;
