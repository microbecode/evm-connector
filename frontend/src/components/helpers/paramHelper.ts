import { IFunctionParam } from "../types";

export const parseParam = (unitType: string): IFunctionParam => {
    const item: IFunctionParam = {
        unitType: unitType,
        basicType: ''
    };

    item.staticArraySize = 0;
    if (unitType.indexOf("[") > -1) {
        item.value = [];

        const arraySizeMatch = unitType.match(/\[(\d+)\]/);

        if (arraySizeMatch) {
            item.staticArraySize = +arraySizeMatch[1];
        }
    } else {
        item.value = "";
    }
    item.basicType = unitType.replace(/\[.*\]/, "").replace(/\d/g, ""); // remove array and number elements
    return item;
}