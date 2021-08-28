// https://github.com/ethereum-ts/TypeChain/blob/1561c32e39611a255f56ffcd75c5a1701929b562/packages/typechain/src/parser/abiParser.ts#L68

import { BytesLike } from "@ethersproject/bytes";
import { ParamType } from "ethers/lib/utils";

export type StateMutability = "pure" | "view" | "nonpayable" | "payable";

export interface RawAbiDefinition {
  name: string;
  // constant: boolean
  //payable: boolean
  stateMutability: StateMutability;
  inputs: RawAbiParameter[];
  outputs: RawAbiParameter[];
  type: string;
}

export interface RawAbiParameter {
  name: string;
  type: string;
  internalType?: string;
  components?: RawAbiParameter[];
}

export interface RawEventAbiDefinition {
  type: "event";
  anonymous?: boolean;
  name: string;
  inputs: RawEventArgAbiDefinition[];
}

export interface RawEventArgAbiDefinition {
  indexed: boolean;
  name: string;
  type: string;
}

export const UnitTypes: string[] = ["address", "bool", "bytes", "int", "uint", "string"];

export enum ExecutionTypes {
  default = "default (infer from function type)",
  local = "local call",
}

export enum FuncTypes {
  nonpayable,
  view,
  pure,
  payable,
}

export interface IContractTemplate {
  name: string;
  functions: IFuncTemplate[];
}

export interface IContract {
  address: string;
  functions: IFuncTemplate[];
}

export interface IFuncTemplate {
  funcName: string;
  funcType: StateMutability;
  funcInputParams: IFunctionParam[];
  funcOutputParams: IFunctionParam[];
}

export interface IFunctionParam {
  unitType: string; // the full type: uint, uint[], string[6], ...
  basicType: string; // uint, string, address, ...
  value?: any;
  staticArraySize?: number;
  components?: IFunctionParam[];
}

export interface IShortContract {
  a: string;
  f: IShortFunc[];
}

export interface IShortFunc {
  n: string; // name of the function
  t: StateMutability; // type: view, pure, ...
  i: IShortParamType[]; // inputs
  o: IShortParamType[]; // outputs
}

export interface IShortParamType {
  t: string; // type: uint, string[5], tuple, ...
  c?: IShortParamType[]; // components for tuple types: [string, uint], ...
}
