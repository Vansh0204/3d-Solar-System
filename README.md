# Solar System 3D Simulation

This is a mobile-responsive 3D solar system simulation built using Three.js, plain JavaScript, and CSS.

## Features:

*   Central Sun and 8 orbiting planets with adjustable speeds.
*   Realistic lighting and camera controls (OrbitControls).
*   Animation pause/resume functionality.
*   Toggle between dark and light themes.
*   Background stars.
*   Hover labels/tooltips for planets.
*   Camera movement and zoom on click for individual planets.
*   Speed control panel for each planet (dropdown).

## How to Run:

Follow these steps to set up and run the project:

1.  **Download or Clone the Repository:**
    If you haven't already, download the project files or clone the repository to your local machine.

2.  **Navigate to the Project Directory:**
    Open your file explorer or terminal and navigate to the root directory of the project.

3.  **Open `index.html` in a Web Browser:**
    Simply double-click the `index.html` file, or drag and drop it into your preferred web browser (e.g., Chrome, Firefox, Edge). Most modern browsers will render it correctly directly from the file system.

    *   **Note on Local Server (Optional but Recommended):** For the best experience and to avoid potential CORS issues with textures or other assets, it's recommended to serve the files using a simple local web server. If you have Python installed, you can run:

        ```bash
        python3 -m http.server
        ```

        Then, open your browser and go to `http://localhost:8000` (or the port indicated by the server).

4.  **Ensure Image Assets:**
    Make sure you have an `images` folder in the root of your project containing all the necessary texture `.jpg` files for the planets and sun. The favicon is currently set to `ss.jpg` in the root directory or `images/ss.jpg`. If you want a round favicon, ensure `ss.jpg` (or `ss_round.png` if you change the HTML) is indeed a transparent round image.

## Troubleshooting:

*   **Images not loading (404 errors):** Ensure all image paths in `script.js` and `index.html` are correct and that the image files exist in the specified `images` folder.
*   **No 3D scene visible:** Check your browser's developer console (F12 or Cmd+Option+I) for any JavaScript errors. Ensure `script.js` is correctly linked and that Three.js is loading without issues. 