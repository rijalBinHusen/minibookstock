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
    incoming: (state, getters, rootState, rootGetters) => (tanggal) => {
      let result = state.lists.filter((val) => {
        if (val.type === "in" && +val.tanggal === +tanggal) {
          val.nameItem = rootGetters["Master/nameItem"](val.item);
          return val;
        }
      });
      return result;
    },
	incomingId: (state, getters, rootState, rootGetters) => (id) => {
		return state.lists.filter((val) => val.id === id)
	}
  },
};

export default Mutation;
