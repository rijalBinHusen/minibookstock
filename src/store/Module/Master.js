const Master = {
  namespaced: true,
  state: {
    lists: [],
  },
  mutations: {
    master(state, value) {
      state.lists = value;
    },
    append(state, value) {
      state.lists.push(value);
    },
  },
  actions: {},
  getters: {
    qty: (state, getters, rootState, rootGetters) => (itemKode) => {
      let total = 0;
      state.lists.forEach((val) => {
        if (val.master_item == itemKode) {
          total += +val.master_qty;
        }
      });
      return total;
    },
  },
};

export default Master;
