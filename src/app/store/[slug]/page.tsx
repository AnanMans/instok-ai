import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import StoreClient from './StoreClient'

export default async function StorePage(props: PageProps<'/store/[slug]'>) {
  const { slug } = await props.params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!store) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)

  return <StoreClient store={store} products={products ?? []} />
}
