# Remi - STEM-Focused AI Assistant

Remi is an intelligent AI assistant designed specifically for STEM (Science, Technology, Engineering, Mathematics) education and pleasant conversation. Built with a clean, dark UI and powered by Cloudflare Workers and LLaMA models, Remi offers both quick responses and deep analysis through its innovative Tiered Inference system.

## ✨ Features

### 🎯 Core Capabilities
- **STEM-Focused**: Specialized knowledge base for science, technology, engineering, and mathematics
- **Pleasant Conversation**: Charming, witty personality for engaging interactions
- **Voice Integration**: Speech-to-text input and text-to-speech output
- **Real-time Chat**: Instant responses with typing indicators

### 🧠 Tiered Inference System
- **Standard Mode**: Fast responses using LLaMA 3.1 8B model (temperature 0.6)
- **Deep Dig Mode 🦴**: Thoughtful analysis using LLaMA 3.1 70B model (temperature 0.3)
- **Smart Toggle**: Easy switching between speed and depth

### 🎨 Design System
- **Dark Theme**: Easy on the eyes with professional aesthetics
- **Color Palette**: Black, Charcoal (#2A2A2A), Tan (#FFF2CC), Red (#CC0000)
- **Responsive**: Works seamlessly on desktop and mobile
- **Accessibility**: High contrast and clear typography

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Cloudflare Account
- Wrangler CLI

### Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/MeckMan2025/Remi.git
   cd Remi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   ```javascript
   // In public/index.html, update line 320:
   const API_URL = "http://localhost:8787"; // For local development
   ```

4. **Start development server**
   ```bash
   npx wrangler dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:8787` or serve the `public/` directory

### Cloudflare Deployment

1. **Configure wrangler.toml**
   ```toml
   name = "remi-api"
   main = "src/worker.js"
   compatibility_date = "2024-11-30"
   
   [ai]
   binding = "AI"
   ```

2. **Update API URL**
   ```javascript
   // In public/index.html:
   const API_URL = "https://your-worker-name.your-subdomain.workers.dev";
   ```

3. **Deploy worker**
   ```bash
   npx wrangler deploy
   ```

4. **Deploy frontend**
   Deploy the `public/` directory to your preferred hosting service (Cloudflare Pages, Netlify, Vercel, etc.)

## 📁 Project Structure

```
Remi/
├── src/
│   └── worker.js          # Cloudflare Worker backend
├── public/
│   ├── index.html         # Frontend application
│   └── Remi.jpeg         # Avatar image
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Dependencies
├── LICENSE              # MIT License
└── README.md           # This file
```

## 🛠️ Architecture

### Frontend (`public/index.html`)
- **Pure HTML/CSS/JS**: No framework dependencies
- **Speech Recognition**: WebKit/Chrome Speech API integration
- **Text-to-Speech**: Browser speechSynthesis API
- **Responsive Design**: Mobile-first approach
- **Tiered Interface**: Toggle for inference mode selection

### Backend (`src/worker.js`)
- **Cloudflare Worker**: Edge computing for low latency
- **LLaMA Integration**: AI model inference via Cloudflare AI
- **Model Selection**: Dynamic switching based on user preference
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error management

### Inference Models
- **Standard**: `@cf/meta/llama-3.1-8b-instruct` (Fast, creative responses)
- **Deep Dig**: `@cf/meta/llama-3.1-70b-instruct` (Thorough, precise analysis)

## 🎮 Usage Guide

### Basic Chat
1. Type your message in the input field
2. Press Enter or click Send
3. Remi will respond with STEM-focused insights

### Voice Features
- **🎤 Microphone**: Click to start voice input
- **🔊 Speaker**: Toggle text-to-speech on/off
- **Push-to-Talk**: Hold microphone button while speaking

### Deep Dig Mode
- **Toggle ON**: For complex problems requiring detailed analysis
- **Toggle OFF**: For quick questions and casual conversation
- **Visual Indicator**: Red circle shows "Curiosity Spark" is active

## 🔧 Configuration

### API Endpoint
Update the API_URL constant in `public/index.html`:
```javascript
const API_URL = "https://your-worker-domain.workers.dev";
```

### System Prompt
Modify the system prompt in `src/worker.js` to customize Remi's personality and capabilities.

### Styling
The design system uses CSS custom properties for easy theming:
- Background: `#000000` (Black)
- Containers: `#2A2A2A` (Charcoal)  
- Accents: `#FFF2CC` (Tan)
- Active states: `#CC0000` (Red)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Maintain the existing design system
- Follow the file separation architecture
- Test both inference modes
- Ensure mobile responsiveness
- Include appropriate comments

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/MeckMan2025/Remi/issues) page
2. Create a new issue with detailed information
3. Include browser console logs if applicable

## 🙏 Acknowledgments

- **Cloudflare**: AI platform and Workers infrastructure
- **Meta**: LLaMA language models
- **Community**: Inspiration and feedback

---

**Remi** - Making STEM learning engaging, one conversation at a time. 🧪🔬📊