export default [
  {
    label: '日常业务',
    value: 'business',
    icon: 'el-icon-menu',
    children: [
      {
        label: '入库',
        value: 'business-in'
      },
      {
        label: '出库',
        value: 'business-out'
      },
      {
        label: '物品管理',
        value: 'business-manage-project'
      },
      {
        label: '部门管理',
        value: 'business-manage-department'
      }
    ]
  },
  {
    label: '历史记录',
    value: 'history',
    icon: 'el-icon-menu',
    children: [
      {
        label: '入库历史',
        value: 'history-in'
      }
    ]
  },
  {
    label: '设置',
    value: 'setting',
    icon: 'el-icon-menu',
    children: [
      {
        label: '备份与还原',
        value: 'setting-db'
      },
      {
        label: '数据导入',
        value: 'setting-import'
      }
    ]
  }
]
