# Animal Face Test Application Blueprint (Professional AdSense Edition - v3)

## Overview

This application is an AI-powered "Animal Face Test" website designed for high-quality user experience and Google AdSense optimization. It uses a modern, professional aesthetic, detailed textual content, and sophisticated UI components to distinguish itself from "amateur" alternatives.

## Project Plan

### 1. **Professional Re-Branding (Typography & UI)**

*   **Typography:** Replace the current playful fonts with **Pretendard**, the industry-standard variable font for Korean web interfaces. This provides a clean, modern, and trustworthy feel.
*   **Header Layout:** Move the Navigation Menu and Dark/Light Mode toggle to the **top right** for a more standard and professional layout.
*   **Modern Toggle:** Replace the current button toggle with a sophisticated, animated sliding switch or a highly refined icon button that matches a professional UI.
*   **Aesthetics:**
    *   **Color Palette:** Refined `oklch` palette with subtle, professional hues.
    *   **Shadows:** Multi-layered, soft "lifted" shadows for cards and buttons.
    *   **Glassmorphism:** Use subtle blur effects on the sticky header and floating elements.
    *   **Textures:** Maintain the subtle noise texture for a premium feel.

### 2. **Content Strategy (AdSense Optimization)**

*   **Detailed Results:** Expand the result descriptions with "Style Advice" and "Compatible Personalities" based on the animal type.
*   **AI Model Transparency:** Add a section explaining the AI technology (e.g., MobileNet/CNN-based image classification) to provide educational value.
*   **"How it Works" Section:** A clear, step-by-step visual guide for users.
*   **Ad Placement Strategy:**
    *   **Top Banner:** Above the hero section.
    *   **In-Feed Ad:** Between the test section and the animal guide.
    *   **Result Ad:** Just below the main result card.
    *   **Anchor Ad:** Fixed at the bottom for mobile.

### 3. **Modern Technical Stack (Baseline)**

*   **CSS Layers:** Maintain `@layer` for cascade management.
*   **Container Queries:** For responsive cards in the grid.
*   **Web Components:** Use custom elements for reusable UI parts (e.g., `<animal-card>`, `<adsense-placeholder>`).
*   **Performance:** Optimize image loading and lazy-load non-critical sections.

### 4. **Implementation Steps**

1.  **Phase 1: Professional Typography & Header** - Update `style.css` to use Pretendard and reposition header elements.
2.  **Phase 2: UI Component Refinement** - Replace the theme toggle with a modern sliding switch and update all buttons and cards.
3.  **Phase 4: Content Enrichment** - Expand `index.html` with professional text, AI technology explanations, and AdSense slots.
4.  **Phase 5: Final Polish** - Ensure mobile responsiveness and smooth animations.
5.  **Phase 6: Deployment** - Git commit, push, and `firebase deploy`.

## Current Status (v3)
- [ ] Implement Pretendard font.
- [ ] Move nav/toggle to top-right.
- [ ] Create modern theme toggle switch.
- [ ] Add "How it Works" and "AI Model" sections.
- [ ] Add AdSense placeholders.
- [ ] Verify responsiveness and aesthetics.
