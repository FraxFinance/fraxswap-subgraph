import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  BIG_NATIVE_START_PRICE,
  FACTORY_ADDRESS,
  FRAXSWAP_FRAX_WETH_PAIR_ADDRESS,
  FRAXSWAP_FRAX_WETH_PAIR_DEPLOY_BLOCK,
  FXS_ADDRESS,
  BIG_FXS_START_PRICE,
  FRAX_FXS_PAIR_ADDRESS,
  FRAX_ADDRESS,
  WETH_ADDRESS,
} from 'const';
import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts'

import { FraxswapFactory as FactoryContract } from '../../generated/FraxswapFactory/FraxswapFactory'
import { FraxswapPair as PairContract } from '../../generated//FraxswapFactory/FraxswapPair'

export function getUSDRate(token: Address, block: ethereum.Block): BigDecimal {
  const usd_price = BIG_DECIMAL_ONE;

  if (block.number.le(BigInt.fromI32(FRAXSWAP_FRAX_WETH_PAIR_DEPLOY_BLOCK))) {
    return usd_price // Return 1
  }
  else if (token != FRAX_ADDRESS) {
    const address = FRAXSWAP_FRAX_WETH_PAIR_ADDRESS

    const tokenPriceETH = getEthRate(token, block)

    const pair = PairContract.bind(address)

    const reserves = pair.getReserves()

    const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)

    const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

    const ethPriceUSD = reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)

    return ethPriceUSD.times(tokenPriceETH)
  }

  return usd_price
}

export function getEthRate(token: Address, block: ethereum.Block): BigDecimal {
  let eth_price = BIG_NATIVE_START_PRICE

  if (block.number.le(BigInt.fromI32(FRAXSWAP_FRAX_WETH_PAIR_DEPLOY_BLOCK))) {
    // FRAX/FXS was deployed really close to FRAX/WETH, so this should be ok
    // This is more of a short corner case
    return eth_price
  }
  else if (token != WETH_ADDRESS) {
    const factory = FactoryContract.bind(FACTORY_ADDRESS)

    const address = factory.getPair(token, WETH_ADDRESS)

    if (address == ADDRESS_ZERO) {
      log.info('Adress ZERO...', [])
      return BIG_DECIMAL_ZERO
    }

    const pair = PairContract.bind(address)

    const reserves = pair.getReserves()

    eth_price =
      pair.token0() == WETH_ADDRESS
        ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
        : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

    return eth_price.div(BIG_DECIMAL_1E18)
  }

  return eth_price
}

export function getFxsPrice(block: ethereum.Block): BigDecimal {
  let fxs_price = BIG_FXS_START_PRICE;

  if (block.number.lt(BigInt.fromI32(FRAXSWAP_FRAX_WETH_PAIR_DEPLOY_BLOCK))) {
    // Approx price for now
    return fxs_price
  }
  else {
    // Else get price from either uni or sushi usdt pair depending on space-time
    const pair = PairContract.bind(FRAX_FXS_PAIR_ADDRESS)
    const reserves = pair.getReserves()

    fxs_price =
      pair.token0() == FXS_ADDRESS
        ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
        : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

  }

  return fxs_price;
}
