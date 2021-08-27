import { IContractTemplate } from "../types";

export const contractTemplates: IContractTemplate[] = [
  {
    name: "ERC20",
    functions: [
      {
        funcName: "name",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "string", basicType: "string" }],
      },
      {
        funcName: "symbol",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "string", basicType: "string" }],
      },
      {
        funcName: "decimals",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "uint8", basicType: "uint" }],
      },
      {
        funcName: "totalSupply",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
      {
        funcName: "balanceOf",
        funcType: "view",
        funcInputParams: [{ unitType: "address", basicType: "address" }],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
      {
        funcName: "transfer",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
      {
        funcName: "transferFrom",
        funcType: "nonpayable",
        funcInputParams: [
          { unitType: "address", basicType: "address" },
          { unitType: "address", basicType: "address" },
          { unitType: "uint256", basicType: "uint" },
        ],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
      {
        funcName: "approve",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
      {
        funcName: "allowance",
        funcType: "view",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "address", basicType: "address" }],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
    ],
  },
  {
    name: "ERC721",
    functions: [
      {
        funcName: "balanceOf",
        funcType: "view",
        funcInputParams: [{ unitType: "address", basicType: "address" }],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
      {
        funcName: "ownerOf",
        funcType: "view",
        funcInputParams: [{ unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [{ unitType: "address", basicType: "address" }],
      },
      /*   {
                funcName: 'safeTransferFrom',
                funcType: 'payable',
                funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }, { unitType: 'uint' }, { unitType: 'string' }],
                funcOutputParams: []
            },
            {
                funcName: 'safeTransferFrom',
                funcType: 'payable',
                funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }, { unitType: 'uint' }],
                funcOutputParams: []
            }, */
      {
        funcName: "transferFrom",
        funcType: "payable",
        funcInputParams: [
          { unitType: "address", basicType: "address" },
          { unitType: "address", basicType: "address" },
          { unitType: "uint256", basicType: "uint" },
        ],
        funcOutputParams: [],
      },
      {
        funcName: "approve",
        funcType: "payable",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [],
      },
      {
        funcName: "setApprovalForAll",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "bool", basicType: "bool" }],
        funcOutputParams: [],
      },
      {
        funcName: "getApproved",
        funcType: "view",
        funcInputParams: [{ unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [{ unitType: "address", basicType: "address" }],
      },
      {
        funcName: "isApprovedForAll",
        funcType: "view",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "address", basicType: "address" }],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
    ],
  },
  {
    name: "BEP20",
    functions: [
      {
        funcName: "name",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "string", basicType: "string" }],
      },
      {
        funcName: "symbol",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "string", basicType: "string" }],
      },
      {
        funcName: "decimals",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "uint8", basicType: "uint" }],
      },
      {
        funcName: "totalSupply",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
      {
        funcName: "balanceOf",
        funcType: "view",
        funcInputParams: [{ unitType: "address", basicType: "address" }],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
      {
        funcName: "getOwner",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "address", basicType: "address" }],
      },
      {
        funcName: "transfer",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
      {
        funcName: "transferFrom",
        funcType: "nonpayable",
        funcInputParams: [
          { unitType: "address", basicType: "address" },
          { unitType: "address", basicType: "address" },
          { unitType: "uint256", basicType: "uint" },
        ],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
      {
        funcName: "approve",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "uint256", basicType: "uint" }],
        funcOutputParams: [{ unitType: "bool", basicType: "bool" }],
      },
      {
        funcName: "allowance",
        funcType: "view",
        funcInputParams: [{ unitType: "address", basicType: "address" }, { unitType: "address", basicType: "address" }],
        funcOutputParams: [{ unitType: "uint256", basicType: "uint" }],
      },
    ],
  },
];
