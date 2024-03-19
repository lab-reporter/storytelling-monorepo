import hooks from './hooks'
import { Hint } from './twreporter/index'
import { Hint as KidsHint } from './kids/index'

const twreporter = {
  Hint,
}

const kids = {
  Hint: KidsHint,
}

export { hooks, twreporter, kids }
