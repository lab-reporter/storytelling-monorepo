import { Karaoke as KidsKaraoke } from './kids/index'
import { Karaoke as TwreporterKaraoke } from './twreporter/index'

export { Karaoke, KidsKaraoke, TwreporterKaraoke }

export default {
  Karaoke,
  KidsKaraoke,
  TwreporterKaraoke,
}

/**
 *  @typedef {import('./kids/index.js').KaraokeProps} KidsProps
 *  @typedef {import('./twreporter/index.js').KaraokeProps} TwreporterProps
 */

/**
 *  @param {Object} props
 *  @param {string} props.componentTheme - 'kids' or 'twreporter'
 *  @param {...(KidsProps|TwreporterProps)} ...restProps
 *  @returns {React.ReactNode}
 */
function Karaoke({ componentTheme, ...restProps }) {
  switch (componentTheme) {
    case 'kids':
      return <KidsKaraoke {...restProps} />
    case 'twreporter':
    default: {
      return <TwreporterKaraoke {...restProps} />
    }
  }
}
