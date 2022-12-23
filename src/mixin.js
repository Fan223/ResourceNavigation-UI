import axios from '@/axios';
import store from '@/store';

export default {
  methods: {
    hasAuth(authority) {
       return store.state.menu.authorities.indexOf(authority) > -1
    },

    refreshNavMenus() {
      axios.get('/resNav/menu/listNavMenus').then(response => {
        // 拿到 menus 菜单列表
        store.commit('SET_MENUS', response.data.data.menus);
        // 拿到 authorities 权限列表
        store.commit('SET_AUTHORITIES', response.data.data.authorities);

        store.state.menu.hasRoute = false
      })
    },

    refreshTabs(menus) {
      console.log(menus);
      console.log(store.state.menu.tabs);
    }
  }
}
