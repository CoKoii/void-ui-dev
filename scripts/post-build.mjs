#!/usr/bin/env node

import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const distDir = resolve(__dirname, '../dist')

/**
 * 构建后处理脚本
 */
async function postBuild() {
  console.log('🚀 开始执行构建后处理...')

  try {
    // 1. 重命名 CSS 文件
    await renameCssFiles()

    // 2. 清理不必要的文件
    await cleanupFiles()

    // 3. 生成包大小报告
    await generateBuildReport()

    console.log('✅ 构建后处理完成!')
  } catch (error) {
    console.error('❌ 构建后处理失败:', error)
    process.exit(1)
  }
}

/**
 * 重命名 CSS 文件，确保统一命名
 */
async function renameCssFiles() {
  try {
    const files = await fs.readdir(distDir)

    // 查找 CSS 文件并重命名为 style.css
    for (const file of files) {
      if (file.endsWith('.css') && file !== 'style.css') {
        const oldPath = join(distDir, file)
        const newPath = join(distDir, 'style.css')

        // 如果 style.css 已存在，先删除
        try {
          await fs.access(newPath)
          await fs.unlink(newPath)
        } catch {}

        await fs.rename(oldPath, newPath)
        console.log(`📝 重命名 CSS 文件: ${file} -> style.css`)
        break
      }
    }
  } catch (error) {
    console.warn('⚠️ CSS 文件重命名失败:', error.message)
  }
}

/**
 * 清理不必要的文件
 */
async function cleanupFiles() {
  const filesToRemove = [
    'favicon.ico', // 开发时的图标文件
    'index.html', // 开发时的 HTML 文件
  ]

  for (const file of filesToRemove) {
    try {
      await fs.unlink(join(distDir, file))
      console.log(`🗑️ 删除文件: ${file}`)
    } catch (error) {
      // 文件不存在时忽略错误
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️ 删除文件失败 ${file}:`, error.message)
      }
    }
  }
}

/**
 * 生成构建报告
 */
async function generateBuildReport() {
  try {
    const files = await fs.readdir(distDir)
    const report = {
      timestamp: new Date().toISOString(),
      files: [],
      totalSize: 0,
    }

    for (const file of files) {
      const filePath = join(distDir, file)
      const stats = await fs.stat(filePath)

      if (stats.isFile()) {
        const size = stats.size
        report.files.push({
          name: file,
          size: size,
          sizeFormatted: formatBytes(size),
        })
        report.totalSize += size
      }
    }

    report.totalSizeFormatted = formatBytes(report.totalSize)

    // 写入报告文件
    await fs.writeFile(join(distDir, 'build-report.json'), JSON.stringify(report, null, 2))

    // 在控制台输出摘要
    console.log('\n📊 构建报告:')
    console.log(`总大小: ${report.totalSizeFormatted}`)
    console.log('文件列表:')
    report.files
      .sort((a, b) => b.size - a.size)
      .forEach((file) => {
        console.log(`  ${file.name}: ${file.sizeFormatted}`)
      })
    console.log('')
  } catch (error) {
    console.warn('⚠️ 生成构建报告失败:', error.message)
  }
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 执行构建后处理
postBuild()
