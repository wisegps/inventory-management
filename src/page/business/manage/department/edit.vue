<template>
  <Container>
    <div>
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click="handleBack">
        返回物品管理列表
      </el-button>
    </div>
    <br>
    <el-alert
      title="如果修改价格请新建物品记录"
      type="info">
    </el-alert>
    <br>
    <Xform v-model="form" @submit="handleSave" mode="edit"></Xform>
  </Container>
</template>

<script>
import vuex from '@/mixins/vuex.js'
import Xform from './components/Form'
export default {
  mixins: [
    vuex
  ],
  components: {
    Xform
  },
  data () {
    return {
      form: {
        name: '物品名称'
      }
    }
  },
  computed: {
    // 这个页面编辑的数据id 从路由参数中传进来
    id () {
      return this.$route.params.id
    },
    // 校验
    formValid () {
      return this.form.name
    }
  },
  created () {
    // 初始化这个页面
    this.init()
  },
  methods: {
    // 初始化这个页面
    init () {
      if (this.id) {
        const project = this.vuexDepartments.find(e => e.id === this.id)
        if (project) {
          this.form.name = project.name
        } else {
          this.handleBack()
        }
      } else {
        this.handleBack()
      }
    },
    // 返回相关的列表页
    handleBack () {
      this.$router.push({
        name: 'business-manage-department'
      })
    },
    // 保存
    handleSave () {
      if (this.formValid) {
        this.vuexDepartmentsUpdate({
          id: this.id,
          ...this.form
        })
        this.handleBack()
      } else {
        this.$message({
          type: 'error',
          message: '数据校验不通过'
        })
      }
    }
  }
}
</script>
