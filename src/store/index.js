import Vue from 'vue'
import Vuex from 'vuex'
import low from 'lowdb'
import lodashId from 'lodash-id'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import wilddog from 'wilddog'
import key from '@/key.js'

Vue.use(Vuex)

// 野狗
const sync = wilddog.initializeApp({
  syncURL: key.wilddog.syncURL
}).sync()

// 上传数据
const vuexUpload = (state) => {
  return new Promise((resolve, reject) => {
    sync.ref('data/backup').push({
      projects: state.vuexProjects
    })
      .then(() => {
        console.log('数据已经上传到 data/backup')
        resolve()
      })
  })
}

const db = low(new LocalStorage('db'))
db._.mixin(lodashId)

export default new Vuex.Store({
  state: {
    // [物品列表] 全部
    vuexProjects: [],
    // [历史 入库] 全部
    vuexHistoryIn: []
  },
  getters: {
    // [物品列表] 有效
    vuexProjectsValid: state => {
      return state.vuexProjects.filter(e => !e.delFlag)
    },
    // [历史 入库] 有效
    vuexHistoryInValid: state => {
      return state.vuexHistoryIn.filter(e => !e.delFlag)
    }
  },
  mutations: {
    // [物品列表] 增
    vuexProjectsPush (state, item) {
      db
        .get('projects')
        .insert({
          ...item,
          delFlag: false
        })
        .write()
    },
    // [物品列表] 删 (只是标记删除)
    vuexProjectsDelete (state, id) {
      db
        .get('projects')
        .find({
          id: id
        })
        .assign({delFlag: true})
        .write()
    },
    // [物品列表] 改
    vuexProjectsUpdate (state, item) {
      db
        .get('projects')
        .find({
          id: item.id
        })
        .assign(item)
        .write()
    },
    // [物品列表] 改存量 id是物品id change是表示变化的数字
    vuexProjectsUpdateNum (state, {id, change}) {
      db
        .get('projects')
        .find({
          id: id
        })
        .update('num', n => n + change)
        .write()
    },
    // [物品列表] 载入
    vuexProjectsLoad (state) {
      state.vuexProjects = (
        db
          .get('projects')
          .value() || []
      ).reverse()
    },
    // [物品列表] 清空
    vuexProjectReset (state) {
      db.set('projects', [])
        .write()
    },
    // ----------------------------------------------------------------------------------------------------
    // [历史 入库] 增
    vuexHistoryInPush (state, item) {
      console.log(item)
      db
        .get('historyIn')
        .insert({
          ...item,
          delFlag: false
        })
        .write()
    },
    // [物品列表] 载入
    vuexHistoryInLoad (state) {
      state.vuexHistoryIn = (
        db
          .get('historyIn')
          .value() || []
      ).reverse()
    },
    // [历史 入库] 清空
    vuexHistoryInReset (state) {
      db.set('historyIn', [])
        .write()
    }
  },
  actions: {
    // [整体] 将本地数据库备份到云端
    vuexUpload (context) {
      return vuexUpload(context.state)
    },
    // [整体] 重置数据库中的数据
    vuexResetAll (context) {
      return new Promise((resolve, reject) => {
        context.commit('vuexProjectReset')
        context.commit('vuexHistoryInReset')
        resolve()
      })
    },
    // [整体] 从数据库中载入所有需要的数据
    vuexLoadAll (context) {
      return new Promise((resolve, reject) => {
        context.commit('vuexProjectsLoad')
        context.commit('vuexHistoryInLoad')
        resolve()
      })
    },
    // [云数据操作] 清空云端备份
    vuexClearCloud () {
      return new Promise((resolve, reject) => {
        sync.ref('data/backup').set([])
          .then(resolve)
      })
    }
  }
})
