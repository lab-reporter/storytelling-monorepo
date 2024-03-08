import config from '../config'
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { text, file, virtual } from '@keystone-6/core/fields'

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

const listConfigurations = list({
  fields: {
    name: text({
      label: '捲到式聲音名稱',
      validation: { isRequired: true },
    }),
    audio: file({
      storage: 'files',
    }),
    startEmbedCode: virtual({
      label: '起始 embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const audioSrc = `${config.gcs.urlPrefix}/files/${item?.audio_filename}`

          const code = embedCodeGen.buildScrollToAudioEmbedCode(
            {
              id: 'scroll-to-audio-' + item.id,
              theme: 'twreporter',
              audioUrls: [audioSrc],
            },
            embedCodeWebpackAssets
          )

          return code
        },
      }),
      ui: {
        views: './lists/views/embed-code',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    endEmbedCode: virtual({
      label: '結束 embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const componentHtmlOnly = true
          const code = embedCodeGen.buildScrollToAudioEmbedCode(
            {
              id: 'scroll-to-audio-' + item.id,
              bottomEntryOnly: true,
            },
            embedCodeWebpackAssets,
            componentHtmlOnly
          )
          return code
        },
      }),
      ui: {
        views: './lists/views/embed-code',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    hintEmbedCode: virtual({
      label: '聲音提示 embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (): Promise<string> => {
          return embedCodeGen.buildScrollToAudioEmbedCode(
            {
              hintOnly: true,
            },
            embedCodeWebpackAssets
          )
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
      initialColumns: ['name'],
      pageSize: 50,
    },
    labelField: 'name',
  },

  access: () => true,
  hooks: {},
})

export default listConfigurations
