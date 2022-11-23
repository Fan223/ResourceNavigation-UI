<template>
  <el-tree
    ref="menuTree"
    :data="menus.data"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
  />
</template>

<script>
import { reactive } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
  setup() {
    const axios = inject('axios')
    let menus = reactive({
      data: []
    })
    let defaultProps = {
      children: 'children',
      label: 'name',
    }

    function listMenu() {
      axios.get('/resNav/menu/listMenu').then(
        response => {
          menus.data = response.data.data.records
        }
      )
    }

    listMenu();

    return {
      menus,
      defaultProps
    }
  }
}
</script>

<style>
</style>