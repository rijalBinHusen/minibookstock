import localforage from "localforage";

export const setItem = (key, value) => {
  const db = "my_report_stock";
  const nameStore = localforage.createInstance({
    name: db,
    storeName: "items",
  });
  nameStore
    .setItem(key, value)
    .then(function (value) {
      // Do other things once the value has been saved.
      console.log(value);
    })
    .catch(function (err) {
      // This code runs if there were any errors
      console.log(err);
    });
};
