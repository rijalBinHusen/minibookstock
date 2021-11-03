const Mutation = {
  namespaced: true,
  state: {
    lists: [],
  },
  mutations: {
    mutation(state, value) {
      state.lists = value;
    },
    append(state, value) {
      state.lists.push(value);
    },
  },
  actions: {},
  getters: {
    //   get income mutation
    incoming(state) {
      return state.lists.filter((val) => val.type === "in");
    },
  },
};

export default Mutation;
