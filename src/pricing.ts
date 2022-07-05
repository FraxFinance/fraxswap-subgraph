import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  FRAX_FXS_PAIR,
  FRAXSWAP_FRAX_WETH_PAIR,
  FRAX,
  NATIVE
} from 'const'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Pair, Token } from '../generated/schema'

import { FraxswapFactory as FactoryContract } from '../generated/templates/FraxswapPair/FraxswapFactory'
import { FraxswapPair as PairContract } from '../generated/templates/FraxswapPair/FraxswapPair'

// export const uniswapFactoryContract = FactoryContract.bind(Address.fromString("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"))

export const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)

export function getFxsPrice(): BigDecimal {
  const pair = Pair.load(FRAX_FXS_PAIR)

  if (pair) {
    return pair.token0Price
  }

  return BIG_DECIMAL_ZERO
}

export function getEthPrice(block?: ethereum.Block): BigDecimal {
  // Fetch eth prices for each stablecoin
  const fraxPair = Pair.load(FRAXSWAP_FRAX_WETH_PAIR)
  
  // Can do a weighted average here later
  if (
    fraxPair !== null &&
    fraxPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
  ) {
    const isFraxFirst = fraxPair.token0 == FRAX
    const fraxPairEth = isFraxFirst ? fraxPair.reserve1 : fraxPair.reserve0
    const totalLiquidityETH = fraxPairEth;
    const fraxWeight = !isFraxFirst ? fraxPair.reserve0.div(totalLiquidityETH) : fraxPair.reserve1.div(totalLiquidityETH)
    const fraxPrice = isFraxFirst ? fraxPair.token0Price : fraxPair.token1Price

    return fraxPrice.times(fraxWeight);

  } 
  else {
    log.warning('No eth pair...', [])
    return BIG_DECIMAL_ZERO
  }
}

export function findEthPerToken(token: Token): BigDecimal {
  if (Address.fromString(token.id) == NATIVE) {
    return BIG_DECIMAL_ONE
  }

  const whitelist = token.whitelistPairs

  for (let i = 0; i < whitelist.length; ++i) {
    const pairAddress = whitelist[i]
    const pair = Pair.load(pairAddress)
    if (!pair) throw "Pair not found";

    if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
      const token1 = Token.load(pair.token1)
      if (!token1) throw "token1 not found";

      return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
    }

    if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
      const token0 = Token.load(pair.token0)
      if (!token0) throw "token0 not found";
      return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
    }
  }

  return BIG_DECIMAL_ZERO // nothing was found return 0
}
