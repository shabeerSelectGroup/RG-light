<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { PlayIcon, PauseIcon, BoltIcon, TrophyIcon, FireIcon, SparklesIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const lightColor = ref('bg-gray-500');
const gameInterval = ref(null);
const isGameRunning = ref(false);
const lightChanges = ref(0);
const streak = ref(0);
const particles = ref([]);
const showCelebration = ref(false);
const audio = ref(null);
const isMuted = ref(false);
const isFullscreen = ref(false);
const lightContainer = ref(null);

// Toggle fullscreen mode
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await lightContainer.value.requestFullscreen();
      isFullscreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullscreen.value = false;
    }
  } catch (err) {
    console.error('Error toggling fullscreen:', err);
  }
};

// Handle fullscreen change
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Clean up event listeners
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);  
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
});

// Toggle mute state
const toggleMute = () => {
  if (audio.value) {
    audio.value.muted = !audio.value.muted;
    isMuted.value = audio.value.muted;
  }
};

// Initialize audio when component mounts
import bgmUrl from '@/assets/music/bgm.mp3';

onMounted(() => {
  audio.value = new Audio(bgmUrl);
  audio.value.loop = true;
});

// Duration options in seconds (will be converted to milliseconds)
const durationInput = ref('5,10,15');
const durationOptions = computed(() => {
  return durationInput.value
    .split(',')
    .map(num => parseInt(num.trim()) * 1000)
    .filter(num => !isNaN(num) && num > 0);
});

const getRandomTime = () => {
  if (durationOptions.value.length === 0) return 5000; // Default 5s if no valid options
  const randomIndex = Math.floor(Math.random() * durationOptions.value.length);
  return durationOptions.value[randomIndex];
};

const createParticles = () => {
  particles.value = [];
  for (let i = 0; i < 20; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 2
    });
  }
};

const changeLight = () => {
  // Toggle between red and green
  const wasRed = lightColor.value === 'bg-red-500';
  lightColor.value = wasRed ? 'bg-green-500' : 'bg-red-500';
  
  // Play or pause audio based on light color
  if (audio.value) {
    if (wasRed) {
      audio.value.currentTime = 0; // Restart from beginning
      audio.value.play().catch(e => console.log('Audio play failed:', e));
    } else {
      audio.value.pause();
    }
  }
  
  lightChanges.value++;
  streak.value++;

  // Check for milestone achievements
  if (streak.value % 10 === 0) {
    showCelebration.value = true;
    createParticles();
    setTimeout(() => {
      showCelebration.value = false;
    }, 2000);
  }

  // Set next light change with random interval
  if (isGameRunning.value) {
    clearTimeout(gameInterval.value);
    gameInterval.value = setTimeout(changeLight, getRandomTime());
  }
};

const toggleGame = () => {
  isGameRunning.value = !isGameRunning.value;

  if (isGameRunning.value) {
    // Start the game
    lightChanges.value = 0;
    streak.value = 0;
    changeLight();
  } else {
    // Stop the game
    clearTimeout(gameInterval.value);
    lightColor.value = 'bg-gray-500';
    // Stop audio when game is stopped
    if (audio.value) {
      audio.value.pause();
      audio.value.currentTime = 0;
    }
  }
};

