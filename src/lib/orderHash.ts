import { encodeAbiParameters, keccak256 } from 'viem';

export type OrderHashInput = {
  orderId: `0x${string}`;
  productId: bigint;
  quantity: bigint;
  unitPriceCents: bigint;
  buyer: `0x${string}`;
  seller: `0x${string}`;
};

// Hash del pedido con codificación ABI fija (sin JSON), para que el mismo pedido dé siempre el mismo valor.
// Las direcciones se pasan en minúsculas para no depender de mayúsculas o checksum.
export function computeOrderHash(input: OrderHashInput): `0x${string}` {
  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'address' },
      { type: 'address' },
    ],
    [
      input.orderId,
      input.productId,
      input.quantity,
      input.unitPriceCents,
      input.buyer.toLowerCase() as `0x${string}`,
      input.seller.toLowerCase() as `0x${string}`,
    ],
  );
  return keccak256(encoded);
}
