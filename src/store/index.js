/* eslint-disable no-unused-vars */
import { createStore } from "vuex";
import Localbase from "../Localbase";
import Group from "./Module/Group";
import Master from "./Module/Master";
import Item from "./Module/Item";
import Incoming from "./Module/Incoming";
import Mutation from "./Module/Mutation";

export default createStore({
  state: {
    form: "",
  },
  mutations: {
    form(state, form) {
      state.form = form;
    },
  },
  actions: {
    // to add to indexeddb
    append({ commit }, value) {
      // value = {store: 'nameOfStore', obj: {object: 'to append to indexeddb'}, id: String
      // the first letter of value.store must be capital e.g 'Group'

      // create id to the record
      if (value.id) value.obj.id = Localbase.generateId(value.id);
      // commit to module e.g 'Group/append
      commit(`${value.store}/append`, value.obj, { root: true });
      // insert record to indexeddb and return as promise
      return new Promise((resolve) => {
        Localbase.append(value.store.toLowerCase(), value.obj);
        setTimeout(() => resolve(), 30);
      });
    },
    // to update record in indexeddb
    update({ commit }, value) {
      // value = {store: 'nameOfStore', obj: {id: idOfDocument, object: 'to append to indexeddb'} }
      // the first letter of value.store must be capital e.g 'Group'

      // send to indexeddb
      Localbase.update(
        value.store.toLowerCase(),
        { id: value.obj.id },
        value.obj
      );
      // send to module
      commit(`${value.store}/update`, value.obj, { root: true });
    },
    // Getting all data in indexeddb
    getStart({ commit }) {
      // list of store
      let store = ["Group", "Item", "Master", "Incoming", "Mutation"];
      // iterate the store
      store.forEach((val) => {
        // call the get data functions
        Localbase.getData({
          store: val.toLowerCase(),
          orderBy: "id",
          desc: true,
        }).then((result) =>
          commit(`${val}/${val.toLowerCase()}`, result, { root: true })
        );
      });
    },
  },
  getters: {
    dateFormat: () => (a) => {
      const a001 = a[1] ? new Date(a[1]) : new Date();
      const a002 = a001.getDate();
      const a003 = a001.getMonth();
      const a004 = a001.getFullYear();
      const a005 =
        a001.getHours() > 9 ? a001.getHours() : "0" + a001.getHours();
      const a006 =
        a001.getMinutes() > 9 ? a001.getMinutes() : "0" + a001.getMinutes();
      const a007 = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Des",
      ];

      if (a[0] == "time") {
        return a001.getTime();
      } //dapatkan waktu dalam bentuk mili second
      else if (a[0] == "full") {
        return a002 + " " + a007[a003] + " " + a004 + " " + a005 + ":" + a006;
      } //dapatkan waktu penuh yyyy mmm dd hh:mm
      else if (a[0] == "+1") {
        return a001.getTime() - 25200000 + 86400000;
      } // hari selanjutnya pada jam 00:00
      else if (a[0] == "-1") {
        return a001.getTime() - 25200000 - 86400000;
      } // hari sebelumnya pada jam 00:00
      else if (a[0] == "0") {
        return a001.getTime() - 25200000;
      } // hari yang tersebut pada jam 00:00
      else if (a[0] == "waktu") {
        return a005 + ":" + a006;
      }
    },
  },
  modules: {
    Group,
    Master,
    Item,
    Incoming,
    Mutation,
  },
});
