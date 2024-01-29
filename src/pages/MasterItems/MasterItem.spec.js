import "fake-indexeddb/auto";
import { describe, it, expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import { Items } from "./MasterItems";

describe("Click submit button ", async () => {
  
  const { createItem, getItemById  } = Items();
  
  // testing create item
  it("Create new record", async () => {
    
    const kodeItemError = "Kode item tidak boleh kosong";
    const nameItemError = "Nama item tidak boleh kosong";
    const umurItemError = "Umur item tidak boleh kosong";
    
    for(let i=0; i < 20; i++) {
      // new record
      const kd_item = faker.datatype.string(5);
      const nm_item = faker.datatype.string(15);
      const age_item = faker.datatype.number({ min: 1, max: 12 }) + "";
      const sort_item = faker.datatype.number();
      
      // item created
      const idItem = await createItem(kd_item, nm_item, "", 0, age_item, sort_item);
      expect(idItem.length).toBe(14);

      // failed create item because kode item is null
      const createFailed = await createItem("", nm_item, "", 0, age_item, 0);
      expect(createFailed).toBe(kodeItemError)

      // failed create item because name item is null
      const createFailed2 = await createItem(kd_item, "", "", 0, age_item, 0);
      expect(createFailed2).toBe(nameItemError)

      // failed create item because age item is null
      const createFailed3 = await createItem(kd_item, nm_item, "", 0, 0, 0);
      expect(createFailed3).toBe(umurItemError)

      // failed create item because age item is null
      const createFailed4 = await createItem("", "", "", 0, 0, 0);
      expect(createFailed4).toBe(kodeItemError + ", " + nameItemError + ", " + umurItemError)
    }
  });

  it("Create and getItemById, the item must matched", async () => {
    
    for(let i=0; i < 20; i++) {
      // new record
      const kd_item = faker.datatype.string(5);
      const nm_item = faker.datatype.string(15);
      const age_item = faker.datatype.number({ min: 1, max: 12 }) + "";
      const sort_item = faker.datatype.number();
      
      // item created
      const idItem = await createItem(kd_item, nm_item, "", 0, age_item, sort_item);
      expect(idItem.length).toBe(14);

      const item = await getItemById(idItem);

      // expect item information must be matched
      expect(item.id).toBe(idItem);
      expect(item.kd_item).toBe(kd_item);
      expect(item.nm_item).toBe(nm_item);
      expect(item.age_item).toBe(age_item);
      expect(item.sort_item).toBe(sort_item);
    }
  });

});
