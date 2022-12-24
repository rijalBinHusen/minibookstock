/* eslint-disable no-unused-vars */
import { createStore } from "vuex";

export default createStore({
  state: {
    form: null,
    dialogMessage: null,
    dialogType: null,
  },
  mutations: {
    form(state, form) {
      state.form = form;
    },
    confirmPayload(state, payload) {
      state.dialogMessage = payload?.message;
      state.dialogType = payload?.type;
    },
    tunnelMessage(val) {
      return val;
    },
  },
  actions: {
    // to add to indexeddb
    append({ commit }, value) {},
    // to update record in indexeddb
    update({ commit }, value) {},
    // Getting all data in indexeddb
    getStart({ commit }) {},
  },
  getters: {},
  modules: {},
});
