export type TemplateProps = {
  storeName: string
  slogan: string
  colors: string[]
  lang: 'ar' | 'he'
  logoUrl?: string
  products: { name: string; price: number; image_url?: string }[]
  preview?: boolean
}
