import { IFunctionParam } from "../types";

export const parseParam = (unitType: string): IFunctionParam => {
  const item: IFunctionParam = {
    unitType: unitType,
    basicType: "",
  };

  if (unitType.indexOf("tuple") > -1) {
    return null; // tuples not supported yet
  }
  if (unitType.indexOf("[") > -1) {
    item.value = [];
  } else {
    item.value = "";
  }
  item.basicType = unitType.replace(/\[.*\]/, "").replace(/\d/g, ""); // remove array and number elements
  return item;
};
