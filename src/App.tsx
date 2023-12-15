import { useEffect, useState, FunctionComponent, ReactElement, CSSProperties } from "react";
import { Interface, TransactionDescription } from '@ethersproject/abi';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import "./App.css";

function shortenAddress(address: string, digits = 4) {
  if (!address) return '';
  return `${address.substring(0, digits + 2)}...${address.substring(address.length - digits)}`;
}

const TokenName = "Unknown";
const TokenIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Ub2tlbnM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnlLvmnb8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NzUuMDAwMDAwLCAtMzEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUb2tlbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2My4wMDAwMDAsIDE4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik1haW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjA5Mzc5NDEsOS42MTI5NjI4NiBDMTMuODI1MTcwNSw5LjIzMjgzNDcgMTMuMzU0NjM0MSw5LjAwMTM2MzM1IDEyLjg0Nzc5NjcsOSBMNC4xNTUyOTU4Niw5IEMzLjY0NTgzNTIxLDguOTk5MTE2MzYgMy4xNzE5MzgxMiw5LjIzMDg3MDA1IDIuOTAxOTI0ODUsOS42MTI5NjI4NyBMMC4yMjU2MTM1MjcsMTMuNDAxNDg4OCBDLTAuMTE4NTc4MzcxLDEzLjg4NjUyMzggLTAuMDY0NzQ2MDY4OCwxNC41MTMzOTYyIDAuMzU4MzIzMzY0LDE0Ljk0Njg4NyBMNy45Mzc1MjYzNCwyMi43NzE3MTM4IEM4LjIwMjE2NjI4LDIzLjA0NTQxMDcgOC42Njc1Njc0MywyMy4wNzc1NDY0IDguOTc3MDMwNTIsMjIuODQzNDkxNiBDOS4wMDYxNTA3MywyMi44MjE0NjcyIDkuMDMzMjg1MzEsMjIuNzk3NDY4NiA5LjA1ODE4NzY5LDIyLjc3MTcxMzggTDE2LjYzNzM5MDcsMTQuOTQ2ODg3IEMxNy4wNjI4MDQxLDE0LjUxNDg3ODIgMTcuMTE5NjMzNywxMy44ODc5MTQzIDE2Ljc3NzQ3MzIsMTMuNDAxNDg4OCBMMTQuMDkzNzk0MSw5LjYxMjk2Mjg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNDNEM2RDIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNi43Nzc2MDcyLDE4LjQ2NTY5MjYgQzI2LjU3MjE4OTIsMTguMTc2ODkzOSAyNi4yMTIzNjczLDE4LjAwMTAzNTggMjUuODI0Nzg1NywxOCBMMTkuMTc3NTc5MiwxOCBDMTguNzg3OTkxNiwxNy45OTkzMjg3IDE4LjQyNTU5OTcsMTguMTc1NDAxMyAxOC4yMTkxMTksMTguNDY1NjkyNiBMMTYuMTcyNTI4LDIxLjM0Mzk4ODIgQzE1LjkwOTMyMjQsMjEuNzEyNDg4OSAxNS45NTA0ODgzLDIyLjE4ODc0OSAxNi4yNzQwMTIsMjIuNTE4MDg5NCBMMjIuMDY5ODczMSwyOC40NjI5MjU0IEMyMi4yNzIyNDQ4LDI4LjY3MDg2NCAyMi42MjgxMzk4LDI4LjY5NTI3ODcgMjIuODY0Nzg4LDI4LjUxNzQ1NzkgQzIyLjg4NzA1NjQsMjguNTAwNzI1MSAyMi45MDc4MDY0LDI4LjQ4MjQ5MjQgMjIuOTI2ODQ5NCwyOC40NjI5MjU0IEwyOC43MjI3MTA1LDIyLjUxODA4OTQgQzI5LjA0ODAyNjYsMjIuMTg5ODc1IDI5LjA5MTQ4NDYsMjEuNzEzNTQ1MiAyOC44Mjk4MzI1LDIxLjM0Mzk4ODIgTDI2Ljc3NzYwNzIsMTguNDY1NjkyNiBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTgwOTM0MiwzLjc0NDMxMjcyIEMyNS4yNjQ5MDY1LDMuMjgyNzI4MTEgMjQuNzExMzM0MywzLjAwMTY1NTQ5IDI0LjExNTA1NSwzIEwxMy44ODg1ODM0LDMgQzEzLjI4OTIxNzksMi45OTg5MjcwMSAxMi43MzE2OTE5LDMuMjgwMzQyNDYgMTIuNDE0MDI5MiwzLjc0NDMxMjc0IEw5LjI2NTQyNzY4LDguMzQ0NjY5ODMgQzguODYwNDk2MDMsOC45MzM2NDE0OSA4LjkyMzgyODE1LDkuNjk0ODQ0MzMgOS40MjE1NTY5LDEwLjIyMTIyNjUgTDE4LjMzODI2NjMsMTkuNzIyODEwNiBDMTguNjQ5NjA3NCwyMC4wNTUxNTcxIDE5LjE5NzEzODIsMjAuMDk0MTc5MSAxOS41NjEyMTI0LDE5LjgwOTk2OTUgQzE5LjU5NTQ3MTQsMTkuNzgzMjI1NSAxOS42MjczOTQ1LDE5Ljc1NDA4NDMgMTkuNjU2NjkxNCwxOS43MjI4MTA2IEwyOC41NzM0MDA4LDEwLjIyMTIyNjUgQzI5LjA3Mzg4NzEsOS42OTY2NDM5NSAyOS4xNDA3NDU2LDguOTM1MzI5ODggMjguNzM4MjAzOCw4LjM0NDY2OTgyIEwyNS41ODA5MzQyLDMuNzQ0MzEyNzIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgNC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtNC42MDAwMDApICIgeD0iMTAiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtNC4wMDAwMDAsIC04LjYwMDAwMCkgIiB4PSIwLjUiIHk9IjgiIHdpZHRoPSI3IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5LjI1MDAwMCwgMTUuNjAwMDAwKSByb3RhdGUoNDcuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjI1MDAwMCwgLTE1LjYwMDAwMCkgIiB4PSIxNyIgeT0iMTUiIHdpZHRoPSI0LjUiIGhlaWdodD0iMS4yIiByeD0iMC42Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgY3g9IjEwIiBjeT0iMC41IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTMiIGN4PSIwLjUiIGN5PSI1IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTQiIGN4PSIxNi41IiBjeT0iMTIuNSIgcj0iMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
const TokenSymbol = "Unknown";
const TokenDecimals = 18;
const Zero = "0x0000000000000000000000000000000000000000";

