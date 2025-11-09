import { createClient } from '@nhost/nhost-js'

export const nhost = createClient({
  subdomain: 'ofafvhtbuhvvkhuprotc',
  region: 'ap-south-1'
})

if (typeof window !== 'undefined') {
  window.nhost = nhost
}