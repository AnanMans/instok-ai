'use client'

import StorePage from '@/components/StorePage'
import type { StoreData, ProductData } from '@/components/StorePage'

export default function StoreClient({ store, products }: { store: StoreData; products: ProductData[] }) {
  return <StorePage store={store} products={products} />
}
