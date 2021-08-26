import { ParamType } from "ethers/lib/utils";
import JSONCrush from "jsoncrush";
import {
  IFunctionParam,
  IContract,
  IFuncTemplate,
  IShortContract,
  IShortFunc,
  IShortParamType,
} from "../types";

export const generateUrl = (
  address: string,
  functions: IFuncTemplate[],
): string => {
  const param = encodeUrlParams(address, functions);
  const url = window.location.origin + "/load/" + param;
  return url;
};

export const decodeUrlParams = (crushed: string): IContract => {
  const json = JSONCrush.uncrush(crushed);
  const short = JSON.parse(json) as IShortContract;

  const funcs: IFuncTemplate[] = [];

  const mapParam = (param: IShortParamType): IFunctionParam => {
    const put: IFunctionParam = {
      unitType: param.t,
      staticArraySize: 0,
    };
    if (param.t == "tuple") {
      put.components = param.c.map((c): IFunctionParam => {
        return mapParam(c);
      });
    }
    if (param.t.indexOf("[") > -1) {
      put.value = [];
      const arraySize = +param.t.substr(
        param.t.indexOf("[") + 1,
        param.t.indexOf("]") - param.t.indexOf("[") - 1,
      );

      if (Number.isInteger(arraySize)) {
        //console.log("decoding", param.t, arraySize);
        // If there is a number after [, this is a statically sized array
        put.staticArraySize = arraySize;
        put.unitType = put.unitType.replace(/\[.*\]/, "[]");
      }
    }
    return put;
  };

  short.f.forEach((f) => {
    const inputs = f.i.map((p) => {
      return mapParam(p);
    });

    const outputs = f.o.map((p) => {
      return mapParam(p);
    });

    const func: IFuncTemplate = {
      funcName: f.n,
      funcType: f.t,
      funcInputParams: inputs,
      funcOutputParams: outputs,
    };

    funcs.push(func);
  });

  const contract: IContract = {
    address: short.a,
    functions: funcs,
  };
  return contract;
};

const encodeUrlParams = (
  address: string,
  functions: IFuncTemplate[],
): string => {
  const funcs: IShortFunc[] = [];

  const mapParam = (param: IFunctionParam): IShortParamType => {
    const put: IShortParamType = {
      t: param.unitType,
    };
    if (param.unitType == "tuple") {
      put.c = param.components.map((c) => mapParam(c));
    }
    if (param.staticArraySize > 0) {
      put.t = param.unitType.replace(
        /\[.*\]/,
        "[" + param.staticArraySize + "]",
      );
    }
    return put;
  };

  functions.forEach((f) => {
    const inputs = f.funcInputParams.map((p) => {
      return mapParam(p);
    });

    const outputs = f.funcOutputParams.map((p) => {
      return mapParam(p);
    });

    const func: IShortFunc = {
      n: f.funcName,
      t: f.funcType,
      i: inputs,
      o: outputs,
    };
    funcs.push(func);
  });

  const contr: IShortContract = {
    a: address,
    f: funcs,
  };

  const json = JSON.stringify(contr);
  console.log("json", json);
  const crushed = JSONCrush.crush(json);

  return crushed;
};
