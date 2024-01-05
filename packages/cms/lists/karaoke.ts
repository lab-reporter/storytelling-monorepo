import config from '../config'
// @ts-ignore: no definition
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
// @ts-ignore: no definition
import { list, graphql } from '@keystone-6/core'
import { checkbox, text, file, virtual, select } from '@keystone-6/core/fields'

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Karaoke 名稱',
      validation: { isRequired: true },
    }),
    webVtt: text({
      label: '字幕（WebVTT 格式）',
      ui: {
        displayMode: 'textarea',
      },
      defaultValue: `WEBVTT
00:00:00.000 --> 00:00:04.500
演員，我覺得他就是一個生活的體驗者,

00:00:04.600 --> 00:00:07.500
然後生命的實踐家;

00:00:08.000 --> 00:00:11.000
期許自己啦，可以這麼做。
`,
    }),
    quote: text({
      label: '引言',
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: 'hidden',
        },
        createView: {
          fieldMode: 'hidden',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
    }),
    audio: file({
      storage: 'files',
    }),
    muteHint: checkbox({
      label: '是否產生「聲音播放提示」的 embed code',
      defaultValue: false,
    }),
    theme: select({
      label: '哪裡要使用 embed code？',
      options: [
        {
          label: '報導者文章頁',
          value: 'twreporter',
        },
        {
          label: '少年報導者文章頁',
          value: 'kids',
        },
      ],
      defaultValue: 'twreporter',
    }),
    embedCode: virtual({
      label: 'Karaoke embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const audioSrc = `${config.googleCloudStorage.origin}/files/${item?.audio_filename}`

          const code = embedCodeGen.buildEmbeddedCode(
            'react-karaoke',
            {
              componentTheme: item?.theme,
              audioUrls: [audioSrc],
              webVtt: item?.webVtt,
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
    hintEmbedCode: virtual({
      label: '聲音提示 embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const muteHint = item?.muteHint
          if (muteHint) {
            return embedCodeGen.buildEmbeddedCode(
              'react-karaoke',
              {
                hintOnly: true,
              },
              embedCodeWebpackAssets
            )
          }

          return ''
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
