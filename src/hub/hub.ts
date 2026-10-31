import { createChainClient } from '@parity/product-sdk/chain';
import { createContract, createContractRuntimeFromClient, type AbiEntry } from '@parity/product-sdk/contracts';
import { isInsideContainer, requestResourceAllocation } from '@parity/product-sdk/host';
import { SignerManager } from '@parity/product-sdk/wallet';
import { devnet_asset_hub } from '@parity/product-sdk-descriptors/devnet-asset-hub';
import campusChainAbi from '../contract/campusChain.abi.json';
import { productIdFromHostname } from '../lib/product';

// Dirección que dio Remix al desplegar CampusChain.sol en Products Devnet (ver README).
const CONTRACT_ADDRESS_ENV: string | undefined = import.meta.env.VITE_CONTRACT_ADDRESS;

// Sin dirección válida, createContract falla con un TypeError poco claro: se avisa antes.
export function contractAddress(): `0x${string}` {
  if (!CONTRACT_ADDRESS_ENV || !/^0x[0-9a-fA-F]{40}$/.test(CONTRACT_ADDRESS_ENV)) {
    throw new Error(
      'Falta VITE_CONTRACT_ADDRESS. Despliega CampusChain.sol, crea .env con la dirección y vuelve a construir la app.',
    );
  }
  return CONTRACT_ADDRESS_ENV as `0x${string}`;
}

// Índice de la cuenta derivada del Product. Siempre 0 en esta app.
const DERIVATION_INDEX = 0;

export class OutsideHostError extends Error {
  constructor() {
    super('Abre esta app dentro de Polkadot Desktop o de la Polkadot App.');
    this.name = 'OutsideHostError';
  }
}

export type Session = {
  dappName: string;
  address: string; // SS58 de la cuenta del Product
  h160: `0x${string}`; // msg.sender del contrato
  contract: ReturnType<typeof createContract>;
};

export async function connectSession(): Promise<Session> {
  // Antes de pedir permisos al Host: si falta la dirección, no tiene sentido conectar.
  const address = contractAddress();
  if (!(await isInsideContainer())) throw new OutsideHostError();

  const dappName = productIdFromHostname(window.location.hostname);

  const client = await createChainClient({ chains: { assetHub: devnet_asset_hub } });
  const runtime = createContractRuntimeFromClient(client.raw.assetHub, devnet_asset_hub, { at: 'best' });

  const manager = new SignerManager({
    dappName,
    ss58Prefix: 42,
    hostTimeout: 30_000,
    maxRetries: 1,
    persistence: null,
  });
  const connected = await manager.connect();
  if (!connected.ok) throw connected.error;

  const account = await manager.getProductAccount(dappName, DERIVATION_INDEX);
  if (!account.ok) throw account.error;
  const me = account.value;

  // Gas para llamar al contrato. El estudiante no necesita PAS.
  await requestResourceAllocation([
    { tag: 'SmartContractAllowance', value: { tag: 'Index', value: DERIVATION_INDEX } },
  ]);

  const contract = createContract(runtime, address, campusChainAbi as AbiEntry[], {
    defaultOrigin: me.address,
    defaultSigner: me.getSigner(),
  });

  return { dappName, address: me.address, h160: me.h160Address as `0x${string}`, contract };
}
