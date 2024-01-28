export const objectsEqual = (o1: any, o2: any): boolean =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const deepEqual = (x: any, y: any): boolean => {
  return x && y && typeof x === "object" && typeof y === "object"
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).reduce(function (isEqual: any, key: any) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true)
    : x === y;
};
