export interface CodeProps {
  lang: string
  lineNumbers?: boolean
  extra?:
    | {
        copy?: boolean
        download?: boolean
        showLang?: boolean
      }
    | boolean
  dots?: boolean
  path?: string
}
