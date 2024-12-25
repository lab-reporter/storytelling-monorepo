import { ScrollableImageEditorProps } from '@story-telling-reporter/react-scrollable-image'
import { buildScrollableImageEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { graphql, list } from '@keystone-6/core'
import { text, json, virtual } from '@keystone-6/core/fields'

const className = 'storytelling-react-scrollable-image-container'

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Scorllable Image 名稱',
      validation: { isRequired: true },
    }),
    editorState: json({
      label: '編輯圖片和字幕',
      defaultValue: {
        captions: [],
        imgObjs: [],
      },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/scrollable-image-editor/index',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    customCss: text({
      label: '客製化 CSS',
      defaultValue: `
  /* 將捲動式影片往上移動，使其與上一個區塊連接在一起。*/
  /* 使用情境範例：想要兩個捲動式影片連在一起，讓第二個捲動式影片與第一個影片沒有間隔。 */
  /* 刪除下方註解即可使用。 */
  /*
  .${className} {
    margin-top: -40px;
  }
  */

  /* 將捲動式影片向左移動，撐滿文章頁 */
  @media (max-width: 767px) {
    .${className} {
      margin-left: -3.4vw;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .${className} {
      margin-left: calc((100vw - 512px)/2 * -1);
    }
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    .${className} {
      margin-left: calc((100vw - 550px)/2 * -1);
    }
  }

  @media (min-width: 1440px) {
    .${className} {
      margin-left: calc((100vw - 730px)/2 * -1);
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
          const editorState = item?.editorState as ScrollableImageEditorProps
          const code = buildScrollableImageEmbedCode({
            className,
            imgObjs: editorState.imgObjs,
            captions: editorState.captions,
            darkMode: editorState.theme === 'dark_mode',
            minHeight: editorState.minHeight,
            maxHeight: editorState.maxHeight,
          })
          const css = (item.customCss as string) ?? ''

          return `<!-- 捲動式影片：${item.name} --><style>${css}</style>${code}`
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
