import config from '../config'
// @ts-ignore: no definition
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
// @ts-ignore: no definition
import { list, graphql } from '@keystone-6/core'
import { checkbox, text, image, file, virtual } from '@keystone-6/core/fields'

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
    /*
    alignCenter: select({
      label: '哪裡要使用 embed code？',
      options: [
        {
          label: '報導者文章頁',
          value: 'twreporter',
        },
        {
          label: '少年報導者文章頁',
          value: 'kids-reporter',
        },
        {
          label: '其他網站',
          value: 'others',
        }
      ],
      defaultValue: 'twreporter',
    }),
    */
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const audioSrc =
            (item?.audioLink && `${item.audioLink}`) ||
            (item?.audio_filename &&
              `${config.googleCloudStorage.origin}/files/${item?.audio_filename}`)
          const imgSrc =
            (item?.imageLink && `${item.imageLink}`) ||
            (item?.imageFile_id &&
              `${config.googleCloudStorage.origin}/images/${item.imageFile_id}.${item.imageFile_extension}`)

          const code = embedCodeGen.buildEmbeddedCode(
            'react-karaoke',
            {
              audioUrls: [audioSrc],
              quoteArr:
                typeof item?.quote === 'string' && item.quote.split('\n'),
              imgSrc,
              muteHint: item?.muteHint,
            },
            embedCodeWebpackAssets
          )

          return `
            <style>
            .margin-left-to-center {
              margin-left: calc((50vw - 350px) * -1);
            }
            </style>
            <div class="margin-left-to-center">
              ${code}
            </div>
          `
        },
      }),
      ui: {
        views: './lists/views/embed-code',
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
