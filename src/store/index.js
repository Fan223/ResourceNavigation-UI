import { createStore } from 'vuex'

const store = createStore({
  mutations: {
    SET_MENUS(state, menus) {
      state.menu.menus = menus;
    },
    SET_AUTHORITIES(state, authorities) {
      state.menu.authorities = authorities;
    },
    CHANGE_ROUTE_STATUS(state, status) {
      state.menu.hasRoute = status
    },
    ADD_TAB(state, asideMenu) {
      let index = state.menu.tabs.findIndex(tab => tab.name === asideMenu.permission);

      if (index === -1) {
        state.menu.tabs.push({
          title: asideMenu.name,
          name: asideMenu.permission,
        });
      }
      state.menu.activeTabName = asideMenu.permission;
    },
  },
  state: { 
    isCollapsed: false,
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    menu: {
      hasRoute: false,
      menus: [],
      authorities: '',
      tabs: [],
      activeTabName: 'Home',
      homeTab: {
        title: '首页',
        name: 'Home'
      }
    }
  } 
})

export default store