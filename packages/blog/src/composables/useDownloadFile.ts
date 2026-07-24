import { computed } from 'vue'
import {
  downloadFile as downloadFileUtil,
  extractFilenameFromUrl,
  encodeMediaUrl,
  isValidMediaUrl,
} from '../utils/shared/media.ts'

export function useDownloadFile(
  url: () => string,
  filename: () => string | undefined,
  fallbackName: string,
  disabled: () => boolean
) {
  const downloadFilename = computed(() => {
    if (filename()) return filename()
    return extractFilenameFromUrl(url(), fallbackName)
  })

  const triggerDownload = () => {
    if (disabled()) return
    const rawUrl = url()
    if (!rawUrl) return
    downloadFileUtil(encodeMediaUrl(rawUrl), downloadFilename.value || fallbackName)
  }

  return {
    downloadFilename,
    triggerDownload,
    encodeMediaUrl,
    isValidMediaUrl,
  }
}
