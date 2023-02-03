import 'fake-indexeddb/auto';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import {
  createStock,
  getStockById,
  changeQuantityStock,
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

// create output
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
