import { NhostClient } from '@nhost/nhost-js'

export const We = new NhostClient({
  subdomain: 'ofafvhtbuhvvkhuprotc',
  region: 'ap-southeast-1'
})

if (typeof window !== 'undefined') {
  window.We = We
}