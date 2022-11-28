<template>
  <el-tree
    ref="menusTree"
    :data="menusTree.data"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
  />
  <h1>
    {{ menusTree.data }}
  </h1>
  <el-button @click="listMenusTree">
    11
  </el-button>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'

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

    function listMenusTree() {
      axios.get('/resNav/menu/listMenusTree').then(
        response => {
          console.log(response.data.data);
          menusTree.data = response.data.data

          console.log(menusTree.data);
        }
      )
    }
    listMenusTree();

    return {
      menusTree,
      defaultProps,
      listMenusTree
    }
  }
}
</script>

<style>
</style>