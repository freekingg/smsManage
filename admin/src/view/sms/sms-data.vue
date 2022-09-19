<template>
  <div class="container">
    <el-row class="container-header" justify="space-between">
      <el-col :span="15">
        <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.title" placeholder="名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.phone" placeholder="号码" clearable />
          </el-form-item>
          <el-form-item>
            <el-select clearable @change="typeChangeHandle"  v-model="dataForm.filterType" class="m-2" placeholder="短信类型" size="large">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="6" class="btn-group">
        <el-button-group>
          <el-button icon="el-icon-search" @click="getDataList(dataForm)">查询</el-button>
          <el-button :icon="monit ? 'el-icon-loading' : 'el-icon-aim'" @click="monitoringHandle">{{
            monit ? '自动查询中' : '自动查询'
          }}</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="wrap" style="height: 70vh; overflow: auto">
      <el-table size="large" v-loading="dataListLoading" :data="smsList" border>
        <el-table-column prop="title" label="名称" width="160" >
          <template #default="scope">
            <span style="font-size: 16px;color: black;">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="号码" width="160" />
        <el-table-column prop="title" label="内容">
          <template #default="scope">
            <div>
              <el-tag effect="dark" v-if="testMsgType(scope.row.message).otp" type="success">OTP</el-tag>
              <el-tag effect="dark" v-if="testMsgType(scope.row.message).debit" type="danger">Debit</el-tag>
              <!-- <el-tag v-if="testMsgType(scope.row.message).otp">OTP</el-tag> -->
              <span style="padding-left: 5px;">{{scope.row.message}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="时间" width="168">
          <template #default="scope">
            <div>
              <span style="padding-left: 5px;">
                {{getExtra(scope.row.extra).time}}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pages">
      <el-pagination
        background
        slot="footer"
        :current-page="page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from 'vue'
import SmsDataModel from '@/model/sms-data'
import mixinViewModule from '@/common/mixin/view-module'
let timer = null
export default {
  setup() {
    const mixinModuleOptions = {
      getDataListIsPage: true,
      getDataListModel: SmsDataModel.getSmsDatas,
      deleteDataModel: SmsDataModel.deleteSmsData,
    }

    const {
      initMixinViewModuleOptions,
      getDataList,
      deleteHandle,
      addOrUpdateHandle,
      addOrUpdateVisible,
      dataListLoading,
      dataList,
      total,
      page,
      limit,
      pageSizeChangeHandle,
      pageCurrentChangeHandle,
    } = mixinViewModule()

    const data = reactive({
      dataForm: {},
      types:[
        {
          value: 'Otp',
          label: 'Otp',
        },
        {
          value: 'Debit',
          label: 'Debit',
        },
      ],
      monit: false,
    })

    initMixinViewModuleOptions(mixinModuleOptions, data.dataForm)

    onMounted(() => {})

    const smsList = computed(() => {
      let filterType = data.dataForm.filterType
      if(!filterType) return dataList.value
      let regObj = {
        Otp: /OTP/,
        Debit: /Debit/
      }
      let _list = dataList.value.filter((item)=>{
        if(regObj[filterType].test(item.message)){
          return item
        }
      })
     return _list
  })

    const monitoringHandle = () => {
      data.monit = !data.monit
      clearInterval(timer)
      if (data.monit) {
        timer = setInterval(() => {
          getDataList(data.dataForm)
        }, 3000)
      }
    }

    const typeChangeHandle = (val)=>{
      console.log('val: ', val);
    }

    const getExtra = (val)=>{
      if(!val) return {}
      let value = JSON.parse(val)

      if(value.message && value.message.time){
        value['time'] = formatDate(value.message.time)
      }
      return value
    }

    const formatDate =  (d) => {
      var now = new Date(parseFloat(d));
      var year=now.getFullYear();
      var month=now.getMonth()+1;
      var date=now.getDate();
      if (month >= 1 && month <= 9) {
      month = "0" + month;
      }
      if (date >= 0 && date <= 9) {
      date = "0" + date;
      }
      var hour=now.getHours();
      var minute=now.getMinutes();
      var second=now.getSeconds();
      if (hour >= 1 && hour <= 9) {
      hour = "0" + hour;
      }
      if (minute >= 0 && minute <= 9) {
      minute = "0" + minute;
      }
      if (second >= 0 && second <= 9) {
      second = "0" + second;
      }
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;

  }

    const testMsgType = (msg)=>{
      let regOpt = /OTP/
      let regDebit = /Debit/
      let result = {
        otp:regOpt.test(msg),
        debit:regDebit.test(msg)
      }
      return result
    }

    return {
      ...toRefs(data),
      getDataList,
      addOrUpdateHandle,
      addOrUpdateVisible,
      dataListLoading,
      deleteHandle,
      dataList,
      total,
      page,
      limit,
      pageSizeChangeHandle,
      pageCurrentChangeHandle,
      monitoringHandle,
      testMsgType,
      typeChangeHandle,
      getExtra,
      smsList
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }

  .account-box {
    display: flex;
    flex-wrap: wrap;
    max-height: 80px;
    overflow: auto;
  }
}
.btn-area button {
  margin-bottom: 4px;
}
</style>
