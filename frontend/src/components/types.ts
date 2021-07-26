// https://github.com/ethereum-ts/TypeChain/blob/1561c32e39611a255f56ffcd75c5a1701929b562/packages/typechain/src/parser/abiParser.ts#L68

import { BytesLike } from "@ethersproject/bytes";

export type StateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

export interface RawAbiDefinition {
    name: string
   // constant: boolean
    //payable: boolean
    stateMutability: StateMutability
    inputs: RawAbiParameter[]
    outputs: RawAbiParameter[]
    type: string
  }

  export interface RawAbiParameter {
    name: string
    type: string
    internalType?: string
    components?: RawAbiParameter[]
  }

  export interface RawEventAbiDefinition {
    type: 'event'
    anonymous?: boolean
    name: string
    inputs: RawEventArgAbiDefinition[]
  }

  export interface RawEventArgAbiDefinition {
    indexed: boolean
    name: string
    type: string
  }

  export interface FunctionParam {
    unitType: UnitTypes,
    value?: string | number | Uint8Array | BytesLike
}

export enum UnitTypes  {
    string = 'string',
    address = 'address',
    uint = 'uint256',
    bytes = 'bytes'
};

export enum ExecutionTypes  {
  default = 'Default (infer from function type)',
  local = 'Local call',
  tx = 'Transaction'
};

export enum FuncTypes {
    nonpayable,
    view,
    pure,
    payable
}