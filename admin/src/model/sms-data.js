import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class SmsData {

  async createSmsData(data) {
    return _axios({
      method: 'post',
      url: 'v1/sms/data',
      data,
    })
  }

  async getSmsData(id) {
    const res = await get(`v1/sms/data/${id}`)
    return res
  }

  async editSmsData(id, info) {
    const res = await put(`v1/sms/data/${id}`, info)
    return res
  }

  async deleteSmsData(id) {
    const res = await _delete(`v1/sms/data/${id}`)
    return res
  }

  async getSmsDatas(data) {
    return _axios({
      method: 'get',
      url: 'v1/sms/data',
      data,
      handleError: true,
    })
  }
}

export default new SmsData()
