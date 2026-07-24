<script lang="ts">
const FILE_TYPE_ICON_MAP: Record<string, string> = {
  pdf: 'mdi:file-pdf-box',
  doc: 'mdi:file-word-box',
  docx: 'mdi:file-word-box',
  xls: 'mdi:file-excel-box',
  xlsx: 'mdi:file-excel-box',
  ppt: 'mdi:file-powerpoint-box',
  pptx: 'mdi:file-powerpoint-box',
  txt: 'mdi:file-document-outline',
  zip: 'mdi:zip-box',
  rar: 'mdi:zip-box',
  '7z': 'mdi:zip-box',
  jpg: 'mdi:file-image',
  jpeg: 'mdi:file-image',
  png: 'mdi:file-image',
  webp: 'mdi:file-image',
  avif: 'mdi:file-image',
  gif: 'mdi:file-image',
  svg: 'mdi:file-image',
  mp4: 'mdi:file-video',
  avi: 'mdi:file-video',
  mov: 'mdi:file-video',
  mp3: 'mdi:file-music',
  wav: 'mdi:file-music',
  json: 'mdi:code-json',
  js: 'mdi:language-javascript',
  ts: 'mdi:language-typescript',
  html: 'mdi:language-html5',
  css: 'mdi:language-css3',
  xml: 'mdi:file-xml-box',
}

const getFileTypeIcon = (extension: string | undefined) => {
  if (!extension) {
    return 'mdi:file'
  }
  return FILE_TYPE_ICON_MAP[extension] || 'mdi:file'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import NeptuBtn from '../NeptuBtn.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import {
  encodeMediaUrl,
  downloadFile as downloadFileUtil,
  extractFilenameFromUrl,
} from '../../utils/shared/media.ts'

const { theme } = useUiTheme()

// Component props
const props = defineProps<{
  url: string
  filename?: string
  containerClass?: string
  disabled?: boolean
}>()

// Computed filename for download (used in the download attribute)
const downloadFilename = computed(() => {
  if (props.filename) {
    return props.filename
  }

  // Extract full filename with extension from URL
  return extractFilenameFromUrl(props.url, 'file')
})

const extensionName = computed(() => {
  const filename = downloadFilename.value
  const extension = filename.split('.').pop()

  // If extension exists and differs from the filename itself (i.e., contains a dot)
  if (extension && extension !== filename) {
    return extension.toLowerCase()
  }

  return undefined
})

const downloadFile = async () => {
  if (props.disabled) return

  try {
    downloadFileUtil(encodeMediaUrl(props.url), downloadFilename.value)
  } catch {
    // On error, open the file in a new tab
    window.open(encodeMediaUrl(props.url), '_blank')
  }
}

// Icon to display
const fileIcon = computed(() => {
  return getFileTypeIcon(extensionName.value)
})
</script>

<template>
  <div
    class="file-download flex items-center justify-between rounded-xl gap-4 transition-transform duration-200 mt-[0.325rem] mb-[0.325rem] p-4 pl-8 border border-[var(--gray-150)] bg-[var(--gray-50)] border-l-4 border-l-[var(--primary-btn-bg)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[var(--gray-850)] dark:border-[var(--gray-800)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] max-sm:flex-col max-sm:items-stretch max-sm:gap-3 max-sm:p-3 max-sm:pl-6 will-change-[transform]"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.fileDownload.fileDownload}: ${downloadFilename}`"
  >
    <div class="file-info flex items-center gap-3 flex-1 min-w-0 max-sm:order-1 max-sm:w-full" :class="{ 'items-start': $slots.default }">
      <div
        class="file-icon flex items-center justify-center w-10 h-10 rounded-md shrink-0 bg-[var(--gray-100)] text-[var(--gray-600)] dark:bg-[var(--gray-800)] dark:text-[var(--gray-400)]"
        :aria-label="`${theme.t.fileDownload.fileType}: ${extensionName || 'unknown'}`"
        role="img"
      >
        <Icon :icon="fileIcon" aria-hidden="true" />
      </div>
      <div class="file-details flex-1 min-w-0">
        <div
          class="file-name muted font-medium break-all mb-1"
          :aria-label="`${theme.t.fileDownload.fileDownload}: ${downloadFilename}`"
        >
          {{ downloadFilename }}
        </div>
        <div v-if="$slots.default" class="file-hint text-sm italic mt-1 text-[var(--gray-600)] dark:text-[var(--gray-400)]">
          <slot />
        </div>
      </div>
    </div>

    <NeptuBtn
      icon="mdi:download"
      :disabled="props.disabled"
      :text="theme.t.fileDownload.downloadFile"
      class="download-btn shrink-0 transition-transform duration-200 hover:-translate-y-px hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] max-sm:w-full max-sm:justify-center max-sm:order-2 will-change-[transform]"
      :aria-label="`${theme.t.fileDownload.downloadFileWithName} ${downloadFilename}`"
      @click="downloadFile"
    />
  </div>
</template>
