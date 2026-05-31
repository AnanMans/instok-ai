'use client'

import StoreTemplate, { type StoreData, type ProductData } from '@/components/StoreTemplate'

export default function StoreClient({ store, products }: { store: StoreData; products: ProductData[] }) {
  return <StoreTemplate store={store} products={products} />
}
