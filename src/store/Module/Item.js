const Item = {
  namespaced: true,
  state: {
    lists: [],
  },
  mutations: {
    item(state, value) {
      state.lists = value;
    },
    append(state, value) {
      state.lists.push(value);
    },
  },
  actions: {},
  getters: {
    byGroup: (state, getters, rootState, rootGetters) => (group) => {
      let result = state.lists.filter((val) => {
        if (val.item_group === group) {
          val.item_qty = rootGetters["Master/qty"](val.id);
          return val;
        }
      });
      return result;
    },
  },
};

export default Item;
