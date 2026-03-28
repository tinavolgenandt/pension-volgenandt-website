#!/usr/bin/env node
/**
 * Image Optimization Script for Pension Volgenandt Website
 *
 * Converts JPGs to WebP, re-optimizes oversized WebPs,
 * and resizes images to appropriate max dimensions.
 *
 * Usage: node scripts/optimize-images.mjs [--dry-run] [--delete-originals]
 */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const sharp = require('sharp')

import { readdir, stat, unlink, readFile } from 'fs/promises'
import { join, extname, basename, relative } from 'path'
import { cpus } from 'os'

const IMG_DIR = 'public/img'
const DRY_RUN = process.argv.includes('--dry-run')
const DELETE_ORIGINALS = process.argv.includes('--delete-originals')

// Quality settings per image type
const PRESETS = {
  hero: { maxWidth: 1920, webpQuality: 82 },
  content: { maxWidth: 1200, webpQuality: 80 },
  gallery: { maxWidth: 1600, webpQuality: 80 },
  thumbnail: { maxWidth: 600, webpQuality: 75 },
}

// Map directories to presets
function getPreset(filePath) {
  if (filePath.includes('/hero/')) return PRESETS.hero
  if (filePath.includes('/homepage/')) return PRESETS.hero
  if (filePath.includes('/content/')) return PRESETS.content
  if (filePath.includes('/map/')) return PRESETS.thumbnail
  if (filePath.includes('/picknick/')) return PRESETS.content
  if (filePath.includes('/welcome/')) return PRESETS.content
  // rooms, attractions, garten - gallery images
  return PRESETS.gallery
}

// Max target sizes (KB) for warnings
const SIZE_TARGETS = {
  hero: 300,
  content: 150,
  gallery: 200,
  thumbnail: 50,
}

async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      // Skip source-uploads
      if (entry.name === 'source-uploads') continue
      files.push(...(await getAllFiles(fullPath)))
    } else {
      files.push(fullPath)
    }
  }
  return files
}

async function getFileSize(filePath) {
  const s = await stat(filePath)
  return s.size
}

async function optimizeImage(filePath, isConversion = false) {
  const ext = extname(filePath).toLowerCase()
  const preset = getPreset(filePath)
  const relPath = relative('.', filePath)

  if (ext === '.jpg' || ext === '.jpeg') {
    // Convert JPG to WebP
    const webpPath = filePath.replace(/\.(jpg|jpeg|JPG|JPEG)$/, '.webp')
    const originalSize = await getFileSize(filePath)

    if (DRY_RUN) {
      console.log(`[DRY] Convert: ${relPath} (${(originalSize / 1024).toFixed(0)}KB) -> .webp`)
      return { action: 'convert', from: relPath, originalSize, newSize: 0 }
    }

    try {
      const img = sharp(filePath)
      const metadata = await img.metadata()

      let pipeline = sharp(filePath).rotate() // auto-rotate from EXIF

      // Resize if wider than max
      if (metadata.width > preset.maxWidth) {
        pipeline = pipeline.resize({
          width: preset.maxWidth,
          withoutEnlargement: true,
          kernel: 'lanczos3',
        })
      }

      await pipeline
        .webp({
          quality: preset.webpQuality,
          effort: 4,
          smartSubsample: true,
        })
        .toFile(webpPath)

      const newSize = await getFileSize(webpPath)
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1)

      console.log(
        `✓ ${relPath} (${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB, -${savings}%)`,
      )

      return { action: 'convert', from: relPath, to: webpPath, originalSize, newSize }
    } catch (err) {
      console.error(`✗ Failed: ${relPath}: ${err.message}`)
      return { action: 'error', from: relPath, error: err.message }
    }
  }

  if (ext === '.webp') {
    // Re-optimize oversized WebP
    const originalSize = await getFileSize(filePath)
    const sizeKB = originalSize / 1024

    // Only re-optimize if > 500KB
    if (sizeKB <= 500) return null

    if (DRY_RUN) {
      console.log(`[DRY] Re-optimize: ${relPath} (${sizeKB.toFixed(0)}KB)`)
      return { action: 'reoptimize', from: relPath, originalSize, newSize: 0 }
    }

    try {
      const img = sharp(filePath)
      const metadata = await img.metadata()
      const buf = await readFile(filePath)

      let pipeline = sharp(buf).rotate()

      if (metadata.width > preset.maxWidth) {
        pipeline = pipeline.resize({
          width: preset.maxWidth,
          withoutEnlargement: true,
          kernel: 'lanczos3',
        })
      }

      // Write to temp, then replace
      const tempPath = filePath + '.tmp'
      await pipeline
        .webp({
          quality: preset.webpQuality,
          effort: 5, // higher effort for re-optimization
          smartSubsample: true,
        })
        .toFile(tempPath)

      const newSize = await getFileSize(tempPath)

      // Only replace if smaller
      if (newSize < originalSize) {
        const { rename } = await import('fs/promises')
        await rename(tempPath, filePath)
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1)
        console.log(
          `✓ Re-optimized: ${relPath} (${sizeKB.toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB, -${savings}%)`,
        )
        return { action: 'reoptimize', from: relPath, originalSize, newSize }
      } else {
        await unlink(tempPath)
        console.log(`- Skipped: ${relPath} (already optimal at ${sizeKB.toFixed(0)}KB)`)
        return null
      }
    } catch (err) {
      console.error(`✗ Failed re-optimize: ${relPath}: ${err.message}`)
      // Clean up temp file if it exists
      try {
        await unlink(filePath + '.tmp')
      } catch {}
      return { action: 'error', from: relPath, error: err.message }
    }
  }

  return null
}

