import { useIdb } from "./localforage";

let timeOut;
let storeToUpdate = []; //store that would to update

// store would contain { lastId: value, total: value }
export async function summary(storeName) {
  const summaryDB = await useIdb("summary")
  // would return { }
  const lastUpdated = await summaryDB.getItem(storeName)
  //   to update summary
  const updateSummary = async (lastId) => {
    const record = { lastId, total: lastUpdated?.total ? lastUpdated?.total + 1 : 1}
    await summaryDB.setItem(storeName, record)
    return;
  };

  return { lastUpdated, updateSummary };
}
