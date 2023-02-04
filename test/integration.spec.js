// import "fake-indexeddb/auto"
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  createItem,
  getItemById,
  updateItemById,
  getItemIdByKdItem,
  getAllDataToBackup,
} from '../src/composables/MasterItems';
import {
  createStock,
  changeAvailableStock,
  getStockById,
  changeQuantityStock,
} from '../src/composables/StockMaster';
import {
  createIncoming,
  updateIncomingById,
  getIncomingById,
} from '../src/composables/Incoming';
import {
  createOutput,
  markAsFinished,
  markAsUnFinished,
  removeOutputById,
  changeQuantityOutput,
  getTotalStockTaken,
} from '../src/composables/Output';

const variableSaved = {
  newItemId: null,
  newStockId: null,
  newIncomingId: null,
  newOutputId: null,
};

for (let i = 0; i < 1; i++) {
  // item kode for item master
  const item_kode = faker.datatype.string(10);
  // item name
  const item_name = faker.name.firstName();
  // item age
  const item_age = faker.datatype.number({ min: 1, max: 12 });
  // item master
  describe('create master item', () => {
    it('Should create new item', async () => {
      // waiting proses create item and write to indexeddb
      const newItemIdReturned = await createItem(
        item_kode,
        item_name,
        false,
        false,
        item_age
      );
      // find the object from indexeddb by id
      const getData = await getItemById(newItemIdReturned);
      // expecting data that we got match with original record
      expect(getData.kd_item).equal(item_kode);
      // write to up, item id
      variableSaved.newItemId = newItemIdReturned;
    });
  });

  // new item varable for update
  const new_kd_item = faker.datatype.string(10);
  // nm_item
  const new_nm_item = faker.name.firstName('male');
  // age item
  const new_age_item = faker.datatype.number({ min: 1, max: 12 });

  // CREATE NEW ITEM
  describe('update master item', () => {
    it('Should create new item', async () => {
      // waiting proses update item and write to indexeddb
      await updateItemById(variableSaved.newItemId, {
        kd_item: new_kd_item,
        nm_item: new_nm_item,
        age_item: new_age_item,
      });
      // find the object from indexeddb by id
      const getData = await getItemById(variableSaved.newItemId);
      // expecting data that we got match with update record
      expect(getData.kd_item).equal(new_kd_item);
      expect(getData.nm_item).equal(new_nm_item);
      expect(getData.age_item).equal(new_age_item);
    });
  });

  // GET ITEM BY KODE
  describe('get item by kode', () => {
    it('item id must equal', async () => {
      // find the object from indexeddb by id
      const getData = await getItemIdByKdItem(new_kd_item);
      // expecting data that we got match with update record
      expect(getData.id).equal(variableSaved.newItemId);
      expect(getData.nm_item).equal(new_nm_item);
      expect(getData.age_item).equal(new_age_item);
    });
  });
  // end of item master

  // stock master
  const kd_produk = faker.datatype.string(12);
  const date_past = faker.date.past(10);
  const date_produk = date_past.getTime();
  const stock_quantity = faker.datatype.number({ min: 250, max: 15000 });
  // CREATE STOCK MASTER
  describe('create master stock', () => {
    it('Create and expect quantity equal', async () => {
      // waiting proses create item and write to indexeddb
      const newStockIdReturned = await createStock(
        variableSaved.newItemId,
        kd_produk,
        date_produk,
        stock_quantity
      );
      // expecting the returned id not equal to false
      expect(newStockIdReturned).not.equal(false);
      expect(newStockIdReturned).not.equal(null);
      // push to up
      variableSaved.newStockId = newStockIdReturned.id;
      // get stock by id
      const stock = await getStockById(newStockIdReturned.id);
      expect(stock.quantity).equal(stock_quantity);
      expect(stock.available).equal(stock_quantity);
    });
  });

  // incoming
  const incoming_paper = faker.datatype.string(20);
  const incoming_date_model = faker.date.past(1);
  const incoming_date = incoming_date_model.getTime();
  const incoming_type = faker.datatype.string(11);
  const incoming_shift = faker.datatype.number({ min: 1, max: 3 });
  const incoming_receiver = faker.name.firstName('male');
  const incoming_sender = faker.name.firstName('male');
  describe('Create new incoming record', () => {
    it('Should return not null', async () => {
      // waiting proses
      const income = await createIncoming(
        [variableSaved.newStockId],
        incoming_paper,
        incoming_date,
        incoming_shift,
        incoming_receiver,
        incoming_type,
        incoming_sender,
        false
      );
      //  save to variable
      variableSaved.newIncomingId = income.id;
      // expect
      expect(income).not.equal(null);
    });
  });
  // update incoming
  const newVariableIncoming = {
    paper_id: faker.datatype.string(30),
    diterima: faker.name.firstName('female'),
    type: faker.datatype.string(13),
    diserahkan: faker.name.firstName('female'),
  };
  describe('Update incoming record', () => {
    it('Should equal to new variable', async () => {
      // waiting proses
      await updateIncomingById(
        variableSaved.newIncomingId,
        newVariableIncoming
      );
      //  get incoming by id
      const incomingRec = await getIncomingById(variableSaved.newIncomingId);
      // expect not equal to old
      expect(incomingRec.diserahkan).not.equal(incoming_sender);
      expect(incomingRec.diterima).not.equal(incoming_receiver);
      expect(incomingRec.paper_id).not.equal(incoming_paper);
      expect(incomingRec.type).not.equal(incoming_type);
      // expect equal to new
      expect(incomingRec.diserahkan).equal(newVariableIncoming.diserahkan);
      expect(incomingRec.diterima).equal(newVariableIncoming.diterima);
      expect(incomingRec.paper_id).equal(newVariableIncoming.paper_id);
      expect(incomingRec.type).equal(newVariableIncoming.type);
    });
  });
  // end of incoming
  // output

  const output_paper = faker.datatype.string(20);
  const output_date_model = faker.date.past(1);
  const output_date = output_date_model.getTime();
  const output_type = faker.datatype.string(11);
  const output_shift = faker.datatype.number({ min: 1, max: 3 });
  const output_quantity = faker.datatype.number({
    min: 10,
    max: stock_quantity,
  });
  describe(`available stock is ${stock_quantity}, Create new output record quantity ${output_quantity}`, () => {
    it('Should return not null', async () => {
      // waiting proses
      const output = await createOutput(
        output_date,
        output_type,
        output_shift,
        output_paper,
        variableSaved.newStockId,
        output_quantity,
        output_paper
      );
      //  save to variable
      variableSaved.newOutputId = output.id;
      // expect
      expect(output).not.equal(null);
      //  send to variable saved
      variableSaved.newOutputId = output.id;
    });
  });

  // check available of stock
  // it must be equal to new new available stock - output quantity
  const availableStockAfterOutput1st = stock_quantity - output_quantity;
  const quantityStockAfterOutput1st = availableStockAfterOutput1st;
  describe(`Check available stock, must be ${availableStockAfterOutput1st} after decrement output ${output_quantity}`, () => {
    it(`Available stock must be equal to ${stock_quantity} - ${output_quantity} = ${availableStockAfterOutput1st}`, async () => {
      //  find rec the we're change
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting available must 90 -5 = 85
      expect(findRec.available).equal(availableStockAfterOutput1st);
    });
  });

  // mark as finished
  describe(`Mark output as finished, quantity stock must equal ${availableStockAfterOutput1st}`, () => {
    it('Should return not null', async () => {
      // waiting proses
      const output = await markAsFinished(variableSaved.newOutputId);
      // expect
      expect(output).not.equal(false);
    });
    // check quantity stock
    it(`Quantity stock should equal to ${stock_quantity} - ${output_quantity} = ${availableStockAfterOutput1st}`, async () => {
      //  find rec that we're change
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting available must 90 -5 = 85
      expect(findRec.quantity).equal(quantityStockAfterOutput1st);
      expect(findRec.available).equal(availableStockAfterOutput1st);
    });
  });

  // mark as un finished
  describe(`'Mark output as unfinished', available stock must be back to origin ${stock_quantity}`, () => {
    it('Should return not null', async () => {
      // waiting proses
      const output = await markAsUnFinished(variableSaved.newOutputId);
      // expect
      expect(output).not.equal(false);
    });
    // back to original quantity
    it(`Quantity stock should equal to original quantity`, async () => {
      //  find rec that we're change
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting quantity must 90 -5 = 85
      expect(findRec.quantity).equal(stock_quantity);
    });
  });

  // update to new quantity and other variable
  const new_output_quantity = faker.datatype.number({
    max: stock_quantity,
  });
  const availableStockAfterUpdateOutput = stock_quantity - new_output_quantity;
  describe(`Update quantity output as ${new_output_quantity}, available now ${stock_quantity} must be ${availableStockAfterUpdateOutput} after this.`, () => {
    it(`Quantity output must be equal`, async () => {
      //  find rec that we're change
      const updateOutput = await changeQuantityOutput(
        variableSaved.newOutputId,
        new_output_quantity
      );
      // expecting available must 90 -5 = 85
      expect(updateOutput).not.equal(false);
      // get all stock taken
      const allStockTaken = await getTotalStockTaken(variableSaved.newStockId);
      // check all stock taken must be equal
      expect(allStockTaken.allTaken).equal(new_output_quantity);
    });

    // check available stock, it must be equal to new available stock - new quantity output
    it(`Available ${stock_quantity} - ${new_output_quantity} = ${availableStockAfterUpdateOutput}`, async () => {
      //  find rec the we're change
      // sdfh/
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting available must be equal
      expect(findRec.available).equal(availableStockAfterUpdateOutput);
    });
  });

  // mark as finished
  describe('Mark output as finished', () => {
    it('Should return not null', async () => {
      // waiting proses
      const output = await markAsFinished(variableSaved.newOutputId);
      // expect
      expect(output).not.equal(false);
      // get all stock taken
      const allStockFinished = await getTotalStockTaken(
        variableSaved.newStockId
      );
      // check all stock taken must be equal
      expect(allStockFinished.allFinished).equal(new_output_quantity);
    });
  });

  // check quantity stock, it must be equal to new quantity stock - new quantity output
  describe(`quantity must be equal to ${stock_quantity} - ${new_output_quantity} = ${availableStockAfterUpdateOutput}`, () => {
    it(`Quantity stock should equal to ${availableStockAfterUpdateOutput}`, async () => {
      //  find rec that we're change
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting available must 90 -5 = 85
      expect(findRec.quantity).equal(availableStockAfterUpdateOutput);
      expect(findRec.available).equal(availableStockAfterUpdateOutput);
    });
  });

  // mark as un finished
  describe('Mark output as unfinished', () => {
    it('Should return not null', async () => {
      // waiting proses
      const output = await markAsUnFinished(variableSaved.newOutputId);
      // expect
      expect(output).not.equal(false);
    });
  });

  // check quantity stock, it must be equal to original quantity
  describe(`quantity must be equal to ${stock_quantity}`, () => {
    it(`Quantity stock should equal`, async () => {
      //  find rec that we're change
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting available must 90 -5 = 85
      expect(findRec.quantity).equal(stock_quantity);
    });
  });

  // remove output
  describe('Mark output as unfinished', () => {
    it('Should return not null', async () => {
      // waiting proses
      const output = await removeOutputById(variableSaved.newOutputId);
      // expect
      expect(output).not.equal(false);
    });
  });

  // check available stock, it must be equal to new available stock
  describe(`quantity must be equal to ${stock_quantity}`, () => {
    it(`Quantity stock should equal`, async () => {
      //  find rec that we're change
      const findRec = await getStockById(variableSaved.newStockId);
      // expecting available must 90 -5 = 85
      // expect(findRec.quantity).equal(stock_quantity);
      expect(findRec.available).equal(stock_quantity);
    });
  });
}
