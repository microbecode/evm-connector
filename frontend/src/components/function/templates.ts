import { IFuncTemplate } from "../types";

export const functionTemplates : IFuncTemplate[] = [ 
    // ERC 20
    {
        selectionTitle: 'Input manually',
        funcName: '',
        funcType: 'nonpayable',
        funcInputParams: [],
        funcOutputParams: []
    },
    {
        selectionTitle: 'ERC20: totalSupply',
        funcName: 'totalSupply',
        funcType: 'view',
        funcInputParams: [],
        funcOutputParams: [{ unitType: 'uint' }]
    },
    {
        selectionTitle: 'ERC20: balanceOf',
        funcName: 'balanceOf',
        funcType: 'view',
        funcInputParams: [{ unitType: 'address' }],
        funcOutputParams: [{ unitType: 'uint' }]
    },
    {
        selectionTitle: 'ERC20: transfer',
        funcName: 'transfer',
        funcType: 'nonpayable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'uint' }],
        funcOutputParams: [{ unitType: 'bool' }]
    },
    {
        selectionTitle: 'ERC20: allowance',
        funcName: 'allowance',
        funcType: 'view',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }],
        funcOutputParams: [{ unitType: 'uint' }]
    },
    {
        selectionTitle: 'ERC20: approve',
        funcName: 'approve',
        funcType: 'nonpayable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'uint' }],
        funcOutputParams: [{ unitType: 'bool' }]
    },
    {
        selectionTitle: 'ERC20: transferFrom',
        funcName: 'transferFrom',
        funcType: 'nonpayable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }, { unitType: 'uint' }],
        funcOutputParams: [{ unitType: 'bool' }]
    },
    // ERC 721
    {
        selectionTitle: 'ERC721: balanceOf',
        funcName: 'balanceOf',
        funcType: 'view',
        funcInputParams: [{ unitType: 'address' }],
        funcOutputParams: [{ unitType: 'uint' }]
    },
    {
        selectionTitle: 'ERC721: ownerOf',
        funcName: 'ownerOf',
        funcType: 'view',
        funcInputParams: [{ unitType: 'uint' }],
        funcOutputParams: [{ unitType: 'address' }]
    },
  /*   {
        selectionTitle: 'ERC721: safeTransferFrom',
        funcName: 'safeTransferFrom',
        funcType: 'payable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }, { unitType: 'uint' }, { unitType: 'string' }],
        funcOutputParams: []
    },
    {
        selectionTitle: 'ERC721: safeTransferFrom',
        funcName: 'safeTransferFrom',
        funcType: 'payable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }, { unitType: 'uint' }],
        funcOutputParams: []
    }, */
    {
        selectionTitle: 'ERC721: transferFrom',
        funcName: 'transferFrom',
        funcType: 'payable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }, { unitType: 'uint' }],
        funcOutputParams: []
    },
    {
        selectionTitle: 'ERC721: approve',
        funcName: 'approve',
        funcType: 'payable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'uint' }],
        funcOutputParams: []
    },
    {
        selectionTitle: 'ERC721: setApprovalForAll',
        funcName: 'setApprovalForAll',
        funcType: 'nonpayable',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'bool' }],
        funcOutputParams: []
    },
    {
        selectionTitle: 'ERC721: getApproved',
        funcName: 'getApproved',
        funcType: 'view',
        funcInputParams: [{ unitType: 'uint' }],
        funcOutputParams: [{ unitType: 'address' }]
    },
    {
        selectionTitle: 'ERC721: isApprovedForAll',
        funcName: 'isApprovedForAll',
        funcType: 'view',
        funcInputParams: [{ unitType: 'address' }, { unitType: 'address' }],
        funcOutputParams: [{ unitType: 'bool' }]
    }
];