const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const ERC721_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
]

const ERC1155_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeBatchTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "TransferSingle",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      }
    ],
    "name": "TransferBatch",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
]

const textData = [
  {
    data: "0xa9059cbb000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df200000000000000000000000000000000000000000000001b1ae4d6e2ef500000",
    icon: TokenIcon,
    symbol: 'Doge',
    decimals: 18,
    event: {
      "total": 4,
      "list": [
        {
          "epochNumber": "0x8cf3d81",
          "transactionHash": "0xbeede5fe84bdb4c6f7b6d43a3471f429a299758aa2c24b178cfd62289f269ff5",
          "transactionLogIndex": "0x0",
          "address": "net71:ab83gp4c8mth0ccy857jcathp3wt6dkckyp72bbye5",
          "data": "0x00000000000000000000000000000000000000000000003635c9adc5dea00000",
          icon: TokenIcon,
          name: 'Doge',
          symbol: 'Doge',
          decimals: 18,
          "topics": [
            "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        },
        {
          "epochNumber": "0x8cf3d81",
          "transactionHash": "0xbeede5fe84bdb4c6f7b6d43a3471f429a299758aa2c24b178cfd62289f269ff5",
          "transactionLogIndex": "0x1",
          "address": "net71:ab83gp4c8mth0ccy857jcathp3wt6dkckyp72bbye5",
          "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
          icon: TokenIcon,
          name: 'Doge',
          symbol: 'Doge',
          decimals: 18,
          "topics": [
            "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        },
        {
          "epochNumber": "0x8cf3d81",
          "transactionHash": "0xbeede5fe84bdb4c6f7b6d43a3471f429a299758aa2c24b178cfd62289f269ff5",
          "transactionLogIndex": "0x2",
          "address": "net71:ab83gp4c8mth0ccy857jcathp3wt6dkckyp72bbye5",
          "data": "0x00000000000000000000000000000000000000000000003635c9adc5dea00000",
          icon: TokenIcon,
          name: 'Doge',
          symbol: 'Doge',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df2"
          ]
        },
        {
          "epochNumber": "0x8cf3d81",
          "transactionHash": "0xbeede5fe84bdb4c6f7b6d43a3471f429a299758aa2c24b178cfd62289f269ff5",
          "transactionLogIndex": "0x3",
          "address": "net71:ab83gp4c8mth0ccy857jcathp3wt6dkckyp72bbye5",
          "data": "0x00000000000000000000000000000000000000000000003635c9adc5dea00000",
          icon: TokenIcon,
          name: 'Doge',
          symbol: 'Doge',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x000000000000000000000000da97274c3ace0baa6f742c06cc2f09561066fd1b"
          ]
        }
      ]
    }
  },
  {
    data: "0x095ea7b30000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c9400000000000000000000000000000000000000000000d3c21bcecceda1000000",
    icon: TokenIcon,
    symbol: 'Doge',
    decimals: 18,
    event: {
      "total": 1,
      "list": [
        {
          "epochNumber": "0x8cf3cfa",
          "transactionHash": "0xcbd217160bf5ed753edf3682fbf7fbca730b6ba7d2ef0fd80ca812c65e79a164",
          "transactionLogIndex": "0x0",
          "address": "net71:ab83gp4c8mth0ccy857jcathp3wt6dkckyp72bbye5",
          "data": "0x00000000000000000000000000000000000000000000d3c21bcecceda1000000",
          icon: TokenIcon,
          name: 'Doge',
          symbol: 'Doge',
          decimals: 18,
          "topics": [
            "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        }
      ]
    }
  },
  {
    data: "0x095ea7b3000000000000000000000000a803474f547a5233a6cca4bc4043d5615eeb657b0000000000000000000000000000000000000000000000000000000000000000",
    icon: TokenIcon,
    symbol: 'Doge',
    decimals: 18
  },
  // ERC721 transferFrom data == 0x, ERC20 transferFrom data != 0x
  {
    data: "0x23b872dd000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df20000000000000000000000000000000000000000000000000000000000000003",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 0,
    event: {
      "total": 4,
      "list": [
        {
          "epochNumber": "0x8cf3f43",
          "transactionHash": "0xacf0a49151877cf9bc8da0d6037e7489229f7ed049ea4ac953477c2d8c82e2eb",
          "transactionLogIndex": "0x0",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ]
        },
        {
          "epochNumber": "0x8cf3f43",
          "transactionHash": "0xacf0a49151877cf9bc8da0d6037e7489229f7ed049ea4ac953477c2d8c82e2eb",
          "transactionLogIndex": "0x1",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df2",
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ]
        },
        {
          "epochNumber": "0x8cf3f43",
          "transactionHash": "0xacf0a49151877cf9bc8da0d6037e7489229f7ed049ea4ac953477c2d8c82e2eb",
          "transactionLogIndex": "0x2",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000001"
          ]
        },
        {
          "epochNumber": "0x8cf3f43",
          "transactionHash": "0xacf0a49151877cf9bc8da0d6037e7489229f7ed049ea4ac953477c2d8c82e2eb",
          "transactionLogIndex": "0x3",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df2",
            "0x0000000000000000000000000000000000000000000000000000000000000001"
          ]
        }
      ]
    }
  },
  {
    data: "0x42842e0e000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df20000000000000000000000000000000000000000000000000000000000000002",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18,
    event: {
      "total": 4,
      "list": [
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x0",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x1",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
          ]
        }
      ]
    }
  },
  {
    data: "0x42842e0e000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18,
    event: {
      "total": 4,
      "list": [
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x0",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x1",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x2",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
          "topics": [
            "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x3",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "topics": [
            "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        }
      ]
    }
  },
  {
    data: "0xa22cb4650000000000000000000000008ae1c5c2dbbb24a7779970fbc30c61b418a34c060000000000000000000000000000000000000000000000000000000000000001",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18
  },
  {
    data: "0xa22cb4650000000000000000000000008ae1c5c2dbbb24a7779970fbc30c61b418a34c060000000000000000000000000000000000000000000000000000000000000000",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18,
  },
  {
    data: "0xf242432a000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18,
    event: {
      "total": 4,
      "list": [
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x0",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x1",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x",
          icon: TokenIcon,
          name: 'Doge card',
          symbol: 'DOGECARD',
          decimals: 18,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000002"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x2",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
          "topics": [
            "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        },
        {
          "epochNumber": "0x8cf3fe8",
          "transactionHash": "0x7c49056012ef3881db788492e9ba783b7088df8b56df582e3c5494160ca1f6ec",
          "transactionLogIndex": "0x3",
          "address": "net71:aa7fcg4h1pfbays9mc5w8t59d3zapc7ytez3uu11cs",
          "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "topics": [
            "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94"
          ]
        }
      ]
    }
  },
  {
    data: "0x2eb2c2d6000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18,
    event: {
      "total": 1,
      "list": [
        {
          "epochNumber": "0x8cf4330",
          "transactionHash": "0x73ff570a92252dffb9a2f6de1ddcd185af90fab447887b19ed36162d2d0f8d3d",
          "transactionLogIndex": "0x0",
          "address": "net71:acs70vjx3ekke3ud7styerb5t5tg3nx376h3d55x60",
          "data": "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a",
          "topics": [
            "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f"
          ]
        }
      ]
    }
  },
  {
    data: "0x2eb2c2d6000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000",
    icon: TokenIcon,
    name: 'Doge card',
    symbol: 'DOGECARD',
    decimals: 18,
    event: {
      "total": 1,
      "list": [
        {
          "epochNumber": "0x8cf4399",
          "transactionHash": "0x5777e99bb5c4e327ee8128bf242f13acb87b87351f236728bd8831b9fa5dd6b2",
          "transactionLogIndex": "0x0",
          "address": "net71:acs70vjx3ekke3ud7styerb5t5tg3nx376h3d55x60",
          "data": "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002",
          "topics": [
            "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb",
            "0x0000000000000000000000004773c603d91ce4b8becbabe1f1c09febe7af9c94",
            "0x000000000000000000000000aea76b7bcf682ae95b51c1a0c94cc32438f85b5f",
            "0x000000000000000000000000f4855963d48c62e011dc3367ce98e550cab80df2"
          ]
        }
      ]
    }
  }

]

const ERC20_INTERFACE = new Interface(ERC20_ABI);
const ERC721_INTERFACE = new Interface(ERC721_ABI);
const ERC1155_INTERFACE = new Interface(ERC1155_ABI);

const StyleWrap: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignContent: 'center', gap: '5px' }
const StyleIcon: CSSProperties = { width: '30px', height: '30px' }


interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}
interface ReturnType {
  type: string;
  address?: string | undefined;
  value?: string | undefined;
  title: string;
  args: string[] | Result;
  content?: ReactElement | string;
}
interface Translation {
  [hash: string]: (args: TranslationArgs) => ReturnType;
}
interface Token {
  icon?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
}
interface CustomProp {
  className?: string,
  address?: string;
}
interface EventList extends Token, CustomProp {
  address: string,
  data: string,
  epochNumber: string,
  topics: string[],
  transactionHash: string,
  transactionLogIndex: string,

};
interface TranslationArgs extends Token, CustomProp {
  data: string;
  event?: {
    total: number;
    list: EventList[];
  },
  value?: string | BigNumber;
}
interface TranslationEvent {
  [hash: string]: (args: EventList) => ReturnType;
}
interface ReturnDataType {
  data: ReturnType,
  event?: ReturnType[],
}

const ActionTranslate: Translation = {
  // transfer (ERC20)
  "0xa9059cbb": (arg: TranslationArgs) => {
    const { icon = TokenIcon, symbol = TokenSymbol, decimals = TokenDecimals, className, data } = arg;
    const parsed = ERC20_INTERFACE.parseTransaction({ data });
    const value = decimals ? formatUnits(parsed.args[1].toString(), decimals) : parsed.args[1].toString();
    return {
      type: "ERC20_Transfer",
      title: 'Transfer',
      args: parsed.args,
      address: parsed.args[0],
      value,
      content: <div className={className} style={{ ...StyleWrap }}>
        Transfer <div className="ta-value">{value}</div> <img className="ta-icon" src={icon} alt={symbol} style={StyleIcon} /> <div className="ta-symbol">{symbol}</div> to <div className="ta-address">{shortenAddress(parsed.args[0])}</div>
      </div>,
      templte: "Transfer {value}{icon}{symbol} to {address}"
    };
  },
  // transferFrom (ERC20,ERC721) x
  "0x23b872dd": (arg: TranslationArgs) => {
    const { icon, symbol, decimals, name, data } = arg;
    const parsed = ERC20_INTERFACE.parseTransaction({ data });
    const value = decimals ? formatUnits(parsed.args[2].toString(), decimals) : parsed.args[2].toString();
    if (parsed.args[1] === Zero) { // only ERC721
      return {
        type: 'ERC721_Burn',
        title: 'Burn',
        args: parsed.args,
        content: <div style={{ ...StyleWrap }}>
          Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
        </div>
      }
    }
    return {
      type: 'ERC721_Transfer',
      title: 'Transfer',
      args: parsed.args,
      content: <div style={{ ...StyleWrap }}>
        Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(parsed.args[1])}
      </div>
    }
  },
  // approve (ERC20)
  "0x095ea7b3": (arg: TranslationArgs) => {
    const { icon, symbol, decimals, data } = arg;
    const parsed = ERC20_INTERFACE.parseTransaction({ data });
    if (parsed.args[1].isZero()) {
      return {
        type: "ERC20_Approved",
        address: parsed.args[0],
        title: 'Revoked',
        args: parsed.args,
        content: <div style={{ ...StyleWrap }}>
          Revoked <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(parsed.args[0])}
        </div>
      };
    } else {
      // const value = decimals ? formatUnits(parsed.args[1].toString(), decimals) : parsed.args[1].toString();
      return {
        type: "ERC20_Approved",
        address: parsed.args[0],
        title: 'Approved',
        args: parsed.args,
        content: <div style={{ ...StyleWrap }}>
          Approved <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} for {shortenAddress(parsed.args[0])}
        </div>
      };
    }
  },
  // safeTransferFrom (ERC721)
  "0x42842e0e": (arg: TranslationArgs) => {
    // Transfer {amount} of {token image}{contract name}{(token symbol)}
    const { data } = arg;
    const parsed = ERC721_INTERFACE.parseTransaction({ data });
    const value = parsed.args[2].toString();
    return {
      type: 'ERC721_SafeTransferFromr',
      title: 'Transfer',
      args: parsed.args,
      value: value,
    };
  },
  // setApprovalForAll (ERC721, ERC1155) x
  "0xa22cb465": (arg: TranslationArgs) => {
    const { icon, symbol, decimals, data } = arg;
    const parsed = ERC721_INTERFACE.parseTransaction({ data });
    if (parsed.args[1] === false) {
      return {
        type: "ERC721_Revoked",
        title: 'Revoked',
        args: parsed.args,
        address: parsed.args[0]
      };
    } else {
      return {
        type: "ERC721_Approved",
        title: 'Approved',
        args: parsed.args,
        address: parsed.args[0]
      };
    }
  },
  // safeTransferFrom (ERC1155)
  "0xf242432a": (arg: TranslationArgs) => {
    // Transfer {amount} of {token image}{contract name}{(token symbol)}
    const { icon, symbol, name, decimals, data } = arg;
    const parsed = ERC1155_INTERFACE.parseTransaction({ data });
    const value = parsed.args[3].toString();
    if (parsed.args[1] === Zero) {
      return {
        type: "ERC1155_Burn",
        title: 'Burn',
        args: parsed.args,
        value
      }
    } else {
      return {
        type: "ERC1155_SafeTransferFrom",
        title: 'Transfer',
        args: parsed.args,
        value
      };
    }
  },
  // safeBatchTransferFrom (ERC1155)
  "0x2eb2c2d6": (arg: TranslationArgs) => {
    // Transfer {amount} of {token image}{contract name}{(token symbol)}
    const { icon, symbol, name, decimals, data } = arg;
    const parsed = ERC1155_INTERFACE.parseTransaction({ data });
    const value = parsed.args[3].reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0')).toString();
    if (parsed.args[1] === Zero) {
      return {
        type: "ERC1155_BatchBurn",
        title: 'Burn',
        args: parsed.args,
        value
      }
    } else if (parsed.args[2] === Zero) {
      return {
        type: "ERC1155_BatchMint",
        title: 'Mint',
        args: parsed.args,
        value
      };
    }
    return {
      type: "ERC1155_SafeBatchTransferFrom",
      title: 'Transfer',
      args: parsed.args,
      value
    };
  }
}
const EventTranslate: TranslationEvent = {
  // Approval (ERC20)
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": (arg: EventList) => {
    const { icon = TokenIcon, symbol = TokenSymbol, decimals = TokenDecimals, name = TokenName, data } = arg;
    const methodId = "0x095ea7b3";
    const eTransaction: TranslationArgs = {
      data: methodId + arg.topics[1].substring(2) + arg.data.substring(2), // spender, value
      icon,
      symbol,
      decimals,
      name,
    }
    return ActionTranslate[methodId](eTransaction);
  },
  // Transfer (ERC20,ERC721)
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": (arg: EventList) => {
    const methodId = "0x23b872dd";
    let eTransaction: TranslationArgs = {
      data: "",
    }
    // ERC721
    if (arg.data === '0x') {
      // Mint
      if (arg.topics[1] === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        return {
          type: 'ERC721_Mint',
          title: 'Mint',
          args: [arg.topics[2], arg.topics[3]], // to, tokenId
          value: '1'
        };
      }
      // transferFrom
      else {
        eTransaction.decimals = 0;
        if (arg.topics[2] === "0x0000000000000000000000000000000000000000000000000000000000000000") {
          eTransaction.data = methodId + arg.topics[1].substring(2) + arg.topics[2].substring(2) + "0000000000000000000000000000000000000000000000000000000000000001"; // from, to, amount (ERC721 can only transfer 1)
        } else {
          eTransaction.data = methodId + arg.topics[1].substring(2) + arg.topics[2].substring(2) + "0000000000000000000000000000000000000000000000000000000000000001";
        }
      }
    }
    // ERC20
    else {
      eTransaction.data = methodId + arg.topics[1].substring(2) + arg.topics[2].substring(2) + arg.data.substring(2); // from, to, value
    }
    return ActionTranslate[methodId](eTransaction);
  },
  // ApprovalForAll (ERC721, 1155)
  "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31": (arg: EventList) => {
    const parsed = ERC1155_INTERFACE.parseLog(arg);
    if (parsed.args[2] === false) {
      return {
        type: "ERC721_Revoked",
        title: 'Revoked',
        args: parsed.args,
        address: parsed.args[0],
      };
    } else {
      return {
        type: "ERC721_Approved",
        title: 'Approved',
        args: parsed.args,
        address: parsed.args[0]
      };
    }
  },
  // TransferSingle (ERC1155)
  "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62": (arg: EventList) => {
    const parsed = ERC1155_INTERFACE.parseLog(arg);
    const value = parsed.args[4].reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0')).toString();
    return {
      type: "ERC1155_Transfer",
      title: "TransferSingle",
      args: parsed.args,
      value
    };
  },
  // TransferBatch (ERC1155) 
  "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb": (arg: EventList) => {
    const parsed = ERC1155_INTERFACE.parseLog(arg);
    const value = parsed.args[4].reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0')).toString();
    if (parsed.args[2] === Zero) {
      return {
        type: "ERC1155_BatchBurn",
        title: "Burn",
        args: parsed.args,
        value
      };
    } else if (parsed.args[1] === Zero) {
      return {
        type: "ERC1155_BatchMint",
        title: "Mint",
        args: parsed.args,
        value
      };
    }
    return {
      type: "ERC1155_SafeBatchTransferFrom",
      title: "Transfer",
      args: parsed.args,
      value
    };
  }
}

