import request from './request';

// 退出
export function createSms(data) {
  return request({
    url: '/v1/sms/data',
    method: 'post',
    data,
  });
}
