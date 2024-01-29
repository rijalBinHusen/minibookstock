import "fake-indexeddb/auto";
import { describe, it, expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import { Items } from "./MasterItems";

describe("Test master item", async () => {
  
  const { createItem, getItemById, updateItemById, getItemByKdItem } = Items();
  
  const kodeItemError = "Kode item tidak boleh kosong";
  const nameItemError = "Nama item tidak boleh kosong";
  const umurItemError = "Umur item tidak boleh kosong";
  
  // testing create item
  it("Create new record", async () => {
    
    for(let i=0; i < 20; i++) {
      // new record
      const kd_item = faker.datatype.string(5);
      const nm_item = faker.datatype.string(15);
      const age_item = faker.datatype.number({ min: 1, max: 12 }) + "";
      const sort_item = faker.datatype.number();
      
      // item created
      const idItem = await createItem(kd_item, nm_item, "", 0, age_item, sort_item);
      expect(typeof idItem).toBe("string");

      // failed create item because kode item is null
      const createFailed = await createItem("", nm_item, "", 0, age_item, 0);
      expect(createFailed[0]).toBe(kodeItemError)

      // failed create item because name item is null
      const createFailed2 = await createItem(kd_item, "", "", 0, age_item, 0);
      expect(createFailed2[0]).toBe(nameItemError)

      // failed create item because age item is null
      const createFailed3 = await createItem(kd_item, nm_item, "", 0, 0, 0);
      expect(createFailed3[0]).toBe(umurItemError)

      // failed create item because age item is null
      const createFailed4 = await createItem("", "", "", 0, 0, 0);
      expect(createFailed4.join(", ")).toBe(kodeItemError + ", " + nameItemError + ", " + umurItemError)
    }
  });

  it("Create,  getItemById, update, and getItemByKdItem, the item must matched", async () => {
    
    for(let i=0; i < 20; i++) {
      // new record
      const kd_item = faker.datatype.string(5);
      const nm_item = faker.datatype.string(15);
      const age_item = faker.datatype.number({ min: 1, max: 12 }) + "";
      const sort_item = faker.datatype.number();
      
      // item created
      const idItem = await createItem(kd_item, nm_item, "", 0, age_item, sort_item);
      expect(typeof idItem).toBe('string');

      const item = await getItemById(idItem);

      // expect item information must be matched
      expect(item.id).toBe(idItem);
      expect(item.kd_item).toBe(kd_item);
      expect(item.nm_item).toBe(nm_item);
      expect(item.age_item).toBe(age_item);
      expect(item.sort_item).toBe(sort_item);

      // failed // failed update item because kode item is null
      const updateFailed = await updateItemById(idItem, { kd_item: "" });
      expect(updateFailed[0]).toBe(kodeItemError)

      // failed update item because name item is null
      const updateFailed2 = await updateItemById(idItem, { nm_item: "" });
      expect(updateFailed2[0]).toBe(nameItemError)

      // failed update item because age item is null
      const updateFailed3 = await updateItemById(idItem, { age_item: 0 });
      expect(updateFailed3[0]).toBe(umurItemError)

      // failed update item because age item is null
      const updateFailed4 = await updateItemById(idItem, { });
      expect(updateFailed4.join(", ")).toBe(kodeItemError + ", " + nameItemError + ", " + umurItemError)

      const kd_item_update = faker.datatype.string(7);
      // updated item
      const updated = await updateItemById(idItem, { kd_item: kd_item_update });
      expect(updated).toBe(true)

      const item2 = await getItemByKdItem(kd_item_update);

      // expect item information must be matched after updated
      expect(item2.id).toBe(idItem);
      expect(item2.kd_item).toBe(kd_item_update);
    }
  });

});