export const decodeData = (transaction: TranslationArgs): ReturnDataType | undefined => {
  const methodId: string = transaction.data.slice(0, 10);
  const methodAction = ActionTranslate[methodId];

  if (!methodAction) return;
  const result = ActionTranslate[methodId](transaction);
  const eventResult: ReturnType[] = []
  if (transaction.event) {
    transaction.event.list.forEach((e: EventList) => {
      const evnetHash = e.topics[0];
      if (EventTranslate[evnetHash]) {
        const eResult = EventTranslate[evnetHash](e);
        eventResult.push(eResult);
      }
    });
  }

  return {
    data: result,
    event: eventResult
  };
}

export const decodeData2 = (transaction: TranslationArgs, custom: MultiAction) => {
  const methodId: string = transaction.data.slice(0, 10);
  const methodAction = ActionTranslate[methodId];

  if (!methodAction) return;
  const result = ActionTranslate[methodId](transaction);
  const actionType: string = result.type;
  let content;
  if (actionType && custom[actionType]) {

    const customResult = custom[actionType](result);
    content = customResult;
  }

  return {
    args: result.args,
    content
  }
}

interface ERC20_Transfer {
  address: string;
  value: string;
}
interface ERC20_Approved {
  address: string;
}
interface ERC20_Revoked {
  address: string;
}
interface ERC721_SafeTransferFromr {
  value: string
}
interface ERC721_Revoked {
  address: string;
}
interface ERC721_Approved {
  address: string;
}
interface ERC1155_SafeTransferFrom {
  value: string;
}
interface ERC1155_Burn {
  value: string;
}
interface ERC1155_SafeBatchTransferFrom {
  value: string;
}
interface ERC1155_BatchBurn {
  value: string;
}
interface ERC1155_BatchMint {
  value: string;
}
interface MultiAction {
  [key: string]: (result: any) => any;
  "ERC20_Transfer": ({ address, value }: ERC20_Transfer) => any,
  "ERC20_Approved": ({ address }: ERC20_Approved) => any,
  "ERC20_Revoked": ({ address }: ERC20_Revoked) => any,
  "ERC721_SafeTransferFromr": ({ value }: ERC721_SafeTransferFromr) => any,
  "ERC721_Revoked": ({ address }: ERC721_Revoked) => any,
  "ERC721_Approved": ({ address }: ERC721_Approved) => any,
  "ERC1155_SafeTransferFrom": ({ value }: ERC1155_SafeTransferFrom) => any,
  "ERC1155_Burn": ({ value }: ERC1155_Burn) => any,
  "ERC1155_SafeBatchTransferFrom": ({ value }: ERC1155_SafeBatchTransferFrom) => any,
  "ERC1155_BatchBurn": ({ value }: ERC1155_BatchBurn) => any,
  "ERC1155_BatchMint": ({ value }: ERC1155_BatchMint) => any,
}
let icon = TokenIcon;
let symbol = 'DOGECARD';
let name = 'Doge card';
const custom: MultiAction = {
  "ERC20_Transfer": ({ address, value }) => {
    return <div style={{ ...StyleWrap }}>
      Transfer <div className="ta-value">{value}</div> <img className="ta-icon" src={icon} alt={symbol} style={StyleIcon} /> <div className="ta-symbol">{symbol}</div> to <div className="ta-address">{address && shortenAddress(address)}</div>
    </div>
  },
  "ERC20_Approved": ({ address }) => {
    return <div style={{ ...StyleWrap }}>
      Approved <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} for {address && shortenAddress(address)}
    </div>
  },
  "ERC20_Revoked": ({ address }) => {
    return <div style={{ ...StyleWrap }}>
      Revoked <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(address)}
    </div>
  },
  "ERC721_SafeTransferFromr": ({ value }) => {
    return <div style={{ ...StyleWrap }}>
      Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
    </div>
  },
  "ERC721_Revoked": ({ address }) => {
    return <div style={{ ...StyleWrap }}>
      Revoked {symbol} from {shortenAddress(address)}
    </div>
  },
  "ERC721_Approved": ({ address }) => {
    return <div style={{ ...StyleWrap }}>
      Approved {symbol} for {shortenAddress(address)}
    </div>
  },
  "ERC1155_SafeTransferFrom": ({ value }) => {
    return <div style={{ ...StyleWrap }}>
      Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
    </div>
  },
  "ERC1155_Burn": ({ value }) => {
    return <div style={{ ...StyleWrap }}>
      Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
    </div>
  },
  "ERC1155_SafeBatchTransferFrom": ({ value }) => {
    return <div style={{ ...StyleWrap }}>
      Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
    </div>
  },
  "ERC1155_BatchBurn": ({ value }) => {
    return <div style={{ ...StyleWrap }}>
      Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
    </div>
  },
  "ERC1155_BatchMint": ({ value }) => {
    return <div style={{ ...StyleWrap }}>
      Mint {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
    </div>
  }
}
function App() {

  return (
    <div className="App" >
      {
        textData.map((e, i) => {
          const res = decodeData2(e, custom);
          if (!res) return;
          return <div className="mt-[10px] flex" key={`textData3` + i}>{res.content}</div>;
        })
      }

      < br />
      {/* {
        textData.map((e, i) => {
          const res = decodeData(e);
          if (!res) return;
          if (res?.event && res.event.length > 0) {
            return <div className="mt-[10px]" key={`textData0` + i}>
              <div className="bg-[#ddd] flex" key={`textData1` + i}> <span className="font-bold">{res.data.title}:</span>  {res.data.content}</div>
              {
                res.event.map((o: ReturnType, i) => {
                  return <div className="bg-[#EEE] flex" key={`textData2` + i}> <span className="font-bold">--{o.title}:</span>  {o.content}</div>
                })
              }
            </div>;
          }
          return <div className="mt-[10px] flex" key={`textData3` + i}> <span className="font-bold">{res.data.title}:</span>  {res.data.content}</div>;
        })
      } */}
    </div >
  );
}

export default App;

