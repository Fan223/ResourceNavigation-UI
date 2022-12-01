import axios from '@/axios';
import store from '@/store';

export default {
  methods: {
    hasAuth(permission) {
       var permissionList = store.state.menu.permissionList
       return permissionList.indexOf(permission) > -1
    },

    refreshNavMenus() {
      axios.get('/resNav/auth/listNavMenus').then(response => {
        // 拿到 menus 菜单列表
        store.commit('SET_MENUS', response.data.data.menus);
        // 拿到 authorities 权限列表
        store.commit('SET_AUTHORITIES', response.data.data.authorities);
      })
    },
  }
}