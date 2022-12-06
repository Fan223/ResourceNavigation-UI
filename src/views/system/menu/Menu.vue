<template>
  <!-- 查询区域 -->
  <el-row>
    <el-col :span="24">
      <el-form
        class="query-form-inline"
        label-position="right"
        label-width="70px"
        :model="menuQueryForm"
        ref="menuQueryFormRef"
        :inline="true"
        @keyup.enter="listMenusTree"
      >
        <el-form-item
          label="菜单名称"
          prop="name"
        >
          <el-input
            v-model="menuQueryForm.name"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="权限编码"
          prop="permission"
        >
          <el-input
            v-model="menuQueryForm.permission"
            placeholder="请输入权限编码"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="menuQueryForm.type"
            placeholder="请选择类型"
            multiple
            clearable
          >
            <el-option
              label="目录"
              value="1"
            />
            <el-option
              label="菜单"
              value="2"
            />
            <el-option
              label="按钮"
              value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="flag"
        >
          <el-select
            v-model="menuQueryForm.flag"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              label="正常"
              value="Y"
            />
            <el-option
              label="禁用"
              value="N"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="query-form-inline-button">
          <el-button
            size="small"
            type="primary"
            @click="listMenusTree"
          >查询
          </el-button>
          <el-button @click="() => this.$refs.menuQueryFormRef.resetFields()">重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  <!-- 结果区域 -->
  <div class="data-content">
    <el-row class="data-content-header">
      <el-col
        :span="6"
        class="data-content-header-text"
      >
        <b>查询结果</b>
      </el-col>
      <el-col :span="18">
        <div class="data-content-header-button">
          <el-button
            v-if="hasAuth('menu:add')"
            type="primary"
            size="small"
            @click="dialog.addDialogVisible = true"
          >新增</el-button>
          <el-popconfirm
            v-if="hasAuth('menu:delete')"
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

    <!-- 数据 -->
    <el-row>
      <el-col :span="23">
        <el-table
          class="data-content-table"
          :data="menusTree.data"
          row-key="id"
          border
          stripe
          show-header
          :max-height="tableMaxHeight"
          :header-cell-style="{background:'#ddd'}"
          ref="menuTableRef"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="name"
            label="名称"
            sortable
            min-width="160px"
          />
          <el-table-column
            prop="path"
            label="路径"
            sortable
            align="center"
            min-width="120px"
          />
          <el-table-column
            prop="permission"
            label="权限编码"
            min-width="160px"
            align="center"
            sortable
          />
          <el-table-column
            prop="component"
            label="组件"
            align="center"
            sortable
            min-width="160px"
          />
          <el-table-column
            prop="type"
            label="类型"
            align="center"
            sortable
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.type === 1"
                size="small"
              >目录</el-tag>
              <el-tag
                v-else-if="scope.row.type === 2"
                size="small"
                type="success"
              >菜单</el-tag>
              <el-tag
                v-else-if="scope.row.type === 3"
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
            min-width="180px"
          />
          <el-table-column
            v-if="hasAuth('menu:update') || hasAuth('menu:delete')"
            label="操作"
            align="center"
            min-width="180px"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                v-if="hasAuth('menu:update')"
                type="primary"
                size="small"
                @click="updateMenu(scope.row)"
              >编辑</el-button>
              <el-popconfirm
                v-if="hasAuth('menu:delete')"
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance, inject } from '@vue/runtime-core'
import { InfoFilled } from '@element-plus/icons-vue'
import ViewUIPlus from 'view-ui-plus';
import MenuAdd from './MenuAdd.vue';
import MenuEdit from './MenuEdit.vue';
import '@/assets/css/mainStyle.css'
import Qs from 'qs'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let menuQueryForm = reactive({
    })
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
    let tableMaxHeight = ref(window.innerHeight - 320)


    function listMenusTree() {
      dialog.addDialogVisible = false
      dialog.editDialogVisible = false
      menusTree.data = []
      ViewUIPlus.LoadingBar.start();

      let queryForm = Qs.stringify({
        name: menuQueryForm.name,
        permission: menuQueryForm.permission,
        type: menuQueryForm.type,
        flag: menuQueryForm.flag
      }, { arrayFormat: 'repeat' })

      axios.get('/resNav/menu/listMenusTree?' + queryForm).then(response => {
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
      menuQueryForm,
      tableMaxHeight,
      menusTree,
      listMenusTree,
      dialog,
      InfoFilled,

      deleteMenu,
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
.el-col {
  margin: 0 auto;
}
:deep(.query-form-inline .el-form-item__label) {
  font-weight: bold;
}
.el-select,
.el-input {
  width: 200px;
}
</style>