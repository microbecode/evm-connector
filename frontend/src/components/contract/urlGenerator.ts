import JSONCrush from "jsoncrush";
import {
  FunctionParam,
  IContract,
  IFuncTemplate,
  IShortContract,
  IShortFunc,
} from "../types";

export const generateUrl = (
  address: string,
  functions: IFuncTemplate[],
): string => {
  const param = encodeUrlParams(address, functions);
  const url = window.location.origin + "/view/" + param;
  return url;
};

export const decodeUrlParams = (crushed: string): IContract => {
  const json = JSONCrush.uncrush(crushed);
  const short = JSON.parse(json) as IShortContract;

  const funcs: IFuncTemplate[] = [];

  short.f.forEach((f) => {
    const inputs = f.i.map((p) => {
      return { unitType: p } as FunctionParam;
    });

    const outputs = f.o.map((p) => {
      return { unitType: p } as FunctionParam;
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

  functions.forEach((f) => {
    const inputs = f.funcInputParams.map((p) => p.unitType);
    const outputs = f.funcOutputParams.map((p) => p.unitType);

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
  const crushed = JSONCrush.crush(json);

  return crushed;
};