async function main() {
  console.log(`\n=== Pension Volgenandt Image Optimizer ===`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Delete originals: ${DELETE_ORIGINALS}\n`)

  const allFiles = await getAllFiles(IMG_DIR)
  const jpgs = allFiles.filter((f) => /\.(jpg|jpeg|JPG|JPEG)$/i.test(f))
  const webps = allFiles.filter((f) => f.endsWith('.webp'))

  console.log(`Found: ${jpgs.length} JPG/JPEG files, ${webps.length} WebP files\n`)

  // Check which JPGs already have WebP versions
  const jpgsWithWebp = []
  const jpgsWithoutWebp = []

  for (const jpg of jpgs) {
    const webpPath = jpg.replace(/\.(jpg|jpeg|JPG|JPEG)$/i, '.webp')
    if (allFiles.includes(webpPath)) {
      jpgsWithWebp.push(jpg)
    } else {
      jpgsWithoutWebp.push(jpg)
    }
  }

  console.log(`JPGs with existing WebP: ${jpgsWithWebp.length} (will delete JPGs)`)
  console.log(`JPGs needing conversion: ${jpgsWithoutWebp.length}`)
  console.log(`WebPs > 500KB to re-optimize: ${webps.filter(async (f) => true).length} (checking...)\n`)

  const results = []
  const concurrency = Math.max(1, cpus().length - 1)
  console.log(`Processing with concurrency: ${concurrency}\n`)

  // Step 1: Convert JPGs without WebP
  console.log(`--- Step 1: Converting ${jpgsWithoutWebp.length} JPGs to WebP ---`)
  for (let i = 0; i < jpgsWithoutWebp.length; i += concurrency) {
    const batch = jpgsWithoutWebp.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map((f) => optimizeImage(f, true)))
    results.push(...batchResults.filter(Boolean))
  }

  // Step 2: Re-optimize oversized WebPs
  console.log(`\n--- Step 2: Re-optimizing oversized WebP files ---`)
  for (let i = 0; i < webps.length; i += concurrency) {
    const batch = webps.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map((f) => optimizeImage(f)))
    results.push(...batchResults.filter(Boolean))
  }

  // Step 3: Delete original JPGs
  if (DELETE_ORIGINALS && !DRY_RUN) {
    console.log(`\n--- Step 3: Deleting ${jpgs.length} original JPG files ---`)
    let deletedSize = 0
    for (const jpg of jpgs) {
      try {
        const size = await getFileSize(jpg)
        await unlink(jpg)
        deletedSize += size
        console.log(`✓ Deleted: ${relative('.', jpg)}`)
      } catch (err) {
        console.error(`✗ Failed to delete: ${relative('.', jpg)}: ${err.message}`)
      }
    }
    console.log(`\nDeleted ${jpgs.length} files, freed ${(deletedSize / 1024 / 1024).toFixed(1)}MB`)
  } else if (DELETE_ORIGINALS && DRY_RUN) {
    let totalJpgSize = 0
    for (const jpg of jpgs) {
      totalJpgSize += await getFileSize(jpg)
    }
    console.log(
      `\n[DRY] Would delete ${jpgs.length} JPG files (${(totalJpgSize / 1024 / 1024).toFixed(1)}MB)`,
    )
  }

  // Summary
  const conversions = results.filter((r) => r.action === 'convert')
  const reoptimizations = results.filter((r) => r.action === 'reoptimize')
  const errors = results.filter((r) => r.action === 'error')

  const totalOriginal = results.reduce((sum, r) => sum + (r.originalSize || 0), 0)
  const totalNew = results.reduce((sum, r) => sum + (r.newSize || 0), 0)

  console.log(`\n=== Summary ===`)
  console.log(`Conversions: ${conversions.length}`)
  console.log(`Re-optimizations: ${reoptimizations.length}`)
  console.log(`Errors: ${errors.length}`)
  if (totalOriginal > 0) {
    console.log(
      `Total savings: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(1)}MB (${(((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(1)}%)`,
    )
  }
}

main().catch(console.error)
