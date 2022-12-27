import { idb } from "./localbase";

let summaryDB = async () => await idb("summary");
let timeOut;
let storeToUpdate = []; //store that would to update

// store would contain { lastId: value, total: value }
export async function summary(storeName) {
  // would return { }
  const lastUpdated = await summaryDB.getdataByKey(storeName);
  //   to update summary
  const updateSummary = async (lastId) => {
    await summaryDB.setData(storeName, {
      lastId,
      total: lastUpdated?.total ? lastUpdated?.total + 1 : 1,
    });
  };

  return { lastUpdated, updateSummary };
}
