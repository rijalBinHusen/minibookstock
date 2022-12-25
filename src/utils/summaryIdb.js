import { useIdb } from "./localforage";

const db = await useIdb("summary");

export const summaryIdb = async (table) => {
  // summary table would contain key = { lastId: value, totalRecord: value }
  // get last summary first
  const lastUpdated = await db.getItem(table);
  // to update summary of table
  const updateSummary = async (lastId) => {
    // update summary
    db.setItem(table, {
      lastId,
      totalRecord: lastUpdated ? lastUpdated.totalRecord++ : 1,
    });
  };

  return { updateSummary, lastUpdated };
};
