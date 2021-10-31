const Group = {
  namespaced: true,
  state: {
    lists: [],
  },
  mutations: {
    group(state, value) {
      state.lists = value;
    },
    append(state, value) {
      state.lists.push(value);
    },
    update(state, value) {
      state.lists = state.lists.map((val) => {
        return val.id === value.id ? value : val;
      });
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    append({ dispatch, commit, state }, value) {
      // atur record yang akan dimasukkan
      let record = {
        store: "Group",
        obj: value,
        id: state.lists.length > 0 ? state.lists.slice(-1)[0].id : "GRP",
      };
      dispatch("append", record, { root: true });
    },
  },
  getters: {
    groupActive(state, getters, rootState, rootGetters) {
      // get all group active
      return state.lists.filter((val) => val.status);
    },
  },
};

export default Group;
