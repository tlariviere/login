import CircularArray from "./CircularArray";

describe("Circular array", () => {
  test("pushOrReplace should push value if buffer is not full", () => {
    const arr: CircularArray<number> = new CircularArray(2);
    arr.pushOrReplace(1);
    expect(arr.values()).toEqual([1]);
    arr.pushOrReplace(2);
    expect(arr.values()).toEqual([1, 2]);
  });

  test("pushOrReplace should replace oldest value if buffer is full", () => {
    const arr: CircularArray<number> = new CircularArray(2);
    arr.pushOrReplace(1);
    arr.pushOrReplace(2);
    arr.pushOrReplace(3);
    expect(arr.values()).toEqual([3, 2]);
    arr.pushOrReplace(4);
    expect(arr.values()).toEqual([3, 4]);
  });

  test("pushOrReplace should return replaced value if buffer is full", () => {
    const arr: CircularArray<number> = new CircularArray(1);
    expect(arr.pushOrReplace(1)).toBeUndefined();
    expect(arr.pushOrReplace(2)).toBe(1);
  });

  test("back should return element at current index or undefined", () => {
    const arr: CircularArray<number> = new CircularArray(2);
    expect(arr.back()).toBeUndefined();
    arr.pushOrReplace(1);
    expect(arr.back()).toBe(1);
    arr.pushOrReplace(2);
    arr.pushOrReplace(3);
    expect(arr.back()).toBe(3);
  });

  test("clear should empty buffer", () => {
    const arr: CircularArray<number> = new CircularArray(2);
    arr.pushOrReplace(1);
    arr.clear();
    expect(arr.values()).toEqual([]);
  });

  test("constructor should throw on 0 or negative `maxLength` argument", () => {
    expect(() => new CircularArray(0)).toThrow(
      "Invalid argument 'maxLength': expected stricly positive number"
    );
    expect(() => new CircularArray(-1)).toThrow(
      "Invalid argument 'maxLength': expected stricly positive number"
    );
  });
});
