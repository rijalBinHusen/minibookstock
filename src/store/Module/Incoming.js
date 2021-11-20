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
  getters: {
	  incomingId: (state) => (id) => {
			return state.lists.filter((val) => val.id === id)
	  }
  },
};

export default Incoming;
