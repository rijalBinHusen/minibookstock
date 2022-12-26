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

  const getAllDataOrderByIdDesc = () => {
    return db.collection(nameOfStore).orderBy("id", "desc").get();
  };

  const updateDataById = (id, keyValueToUpdate) => {
    return db.collection(nameOfStore).doc(id).update(keyValueToUpdate);
  };

  const getDataByKeyValue = (keyValue) => {
    console.log(keyValue);
    return db.collection(nameOfStore).doc(keyValue).get();
  };
  return {
    getdataByKey,
    setData,
    getAllDataOrderByIdDesc,
    updateDataById,
    getDataByKeyValue,
  };
};