// Clean up on component unmount
onUnmounted(() => {
  clearTimeout(gameInterval.value);
  // Clean up audio
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center relative overflow-hidden">
    <!-- Animated Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 -left-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
    </div>
    <!-- Grid Pattern Overlay -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <!-- Celebration Particles -->
    <transition name="celebration">
      <div v-if="showCelebration" class="fixed inset-0 pointer-events-none z-50">
        <div v-for="particle in particles" :key="particle.id" 
             class="particle absolute w-2 h-2 bg-green-500 rounded-full"
             :style="{
               left: particle.x + '%',
               top: particle.y + '%',
               animationDelay: particle.delay + 's',
               animationDuration: particle.duration + 's'
             }">
        </div>
      </div>
    </transition>

    <div class="w-full h-screen flex flex-col items-center justify-center px-4 py-0">
      <!-- Main Game Card -->
      <div class="w-full max-w-4xl mx-auto">
        <!-- Light Indicator -->
        <div class="flex flex-col items-center">
          <!-- Traffic Light Housing -->
          <div class="w-full  md:p-4 relative">
            <!-- Metallic Shine effect -->
           
            <div class="w-full max-w-4xl aspect-square mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-inner relative border-4 border-slate-700">
              <div class="w-[90%] h-[90%] rounded-full transition-all duration-500 transform relative"
                   :class="[
                     lightColor,
                     { 
                       'shadow-glow-green-neon scale-110': lightColor === 'bg-green-500' && isGameRunning,
                       'shadow-glow-red-neon scale-110': lightColor === 'bg-red-500' && isGameRunning,
                       'scale-100 bg-slate-700': lightColor === 'bg-gray-500',
                       '!scale-100': isFullscreen
                     }
                   ]"
                   :style="{
                     '--glow-size': isFullscreen ? '50px' : '20px',
                     'aspect-ratio': '1/1'  // Ensure perfect circle
                   }">
                <!-- Inner glow ring -->
                <div v-if="isGameRunning" class="absolute inset-0 rounded-full" :class="{
                  'animate-ping-slow bg-green-400/30': lightColor === 'bg-green-500',
                  'animate-ping-slow bg-red-400/30': lightColor === 'bg-red-500'
                }"></div>
              </div>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center justify-center gap-4 mt-6 w-full">
            <!-- Mute Button -->
            <button 
              @click="toggleMute" 
              class="p-3 rounded-xl transition-all hover:shadow-lg active:scale-95 transform hover:-translate-y-0.5 relative overflow-hidden group border-2 border-slate-600/30"
              :class="{
                'bg-slate-800/60 hover:bg-slate-700/60': true,
                'text-cyan-400': !isMuted,
                'text-rose-400': isMuted
              }"
              :title="isMuted ? 'Unmute' : 'Mute'"
            >
              <div class="relative z-10 flex items-center justify-center w-6 h-6">
                <SpeakerXMarkIcon v-if="isMuted" class="w-5 h-5" />
                <SpeakerWaveIcon v-else class="w-5 h-5" />
              </div>
              <div class="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
            
            <!-- Duration Options Input -->
            <div class="relative">
              <input 
                v-model="durationInput"
                type="text"
                :disabled="isGameRunning"
                class="w-32 px-4 py-3 bg-slate-800/60 border-2 border-slate-600/30 rounded-xl text-center font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent"
                :class="{ 'opacity-70': isGameRunning }"
                placeholder="e.g. 5,10,15"
              >
              <span class="absolute -bottom-6 left-0 right-0 text-xs text-slate-400 text-center">seconds</span>
            </div>

            <!-- Start/Stop Button -->
            <button 
              @click="toggleGame" 
              class="px-6 py-3 text-base font-semibold rounded-xl transition-all hover:shadow-lg active:scale-95 transform hover:-translate-y-0.5 uppercase tracking-wider relative overflow-hidden group border-2 border-slate-600/30"
              :class="{
                'bg-slate-800/60 hover:bg-slate-700/60 text-emerald-400 hover:text-emerald-300': !isGameRunning,
                'bg-rose-900/60 hover:bg-rose-800/60 text-rose-300 hover:text-rose-200': isGameRunning
              }"
              :disabled="durationOptions.length === 0"
            >
              <span class="relative z-10 flex items-center gap-2">
                <PlayIcon v-if="!isGameRunning" class="w-5 h-5" />
                <PauseIcon v-else class="w-5 h-5" />
                {{ isGameRunning ? 'STOP' : 'START' }}
              </span>
              <div class="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
            </button>
            
          </div>

          <!-- Achievement Notification -->
          <transition name="achievement">
            <div v-if="showCelebration" class="!mt-8 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl border-2 border-white/50 animate-pulse-glow uppercase tracking-wider flex items-center justify-center gap-3">
              <SparklesIcon class="w-8 h-8 animate-spin" />
              <TrophyIcon class="w-8 h-8" />
              <span>MILESTONE! {{ streak }} STREAK!</span>
              <TrophyIcon class="w-8 h-8" />
              <SparklesIcon class="w-8 h-8 animate-spin" />
            </div>
          </transition>
        </div>
      </div>

    
    </div>
  </main>
