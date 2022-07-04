import { Address, ethereum } from '@graphprotocol/graph-ts'
import { LiquidityPosition, LiquidityPositionSnapshot, Pair, Token } from '../../generated/schema'
import { getBundle, getPair, getToken } from '.'

import { FraxswapPair as PairContract } from '../../generated/templates/FraxswapPair/FraxswapPair'

export function createLiquidityPositionSnapshot(position: LiquidityPosition, block: ethereum.Block): void {
  const timestamp = block.timestamp.toI32()

  const id = position.id.concat('-').concat(timestamp.toString())

  const bundle = getBundle()

  const pair = getPair(Address.fromString(position.pair), block)
  if (!pair) throw "Pair is null";

  const token0 = getToken(Address.fromString(pair.token0))
  if (!token0) throw "token0 is null";

  const token1 = getToken(Address.fromString(pair.token1))
  if (!token1) throw "token1 is null";

  const snapshot = new LiquidityPositionSnapshot(id)

  snapshot.timestamp = timestamp
  snapshot.block = block.number.toI32()
  snapshot.user = position.user
  snapshot.pair = position.pair
  snapshot.token0PriceUSD = token0.derivedETH.times(bundle.ethPrice)
  snapshot.token1PriceUSD = token1.derivedETH.times(bundle.ethPrice)
  snapshot.reserve0 = pair.reserve0
  snapshot.reserve1 = pair.reserve1
  snapshot.reserveUSD = pair.reserveUSD
  snapshot.liquidityTokenTotalSupply = pair.totalSupply
  snapshot.liquidityTokenBalance = position.liquidityTokenBalance
  snapshot.liquidityPosition = position.id
  snapshot.save()
}
