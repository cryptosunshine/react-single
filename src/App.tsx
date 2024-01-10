import { useEffect, useState, FunctionComponent, ReactElement, CSSProperties } from "react";
import TransactionAction from "./TransactionAction";
import { textData2 } from "./data"
import "./App.css";

const TokenName = "Unknown";
const TokenIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Ub2tlbnM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnlLvmnb8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NzUuMDAwMDAwLCAtMzEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUb2tlbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2My4wMDAwMDAsIDE4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik1haW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjA5Mzc5NDEsOS42MTI5NjI4NiBDMTMuODI1MTcwNSw5LjIzMjgzNDcgMTMuMzU0NjM0MSw5LjAwMTM2MzM1IDEyLjg0Nzc5NjcsOSBMNC4xNTUyOTU4Niw5IEMzLjY0NTgzNTIxLDguOTk5MTE2MzYgMy4xNzE5MzgxMiw5LjIzMDg3MDA1IDIuOTAxOTI0ODUsOS42MTI5NjI4NyBMMC4yMjU2MTM1MjcsMTMuNDAxNDg4OCBDLTAuMTE4NTc4MzcxLDEzLjg4NjUyMzggLTAuMDY0NzQ2MDY4OCwxNC41MTMzOTYyIDAuMzU4MzIzMzY0LDE0Ljk0Njg4NyBMNy45Mzc1MjYzNCwyMi43NzE3MTM4IEM4LjIwMjE2NjI4LDIzLjA0NTQxMDcgOC42Njc1Njc0MywyMy4wNzc1NDY0IDguOTc3MDMwNTIsMjIuODQzNDkxNiBDOS4wMDYxNTA3MywyMi44MjE0NjcyIDkuMDMzMjg1MzEsMjIuNzk3NDY4NiA5LjA1ODE4NzY5LDIyLjc3MTcxMzggTDE2LjYzNzM5MDcsMTQuOTQ2ODg3IEMxNy4wNjI4MDQxLDE0LjUxNDg3ODIgMTcuMTE5NjMzNywxMy44ODc5MTQzIDE2Ljc3NzQ3MzIsMTMuNDAxNDg4OCBMMTQuMDkzNzk0MSw5LjYxMjk2Mjg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNDNEM2RDIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNi43Nzc2MDcyLDE4LjQ2NTY5MjYgQzI2LjU3MjE4OTIsMTguMTc2ODkzOSAyNi4yMTIzNjczLDE4LjAwMTAzNTggMjUuODI0Nzg1NywxOCBMMTkuMTc3NTc5MiwxOCBDMTguNzg3OTkxNiwxNy45OTkzMjg3IDE4LjQyNTU5OTcsMTguMTc1NDAxMyAxOC4yMTkxMTksMTguNDY1NjkyNiBMMTYuMTcyNTI4LDIxLjM0Mzk4ODIgQzE1LjkwOTMyMjQsMjEuNzEyNDg4OSAxNS45NTA0ODgzLDIyLjE4ODc0OSAxNi4yNzQwMTIsMjIuNTE4MDg5NCBMMjIuMDY5ODczMSwyOC40NjI5MjU0IEMyMi4yNzIyNDQ4LDI4LjY3MDg2NCAyMi42MjgxMzk4LDI4LjY5NTI3ODcgMjIuODY0Nzg4LDI4LjUxNzQ1NzkgQzIyLjg4NzA1NjQsMjguNTAwNzI1MSAyMi45MDc4MDY0LDI4LjQ4MjQ5MjQgMjIuOTI2ODQ5NCwyOC40NjI5MjU0IEwyOC43MjI3MTA1LDIyLjUxODA4OTQgQzI5LjA0ODAyNjYsMjIuMTg5ODc1IDI5LjA5MTQ4NDYsMjEuNzEzNTQ1MiAyOC44Mjk4MzI1LDIxLjM0Mzk4ODIgTDI2Ljc3NzYwNzIsMTguNDY1NjkyNiBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTgwOTM0MiwzLjc0NDMxMjcyIEMyNS4yNjQ5MDY1LDMuMjgyNzI4MTEgMjQuNzExMzM0MywzLjAwMTY1NTQ5IDI0LjExNTA1NSwzIEwxMy44ODg1ODM0LDMgQzEzLjI4OTIxNzksMi45OTg5MjcwMSAxMi43MzE2OTE5LDMuMjgwMzQyNDYgMTIuNDE0MDI5MiwzLjc0NDMxMjc0IEw5LjI2NTQyNzY4LDguMzQ0NjY5ODMgQzguODYwNDk2MDMsOC45MzM2NDE0OSA4LjkyMzgyODE1LDkuNjk0ODQ0MzMgOS40MjE1NTY5LDEwLjIyMTIyNjUgTDE4LjMzODI2NjMsMTkuNzIyODEwNiBDMTguNjQ5NjA3NCwyMC4wNTUxNTcxIDE5LjE5NzEzODIsMjAuMDk0MTc5MSAxOS41NjEyMTI0LDE5LjgwOTk2OTUgQzE5LjU5NTQ3MTQsMTkuNzgzMjI1NSAxOS42MjczOTQ1LDE5Ljc1NDA4NDMgMTkuNjU2NjkxNCwxOS43MjI4MTA2IEwyOC41NzM0MDA4LDEwLjIyMTIyNjUgQzI5LjA3Mzg4NzEsOS42OTY2NDM5NSAyOS4xNDA3NDU2LDguOTM1MzI5ODggMjguNzM4MjAzOCw4LjM0NDY2OTgyIEwyNS41ODA5MzQyLDMuNzQ0MzEyNzIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgNC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtNC42MDAwMDApICIgeD0iMTAiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtNC4wMDAwMDAsIC04LjYwMDAwMCkgIiB4PSIwLjUiIHk9IjgiIHdpZHRoPSI3IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5LjI1MDAwMCwgMTUuNjAwMDAwKSByb3RhdGUoNDcuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjI1MDAwMCwgLTE1LjYwMDAwMCkgIiB4PSIxNyIgeT0iMTUiIHdpZHRoPSI0LjUiIGhlaWdodD0iMS4yIiByeD0iMC42Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgY3g9IjEwIiBjeT0iMC41IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTMiIGN4PSIwLjUiIGN5PSI1IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTQiIGN4PSIxNi41IiBjeT0iMTIuNSIgcj0iMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
const TokenSymbol = "Unknown";
const TokenDecimals = 18;
const Zero = "0x0000000000000000000000000000000000000000";

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


function App() {

  return (
    <div className="App" >
      {
        textData2.map((e, i) => {

          return <>
            <TransactionAction key={i} transaction={e.transaction}
              event={e.event && e.event}
              customInfo={e.customInfo && e.customInfo}
            />
            <br />
          </>;
        })
      }

      < br />
    </div >
  );
}

export default App;

