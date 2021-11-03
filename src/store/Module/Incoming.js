const Incoming = {
  namespaced: true,
  state: {
    lists: [],
  },
  mutations: {
    incoming(state, value) {
      state.lists = value;
    },
    append(state, value) {
      state.lists.push(value);
    },
  },
  actions: {},
  getters: {},
};

export default Incoming;
