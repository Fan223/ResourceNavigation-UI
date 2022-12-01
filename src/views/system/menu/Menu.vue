<template>
  <el-row>
    <el-col :span="6">
      <b>菜单管理</b>
    </el-col>
    <el-col :span="18">
      <div class="main-header-button">
        <el-button
          type="primary"
          size="small"
          @click="dialog.addDialogVisible = true"
        >新增</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除吗?"
          :icon="InfoFilled"
          icon-color="#626AEF"
          @confirm="multipleDeleteMenu"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
            >批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-col>
  </el-row>

  <el-table
    :data="menusTree.data"
    row-key="id"
    border
    stripe
    default-expand-all
    empty-text="加载中..."
    show-header
    height="400px"
    :header-cell-style="{background:'#ddd'}"
    ref="menuTableRef"
  >
    <el-table-column type="selection" />
    <el-table-column
      prop="name"
      label="名称"
      sortable
      width="150px"
    />
    <el-table-column
      prop="path"
      label="路径"
      sortable
      align="center"
      width="120px"
    />
    <el-table-column
      prop="permission"
      label="权限编码"
      width="120px"
      align="center"
      sortable
    />
    <el-table-column
      prop="component"
      label="组件"
      align="center"
      sortable
      width="180px"
    />
    <el-table-column
      prop="type"
      label="类型"
      align="center"
      sortable
    >
      <template #default="scope">
        <el-tag
          v-if="scope.row.type === 0"
          size="small"
        >目录</el-tag>
        <el-tag
          v-else-if="scope.row.type === 1"
          size="small"
          type="success"
        >菜单</el-tag>
        <el-tag
          v-else-if="scope.row.type === 2"
          size="small"
          type="info"
        >按钮</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="icon"
      label="图标"
      align="center"
      sortable
    />
    <el-table-column
      prop="orderNum"
      label="排序号"
      align="center"
    />
    <el-table-column
      prop="flag"
      label="状态"
      align="center"
    >
      <template #default="scope">
        <el-tag
          v-if="scope.row.flag === 'N'"
          size="small"
          type="danger"
        >禁用</el-tag>
        <el-tag
          v-else-if="scope.row.flag === 'Y'"
          size="small"
          type="success"
        >正常</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      sortable
      align="center"
      width="180px"
    />
    <el-table-column
      label="操作"
      align="center"
      width="180px"
      fixed="right"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="updateMenu(scope.row)"
        >编辑</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除吗?"
          :icon="InfoFilled"
          icon-color="#626AEF"
          @confirm="deleteMenu(scope.row)"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
            >删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <MenuAdd
    :menusTree="menusTree.data"
    :dialog="dialog"
    @listMenusTree="listMenusTree"
  />
  <MenuEdit
    :menusTree="menusTree.data"
    :dialog="dialog"
    @listMenusTree="listMenusTree"
    :menuUpdateRow="menuUpdateRow.data"
  />
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, inject } from '@vue/runtime-core'
import { InfoFilled } from '@element-plus/icons-vue'
import ViewUIPlus from 'view-ui-plus';
import MenuAdd from './MenuAdd.vue';
import MenuEdit from './MenuEdit.vue';
import '@/assets/css/mainStyle.css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let menusTree = reactive({
      data: []
    })
    let dialog = reactive({
      addDialogVisible: false,
      editDialogVisible: false
    })
    let menuUpdateRow = reactive({
      data: {}
    })


    function listMenusTree() {
      dialog.addDialogVisible = false
      dialog.editDialogVisible = false
      menusTree.data = []
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/menu/listMenusTree').then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          menusTree.data.push.apply(menusTree.data, response.data.data)
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }
    listMenusTree();

    function deleteMenu(row) {
      let ids = row.id ? [row.id] : row
      ViewUIPlus.LoadingBar.start();

      axios.delete('/resNav/menu/deleteMenu', { data: { ids: ids } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          listMenusTree()
          proxy.refreshNavMenus()
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function multipleDeleteMenu() {
      let ids = proxy.$refs.menuTableRef.getSelectionRows().map(select => select.id);
      console.log(ids);

      if (ids.length > 0) {
        deleteMenu(ids)
      } else {
        ElMessage({
          message: '未选中任何行',
          type: 'error'
        })
      }
    }

    function updateMenu(row) {
      dialog.editDialogVisible = true
      menuUpdateRow.data = row
    }

    return {
      menusTree,
      listMenusTree,
      dialog,
      deleteMenu,
      InfoFilled,
      multipleDeleteMenu,
      updateMenu,
      menuUpdateRow
    }
  },
  components: {
    MenuAdd,
    MenuEdit
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 3px;
}
</style>