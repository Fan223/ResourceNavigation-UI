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
          @click="menuAddEmit"
        >新增</el-button>
        <el-button
          type="danger"
          size="small"
        >批量删除</el-button>
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
      width="100px"
      align="center"
      sortable
    />
    <el-table-column
      prop="component"
      label="组件"
      align="center"
      sortable
      width="160px"
    />
    <el-table-column
      prop="type"
      label="类型"
      align="center"
      sortable
    />
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
      <template v-slot="scope">
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
      width="200"
      fixed="right"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
        >编辑</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除吗?"
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
</template>

<script>
import { reactive } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import MenuAdd from './MenuAdd.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
  setup() {
    const axios = inject('axios')

    let menusTree = reactive({
      data: []
    })
    let defaultProps = {
      label: 'name',
      children: 'children',
    }
    let dialog = reactive({
      dialogVisible: false
    })

    function listMenusTree() {
      dialog.dialogVisible = false,
        menusTree.data = []
      axios.get('/resNav/menu/listMenusTree').then(
        response => {
          menusTree.data.push.apply(menusTree.data, response.data.data)
        }
      )
    }
    listMenusTree();

    function menuAddEmit() {
      dialog.dialogVisible = true
    }

    function deleteMenu(row) {
      let ids = [row.id]
      axios.delete('/resNav/menu/deleteMenu', { data: { ids: ids } }).then(() => {
        listMenusTree()
      })
    }

    return {
      menusTree,
      defaultProps,
      menuAddEmit,
      listMenusTree,
      dialog,
      deleteMenu
    }
  },
  components: {
    MenuAdd
  }
}
</script>

<style scoped>
.main-header-button {
  float: right;
  margin-right: 40px;
  /* border: 1px solid red; */
}
.el-table {
  margin-top: 3px;
}
</style>