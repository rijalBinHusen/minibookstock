import 'fake-indexeddb/auto';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import {
  createStock,
  getStockById,
  StockToOutput,
} from '../src/composables/StockMaster';
import {
  createOutput,
  markAsFinished,
  getOutputById,
  getTotalStockTaken,
} from '../src/composables/Output';

let newItemId = null;
const quantityStock = faker.datatype.number({ min: 200 });
const availableStock = quantityStock;
const quantityOutput = faker.datatype.number({ max: quantityStock });
let newOutputId = null;

describe('create master stock', () => {
  it('Should create new master stock', async () => {
    // waiting proses create item and write to indexeddb
    const newItemIdReturned = await createStock(
      '01',
      '09823123',
      982938,
      quantityStock
    );
    // expecting the returned id not equal to false
    expect(newItemIdReturned).not.equal(false);
    // push to up
    newItemId = newItemIdReturned.id;
  });
});

const quantityOutputGreater = faker.datatype.number({
  min: quantityStock + 1000,
});

// create output greter than stock, must be fail
// create output lower than stock
describe(`create output ${quantityOutputGreater} more than stock ${quantityStock}, it must be false`, () => {
  it('Should not create output transaction', async () => {
    // waiting proses create item and write to indexeddb
    const newItemIdReturned = await createOutput(
      '029384',
      '092834',
      1,
      '09834',
      newItemId,
      quantityOutputGreater,
      'any'
    );
    // expecting the returned id equal to false
    expect(newItemIdReturned).equal(false);
  });
  // create output with stock master not exists
  it('Should not create output transaction', async () => {
    // waiting proses create item and write to indexeddb
    const newItemIdReturned = await createOutput(
      '029384',
      '092834',
      1,
      '09834',
      'loremIpsunDolor',
      quantityOutputGreater,
      'any'
    );
    // expecting the returned id equal to false
    expect(newItemIdReturned).equal(false);
  });
});

// create output lower than stock
describe('create output', () => {
  it('Should create output transaction', async () => {
    // waiting proses create item and write to indexeddb
    const newItemIdReturned = await createOutput(
      '029384',
      '092834',
      1,
      '09834',
      newItemId,
      quantityOutput,
      'any'
    );
    // expecting the returned id not equal to false
    // get output by id
    const output = await getOutputById(newItemIdReturned?.id);
    // quantity output must be 5
    expect(output?.quantity).equal(quantityOutput);
    // set output id
    newOutputId = newItemIdReturned?.id;
  });
});

// check available stock
describe(`available ${availableStock} must decrement by ${quantityOutput}`, () => {
  it(`Available stock should equal to ${
    quantityStock - quantityOutput
  }`, async () => {
    // get total stock taken
    const taken = await getTotalStockTaken(newItemId);
    // stock taken must be 5
    expect(taken?.allTaken).equal(quantityOutput);
    //  find rec the we're change
    const findRec = await getStockById(newItemId);
    // expecting available must 90 -5 = 85
    expect(findRec.available).equal(quantityStock - quantityOutput);
  });
});

// mark output as finished
describe('Mark output as finished', () => {
  it('Should mark finished output transaction', async () => {
    // waiting proses create item and write to indexeddb
    await markAsFinished(newOutputId);
    // expecting the returned id not equal to false
    // get output by id
    const output = await getOutputById(newOutputId);
    // quantity output must be 5
    expect(output?.quantity).equal(quantityOutput);
  });
});

// check quantity stock
describe(`Quantity ${quantityStock} must decrement by ${quantityOutput}`, () => {
  it(`Quantity stock should equal to ${
    quantityStock - quantityOutput
  }`, async () => {
    // get total stock taken
    const taken = await getTotalStockTaken(newItemId);
    // stock taken must be 5
    expect(taken?.allFinished).equal(quantityOutput);
    //  find rec the we're change
    const findRec = await getStockById(newItemId);
    // expecting available must 90 -5 = 85
    expect(findRec.quantity).equal(quantityStock - quantityOutput);
    expect(findRec.available).equal(quantityStock - quantityOutput);
  });
});
describe(`Testing class stock to output`, () => {
  it(`It must be iniate stock output`, () => {
    // initiate stock
    const stock = new StockToOutput();
    // the return must be not false
    expect(stock).not.equal(false);
    // get item that available
    const itemThatAvailable = stock.itemThatAvailable();
    // console.log('item that available:', itemThatAvailable);
    // expect state must be not null
    expect(itemThatAvailable.length).not.equal(0);
    // dateAvailable
    const dateAvailable = stock.getAvailableDateByItem(
      itemThatAvailable[0]?.item_id
    );
    // console.log('date available: ', dateAvailable);
    // must be return not null
    expect(dateAvailable.length).not.equal(0);
    // available stock
    const available = stock.getAvailableStock(dateAvailable[0]?.id);
    // console.log('available stock:', available);
    // expect
    expect(available).not.equal(0);
    // pick stock
    const numbertoPick = faker.datatype.number({ max: available });
    // console.log('number to pick: ', numbertoPick);
    stock.pickAvailableStock(dateAvailable[0]?.id, numbertoPick);
    const availableAfterPick = stock.getAvailableStock(dateAvailable[0]?.id);
    expect(availableAfterPick).equal(available - numbertoPick);
    // console.log('available after pick: ', availableAfterPick);
  });
});
