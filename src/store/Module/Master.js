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
    nameItem: (state, getters, rootState, rootGetters) => (masterId) => {
      let findMaster = state.lists.filter((val) => val.id === masterId);
      if (findMaster.length > 0) {
        let result = rootState.Item.lists.filter(
          (val) => val.id === findMaster[0].master_item
        );
        return result[0].item_name;
      }
    },
  },
};

export default Master;
