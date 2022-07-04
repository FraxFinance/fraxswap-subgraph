import {
  Approval as ApprovalEvent,
  Burn as BurnEvent,
  CancelLongTermOrder as CancelLongTermOrderEvent,
  LongTermSwap0To1 as LongTermSwap0To1Event,
  LongTermSwap1To0 as LongTermSwap1To0Event,
  Mint as MintEvent,
  Swap as SwapEvent,
  Sync as SyncEvent,
  Transfer as TransferEvent,
  VirtualOrderExecution as VirtualOrderExecutionEvent,
  WithdrawProceedsFromLongTermOrder as WithdrawProceedsFromLongTermOrderEvent
} from "../generated/FraxswapPair/FraxswapPair"
import {
  Approval,
  Burn,
  CancelLongTermOrder,
  LongTermSwap0To1,
  LongTermSwap1To0,
  Mint,
  Swap,
  Sync,
  Transfer,
  VirtualOrderExecution,
  WithdrawProceedsFromLongTermOrder
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleBurn(event: BurnEvent): void {
  let entity = new Burn(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.to = event.params.to
  entity.save()
}

export function handleCancelLongTermOrder(
  event: CancelLongTermOrderEvent
): void {
  let entity = new CancelLongTermOrder(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.addr = event.params.addr
  entity.orderId = event.params.orderId
  entity.sellToken = event.params.sellToken
  entity.unsoldAmount = event.params.unsoldAmount
  entity.buyToken = event.params.buyToken
  entity.purchasedAmount = event.params.purchasedAmount
  entity.save()
}

export function handleLongTermSwap0To1(event: LongTermSwap0To1Event): void {
  let entity = new LongTermSwap0To1(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.addr = event.params.addr
  entity.orderId = event.params.orderId
  entity.amount0In = event.params.amount0In
  entity.numberOfTimeIntervals = event.params.numberOfTimeIntervals
  entity.save()
}

export function handleLongTermSwap1To0(event: LongTermSwap1To0Event): void {
  let entity = new LongTermSwap1To0(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.addr = event.params.addr
  entity.orderId = event.params.orderId
  entity.amount1In = event.params.amount1In
  entity.numberOfTimeIntervals = event.params.numberOfTimeIntervals
  entity.save()
}

export function handleMint(event: MintEvent): void {
  let entity = new Mint(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.save()
}

export function handleSwap(event: SwapEvent): void {
  let entity = new Swap(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.amount0In = event.params.amount0In
  entity.amount1In = event.params.amount1In
  entity.amount0Out = event.params.amount0Out
  entity.amount1Out = event.params.amount1Out
  entity.to = event.params.to
  entity.save()
}

export function handleSync(event: SyncEvent): void {
  let entity = new Sync(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve0 = event.params.reserve0
  entity.reserve1 = event.params.reserve1
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}

export function handleVirtualOrderExecution(
  event: VirtualOrderExecutionEvent
): void {
  let entity = new VirtualOrderExecution(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.blocktimestamp = event.params.blocktimestamp
  entity.newReserve0 = event.params.newReserve0
  entity.newReserve1 = event.params.newReserve1
  entity.newTwammReserve0 = event.params.newTwammReserve0
  entity.newTwammReserve1 = event.params.newTwammReserve1
  entity.token0Bought = event.params.token0Bought
  entity.token1Bought = event.params.token1Bought
  entity.token0Sold = event.params.token0Sold
  entity.token1Sold = event.params.token1Sold
  entity.expiries = event.params.expiries
  entity.save()
}

export function handleWithdrawProceedsFromLongTermOrder(
  event: WithdrawProceedsFromLongTermOrderEvent
): void {
  let entity = new WithdrawProceedsFromLongTermOrder(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.addr = event.params.addr
  entity.orderId = event.params.orderId
  entity.proceedToken = event.params.proceedToken
  entity.proceeds = event.params.proceeds
  entity.orderExpired = event.params.orderExpired
  entity.save()
}
