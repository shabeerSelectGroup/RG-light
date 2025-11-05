<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { PlayIcon, PauseIcon, BoltIcon, TrophyIcon, FireIcon, SparklesIcon } from '@heroicons/vue/24/solid';

const lightColor = ref('bg-gray-500');
const gameInterval = ref(null);
const isGameRunning = ref(false);
const lightChanges = ref(0);
const streak = ref(0);
const particles = ref([]);
const showCelebration = ref(false);

// Array of possible durations in milliseconds
const durationOptions = [5000, 4000, 3500, 2000, 1000]; // 5s, 4s, 3.5s, 2s, 1s
const getRandomTime = () => {
  const randomIndex = Math.floor(Math.random() * durationOptions.length);
  return durationOptions[randomIndex];
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
  lightColor.value = lightColor.value === 'bg-red-500' ? 'bg-green-500' : 'bg-red-500';
  
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
  }
};

// Clean up on component unmount
onUnmounted(() => {
  clearTimeout(gameInterval.value);
});
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center p-6 py-12 relative overflow-hidden">
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

    <div class="w-full max-w-4xl">
      <!-- Header -->
      <div class="text-center !mb-10 relative z-10">
        <div class="inline-block relative">
          <h1 class="text-6xl py-2 font-bold text-white !mb-4 drop-shadow-2xl">Red Light, Green Light</h1>
        </div>
        <p class="text-cyan-100 text-lg font-semibold tracking-wide flex items-center justify-center gap-2">
          <BoltIcon class="w-5 h-5 text-yellow-400 animate-pulse" />
          Watch the light change and track your progress
          <BoltIcon class="w-5 h-5 text-yellow-400 animate-pulse" />
        </p>
      </div>

     

      <!-- Main Game Card -->
      <div class="rounded-3xl overflow-hidden relative z-10 hover:border-fuchsia-500/50 transition-all duration-500">
        <!-- Card Glow Effect -->
        <div class="absolute inset-0 pointer-events-none"></div>
        <!-- Light Indicator -->
        <div class="flex flex-col items-center relative">
          <!-- Traffic Light Housing -->
          <div class=" rounded-3xl p-10 relative overflow-hidden  border-slate-700">
            <!-- Metallic Shine effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-400/10"></div>
            <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent"></div>
            <div class="w-56 h-56 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-inner relative border-4 border-slate-700">
              <div class="w-48 h-48 rounded-full transition-all duration-500 transform relative" 
                   :class="[
                     lightColor,
                     { 
                       'shadow-glow-green-neon scale-110': lightColor === 'bg-green-500' && isGameRunning,
                       'shadow-glow-red-neon scale-110': lightColor === 'bg-red-500' && isGameRunning,
                       'scale-100 bg-slate-700': lightColor === 'bg-gray-500'
                     }
                   ]">
                <!-- Inner glow ring -->
                <div v-if="isGameRunning" class="absolute inset-0 rounded-full" :class="{
                  'animate-ping-slow bg-green-400/30': lightColor === 'bg-green-500',
                  'animate-ping-slow bg-red-400/30': lightColor === 'bg-red-500'
                }"></div>
              </div>
            </div>
          </div>

          <!-- Status Text -->
          <div class="mt-10 text-center">
            <p class="text-4xl font-black !my-12 tracking-wider" 
               :class="{
                 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] neon-text-green': lightColor === 'bg-green-500',
                 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)] neon-text-red': lightColor === 'bg-red-500',
                 'text-slate-500': lightColor === 'bg-gray-500'
               }">
              {{ lightColor === 'bg-green-500' ? '🟢 GREEN LIGHT' : lightColor === 'bg-red-500' ? '🔴 RED LIGHT' : '⚪ READY' }}
            </p>
            <div v-if="isGameRunning" class="flex items-center gap-3 text-cyan-300 text-lg font-bold bg-slate-900/60 backdrop-blur-sm px-6 py-2 !my-3 rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <FireIcon class="w-6 h-6 text-orange-400 animate-pulse" />
              <span>{{ lightChanges }} CHANGES</span>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="!mt-8 flex gap-5">
            <button @click="toggleGame" 
                    class="px-8 py-3 text-base font-semibold rounded-xl transition-all hover:shadow-lg active:scale-95 transform hover:-translate-y-1 uppercase tracking-wider relative overflow-hidden group border-2 border-slate-600/30" 
                    :class="{
                      'bg-slate-800/60 hover:bg-slate-700/60 text-emerald-400 hover:text-emerald-300': !isGameRunning,
                      'bg-slate-800/60 hover:bg-slate-700/60 text-rose-400 hover:text-rose-300': isGameRunning
                    }">
              <span class="relative z-10 flex items-center gap-2">
                <PlayIcon v-if="!isGameRunning" class="w-6 h-6" />
                <PauseIcon v-else class="w-6 h-6" />
                {{ isGameRunning ? 'Stop' : 'Start' }}
              </span>
              <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
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