<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import NeptuBtn from '../NeptuBtn.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import {
  isValidMediaUrl,
  encodeMediaUrl,
  downloadFile as downloadFileUtil,
  extractFilenameFromUrl,
  getMediaErrorMessage,
} from '../../utils/shared/media.ts'
import { debounce } from '../../utils/shared/timer.ts'

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

// Computed filename for download (used in the download attribute)
const downloadFilename = computed(() => {
  if (props.filename) {
    return props.filename
  }

  // Extract full filename with extension from URL
  return extractFilenameFromUrl(props.url, 'audio file')
})

const downloadFile = async () => {
  if (props.disabled) return

  try {
    // Validate URL
    if (!isValidMediaUrl(props.url)) {
      hasError.value = true
      errorMessage.value = theme.value.t.audioFile.invalidUrlProvided
      return
    }

    downloadFileUtil(encodeMediaUrl(props.url), downloadFilename.value)
  } catch {
    hasError.value = true
    errorMessage.value = theme.value.t.audioFile.errorDownloadingFile
    // On error, open the file in a new tab
    window.open(encodeMediaUrl(props.url), '_blank')
  }
}

// Audio player state
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isLoading = ref(false)
const hasError = ref(false)
const isPlayerVisible = ref(false)
const isAudioLoaded = ref(false)
const errorMessage = ref('')

// Audio player control methods
const togglePlayPause = async () => {
  if (props.disabled || hasError.value) return

  try {
    // Validate URL before playback
    if (!isValidMediaUrl(props.url)) {
      hasError.value = true
      errorMessage.value = theme.value.t.audioFile.invalidAudioUrlProvided
      console.error('Invalid audio URL provided')
      return
    }

    if (!audioRef.value) return

    // If player is not visible, show it and start playback
    if (!isPlayerVisible.value) {
      isPlayerVisible.value = true
      // Wait for next tick for player appearance animation
      await nextTick()
      if (audioRef.value) {
        await audioRef.value.play()
      }
      return
    }

    // If player is visible, toggle play/pause
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      await audioRef.value.play()
    }
  } catch {
    hasError.value = true
    errorMessage.value = theme.value.t.audioFile.errorPlayingAudioFile
  }
}

const stopAudio = () => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    isPlaying.value = false
  }
}

// Hide player
const hidePlayer = () => {
  isPlayerVisible.value = false
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    isPlaying.value = false
  }
}

const seekTo = (time: number) => {
  if (audioRef.value && !props.disabled) {
    audioRef.value.currentTime = time
  }
}

const setVolume = (newVolume: number | string) => {
  if (audioRef.value) {
    const volumeValue = typeof newVolume === 'string' ? parseFloat(newVolume) : newVolume
    audioRef.value.volume = volumeValue
    volume.value = volumeValue
  }
}

// Progress bar click handler
const handleProgressClick = (event: MouseEvent) => {
  if (props.disabled || !duration.value) return

  const progressBar = event.currentTarget as HTMLElement | null
  if (!progressBar) return
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value

  seekTo(newTime)
}

// Progress bar keyboard handler
const handleProgressKeydown = (event: KeyboardEvent) => {
  if (props.disabled || !duration.value) return

  const step = duration.value * 0.05 // 5% of total duration
  let newTime: number

  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault()
      newTime = Math.max(0, currentTime.value - step)
      break
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault()
      newTime = Math.min(duration.value, currentTime.value + step)
      break
    case 'Home':
      event.preventDefault()
      newTime = 0
      break
    case 'End':
      event.preventDefault()
      newTime = duration.value
      break
    default:
      return
  }

  seekTo(newTime)
}

// Audio event handlers
const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
    isLoading.value = false
    isAudioLoaded.value = true
    // Set volume after metadata load
    audioRef.value.volume = volume.value
  }
}

// Debounced version of handleTimeUpdate for performance optimization
const handleTimeUpdateDebounced = debounce(() => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}, 100)

