import Localbase from "localbase";

// initiate new db
let db = new Localbase("myreport");

export const idb = async (nameOfStore) => {
  // get data by key
  const getdataByKey = (keyToSearch) => {
    return db.collection(nameOfStore).doc(keyToSearch).get();
  };

  const setData = (id, valueObject) => {
    return db.collection(nameOfStore).doc(id).set(valueObject);
  };

  return { getdataByKey, setData };
};
