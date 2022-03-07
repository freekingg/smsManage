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
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column prop="title" label="名称" width="160" />
        <el-table-column prop="phone" label="号码" width="160" />
        <el-table-column prop="message" label="内容" />
        <el-table-column prop="create_time" label="时间" width="160" />
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
import { reactive, toRefs, ref, onMounted } from 'vue'
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
      monit: false,
    })

    initMixinViewModuleOptions(mixinModuleOptions, data.dataForm)

    onMounted(() => {})

    const monitoringHandle = () => {
      data.monit = !data.monit
      clearInterval(timer)
      if (data.monit) {
        timer = setInterval(() => {
          getDataList(data.dataForm)
        }, 3000)
      }
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
