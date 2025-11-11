import { NhostClient } from '@nhost/nhost-js'

export const nhost = new NhostClient({
  subdomain: 'ofafvhtbuhvvkhuprotc',
  region: 'ap-southeast-1'
})

if (typeof window !== 'undefined') {
  window.nhost = nhost
}