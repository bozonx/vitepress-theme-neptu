<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import NeptuBtn from '../NeptuBtn.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import {
  encodeMediaUrl,
  downloadFile as downloadFileUtil,
  extractFilenameFromUrl,
  getMediaErrorMessage,
} from '../../utils/shared/media.ts'

const { theme } = useUiTheme()

const props = withDefaults(
  defineProps<{
    url: string
    filename?: string
    containerClass?: string
    disabled?: boolean
  }>(),
  {
    filename: '',
    containerClass: '',
    disabled: false,
  }
)

const videoRef = ref<HTMLVideoElement | null>(null)
const hasError = ref(false)
const errorMessage = ref('')

const downloadFilename = computed(() => {
  if (props.filename) return props.filename
  return extractFilenameFromUrl(props.url, 'video file')
})

const downloadFile = () => {
  if (props.disabled) return
  try {
    downloadFileUtil(encodeMediaUrl(props.url), downloadFilename.value)
  } catch {
    window.open(encodeMediaUrl(props.url), '_blank')
  }
}

const handleError = (event: Event) => {
  hasError.value = true
  const error = (event.target as HTMLVideoElement)?.error
  errorMessage.value = getMediaErrorMessage(
    error,
    {
      aborted: theme.value.t.videoFile.videoPlaybackAborted,
      network: theme.value.t.videoFile.networkErrorLoadingVideo,
      decode: theme.value.t.videoFile.videoDecodingError,
      notSupported: theme.value.t.videoFile.videoFormatNotSupported,
      unknown: theme.value.t.videoFile.unknownVideoError,
    },
    theme.value.t.videoFile.errorLoadingVideoFile
  )
}

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
})
</script>

<template>
  <div
    class="video-file flex flex-col rounded-xl mb-[0.325rem]"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.videoFile.videoFile}: ${downloadFilename}`"
  >
    <!-- Header: filename + download button -->
    <div class="file-header flex items-center gap-3 px-4 py-3">
      <div class="file-info flex gap-3 min-w-0 flex-1">
        <div class="video-file-icon flex items-center justify-center w-10 h-10 rounded-lg shrink-0">
          <Icon icon="mdi:file-video" class="text-xl" aria-hidden="true" />
        </div>
        <div class="video-file-info flex-1 min-w-0 flex flex-col justify-center">
          <div class="font-medium text-sm break-all">{{ downloadFilename }}</div>
          <div v-if="$slots.default" class="file-hint text-xs mt-0.5">
            <slot />
          </div>
        </div>
      </div>

      <NeptuBtn
        icon="mdi:download"
        :disabled="props.disabled"
        :text="theme.t.videoFile.downloadFile"
        class="download-btn shrink-0"
        :aria-label="`${theme.t.videoFile.downloadVideoFile} ${downloadFilename}`"
        @click="downloadFile"
      />
    </div>

    <!-- Video -->
    <div v-if="!hasError" class="video-wrapper px-4 pb-4">
      <video
        ref="videoRef"
        class="video-element w-full rounded-lg"
        :src="encodeMediaUrl(props.url)"
        controls
        preload="metadata"
        :aria-label="downloadFilename"
        @error="handleError"
      />
    </div>

    <!-- Error -->
    <div v-else class="error-message flex items-center gap-2 mx-4 mb-4 px-4 py-3 rounded-md text-sm" role="alert">
      <Icon icon="mdi:alert-circle" aria-hidden="true" />
      <span>{{ errorMessage || theme.t.videoFile.errorLoadingVideoFile }}</span>
      <NeptuBtn
        icon="mdi:refresh"
        :text="theme.t.videoFile.retry"
        :aria-label="theme.t.videoFile.retry"
        @click="() => { hasError = false; errorMessage = '' }"
      />
    </div>
  </div>
</template>

<style scoped>
.video-file {
  border: 1px solid var(--gray-150);
  background: var(--gray-50);
  border-left: 4px solid var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .video-file {
  background: var(--gray-850);
  border-color: var(--gray-800);
  border-left-color: var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.file-header {
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.video-file-icon {
  background: var(--gray-100);
  color: var(--gray-600);
}

.dark .video-file-icon {
  background: var(--gray-800);
  color: var(--gray-400);
}

.file-hint {
  color: var(--vp-c-text-2);
}

.video-element {
  max-height: 480px;
  background: #000;
  display: block;
  margin-top: 0.75rem;
}

.error-message {
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-3, var(--vp-c-danger-soft));
}

.error-message .iconify {
  color: var(--vp-c-danger-1);
  flex-shrink: 0;
}

.dark .error-message {
  background: var(--vp-c-danger-soft);
  border-color: var(--vp-c-danger-3, var(--vp-c-danger-soft));
  color: var(--vp-c-danger-1);
}

.dark .error-message .iconify {
  color: var(--vp-c-danger-1);
}

@media (max-width: 640px) {
  .file-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .download-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
