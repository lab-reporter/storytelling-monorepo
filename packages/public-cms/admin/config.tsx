/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core'
import { AdminConfig } from '@keystone-6/core/types'
import { CustomNavigation } from './components/custom-navigation'

function CustomLogo() {
  return <h3>報導者新聞敘事元件庫</h3>
}

export const components: AdminConfig['components'] = {
  Logo: CustomLogo,
  Navigation: CustomNavigation,
}
