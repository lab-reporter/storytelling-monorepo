import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

const listConfigurations = list({
  fields: {
    name: text({
      label: '套件',
    }),
    desc: text({
      label: '套件說明',
      ui: { displayMode: 'textarea' }
    }),
    relatedTopics: text({
      label: '使用到此套件的專題',
      ui: { displayMode: 'textarea' }
    }),
    access: () => true,
  },
})