</template>

<style scoped>
/* Neon Light Glow Effects */
.shadow-glow-green-neon {
  box-shadow: 
    0 0 40px rgba(74, 222, 128, 1),
    0 0 80px rgba(74, 222, 128, 0.8),
    0 0 120px rgba(74, 222, 128, 0.6),
    0 0 160px rgba(74, 222, 128, 0.4),
    inset 0 0 30px rgba(74, 222, 128, 0.5);
  animation: pulseGreenNeon 1.5s ease-in-out infinite;
}

.shadow-glow-red-neon {
  box-shadow: 
    0 0 40px rgba(248, 113, 113, 1),
    0 0 80px rgba(248, 113, 113, 0.8),
    0 0 120px rgba(248, 113, 113, 0.6),
    0 0 160px rgba(248, 113, 113, 0.4),
    inset 0 0 30px rgba(248, 113, 113, 0.5);
  animation: pulseRedNeon 1.5s ease-in-out infinite;
}

@keyframes pulseGreenNeon {
  0%, 100% {
    box-shadow: 
      0 0 40px rgba(74, 222, 128, 1),
      0 0 80px rgba(74, 222, 128, 0.8),
      0 0 120px rgba(74, 222, 128, 0.6),
      inset 0 0 30px rgba(74, 222, 128, 0.5);
  }
  50% {
    box-shadow: 
      0 0 60px rgba(74, 222, 128, 1),
      0 0 120px rgba(74, 222, 128, 1),
      0 0 180px rgba(74, 222, 128, 0.8),
      inset 0 0 40px rgba(74, 222, 128, 0.7);
  }
}

@keyframes pulseRedNeon {
  0%, 100% {
    box-shadow: 
      0 0 40px rgba(248, 113, 113, 1),
      0 0 80px rgba(248, 113, 113, 0.8),
      0 0 120px rgba(248, 113, 113, 0.6),
      inset 0 0 30px rgba(248, 113, 113, 0.5);
  }
  50% {
    box-shadow: 
      0 0 60px rgba(248, 113, 113, 1),
      0 0 120px rgba(248, 113, 113, 1),
      0 0 180px rgba(248, 113, 113, 0.8),
      inset 0 0 40px rgba(248, 113, 113, 0.7);
  }
}

/* Neon Text Effects */
.neon-text-green {
  text-shadow: 
    0 0 10px rgba(74, 222, 128, 1),
    0 0 20px rgba(74, 222, 128, 0.8),
    0 0 30px rgba(74, 222, 128, 0.6);
}

.neon-text-red {
  text-shadow: 
    0 0 10px rgba(248, 113, 113, 1),
    0 0 20px rgba(248, 113, 113, 0.8),
    0 0 30px rgba(248, 113, 113, 0.6);
}

/* Grid Pattern Background */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Animated Background Blobs */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(40px, -60px) scale(1.15);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.85);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 8s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Gradient Animation */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Ping Animation (Slower) */
@keyframes ping-slow {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Pulse Glow Animation */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 40px rgba(217, 70, 239, 0.8);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Particle Animation */
.particle {
  animation: particleFloat 2.5s ease-out forwards;
  background: linear-gradient(135deg, #06b6d4, #d946ef, #8b5cf6);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-250px) scale(0) rotate(720deg);
    opacity: 0;
  }
}

/* Celebration Transition */
.celebration-enter-active,
.celebration-leave-active {
  transition: opacity 0.4s;
}

.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}

/* Achievement Transition */
.achievement-enter-active {
  animation: slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.achievement-leave-active {
  animation: slideOutFade 0.4s ease-in;
}

@keyframes slideInBounce {
  0% {
    transform: translateY(30px) scale(0.7) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) scale(1.05) rotate(2deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes slideOutFade {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-30px) scale(0.8);
    opacity: 0;
  }
}
</style>