import { buildScrollToAudioEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { text, virtual, relationship, timestamp } from '@keystone-6/core/fields'
import { createdByFilter, createdByHooks } from './utils/access-control-list'

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
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/audio-url-field',
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
    preview: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve(item: Record<string, unknown>): Record<string, string> {
          return {
            href: `/demo/scroll-to-audios/${item.id}`,
            label: '捲到式聲音預覽',
            buttonLabel: 'Preview',
          }
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/link-button',
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldPosition: 'sidebar',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
      graphql: {
        omit: {
          create: true,
          update: true,
        },
      },
    }),
    created_at: timestamp({
      label: 'Created At',
      defaultValue: { kind: 'now' },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    updated_at: timestamp({
      label: 'Updated At',
      db: {
        updatedAt: true,
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    created_by: relationship({
      ref: 'User',
      many: false,
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
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
    label: '捲到式聲音',
  },

  access: {
    operation: () => true,
    filter: createdByFilter,
  },
  hooks: {
    resolveInput: (args) => {
      if (typeof createdByHooks.resolveInput === 'function') {
        return createdByHooks.resolveInput(args)
      }
      return args.resolvedData
    },
  },
})

export default listConfigurations
