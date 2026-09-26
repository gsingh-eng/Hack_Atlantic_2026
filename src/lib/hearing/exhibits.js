const MAX_FILES = 3
const MAX_BYTES = 4 * 1024 * 1024

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

export function exhibitNames(files) {
  if (!files?.length) return []
  return files.map((item) => item.name)
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function prepareExhibitsForJudge(files) {
  const prepared = []
  for (const item of (files || []).slice(0, MAX_FILES)) {
    const file = item.file
    if (!file) continue
    if (file.size > MAX_BYTES) {
      prepared.push({
        name: file.name,
        kind: 'named',
        note: 'filed but too large to open (over 4 MB)',
      })
      continue
    }

    if (file.type.startsWith('text/') || /\.(txt|md|csv)$/i.test(file.name)) {
      const text = (await file.text()).slice(0, 8000)
      prepared.push({ name: file.name, kind: 'text', text })
      continue
    }

    if (file.type.startsWith('image/')) {
      const dataUrl = await readAsDataUrl(file)
      const base64 = dataUrl.split(',')[1]
      if (base64) {
        prepared.push({
          name: file.name,
          kind: 'inline',
          mime: file.type,
          base64,
        })
      }
      continue
    }

    if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
      const dataUrl = await readAsDataUrl(file)
      const base64 = dataUrl.split(',')[1]
      if (base64) {
        prepared.push({
          name: file.name,
          kind: 'inline',
          mime: 'application/pdf',
          base64,
        })
      }
      continue
    }

    prepared.push({
      name: file.name,
      kind: 'named',
      note: 'filed on the record (filename only)',
    })
  }
  return prepared
}

export function describeExhibits(prepared, label) {
  if (!prepared?.length) return `${label}: (none filed)`
  return `${label}:\n${prepared
    .map((item) => {
      if (item.kind === 'text') {
        return `- ${item.name} (text excerpt):\n${item.text}`
      }
      if (item.kind === 'inline') {
        return `- ${item.name} (attached file — read it)`
      }
      return `- ${item.name}${item.note ? ` — ${item.note}` : ''}`
    })
    .join('\n')}`
}

export function exhibitInlineParts(prepared) {
  return (prepared || [])
    .filter((item) => item.kind === 'inline' && item.base64)
    .map((item) => ({
      inline_data: {
        mime_type: item.mime,
        data: item.base64,
      },
    }))
}
