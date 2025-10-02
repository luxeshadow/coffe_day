import { defineNuxtPlugin } from '#app'
import Toastify from "toastify-js"
import "toastify-js/src/toastify.css"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('toast', (options: {
    text: string
    duration?: number
    gravity?: "top" | "bottom"
    position?: "left" | "center" | "right"
    backgroundColor?: string
  }) => {
    Toastify({
      text: options.text,
      duration: options.duration || 3000,
      gravity: options.gravity || "top",
      position: options.position || "center",
      backgroundColor: options.backgroundColor || "linear-gradient(to right, #00b09b, #96c93d)",
      close: true
    }).showToast()
  })
})