const handleTimeUpdate = () => {
  handleTimeUpdateDebounced()
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const handleLoadStart = () => {
  isLoading.value = true
  hasError.value = false
  isAudioLoaded.value = false
  errorMessage.value = ''
}

const handleError = (event: Event) => {
  hasError.value = true
  isLoading.value = false
  isPlaying.value = false
  isAudioLoaded.value = false

  const error = (event.target as HTMLAudioElement)?.error
  errorMessage.value = getMediaErrorMessage(
    error,
    {
      aborted: theme.value.t.audioFile.audioPlaybackAborted,
      network: theme.value.t.audioFile.networkErrorLoadingAudio,
      decode: theme.value.t.audioFile.audioDecodingError,
      notSupported: theme.value.t.audioFile.audioFormatNotSupported,
      unknown: theme.value.t.audioFile.unknownAudioError,
    },
    theme.value.t.audioFile.errorLoadingAudioFile
  )
}

// Time formatting
const formatTime = (time: number | undefined) => {
  if (!time || !isFinite(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Progress bar percentage formatting
const progressPercent = computed(() => {
  if (!duration.value || !isFinite(duration.value)) {
    return 0
  }
  return (currentTime.value / duration.value) * 100
})

// Initialize on component mount
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
})
</script>

<template>
  <div
    class="audio-file rounded-xl mb-[0.325rem] transition-all duration-200"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.audioFile.audioFile}: ${downloadFilename}`"
  >
    <!-- Hidden audio element with lazy loading -->
    <audio
      ref="audioRef"
      :src="isPlayerVisible ? encodeMediaUrl(props.url) : undefined"
      :preload="isPlayerVisible ? 'metadata' : 'none'"
      aria-hidden="true"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @loadstart="handleLoadStart"
      @error="handleError"
    />

    <!-- Header row: icon + filename + buttons -->
    <div class="file-header flex items-center gap-3 px-4 py-3">
      <!-- Music icon badge -->
      <div class="file-icon flex items-center justify-center w-9 h-9 rounded-lg shrink-0">
        <Icon icon="mdi:music-note" class="text-xl" aria-hidden="true" />
      </div>

      <!-- File info -->
      <div class="flex-1 min-w-0">
        <div
          class="filename text-sm font-medium truncate"
          :aria-label="`${theme.t.audioFile.audioFile}: ${downloadFilename}`"
        >
          {{ downloadFilename }}
        </div>
        <div v-if="$slots.default" class="file-hint text-xs mt-0.5">
          <slot />
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 shrink-0">
        <NeptuBtn
          v-if="!isPlayerVisible"
          class="play-btn-header"
          :primary="true"
          :disabled="props.disabled || hasError"
          :title="theme.t.audioFile.playAudio"
          :aria-label="theme.t.audioFile.startAudioPlayback"
          :aria-pressed="isPlaying"
          :icon="isLoading ? 'mdi:loading' : 'mdi:play'"
          :icon-class="{ spinning: isLoading }"
          @click="togglePlayPause"
        />

        <NeptuBtn
          icon="mdi:download"
          :disabled="props.disabled"
          :text="theme.t.audioFile.downloadFile"
          :aria-label="`${theme.t.audioFile.downloadAudioFile} ${downloadFilename}`"
          @click="downloadFile"
        />
      </div>
    </div>

    <!-- Audio player (shown when play is clicked) -->
    <div
      v-if="isPlayerVisible"
      class="player-section"
      role="group"
      :aria-label="`${theme.t.audioFile.audioFile} controls for ${downloadFilename}`"
    >
      <!-- Divider -->
      <div class="player-divider mx-4" />

      <!-- Controls + progress row -->
      <div
        class="player-controls flex items-center gap-2 px-4 pt-3 pb-1"
        role="toolbar"
        :aria-label="theme.t.audioFile.audioFile + ' playback controls'"
      >
        <!-- Play/pause -->
        <NeptuBtn
          :primary="true"
          :disabled="props.disabled || hasError"
          :title="isPlaying ? theme.t.audioFile.pauseAudio : theme.t.audioFile.playAudio"
          :aria-label="isPlaying ? theme.t.audioFile.pauseAudioPlayback : theme.t.audioFile.resumeAudioPlayback"
          :aria-pressed="isPlaying"
          :icon="isLoading ? 'mdi:loading' : isPlaying ? 'mdi:pause' : 'mdi:play'"
          :icon-class="{ spinning: isLoading }"
          @click="togglePlayPause"
        />

        <!-- Stop -->
        <NeptuBtn
          :disabled="props.disabled || hasError || !isPlaying"
          :title="theme.t.audioFile.stopAudio"
          :aria-label="theme.t.audioFile.stopAudioPlayback"
          icon="mdi:stop"
          @click="stopAudio"
        />

        <!-- Progress bar -->
        <div
          class="progress-bar flex-1 flex items-center cursor-pointer py-2 outline-none rounded"
          role="slider"
          :aria-label="`${theme.t.audioFile.audioProgress}: ${Math.round(progressPercent)}%`"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(progressPercent)"
          :aria-valuetext="`${formatTime(currentTime)} of ${formatTime(duration)}`"
          tabindex="0"
          @click="handleProgressClick"
          @keydown="handleProgressKeydown"
        >
          <div class="progress-track w-full h-1.5 rounded-full overflow-hidden">
            <div
              class="progress-fill h-full rounded-full"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>

        <!-- Time display -->
        <div
          class="time-display text-xs font-mono px-2 py-1 rounded"
          role="timer"
          :aria-label="`${theme.t.audioFile.currentTime}: ${formatTime(currentTime)} of ${formatTime(duration)}`"
        >
          <span aria-hidden="true">{{ formatTime(currentTime) }}</span>
          <span class="time-sep" aria-hidden="true"> / </span>
          <span aria-hidden="true">{{ formatTime(duration) }}</span>
        </div>

        <!-- Hide player -->
        <NeptuBtn
          :title="theme.t.audioFile.hidePlayerTitle"
          :aria-label="theme.t.audioFile.hidePlayer"
          icon="mdi:chevron-up"
          @click="hidePlayer"
        />
      </div>

      <!-- Volume row -->
      <div class="volume-row flex items-center gap-2 px-4 pb-3">
        <Icon icon="mdi:volume-high" class="volume-icon text-base shrink-0" aria-hidden="true" />
        <input
          v-model="volume"
          class="volume-slider flex-1"
          type="range"
          min="0"
          max="1"
          step="0.1"
          :aria-label="`${theme.t.audioFile.volumeControl}: ${Math.round(volume * 100)}%`"
          role="slider"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(volume * 100)"
          :aria-valuetext="`${Math.round(volume * 100)}% ${theme.t.audioFile.volumePercent}`"
          @input="setVolume(($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Error message -->
    <div
      v-if="hasError"
      class="error-message flex items-center gap-2 mx-4 mb-3 px-3 py-2 rounded-lg text-sm"
      role="alert"
      aria-live="polite"
    >
      <Icon icon="mdi:alert-circle" class="shrink-0" aria-hidden="true" />
      <span class="flex-1">{{ errorMessage || theme.t.audioFile.errorLoadingAudioFile }}</span>
      <NeptuBtn
        v-if="!isValidMediaUrl(props.url)"
        :aria-label="theme.t.audioFile.retryWithValidUrl"
        icon="mdi:refresh"
        :text="theme.t.audioFile.retry"
        @click="() => { hasError = false; errorMessage = '' }"
      />
    </div>
  </div>
</template>

<style scoped>
.audio-file {
  border: 1px solid var(--gray-150);
  border-left: 3px solid var(--primary-btn-bg);
  background: var(--gray-50);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.dark .audio-file {
  background: var(--gray-850);
  border-color: var(--gray-800);
  border-left-color: var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

/* Music icon badge */
.file-icon {
  background: color-mix(in srgb, var(--primary-btn-bg) 12%, transparent);
  color: var(--primary-btn-bg);
}

.dark .file-icon {
  background: color-mix(in srgb, var(--primary-btn-bg) 18%, transparent);
}

/* Filename */
.filename {
  color: var(--vp-c-text-1);
}

.file-hint {
  color: var(--vp-c-text-2);
}

/* Player section divider */
.player-divider {
  height: 1px;
  background: var(--vp-c-divider);
}

/* Progress bar */
.progress-track {
  background: var(--gray-200);
}

.dark .progress-track {
  background: var(--gray-700);
}

.progress-fill {
  background: var(--primary-btn-bg);
  transition: width 0.1s linear;
}

.progress-bar:hover .progress-track {
  background: var(--gray-300);
}

.dark .progress-bar:hover .progress-track {
  background: var(--gray-600);
}

/* Time display */
.time-display {
  color: var(--gray-500);
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  white-space: nowrap;
}

.dark .time-display {
  color: var(--gray-400);
  background: var(--gray-800);
  border-color: var(--gray-700);
}

.time-sep {
  color: var(--gray-400);
}

/* Volume */
.volume-icon {
  color: var(--gray-400);
}

.dark .volume-icon {
  color: var(--gray-500);
}

.volume-slider {
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--gray-200);
  cursor: pointer;
  transition: background 0.2s;
}

.dark .volume-slider {
  background: var(--gray-700);
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary-btn-bg);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: 50%;
  background: var(--primary-btn-bg);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.volume-slider:focus {
  outline: none;
}

/* Error message */
.error-message {
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-3, var(--vp-c-danger-soft));
}

.error-message .iconify {
  color: var(--vp-c-danger-1);
}

.dark .error-message {
  background: var(--vp-c-danger-soft);
  border-color: var(--vp-c-danger-3, var(--vp-c-danger-soft));
  color: var(--vp-c-danger-1);
}

.dark .error-message .iconify {
  color: var(--vp-c-danger-1);
}

/* Animation */
.player-section {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile */
@media (max-width: 640px) {
  .file-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .file-header > div:last-child {
    width: 100%;
    justify-content: flex-end;
  }

  .player-controls {
    flex-wrap: wrap;
  }

  .progress-bar {
    order: 10;
    width: 100%;
  }
}
</style>
