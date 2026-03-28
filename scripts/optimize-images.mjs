#!/usr/bin/env node
/**
 * Image optimization script for Pension Volgenandt website.
 *
 * Resizes all WebP images in public/img/ to sensible max dimensions
 * and re-encodes at quality 80. Originals are preserved in public/img-originals/.
 *
 * Usage:  node scripts/optimize-images.mjs [--dry-run]
 */

import sharp from 'sharp'
import { readdir, stat, mkdir, copyFile } from 'node:fs/promises'
import { join, relative, dirname } from 'node:path'

const IMG_DIR = 'public/img'
const BACKUP_DIR = 'public/img-originals'
const DRY_RUN = process.argv.includes('--dry-run')

// Max dimensions per subfolder context
const MAX_WIDTHS = {
  hero: 1920,      // Full-viewport hero images
  garten: 1200,    // Gallery grid (displayed at max ~600px, 2x for retina)
  rooms: 1200,     // Room photos
  content: 1200,   // Content images
  attractions: 800, // Small card images
  homepage: 1200,  // Homepage images
  welcome: 800,    // Welcome section
}
const DEFAULT_MAX_WIDTH = 1200
const QUALITY = 80

// Minimum file size to bother optimizing (skip tiny files)
const MIN_SIZE_KB = 50

async function findWebpFiles(dir) {
  const results = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findWebpFiles(fullPath))
    } else if (entry.name.endsWith('.webp')) {
      results.push(fullPath)
    }
  }
  return results
}

function getMaxWidth(filePath) {
  const rel = relative(IMG_DIR, filePath)
  const folder = rel.split(/[/\\]/)[0]
  return MAX_WIDTHS[folder] || DEFAULT_MAX_WIDTH
}

async function optimizeImage(filePath) {
  const fileStat = await stat(filePath)
  const sizeKB = Math.round(fileStat.size / 1024)

  if (sizeKB < MIN_SIZE_KB) {
    return { file: filePath, skipped: true, reason: 'too small', sizeKB }
  }

  const { readFile: readFileForMeta } = await import('node:fs/promises')
  const rawBuffer = await readFileForMeta(filePath)
  const metadata = await sharp(rawBuffer).metadata()
  const maxWidth = getMaxWidth(filePath)

  if (metadata.width <= maxWidth) {
    // Still re-encode at target quality if file is large
    if (sizeKB < 150) {
      return { file: filePath, skipped: true, reason: 'already optimal', sizeKB }
    }
  }

  const needsResize = metadata.width > maxWidth

  if (DRY_RUN) {
    const ratio = needsResize ? (maxWidth / metadata.width) : 1
    const estNewWidth = needsResize ? maxWidth : metadata.width
    const estNewHeight = Math.round(metadata.height * ratio)
    return {
      file: filePath,
      dryRun: true,
      from: `${metadata.width}x${metadata.height}`,
      to: `${estNewWidth}x${estNewHeight}`,
      sizeKB,
    }
  }

  // Backup original
  const relPath = relative(IMG_DIR, filePath)
  const backupPath = join(BACKUP_DIR, relPath)
  await mkdir(dirname(backupPath), { recursive: true })
  await copyFile(filePath, backupPath)

  // Read file into buffer first to avoid Windows file locking issues
  const { readFile, writeFile } = await import('node:fs/promises')
  const inputBuffer = await readFile(filePath)

  // Optimize
  let pipeline = sharp(inputBuffer)
  if (needsResize) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  }

  const buffer = await pipeline
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer()

  await writeFile(filePath, buffer)

  const newSizeKB = Math.round(buffer.length / 1024)
  const saved = sizeKB - newSizeKB
  const pct = Math.round((saved / sizeKB) * 100)

  return {
    file: filePath,
    from: `${metadata.width}x${metadata.height}`,
    to: needsResize
      ? `${maxWidth}x${Math.round(metadata.height * (maxWidth / metadata.width))}`
      : `${metadata.width}x${metadata.height}`,
    oldKB: sizeKB,
    newKB: newSizeKB,
    savedKB: saved,
    savedPct: pct,
  }
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no files will be modified\n' : '🖼️  Optimizing images...\n')

  const files = await findWebpFiles(IMG_DIR)
  console.log(`Found ${files.length} WebP files\n`)

  let totalSaved = 0
  let optimizedCount = 0

  for (const file of files) {
    const result = await optimizeImage(file)
    const rel = relative(IMG_DIR, result.file)

    if (result.skipped) {
      // silent for skipped
      continue
    }

    if (result.dryRun) {
      console.log(`  ${rel}: ${result.from} → ${result.to} (${result.sizeKB} KB)`)
      continue
    }

    if (result.savedKB > 0) {
      console.log(`  ✅ ${rel}: ${result.from} → ${result.to} | ${result.oldKB} KB → ${result.newKB} KB (−${result.savedKB} KB, ${result.savedPct}%)`)
      totalSaved += result.savedKB
      optimizedCount++
    } else {
      console.log(`  ⏭️  ${rel}: already optimal`)
    }
  }

  console.log(`\n${DRY_RUN ? 'Would optimize' : 'Optimized'} ${optimizedCount} files`)
  if (!DRY_RUN && totalSaved > 0) {
    const mb = (totalSaved / 1024).toFixed(1)
    console.log(`Total saved: ${totalSaved} KB (${mb} MB)`)
    console.log(`\nOriginals backed up to ${BACKUP_DIR}/`)
  }
}

main().catch(console.error)
