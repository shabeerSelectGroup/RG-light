<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-indigo-600 px-6 py-5">
        <h1 class="text-2xl font-bold text-white">QR Code Generator</h1>
        <p class="text-indigo-100 text-sm mt-1">Generate and download QR codes instantly</p>
      </div>
      
      <!-- Main Content -->
      <div class="p-6">
        <!-- Input Section -->
        <div class="space-y-4">
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700 mb-1.5">Enter URL or Text</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="url"
                v-model="inputText"
                @keyup.enter="generateQRCode"
                placeholder="https://example.com"
                class="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 text-gray-700 block w-full rounded-l-md sm:text-sm border-gray-300 p-3 border"
              />
              <button
                @click="generateQRCode"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                :disabled="!inputText.trim()"
                :class="{'opacity-75 cursor-not-allowed': !inputText.trim()}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate
              </button>
            </div>
          </div>

          <!-- QR Code Display -->
          <div v-if="qrCodeUrl" class="mt-8 space-y-4">
            <div class="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Your QR Code</h2>
              <div class="flex justify-center p-2 bg-white rounded-md shadow-inner">
                <img :src="qrCodeUrl" alt="Generated QR Code" class="w-48 h-48 object-contain" />
              </div>
              <div class="mt-6">
                <a
                  :href="qrCodeUrl"
                  download="qrcode.png"
                  class="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </a>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="mt-8 text-center">
            <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-1">Ready to generate</h3>
              <p class="text-sm text-gray-500">Enter a URL or any text above to create your QR code</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-4 border-t border-gray-200 text-center">
          <router-link 
            to="/" 
            class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';

const inputText = ref('');
const qrCodeUrl = ref('');

const generateQRCode = async () => {
  if (!inputText.value.trim()) return;
  
  try {
    const url = await QRCode.toDataURL(inputText.value, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    qrCodeUrl.value = url;
  } catch (error) {
    console.error('Error generating QR code:', error);
    alert('Failed to generate QR code. Please try again.');
  }
};
</script>
