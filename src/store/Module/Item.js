const Item = {
  namespaced: true,
  state: {
    lists: [],
  },
  mutations: {
    append(state, value) {
      state.lists.push(value);
    },
  },
  actions: {},
  getters: {},
};

export default Item;
