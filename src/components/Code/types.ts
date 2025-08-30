export interface CodeProps {
  lang: string
  /** 是否显示行号 */
  lineNumbers?: boolean
  /** 额外功能配置 */
  extra?:
    | {
        copy?: boolean
        download?: boolean
        showLang?: boolean
      }
    | boolean
  dots?: boolean
  /** 文件路径 */
  path?: string
}
