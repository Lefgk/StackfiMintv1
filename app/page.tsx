"use client";

import { useEffect, useState } from "react";
import { parseEther, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import React from "react";
import { base } from "viem/chains";

// WHITELIST ADDRESSES - Only these addresses can mint
const WHITELIST_ADDRESSES = [
  "0xF27e05666EC6891F777229633376Ca24181d165B",
  "0x78f1CE994645f3105302947cF5D8c721A4FF8F3f",
  "0x417e70e4842e6F2576F2a7349aA6e9346625360F",
  "0xD5B140859C33f7390BfAe21eF2255865344cf776",
  "0x5ef6a47fa3991669347ba40b400d3a8e036efeeb",
  "0xf51ADB5a74E4C79a72d6bC5aDA34eE080A64163e",
  "0xcF8DbdC1d2566e54d0b375e16590b6F6Ef2D5070",
  "0xf375c3b51dda5b97800fb654e0e6e1dce35d393f",
  "0xB0181A12d53b1aD864de8cBeb06Cd764A6168131",
  "0xf51ADB5a74E4C79a72d6bC5aDA34eE080A64163e",
  "0x38e588D736Bf1D4a3DFA1045aEd03Aca4c1D48f9",
  "0xa97f26b851c571ee1e65635ee1b3db69c5f15f51",
  "0x1B4894353C9f449aA2cc6E28275FbCF71b80F204",
  "0xf64d737f875e6206b8043596255ed3bcda71d0c7",
  "0xb1eda5fa1a441a6994a0c943f164e18d1710f585",
  "0xbD5c88DB6B2852dd3d8494C1d16CD1be944A0a13",
  "0x223c26aFaeB97723DC639e86407f2045392D4044",
  "0xc044baB62c012E448F0045eA96899B35761E2a4a",
  "0x721b198cce51cc1a03d708d025fa3c7a1217cd91",
  "0x9ed34016c483d00447d43f3f83ff0a7a204b2c05",
  "0x8205253A8CdcAda29F5aa131B2B1bCa4d1551850",
  "0x7a500d1c5a17c4cceb1f0a382d5ed552bf569aae",
  "0x663254a67f5c59e0925d0df82e2cd0e74e527388",
  "0xE0BfAf45A51Bbe5E0b9B688C5A0727d6cB7afBA4",
  "0x6406CA5C3813B0825B9424f9bB0C1979DCef68BD",
  "0xaa964Eef6afEc789D4A2f6F7f3abd69e1AcAa203",
  "0x04211a14f5A4e5450ED17356461D9fCE6B32449B",
  "0xc3Cc6a2A77C928A77c46362B48E182A1025eb19B",
  "0x10cc63abdd325724fe68093bd3c5492190587a2e",
  "0x284C9e479eb61390fb8bAd5734EbCFe2693eCC77",
  "0x50015dE32477b17e5d5E9C7d8ba58e4BF456FC33",
  "0x094ef49ba03c3ea1ec2e72e19d58b9447d3db6a3",
  "0x2e9Bf8D192B52870E8139271F8c9F5cdB93bD202",
  "0xD32CB34399415250C2249E521b1c8A4b39733Cd2",
  "0x1e8bc37a46b8d0cbc60f0c4f7d3457a74160be0c",
  "0x40a2Aa83271dd2F86e7C50C05b60bf3873bA4461",
  "0x9bdae17c7cadd52736e86c9af7b61222fc351b54",
  "0x62fA91eA41E0069e84121184D03737dc18c092db",
  "0x72051A823ec61ADd719Da7beE04EF4e5E8E12264",
  "0x9C6F2920c9ac9DF269D902A5c9aDE0055F383dEA",
  "0x1B4894353C9f449aA2cc6E28275FbCF71b80F204",
  "0x15830F5423D036cB94EdF942d810c818CD979485",
  "0xA27337D1D6b04A12aFC69aE9e68cB028eF393958",
  "0xB59DF00e1F6A6d110a93de26F43bef575944ed7D",
  "0xAD5F26Ea072d340024E5D644F491CdDC41cb6Bee",
  "0x9cEe0BB976142121E650ea6A09Fa1CAf78440A13",
  "0x1e690103561189C4668C0277A5ecdd7346F973f1",
  "0x91d69a81541ef75ACADecd172ef7052d0C9c1CE9",
  "0xEcf341C2dB77Be7137625b731488875DcFB212a1",
  "0x7145d5CAa4C05fA360BeAFe7D98682775AA5B113",
  "0x6765053bdb4d6e294c8c0ce624f79b9eaebeed0a",
  "0xE835ef9B6C7D5C9EB48a7d33b3947EF0280384D2",
  "0xb554eA3eC9Cc4602777aA6A7522BeF5130657221",
  "0x3f5791a05fec46df8e28ac15a72a3a275d40fc39",
  "0xe0677e964e478649859af83127a9c82553bf4f63",
  "0xa328b1f7c2fa789442aada66dcd6ac1a185826af",
  "0x049D797C7521Bdf27aAfE9395c809802C7f58A62",
  "0x60F07b60F5D7F5C0A4EA3c2ff267fC61FF8106F9",
  "0x98687a656E846C4809A915CAEF563fC06f445e98",
  "0x4a550E753E36eBe74D1a7011bFc3a845F6ce54FD",
  "0x23AEE26e8977BBEC0C6Ff40791aEB22a28B72F20",
  "0x713B349E4A5cb4AC09FE5a655a82c59D664E7332",
  "0x64c9a793361e29b317741785a2ffafc41517d3df",
  "0xBBB43E58FE409821524f302E50C00b9498747117",
  "0x08D01B93c8Ae027Ba5361652470493Af9302D85B",
  "0x4dC8e8caE1Cb8aa8a1C9878877dD30D85F823277",
  "0xC6b1c0d78f0a4971B257DBB2F5bf1721a0d13259",
  "0xe46D962397CDF6e4a28ef0dAE2C0E188f663fAAE",
  "0xbCFB46B6BDd25cA4396258fC537FE6Fe14aA8038",
  "0x65D83c9c3E26a8ABE51E4555BF17444eDCfa31bC",
  "0x4e4Aa72De913baC1795c972BbfAFBF0156D75143",
  "0x1839d03eB79E55A8f8B9D6D562E58DBCF4630519",
  "0xA358bb5Ee5F8E4bCD5F626c2F2bF9200B165dCA8",
  "0xDaa65aC0fCa89EDa20B895e6Eb2f54213d66ca39",
  "0xdC1c8060b11BdFf189Fc282fdB65841018626f08",
  "0x1dC6a0c890D5782968ed49FcC45DE922E3141900",
  "0xEFDf8110F7640aCeda6413f31E4085BacA6a105F",
  "0x41ca7e062fcb8870f7fa2a9e5e47f5f759891a4c",
  "0x475C4d400f1CdB7a60a3F74ce08DB3d87422Ad18",
  "0x64Ca54A3A21E6F4551F6dF3cC690aae4f8D955FF",
  "0x68f272B72E7bf5EaD2f81D17B444a6C9454D5073",
  "0x6A1f78C4E707D4289C56D81B2D94AE9EddADC87b",
  "0xc4646f0B9a42c4ea7f5Dd8A8C2525C9068B90571",
  "0x0E40447200c95Ccb31F177Def5E49814408bEa16",
  "0xF7b82542Bd45DEE4128040c013Ce56bD8eC2A0dB",
  "0x6f8e9A8965c53bEFf92897fA2b4dC571F1965343",
  "0x8540E8288c8fA81E3fb0AcE0E14cBB9514832547",
  "0x60e5d6acdc3f124ad6650c9f9467db9e9e4badfd",
  "0xabec6090e8abe2b17fd3386c7a16dce81c2f31c3",
  "0x7eFBbeD4245Cb57396D89062Cd9857Ab34Db58c6",
  "0x56dbBeBfE9b2d495c5A45e5F35C0E212DCF3AFB3",
  "0xD86C636ce41e1B490E9C6295d89F3Da97b627116",
  "0xd99805d47059d6f2cf5e08f1ef47ee099cf8325a",
  "0x69B5888f72b80BB2106cfb43fC7067b8DF791D17",
  "0xb1b2c78934209B5D0F64975fDAC311fd5fe7A9ce",
  "0x5cc72a9f94a632bda9f2cebb2074109d67d7af4e",
  "0x8bdb5c622d1495acd07579ea35bb9c62d23a69f9",
  "0xc8E8Fc8d921fB93238C698E20854B337e37A04d1",
  "0xdedccca9ffed4650efe31a655c600c54a9f036f6",
  "0xC85292C12f76Ae7be4D9C64E225ED30F21C8E661",
  "0x12fB0Ef73652eB666a8b8a477bf28e414C49e0e8",
  "0xb337f1DaB3981a37a546Dc28de71064EcF727805",
  "0xBB00AcB6686f77E53e637C3b33c08a86bFc4a475",
  "0xf3b2e945D4486Ed0E3107dC0F9DfC66658F3D7Be",
  "0x091a853ae5b5fC8d9033D9256499C66a9789aA89",
  "0xC3c88852871Ac3174F40E97bdFdc184FbBCcAe62",
  "0x37485c04af8e946934f015d9591ca0b7c2ecfa30",
  "0x37c5fd36AB51918bFDD89e58217B65e26a397149",
  "0x9353C5C376CBAAceC14B5910589c2fB4Ac1f4269",
  "0xb79b82106ac7405f03763c4456552b41ede30843",
  "0x76810B4D78C107df29A12E8aC33d2480ea534C91",
  "0xEd7B4D139a005376a047CFF2A3D01F569D6f215A",
  "0x0BafC8E0234770861Efcf292Bf22BaED780545DC",
  "0xC139496Cb464397486ecD951f6684eCe1aB3b4D3",
  "0x1263334614ab2679260f4b15f35e436e7edbe4f0",
  "0x05ad784e0c687df008437f5d0bcab39270acfc32",
  "0x5d1dA17Fcc23dda7a710C3F992a9D6eda24e4Df5",
  "0x1f4Ac73027f2636205E6290BE1d800702ed99016",
  "0xe926bbbb938f82b0e533aa5032f3e77cfc29e424",
  "0x805c17ce883311fa7536da8cc29605ee52a9e6d9",
  "0xCBE5DdEED3515Ca57F1ed2D9691a607612f2D0FE",
  "0xA7Cb201409875DFBDA7dD7ee283a2246af926503",
  "0x94D20E83Bb31Ca5Ca1E1727f89328fd4890629e4",
  "0x29B79E4C02ae17a902E56Eb8087CB8adF73543fb",
  "0x59E1ab624d655DD317EC70D4ED21346307918120",
  "0xB0b079c658c1CE1CF7672131666f7D1C0738f2De",
  "0x9a7668985BbF75D630259EB0c424BAF488f4b369",
  "0xF52C4f0b44b82223d7D60e67C6DD4f91941e1889",
  "0xe6df807d47c4c2997b64513ea66201Ac13221F03",
  "0x9a5cAa78EDCB8416A18CD949100272026C87E791",
  "0xFFe1A60F6B32040C6e6d52922BEa21d82e0f16cF",
  "0x1d0bD06BC088834b914E4991FcDc568A7753ec0d",
  "0x05bd64B57A179907e523591a1F6864952cdd1EF9",
  "0x4810d6a2cd7a09c62fc220e2e2d448d4faff1b08",
  "0xc1c312bec30367a072abc525ec5953e1d84c65fb",
  "0x0e2a91a9c2e86ef05bf8b5a7e46068a8a012d60b",
  "0x54a4b1ef69a39213fda65102cd2660c583c0f5c0",
  "0xb2fa533f90e574ae001C6D7581563C7ED7AF5D51",
  "0x9b74c5980cad88a97c2d1344c8b09112fc7c9840",
  "0x6D186A6381e53c68438863023260Fa16b038c519",
  "0x044f0e0908d1329cd773a4953a699a4c4b42c6a2",
  "0x706BC47Ef4cA0de2Cc78e9De222bb5CF8938De91",
  "0xf474a3d68d401f9e56c49fc8cc7d7f37d774c58f",
  "0x9a7136af0b35E1aCd417dbd105a3e171df0b6E17",
  "0x4FB02BA5d7E4Ac803C98dAeA961B2baa8bA83e6F",
  "0xFF5414737c5B37B713025c690b042B335E31Ed39",
  "0x2e2A9506a6847f6349dEFDAB5385ABc34262834c",
  "0x2989C685788A0300cA294Dceb66E1337655C746E",
  "0x1Ca0B76f7Ad0394a6C16b37468f4Ea9D2967DA54",
  "0x80B14aF1EF612cE5eC2c17c9d7AD2ceE21104B6d",
  "0xcb3ebd848d23d5dbe10ddeb1b943414ff5dcdcf8",
  "0xfE5962CedA0e914eD76a019f90704c8715F942cc",
  "0x71924297899D8CEab6eec68C135697DD3E990Baa",
  "0x349a70ec5819e96fae48cbf6d54bf57f97fbde7e",
  "0x75758394DB34d5ddb8cd16f08F8996c9dd75Ed43",
  "0x58248B4B95408019728023a05Ed7719DE2Ca97f8",
  "0x22FD4d24771358fD18a3964456CD5F9d7b6E8f9f",
  "0xFB6F91c4A5e37B8db368Fab027D6c9C3Ad680d1b",
  "0xBb0732C77e104D6246cE89890338b8B86317283d",
  "0xC90261AC564436b5655Be205303f51a405E0CB07",
  "0xC851A481D17e382625F8F0A2013a5221E73dB4ec",
  "0x1a71c1d69c99A5992e13F1E50a481e1CAf69eAE7",
  "0x0f399c549d86951D1e09dA992e23cCBF0393a58C",
].map((addr) => addr.toLowerCase()); // Convert to lowercase for comparison

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC721EnumerableForbiddenBatchMint",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "ERC721OutOfBoundsIndex",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safeMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "_baseTokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasMinted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Replace with your actual deployed contract address
const CONTRACT_ADDRESS = "0x62aDdE8200084C5C4932B29A266163246B4941CA";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "white",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundImage:
      "radial-gradient(circle at 25% 25%, #3b0764 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1e1b4b 0%, transparent 50%)",
    backgroundSize: "100% 100%",
    position: "relative" as const,
    overflow: "hidden",
  },
  animatedBackground: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(-45deg, #1a1a1a, #2d1b69, #1a1a1a, #581c87)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    zIndex: -1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    borderBottom: "1px solid rgba(55, 65, 81, 0.3)",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    position: "relative" as const,
    zIndex: 10,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoIcon: {
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: "white",
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
  },
  logoDiamond: {
    width: "1.75rem",
    height: "1.75rem",
    backgroundColor: "black",
    transform: "rotate(45deg)",
    animation: "spin 20s linear infinite",
  },
  nav: {
    display: "flex",
    gap: "2.5rem",
  },
  navLink: {
    color: "#9ca3af",
    textDecoration: "none",
    transition: "all 0.3s ease",
    padding: "0.5rem 0",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  navLinkActive: {
    color: "#3b82f6",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "0.5rem",
  },
  main: {
    maxWidth: "90rem",
    margin: "0 auto",
    padding: "4rem 2rem",
    position: "relative" as const,
    zIndex: 1,
  },
  heroSection: {
    textAlign: "center" as const,
    marginBottom: "4rem",
  },
  heroTitle: {
    fontSize: "4.5rem",
    fontWeight: "900",
    marginBottom: "1.5rem",
    lineHeight: "1.1",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f97316 50%, #3b82f6 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    animation: "textGlow 3s ease-in-out infinite alternate",
  },
  heroDescription: {
    color: "#d1d5db",
    fontSize: "1.25rem",
    marginBottom: "3rem",
    lineHeight: "1.8",
    maxWidth: "48rem",
    margin: "0 auto 3rem",
  },
  mainGrid: {
    gap: "4rem",

    alignItems: "start",
    marginBottom: "5rem",
    width: "60%", // Set width to 50%
    margin: "0 auto 5rem auto", // Center horizontally, keep bottom margin
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  statCard: {
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    padding: "2rem",
    borderRadius: "1rem",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative" as const,
    overflow: "hidden",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#9ca3af",
    marginBottom: "0.75rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
  },
  statValue: {
    fontSize: "2.25rem",
    fontWeight: "900",
    position: "relative" as const,
    zIndex: 1,
  },
  mintCard: {
    backgroundColor: "rgba(17, 24, 39, 0.9)",
    borderRadius: "1.5rem",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    padding: "2.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    position: "relative" as const,
    overflow: "hidden",
  },
  mintCardBorder: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, #3b82f6, #f97316, #3b82f6)",
    padding: "1px",
    borderRadius: "1.5rem",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    animation: "borderGlow 3s linear infinite",
  },
  mintTitle: {
    fontSize: "1.75rem",
    fontWeight: "800",
    textAlign: "center" as const,
    marginBottom: "2rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  nftPreview: {
    width: "10rem",
    height: "10rem",
    margin: "0 auto 2rem",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.75rem",
    fontWeight: "900",
    boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
    animation: "float 6s ease-in-out infinite",
    position: "relative" as const,
    overflow: "hidden",
  },
  nftGlow: {
    position: "absolute" as const,
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.3), transparent)",
    animation: "rotate 4s linear infinite",
  },
  mintButton: {
    width: "100%",
    padding: "1.25rem 2rem",
    background: "linear-gradient(135deg, #2563eb, #3b82f6, #1d4ed8)",
    borderRadius: "1rem",
    color: "white",
    fontWeight: "800",
    fontSize: "1.125rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative" as const,
    overflow: "hidden",
    letterSpacing: "0.05em",
  },
  mintButtonDisabled: {
    background: "rgba(75, 85, 99, 0.8)",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  status: {
    marginTop: "2rem",
    padding: "1.25rem",
    borderRadius: "1rem",
    textAlign: "center" as const,
    fontWeight: "600",
    backdropFilter: "blur(10px)",
  },
  connectSection: {
    textAlign: "center" as const,
    padding: "2rem",
  },
  progressSection: {
    marginTop: "5rem",
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    backdropFilter: "blur(10px)",
  },
  progressBar: {
    width: "100%",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: "1rem",
    height: "1.5rem",
    overflow: "hidden",
    position: "relative" as const,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #f97316, #ea580c, #dc2626)",
    borderRadius: "1rem",
    transition: "width 1s ease-out",
    position: "relative" as const,
    overflow: "hidden",
  },
  progressGlow: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    animation: "shimmer 2s infinite",
  },
  soldOutBadge: {
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    border: "1px solid rgba(220, 38, 38, 0.5)",
    color: "#fca5a5",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "700",
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  // NEW WHITELIST STYLES
  whitelistBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    border: "1px solid rgba(16, 185, 129, 0.5)",
    color: "#6ee7b7",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "700",
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  notWhitelistedBadge: {
    backgroundColor: "rgba(245, 101, 101, 0.2)",
    border: "1px solid rgba(245, 101, 101, 0.5)",
    color: "#fca5a5",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "700",
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  whitelistInfo: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginBottom: "2rem",
    textAlign: "center" as const,
  },
};

