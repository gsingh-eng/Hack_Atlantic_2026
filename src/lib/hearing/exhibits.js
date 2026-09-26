const MAX_FILES = 3

export function addExhibitFiles(current, fileList) {
  const next = [...current]
  for (const file of Array.from(fileList || [])) {
    if (next.length >= MAX_FILES) break
    if (next.some((item) => item.name === file.name && item.size === file.size)) {
      continue
    }
    next.push({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      file,
    })
  }
  return next
}
