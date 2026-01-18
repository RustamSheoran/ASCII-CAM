<div align="center">
  
   ██████╗██╗   ██╗██████╗ ████████╗██████╗ 
  ██╔════╝██║   ██║██╔══██╗╚══██╔══╝██╔══██╗
  ██║     ██║   ██║██████╔╝   ██║   ██████╔╝
  ██║     ╚██╗ ██╔╝██╔══██╗   ██║   ██╔══██╗
  ╚██████╗ ╚████╔╝ ██║  ██║   ██║   ██║  ██║
   ╚═════╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
    📸  REAL-TIME ASCII ART CAMERA
  
  <img src="public/assets/banner.png" alt="Project Logo" width="full">
  
  # ASCII-Cam
  
  <p align="center">
    <i>Transform your camera feed into real-time ASCII art</i>
  </p>

[![GitHub stars](https://img.shields.io/github/stars/RustamSheoran/ASCII-CAM?style=social)](https://github.com/RustamSheoran/ASCII-CAM/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/RustamSheoran/ASCII-CAM?style=social)](https://github.com/RustamSheoran/ASCII-CAM/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/RustamSheoran/ASCII-CAM?style=social)](https://github.com/RustamSheoran/ASCII-CAM/watchers)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

[![GitHub issues](https://img.shields.io/github/issues/RustamSheoran/ASCII-CAM)](https://github.com/RustamSheoran/ASCII-CAM/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/RustamSheoran/ASCII-CAM)](https://github.com/RustamSheoran/ASCII-CAM/pulls)
[![Last commit](https://img.shields.io/github/last-commit/RustamSheoran/ASCII-CAM)](https://github.com/RustamSheoran/ASCII-CAM/commits/main)

</div>

---

## About

I built ASCII-Cam as a fun project to explore real-time image processing and the creative possibilities of ASCII art. My goal was to create a browser-based application that transforms live camera feeds into retro terminal aesthetics while maintaining high performance.

The idea came from my love for hacker movies and their iconic Matrix-style displays. I wanted to build something practical that anyone could use right in their browser without any installation.

## ✨ Features

- **Real-Time Rendering** – Live ASCII conversion with performance optimization (60+ FPS)
- **High-Quality Capture** – Export 4K resolution ASCII art images
- **Customizable Settings**
  - 5 character sets (standard, simple, blocks, matrix, edges)
  - Adjustable font size/resolution (6-30px)
  - Contrast and brightness controls
  - Color mode and invert options
- **Camera Controls**
  - Front/back camera switching
  - High-quality snapshot export
  - ASCII text copy to clipboard
  - Video recording capability with WebM export
- **Performance Monitoring** – Real-time FPS and render time display

## 📸 Demo

<div align="center">
  <img src="public/demo/blocks-color.png" alt="ASCII Camera Demo 1" width="45%">
  <img src="public/demo/standrad.png" alt="ASCII Camera Demo 2" width="45%">
</div>

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/RustamSheoran/ASCII-CAM.git
cd ASCII-Cam

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 📖 Usage

1. **Grant Camera Access** – Allow browser to access your camera when prompted
2. **Adjust Settings** – Click the settings icon (⚙️) to customize the ASCII effect
3. **Capture Images** – Press the shutter button for high-quality exports
4. **Switch Cameras** – Use the flip button (🔄) to toggle between front/back cameras
5. **Copy ASCII** – Click the copy button to copy the ASCII text to your clipboard
6. **Record Video** – Click the record button (📹) to start/stop video capture

## 🛠️ Tech Stack

- **React 19** – UI framework
- **TypeScript** – Type safety
- **Vite** – Build tool
- **Canvas API** – Real-time rendering
- **MediaStream API** – Camera access
- **Tailwind CSS** – Styling
- **Lucide React** – Icons

## 🌐 Browser Support

Requires a modern browser with support for:

- `getUserMedia` API
- `Canvas 2D` rendering context
- ES6+ JavaScript features

✅ Chrome 90+ | ✅ Firefox 88+ | ✅ Safari 14+ | ✅ Edge 90+

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show Your Support

If you found this project helpful, please consider giving it a star! It helps others discover the project.

[![Star this repo](https://img.shields.io/github/stars/RustamSheoran/ASCII-CAM?style=social)](https://github.com/RustamSheoran/ASCII-CAM)

## 📬 Contact

Have questions or suggestions? Open an issue or reach out!

---

<div align="center">
  Made with ❤️ by Rustam Sheoran using React and Canvas API
  
  [Report Bug](https://github.com/RustamSheoran/ASCII-CAM/issues) · [Request Feature](https://github.com/RustamSheoran/ASCII-CAM/issues)
</div>