// Add keyframes as a style tag
const keyframes = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes textGlow {
    0% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
    100% { text-shadow: 0 0 40px rgba(249, 115, 22, 0.8); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes spin {
    0% { transform: rotate(45deg); }
    100% { transform: rotate(405deg); }
  }
  @keyframes borderGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export default function Home() {
  const [status, setStatus] = useState("");
  const [supply, setSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(500);
  const [remaining, setRemaining] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);
      return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return isMobile;
  };

  // Then in your component, add this line after your other useState declarations:
  const isMobile = useIsMobile();
  // Check if user is whitelisted
  useEffect(() => {
    if (address) {
      const whitelisted = WHITELIST_ADDRESSES.includes(address.toLowerCase());
      setIsWhitelisted(whitelisted);
      if (!whitelisted) {
        setStatus("❌ Your wallet is not on the whitelist");
      } else {
        setStatus("✅ Your wallet is whitelisted!");
      }
    }
  }, [address]);
  // Add these state variables to your existing useState declarations:
  const [userBalance, setUserBalance] = useState(0);
  const [hasUserMinted, setHasUserMinted] = useState(false);
  useEffect(() => {
    if (address) {
      const whitelisted = WHITELIST_ADDRESSES.includes(address.toLowerCase());
      setIsWhitelisted(whitelisted);

      // Check user's NFT balance and mint status
      checkUserStatus();

      if (!whitelisted) {
        setStatus("❌ Your wallet is not on the whitelist");
      } else {
        setStatus("✅ Your wallet is whitelisted!");
      }
    }
  }, [address, publicClient]);

  const checkUserStatus = async () => {
    if (!publicClient || !address) return;

    try {
      const [balance] = await Promise.all([
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
      ]);

      setUserBalance(Number(balance));
      setHasUserMinted(Number(balance) > 0 ? true : false);
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      if (!publicClient) return;

      try {
        const [totalSupply, maxSupplyData] = await Promise.all([
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "totalSupply",
          }),
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "MAX_SUPPLY",
          }),
        ]);

        const currentSupply = Number(totalSupply);
        const maxSupplyNum = Number(maxSupplyData);
        const remainingSupply = maxSupplyNum - currentSupply;

        setSupply(currentSupply);
        setMaxSupply(maxSupplyNum);
        setRemaining(remainingSupply);
        setIsSoldOut(remainingSupply <= 0);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setStatus("Error loading contract data");
      }
    };

    fetchContractData();
    const interval = setInterval(fetchContractData, 30000);
    return () => clearInterval(interval);
  }, [publicClient]);

  const handleMint = async () => {
    if (!walletClient || !address) {
      setStatus("Please connect your wallet");
      return;
    }

    if (!isWhitelisted) {
      setStatus("❌ Your wallet is not on the whitelist for this mint");
      return;
    }

    if (isSoldOut) {
      setStatus("Sorry, all NFTs have been minted!");
      return;
    }

    setIsLoading(true);
    setStatus("Preparing transaction...");

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [], // Updated to pass address as parameter
        value: BigInt(0),
        chain: base,
        account: address,
      });

      setStatus("Transaction submitted. Waiting for confirmation...");

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "success") {
          setStatus("Mint successful! 🎉");

          const newSupply = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "totalSupply",
          });

          const currentSupply = Number(newSupply);
          const remainingSupply = maxSupply - currentSupply;

          setSupply(currentSupply);
          setRemaining(remainingSupply);
          setIsSoldOut(remainingSupply <= 0);
        } else {
          setStatus("Transaction failed");
        }
      }
    } catch (error: any) {
      console.error("Mint error:", error);
      if (error.message?.includes("Max supply reached")) {
        setStatus("Sorry, all NFTs have been minted!");
        setIsSoldOut(true);
      } else if (error.message?.includes("already minted")) {
        setStatus("You have already minted your NFT!");
      } else {
        setStatus(`Mint failed: ${error.shortMessage || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = () => {
    if (status.includes("successful") || status.includes("✅")) {
      return {
        ...styles.status,
        backgroundColor: "rgba(6, 78, 59, 0.8)",
        border: "1px solid rgba(5, 150, 105, 0.5)",
        color: "#10b981",
      };
    } else if (
      status.includes("failed") ||
      status.includes("Error") ||
      status.includes("❌")
    ) {
      return {
        ...styles.status,
        backgroundColor: "rgba(127, 29, 29, 0.8)",
        border: "1px solid rgba(220, 38, 38, 0.5)",
        color: "#f87171",
      };
    } else {
      return {
        ...styles.status,
        backgroundColor: "rgba(120, 53, 15, 0.8)",
        border: "1px solid rgba(217, 119, 6, 0.5)",
        color: "#fbbf24",
      };
    }
  };

  const progressPercentage = maxSupply > 0 ? (supply / maxSupply) * 100 : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div style={styles.container}>
        <div style={styles.animatedBackground}></div>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <img
              src="/stackLogo.png"
              alt="StackFi Logo"
              style={{
                width: "8.5rem",
                height: "5.5rem",
                borderRadius: "0.25rem",
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
              }}
            />
          </div>
          <nav style={styles.nav}>
            <a
              href="#"
              style={{ ...styles.navLink, ...styles.navLinkActive }}
              onMouseOver={(e: any) => (e.target.style.color = "#60a5fa")}
              onMouseOut={(e: any) => (e.target.style.color = "#3b82f6")}
            >
              Home
            </a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ConnectButton />
          </div>
        </header>

        <main style={styles.main}>
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <h1 style={styles.heroTitle}>StackFi NFT WHITELIST MINT</h1>
            <p style={styles.heroDescription}>
              Exclusive whitelist mint for StackFi community members. Only
              whitelisted addresses can participate in this Genesis NFT drop.
            </p>
          </div>

          {/* Whitelist Notice */}
          <div style={styles.whitelistInfo}>
            <h3
              style={{
                margin: "0 0 1rem 0",
                color: "#60a5fa",
                fontSize: "1.25rem",
                fontWeight: "700",
              }}
            >
              🎯 WHITELIST ONLY MINT
            </h3>
            <p style={{ margin: "0", color: "#d1d5db", lineHeight: "1.6" }}>
              This is an exclusive mint for whitelisted community members only.
              <br />
              {/* <strong>
                Total whitelisted addresses: {WHITELIST_ADDRESSES.length}
              </strong> */}
              <br />
              Each whitelisted address can mint exactly 1 NFT.
            </p>
          </div>
          <div style={styles.statsSection}>
            <div
              style={styles.statCard}
              onMouseOver={(e: any) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 50px rgba(249, 115, 22, 0.15)";
              }}
              onMouseOut={(e: any) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={styles.statLabel}>TOTAL MINTED</div>
              <div style={{ ...styles.statValue, color: "#f97316" }}>
                {supply.toLocaleString()}
              </div>
            </div>

            <div
              style={styles.statCard}
              onMouseOver={(e: any) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 50px rgba(16, 185, 129, 0.15)";
              }}
              onMouseOut={(e: any) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={styles.statLabel}>REMAINING</div>
              <div
                style={{
                  ...styles.statValue,
                  color: remaining > 0 ? "#10b981" : "#ef4444",
                }}
              >
                {remaining.toLocaleString()}
              </div>
            </div>

            {/* <div
                style={styles.statCard}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(59, 130, 246, 0.15)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.statLabel}>WHITELISTED</div>
                <div style={{ ...styles.statValue, color: "#3b82f6" }}>
                  {WHITELIST_ADDRESSES.length}
                </div>
              </div>

              <div
                style={styles.statCard}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(255, 255, 255, 0.15)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.statLabel}>MINT PRICE</div>
                <div style={{ ...styles.statValue, color: "#10b981" }}>
                  FREE
                </div>
              </div> */}
          </div>
          <div style={styles.mainGrid}>
            {/* Left Side - Stats */}

            {/* Right Side - Mint Interface */}
            <div
              style={{
                ...styles.mintCard,
                padding: isMobile ? "1.5rem" : "2.5rem",
              }}
            >
              <div style={styles.mintCardBorder}></div>
              <h2
                style={{
                  ...styles.mintTitle,
                  fontSize: isMobile ? "1.5rem" : "1.75rem",
                }}
              >
                WHITELIST MINT
              </h2>

              <div
                style={{
                  ...styles.nftPreview,
                  width: isMobile ? "8rem" : "10rem",
                  height: isMobile ? "8rem" : "10rem",
                }}
              >
                <div style={styles.nftGlow}></div>
                <div style={styles.logo}>
                  <img
                    src="/nft.png"
                    alt="StackFi NFT"
                    style={{
                      width: isMobile ? "6rem" : "8.5rem",
                      height: isMobile ? "3.5rem" : "5.5rem",
                      borderRadius: "0.25rem",
                      boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
              </div>

              {/* Whitelist Status */}
              {isConnected && address && (
                <>
                  {isWhitelisted ? (
                    <div
                      style={{
                        ...styles.whitelistBadge,
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        padding: isMobile ? "0.6rem 1rem" : "0.75rem 1.5rem",
                      }}
                    >
                      ✅ WHITELISTED - You can mint!
                    </div>
                  ) : (
                    <div
                      style={{
                        ...styles.notWhitelistedBadge,
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        padding: isMobile ? "0.6rem 1rem" : "0.75rem 1.5rem",
                      }}
                    >
                      ❌ NOT WHITELISTED - Address not eligible
                    </div>
                  )}
                </>
              )}

              {isConnected && address && (
                <div
                  style={{
                    backgroundColor: "rgba(75, 85, 99, 0.2)",
                    border: "1px solid rgba(75, 85, 99, 0.5)",
                    borderRadius: "0.75rem",
                    padding: isMobile ? "0.75rem" : "1rem",
                    marginBottom: isMobile ? "1rem" : "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: isMobile ? "0.75rem" : "1rem",
                      fontSize: "0.875rem",
                      color: "#d1d5db",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#9ca3af",
                          marginBottom: "0.25rem",
                          fontSize: isMobile ? "0.8rem" : "0.875rem",
                        }}
                      >
                        Your Balance
                      </div>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: isMobile ? "1rem" : "1.125rem",
                          color: userBalance > 0 ? "#10b981" : "#6b7280",
                        }}
                      >
                        {userBalance} NFT{userBalance !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          color: "#9ca3af",
                          marginBottom: "0.25rem",
                          fontSize: isMobile ? "0.8rem" : "0.875rem",
                        }}
                      >
                        Mint Status
                      </div>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: isMobile ? "1rem" : "1.125rem",
                          color: hasUserMinted ? "#f59e0b" : "#6b7280",
                        }}
                      >
                        {hasUserMinted ? "✅ Minted" : "⏳ Not Minted"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isSoldOut && (
                <div
                  style={{
                    ...styles.soldOutBadge,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    padding: isMobile ? "0.6rem 1rem" : "0.75rem 1.5rem",
                  }}
                >
                  🔥 SOLD OUT - All {maxSupply} NFTs Minted!
                </div>
              )}

              {isConnected ? (
                <div>
                  <button
                    onClick={handleMint}
                    disabled={
                      isLoading || isSoldOut || !isWhitelisted || hasUserMinted
                    }
                    style={{
                      ...styles.mintButton,
                      ...(isLoading ||
                      isSoldOut ||
                      !isWhitelisted ||
                      hasUserMinted
                        ? styles.mintButtonDisabled
                        : {}),
                      fontSize: isMobile ? "1rem" : "1.125rem",
                      padding: isMobile ? "1rem 1.5rem" : "1.25rem 2rem",
                    }}
                    onMouseOver={(e: any) => {
                      if (
                        !isLoading &&
                        !isSoldOut &&
                        isWhitelisted &&
                        !hasUserMinted
                      ) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 20px 40px rgba(37, 99, 235, 0.4)";
                      }
                    }}
                    onMouseOut={(e: any) => {
                      if (
                        !isLoading &&
                        !isSoldOut &&
                        isWhitelisted &&
                        !hasUserMinted
                      ) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {isLoading
                      ? "MINTING..."
                      : isSoldOut
                      ? "SOLD OUT"
                      : !isWhitelisted
                      ? "NOT WHITELISTED"
                      : hasUserMinted
                      ? "ALREADY MINTED"
                      : "MINT FREE NFT"}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    ...styles.connectSection,
                    padding: isMobile ? "1rem" : "2rem",
                  }}
                >
                  <p
                    style={{
                      color: "#9ca3af",
                      marginBottom: "2rem",
                      fontSize: isMobile ? "1rem" : "1.125rem",
                    }}
                  >
                    Connect your wallet to check whitelist status
                  </p>
                  <div
                    style={{
                      backgroundColor: "rgba(55, 65, 81, 0.8)",
                      borderRadius: "1rem",
                      padding: isMobile ? "1rem" : "1.5rem",
                      border: "1px solid rgba(75, 85, 99, 0.5)",
                      backdropFilter: "blur(10px)",
                      display: "inline-block",
                    }}
                  >
                    <ConnectButton />
                  </div>
                </div>
              )}

              {status && (
                <div
                  style={{
                    ...getStatusStyle(),
                    padding: isMobile ? "1rem" : "1.25rem",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    {status}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressSection}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
                WHITELIST MINT PROGRESS
              </h3>
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                }}
              >
                {supply.toLocaleString()} / {maxSupply.toLocaleString()} (
                {Math.round(progressPercentage)}%)
              </span>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progressPercentage}%`,
                }}
              >
                <div style={styles.progressGlow}></div>
              </div>
            </div>

            {remaining > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "#10b981",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                }}
              >
                {remaining} NFTs remaining for whitelist members
              </div>
            )}
          </div>

          {/* Features Section */}
          <div
            style={{
              marginTop: "6rem",
              textAlign: "center" as const,
            }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                marginBottom: "1.5rem",
                lineHeight: "1.2",
              }}
            >
              <span style={{ color: "white" }}>WHITELIST </span>
              <span style={{ color: "#f97316" }}>BENEFITS</span>
            </h2>
            <p
              style={{
                color: "#d1d5db",
                fontSize: "1.125rem",
                marginBottom: "4rem",
                maxWidth: "64rem",
                margin: "0 auto 4rem",
                lineHeight: "1.7",
              }}
            >
              As a whitelisted member, you get exclusive early access to mint
              your StackFi NFT before the public sale. Each NFT grants you
              special privileges in the StackFi ecosystem.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "2rem",
                maxWidth: "80rem",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 60px rgba(59, 130, 246, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.5)";
                }}
              >
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#1d4ed8",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#3b82f6",
                      borderRadius: "50%",
                      animation: "float 4s ease-in-out infinite 1s",
                    }}
                  ></div>
                </div>
                <h3
                  style={{
                    color: "#3b82f6",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  FREE MINT
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#d1d5db",
                    marginBottom: "1.25rem",
                    lineHeight: "1.6",
                  }}
                >
                  No cost to mint for whitelisted members
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    lineHeight: "1.5",
                  }}
                >
                  Save on gas fees with our optimized minting contract
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 60px rgba(16, 185, 129, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.5)";
                }}
              >
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#059669",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#10b981",
                      borderRadius: "0.5rem",
                      transform: "rotate(45deg)",
                      animation: "float 4s ease-in-out infinite 2s",
                    }}
                  ></div>
                </div>
                <h3
                  style={{
                    color: "#10b981",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  EXCLUSIVE UTILITY
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#d1d5db",
                    marginBottom: "1.25rem",
                    lineHeight: "1.6",
                  }}
                >
                  Unlock premium features and governance rights
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    lineHeight: "1.5",
                  }}
                >
                  Access to special DeFi strategies and community perks
                </p>
              </div>
            </div>
          </div>

          {/* Whitelist Rules Section */}
          <div
            style={{
              marginTop: "6rem",
              textAlign: "center",
              backgroundColor: "rgba(17, 24, 39, 0.6)",
              borderRadius: "2rem",
              padding: "3rem",
              border: "1px solid rgba(55, 65, 81, 0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "2rem",
                background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              📋 WHITELIST RULES
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                maxWidth: "60rem",
                margin: "0 auto",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "1rem",
                  padding: "2rem",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  ✅
                </div>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#60a5fa",
                    textAlign: "center",
                  }}
                >
                  Eligibility
                </h4>
                <ul
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    paddingLeft: "1.25rem",
                    margin: 0,
                  }}
                >
                  <li>Only whitelisted addresses can mint</li>
                  <li>Must connect your whitelisted wallet</li>
                  <li>Contract automatically verifies eligibility</li>
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(249, 115, 22, 0.1)",
                  borderRadius: "1rem",
                  padding: "2rem",
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  🎯
                </div>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#fb923c",
                    textAlign: "center",
                  }}
                >
                  Mint Limits
                </h4>
                <ul
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    paddingLeft: "1.25rem",
                    margin: 0,
                  }}
                >
                  <li>1 NFT per whitelisted address</li>
                  <li>Cannot mint multiple times</li>
                  <li>No transferring mint rights</li>
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "1rem",
                  padding: "2rem",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  💰
                </div>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#34d399",
                    textAlign: "center",
                  }}
                >
                  Cost
                </h4>
                <ul
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    paddingLeft: "1.25rem",
                    margin: 0,
                  }}
                >
                  <li>Completely FREE to mint</li>
                  <li>Only pay gas fees</li>
                  <li>No hidden costs</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderTop: "1px solid rgba(55, 65, 81, 0.3)",
            padding: "2rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            marginTop: "4rem",
          }}
        >
          <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              © 2025 StackFi. All rights reserved. | Whitelist Mint Phase Active
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                color: "#9ca3af",
                fontSize: "0.9rem",
              }}
            >
              <a
                href="https://twitter.com/StackFi"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e: any) => (e.target.style.color = "#f97316")}
                onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
              >
                Twitter
              </a>
              <a
                href="https://t.me/StackFi"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e: any) => (e.target.style.color = "#f97316")}
                onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
              >
                Telegram
              </a>
              <a
                href="https://discord.gg/StackFi"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e: any) => (e.target.style.color = "#f97316")}
                onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
              >
                Discord
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
