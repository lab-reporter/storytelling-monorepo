import config from '../config'
// @ts-ignore: no definition
import embedCodeGen from '@readr-media/react-embed-code-generator'
// @ts-ignore: no definition
import { list, graphql } from '@keystone-6/core'
import {
  checkbox,
  relationship,
  text,
  image,
  file,
  virtual,
} from '@keystone-6/core/fields'

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

type Session = {
  data: {
    id: string
    role: string
  }
}

function imageFileACL({ session }: { session: Session }) {
  const fieldMode = session?.data?.role == 'contributor' ? 'hidden' : 'edit'
  return fieldMode
}

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Karaoke 名稱',
      validation: { isRequired: true },
    }),
    quote: text({
      label: '引言',
      validation: { isRequired: true },
      ui: {
        displayMode: 'textarea',
      },
    }),
    audio: file({
      storage: 'files',
      //external users can't upload files to our GCS. They can only use the image from their sources.
      ui: {
        createView: { fieldMode: imageFileACL },
        itemView: { fieldMode: imageFileACL },
      },
    }),
    //external users can't upload files to our GCS. They can only use the image from their sources.
    imageFile: image({
      storage: 'images',
      ui: {
        createView: { fieldMode: imageFileACL },
        itemView: { fieldMode: imageFileACL },
      },
    }),
    audioLink: text(),
    imageLink: text(),
    muteHint: checkbox({
      label: '是否顯示聲音播放提醒',
      defaultValue: false,
    }),
    previewButton: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve(item: Record<string, unknown>): Record<string, string> {
          return {
            href: `/demo/karaokes/${item?.id}`,
            label: 'Preview',
          }
        },
      }),
      ui: {
        views: './lists/views/link-button',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
  },
  ui: {
    listView: {
      initialSort: { field: 'id', direction: 'DESC' },
      initialColumns: ['name', 'quote'],
      pageSize: 50,
    },
    labelField: 'name',
  },

  access: () => true, 
  hooks: {},
})

export default listConfigurations
