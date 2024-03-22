import { buildScrollToAudioEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { text, virtual } from '@keystone-6/core/fields'

const hintId = 'muted-hint-id'

const listConfigurations = list({
  fields: {
    name: text({
      label: '捲到式聲音名稱',
      validation: { isRequired: true },
    }),
    audioSrc: text({
      label: '聲音檔案 URL',
      validation: {
        isRequired: true,
      },
    }),
    startEmbedCode: virtual({
      label: '起始 embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const audioSrc = item.audioSrc
          const bottomEntryPointOnly = false

          const code = buildScrollToAudioEmbedCode(
            {
              id: 'scroll-to-audio-' + item.id,
              theme: 'twreporter',
              audioUrls: [audioSrc],
              idForHintContainer: hintId,
            },
            bottomEntryPointOnly
          )

          return `<!-- 捲到式聲音：${item.name} 起始點 -->` + code
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
          const bottomEntryPointOnly = true
          const code = buildScrollToAudioEmbedCode(
            {
              id: 'scroll-to-audio-' + item.id,
            },
            bottomEntryPointOnly
          )
          return `<!-- 捲到式聲音：${item.name} 結束點 -->` + code
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
          const code = buildScrollToAudioEmbedCode({
            hintOnly: true,
          })

          return `<!-- 開頭聲音提示 -->` + code
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
