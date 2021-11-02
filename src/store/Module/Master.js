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
  getters: {},
};

export default Master;
