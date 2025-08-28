#!/usr/bin/env node

import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import readline from 'readline'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const rootDir = resolve(__dirname, '..')
const srcDir = join(rootDir, 'src')
const componentsDir = join(srcDir, 'components')

/**
 * 🚀 一键懒人发布脚本
 * 自动扫描组件 -> 选择版本更新 -> 自动导出 -> 构建 -> 发布
 */
class LazyPublisher {
  constructor() {
    this.args = this.parseArgs(process.argv.slice(2))
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  async run() {
    console.log('🚀 懒人一键发布助手')
    console.log('====================\n')

    try {
      // 1. 扫描组件
      const components = await this.scanComponents()
      console.log(
        `📦 发现 ${components.length} 个组件: ${components.map((c) => c.name).join(', ')}\n`,
      )

      // 2. 生成/修复每个组件的入口 index.ts（barrel）
      await this.ensureComponentBarrels(components)

      // 3. 选择版本更新
      const versionType = await this.selectVersionType()
      const newVersion = await this.updateVersion(versionType)

      // 4. 自动更新导出文件
      await this.updateExports(components)
      await this.updatePackageVersion(newVersion)

      // 5. 构建
      await this.build()

      // 6. 询问是否发布（或命令行参数指定）
      const shouldPublish = this.args.publish
        ? 'y'
        : await this.ask(`\n🎯 版本 ${newVersion} 构建完成，发布到 npm? (y/n): `)

      if (shouldPublish.toLowerCase() === 'y') {
        await this.publish()
        console.log('\n🎉 发布成功!')
      } else {
        console.log('\n✅ 构建完成，可手动执行 npm publish 发布')
      }
    } catch (error) {
      console.error('\n❌ 失败:', error.message)
      process.exit(1)
    } finally {
      this.rl.close()
    }
  }

  // 解析 CLI 参数
  parseArgs(argv) {
    const args = { type: null, yes: false, publish: false }
    for (const a of argv) {
      if (a === '--yes' || a === '-y') args.yes = true
      else if (a === '--publish') args.publish = true
      else if (a.startsWith('--type=')) {
        const t = a.split('=')[1]
        if (['major', 'minor', 'patch'].includes(t)) args.type = t
      }
    }
    return args
  }

  // 扫描组件目录
  async scanComponents() {
    const components = []
    const items = await fs.readdir(componentsDir, { withFileTypes: true })

    for (const item of items) {
      if (item.isDirectory()) {
        const indexVue = join(componentsDir, item.name, 'index.vue')
        if (await this.exists(indexVue)) {
          components.push({ name: item.name, componentName: `V${item.name}` })
        }
      }
    }
    return components
  }

  // 选择版本更新类型
  async selectVersionType() {
    if (this.args.type) return this.args.type

    if (this.args.yes) return 'patch'

    console.log('📝 选择版本更新:')
    console.log('  1. 主版本 (1.0.0 -> 2.0.0)')
    console.log('  2. 次版本 (1.0.0 -> 1.1.0)')
    console.log('  3. 修订版 (1.0.0 -> 1.0.1)')

    const choice = await this.ask('选择 (1/2/3): ')
    const types = { 1: 'major', 2: 'minor', 3: 'patch' }
    if (!types[choice]) throw new Error('无效选择')
    return types[choice]
  }

  // 更新版本号
  async updateVersion(type) {
    const pkg = JSON.parse(await fs.readFile(join(rootDir, 'package.json'), 'utf-8'))
    const [major, minor, patch] = pkg.version.split('.').map(Number)

    const newVersion =
      type === 'major'
        ? `${major + 1}.0.0`
        : type === 'minor'
          ? `${major}.${minor + 1}.0`
          : `${major}.${minor}.${patch + 1}`

    console.log(`📈 ${pkg.version} -> ${newVersion}`)
    return newVersion
  }

  // 更新导出文件
  async updateExports(components) {
    console.log('🔄 更新导出文件...')

    // 更新 components.ts
    let componentsTs = '// 自动生成，请勿手动修改\n'
    components.forEach((c) => {
      componentsTs += `export { default as ${c.componentName} } from './components/${c.name}'\n`
    })

    // 扫描并导出类型
    componentsTs += '\n// 导出类型\n'
    for (const comp of components) {
      const typesPath = join(componentsDir, comp.name, 'types.ts')
      if (await this.exists(typesPath)) {
        const typesContent = await fs.readFile(typesPath, 'utf-8')
        const types = typesContent.match(/export\s+(?:interface|type)\s+(\w+)/g) || []
        types.forEach((match) => {
          const typeName = match.match(/(\w+)$/)[1]
          componentsTs += `export type { ${typeName} } from './components/${comp.name}/types'\n`
        })
      }
    }

    await fs.writeFile(join(srcDir, 'components.ts'), componentsTs)

    // 更新 index.ts
    const indexTs = `import type { App } from 'vue'
import { version } from './version'

// 组件导入
${components.map((c) => `import ${c.componentName} from './components/${c.name}/index.vue'`).join('\n')}

// 样式导入
import './styles/main.scss'

// 组件列表
const components = [${components.map((c) => c.componentName).join(', ')}] as const

// 安装函数
const install = (app: App): void => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 默认导出
const VoidDesignVue = { install, version }

// 组件导出
export { ${components.map((c) => c.componentName).join(', ')} }

// 类型导出
export * from './components'

// 插件导出
export { install, version }
export default VoidDesignVue`

    await fs.writeFile(join(srcDir, 'index.ts'), indexTs)
  }

  // 为每个组件生成/修复入口 index.ts（barrel）
  async ensureComponentBarrels(components) {
    console.log('🧱 生成/修复组件入口 (index.ts)...')
    for (const comp of components) {
      const compDir = join(componentsDir, comp.name)
      const indexTsPath = join(compDir, 'index.ts')
      const typesPath = join(compDir, 'types.ts')
      const hasTypes = await this.exists(typesPath)

      const expected =
        `export { default } from './index.vue'\n` +
        (hasTypes ? `export type * from './types'\n` : '')

      let needWrite = true
      if (await this.exists(indexTsPath)) {
        const current = await fs.readFile(indexTsPath, 'utf-8')
        if (current.trim() === expected.trim()) needWrite = false
      }

      if (needWrite) {
        await fs.writeFile(indexTsPath, expected)
        console.log(`  ✓ ${comp.name}/index.ts`)
      }
    }
  }

  // 更新包版本
  async updatePackageVersion(newVersion) {
    const packagePath = join(rootDir, 'package.json')
    const pkg = JSON.parse(await fs.readFile(packagePath, 'utf-8'))
    pkg.version = newVersion
    await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2))

    // 更新 index.ts 中的版本占位符
    const indexPath = join(srcDir, 'index.ts')
    let content = await fs.readFile(indexPath, 'utf-8')
    content = content.replace('__VERSION__', newVersion)
    await fs.writeFile(indexPath, content)
  }

  // 构建项目
  async build() {
    console.log('🔨 开始构建...')
    await this.runCommand('npm', ['run', 'build'])
    console.log('✅ 构建完成')
  }

  // 发布
  async publish() {
    console.log('📤 发布中...')
    return this.runCommand('npm', ['publish'])
  }

  // 运行命令
  runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd: rootDir, stdio: 'inherit' })
      child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`命令失败: ${code}`))))
      child.on('error', reject)
    })
  }

  // 检查文件存在
  async exists(path) {
    try {
      await fs.access(path)
      return true
    } catch {
      return false
    }
  }

  // 询问问题
  ask(question) {
    return new Promise((resolve) => this.rl.question(question, (answer) => resolve(answer.trim())))
  }
}

new LazyPublisher().run()
