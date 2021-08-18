import { IContractTemplate } from "../types";

export const contractTemplates: IContractTemplate[] = [
  {
    name: "ERC20",
    functions: [
      {
        funcName: "totalSupply",
        funcType: "view",
        funcInputParams: [],
        funcOutputParams: [{ unitType: "uint" }],
      },
      {
        funcName: "balanceOf",
        funcType: "view",
        funcInputParams: [{ unitType: "address" }],
        funcOutputParams: [{ unitType: "uint" }],
      },
      {
        funcName: "transfer",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address" }, { unitType: "uint" }],
        funcOutputParams: [{ unitType: "bool" }],
      },
      {
        funcName: "allowance",
        funcType: "view",
        funcInputParams: [{ unitType: "address" }, { unitType: "address" }],
        funcOutputParams: [{ unitType: "uint" }],
      },
      {
        funcName: "approve",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address" }, { unitType: "uint" }],
        funcOutputParams: [{ unitType: "bool" }],
      },
      {
        funcName: "transferFrom",
        funcType: "nonpayable",
        funcInputParams: [
          { unitType: "address" },
          { unitType: "address" },
          { unitType: "uint" },
        ],
        funcOutputParams: [{ unitType: "bool" }],
      },
    ],
  },
  {
    name: "ERC721",
    functions: [
      {
        funcName: "balanceOf",
        funcType: "view",
        funcInputParams: [{ unitType: "address" }],
        funcOutputParams: [{ unitType: "uint" }],
      },
      {
        funcName: "ownerOf",
        funcType: "view",
        funcInputParams: [{ unitType: "uint" }],
        funcOutputParams: [{ unitType: "address" }],
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
          { unitType: "address" },
          { unitType: "address" },
          { unitType: "uint" },
        ],
        funcOutputParams: [],
      },
      {
        funcName: "approve",
        funcType: "payable",
        funcInputParams: [{ unitType: "address" }, { unitType: "uint" }],
        funcOutputParams: [],
      },
      {
        funcName: "setApprovalForAll",
        funcType: "nonpayable",
        funcInputParams: [{ unitType: "address" }, { unitType: "bool" }],
        funcOutputParams: [],
      },
      {
        funcName: "getApproved",
        funcType: "view",
        funcInputParams: [{ unitType: "uint" }],
        funcOutputParams: [{ unitType: "address" }],
      },
      {
        funcName: "isApprovedForAll",
        funcType: "view",
        funcInputParams: [{ unitType: "address" }, { unitType: "address" }],
        funcOutputParams: [{ unitType: "bool" }],
      },
    ],
  },
];
