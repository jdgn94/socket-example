const expect = require('expect');
const {isRealString} = require('./isRealString');

describe('Is Real String', () => {
  it ('should reject non-string values', () => {
    let res = isRealString(13);
    expect(res).toBe(false);
  });

  it ('should reject string values with only space', () => {
    let res = isRealString(                           );
    expect(res).toBe(false);
  });
  
  it ('should all string with non-string chars', () => {
    let res = isRealString(            Hi         );
    expect(res).toBe(false);
  });
});