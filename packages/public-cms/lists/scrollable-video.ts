import { buildScrollableVideoEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { text, json, relationship, virtual } from '@keystone-6/core/fields'
import {
  ScrollableVideoEditorProps,
  ThemeEnum,
} from '@story-telling-reporter/react-scrollable-video'
import { customAlphabet } from 'nanoid'
import CleanCss from 'clean-css'
import postcss from 'postcss'
import postcssNesting from 'postcss-nesting'
import { createdByFilter, createdByHooks } from './utils/access-control-list'

const nanoid = customAlphabet('abcdefghijklmnopq', 10)

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Scorllable Video 名稱',
      validation: { isRequired: true },
    }),
    videoSrc: text({
      label: '桌機版影片檔案 URL',
      validation: {
        isRequired: true,
      },
    }),
    mobileVideoSrc: text({
      label: '手機版影片檔案 URL',
    }),
    editorState: json({
      label: '編輯字幕',
      defaultValue: {
        captions: [],
        videoSrc: '',
        videoDuration: 0,
        theme: ThemeEnum.LIGHT_MODE,
        secondsPer100vh: 1.5,
      },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/scrollable-video-editor/index',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    customCss: text({
      label: '客製化 CSS',
      defaultValue: `
.scrollable-video {
  /* 覆寫所有區塊預設的 css */
  .section {
    /* 例如：background-color: pink; */

    /* 覆寫所有區塊內圖說預設的 css */
    .draft-image-desc {
    }

    /* 覆寫所有區塊內抽言預設的 css */
    .draft-blockquote {
    }

    /* 覆寫所有區塊內 H2 預設的 css */
    .draft-header-two h2 {
    }

    /* 覆寫所有區塊內 H3 預設的 css */
    .draft-header-three h3 {
    }

    /* 覆寫所有區塊內內文預設的 css */
    .draft-paragraph {
    }

    /* 覆寫所有區塊內超連結預設的 css */
    .draft-link {
    }

    /* 覆寫所有區塊內 annotation 預設的 css */
    .annotation-wrapper {
    }
    .annotation-title {
    }
    .annotation-body {
    }
  }

}
      `,
      ui: {
        displayMode: 'textarea',
      },
    }),
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const editorState = item?.editorState as ScrollableVideoEditorProps
          const captions = editorState.captions
          const code = buildScrollableVideoEmbedCode({
            video: {
              src: item?.videoSrc,
              mobileSrc: item?.mobileVideoSrc,
              duration: editorState.videoDuration,
            },
            captions: captions.map((caption) => {
              // do not pass customCss to reduce embed code size
              const {customCss, ...rest} = caption // eslint-disable-line
              return rest
            }),
            darkMode: editorState.theme === ThemeEnum.DARK_MODE,
            secondsPer100vh: editorState.secondsPer100vh,
          })

          const wrapperDivId = nanoid(5)
          const initialCustomCss = (item.customCss as string) ?? ''

          let css = captions.reduce((_css, caption) => {
            if (caption.customCss) {
              return _css + caption.customCss
            }
            return _css
          }, initialCustomCss)

          if (typeof css === 'string') {
            const nestedCss = `#${wrapperDivId} { ${css} }`
            try {
              // parse nested css into plain css
              const result = await postcss([postcssNesting()]).process(
                nestedCss,
                { from: undefined }
              )
              // minify css
              css = new CleanCss().minify(result.css).styles
            } catch (err) {
              console.log('Custom css cannot be parsed: ', err)
            }
          }

          return `<!-- 捲動式影片：${item.name} --><style>${css}</style><div id="${wrapperDivId}">${code}</div>`
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/embed-code',
        createView: {
          fieldMode: 'hidden',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
    }),
    preview: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve(item: Record<string, unknown>): Record<string, string> {
          return {
            href: `/demo/scrollable-videos/${item.id}`,
            label: '捲動式影片預覽',
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
    label: '捲動式影片',
  },
  access: {
    operation: () => true,
    filter: createdByFilter,
  },
  hooks: {
    resolveInput: (args) => {
      let { resolvedData } = args
      const { inputData, item } = args

      if (typeof createdByHooks.resolveInput === 'function') {
        resolvedData = createdByHooks.resolveInput(args)
      }

      const videoSrc = inputData?.videoSrc
      if (videoSrc) {
        const editorState = Object.assign(
          // default `editorState`
          {
            captions: [],
            videoDuration: 0,
            theme: ThemeEnum.LIGHT_MODE,
            secondsPer100vh: 1.5,
          },
          item?.editorState,
          {
            videoSrc,
          }
        )
        resolvedData.editorState = editorState
      }
      return resolvedData
    },
  },
})

export default listConfigurations
