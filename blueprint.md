
# Animal Face Test Application Blueprint

## Overview

This application is an AI-powered "Animal Face Test" website that identifies whether a user's face (or an uploaded image) more closely resembles a dog or a cat. It uses a custom-trained Teachable Machine model to perform the classification. The project focuses on a fun, interactive user experience with modern web standards and high-quality aesthetics.

## Project Plan

### 1. **HTML Structure (`index.html`)**

*   **Header:** Simple and friendly header with the app name "Animal Face Test".
*   **Hero Section:** Brief explanation of the test and an inviting call to action.
*   **Upload Area:** A prominent drag-and-drop zone for users to upload their photos. Includes a fallback "Browse Files" button.
*   **Result Section (Hidden initially):**
    *   **Image Preview:** Displays the uploaded image.
    *   **Loading Spinner:** Shown while the AI model is processing the image.
    *   **Classification Results:** Clear display of "Dog" or "Cat" percentage using progress bars and expressive icons.
    *   **Recommendation/Fun Fact:** A small snippet of text based on the result.
*   **Footer:** Copyright and links.

### 2. **Styling (`style.css`)**

*   **Playful & Modern Design:** Use soft rounded corners, vibrant colors, and friendly typography.
*   **Responsive Layout:** Mobile-first design to ensure a great experience on smartphones (where people often take selfies).
*   **Visual Enhancements:**
    *   **Color Palette:** Warm yellows, friendly blues, and soft pinks.
    *   **Animations:** Smooth transitions for the upload area and results display.
    *   **Drop Shadows:** Soft, deep shadows to give elements a "lifted" feel.
    *   **Glow Effects:** Subtle glows on the result highlights.
*   **Loading State:** A beautiful, custom CSS animation for the loading state.

### 3. **JavaScript Logic (`main.js`)**

*   **Teachable Machine Integration:**
    *   Load the model from `https://teachablemachine.withgoogle.com/models/CVkszXzkx/`.
    *   Use `@teachablemachine/image` and `tensorflow/tfjs`.
*   **Image Handling:**
    *   Implement drag-and-drop and file input listeners.
    *   Generate a local URL for the uploaded image to display a preview immediately.
*   **Classification:**
    *   Pass the preview image to the TM model.
    *   Process the results (array of probabilities).
*   **UI Updates:**
    *   Transition from the upload state to the results state.
    *   Animate progress bars based on the probability scores.
*   **Social Sharing (Optional):** Add buttons to share the result.

### 4. **Features & Enhancements**

*   **Camera Integration:** Allow users to take a photo directly from their device.
*   **Accessibility:** Ensure the site is screen-reader friendly and has good color contrast.
*   **Performance:** Optimize model loading and image processing for speed.
