import { createStore } from 'vuex'

const store = createStore({ 
  state () { 
    return { 
      isCollapsed: false,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    } 
  } 
})

export default store