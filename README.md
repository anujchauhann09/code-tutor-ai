# 🎓 Code Tutor AI

> An intelligent programming assistant powered by AI that provides expert coding guidance, explanations, and solutions.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

## ✨ Features

- **🤖 AI-Powered Assistance**: Get expert programming help using AI
- **💬 Interactive Chat**: Ask questions and receive detailed, formatted responses
- **📚 Chat History**: Keep track of your conversations and revisit previous solutions
- **🎨 Modern UI**: Beautiful, responsive interface with dark/light theme support
- **📱 Mobile Friendly**: Fully responsive design that works on all devices
- **🔍 Code Formatting**: Syntax-highlighted code blocks with copy functionality
- **⚡ Fast Performance**: Built with Next.js for optimal speed and SEO

## 🚀 Demo

[![Code Tutor AI Logo](public/logo.png)](https://codetutorai.vercel.app/)

**Ask any programming question and get expert guidance with formatted code examples**  
🔗 **Live Site:** [codetutorai.vercel.app](https://codetutorai.vercel.app/)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.6, React 19.1.0
- **Styling**: TailwindCSS 4.0
- **AI Integration**: Google Gemini API
- **Icons**: Font Awesome
- **State Management**: React Hooks + Local Storage
- **Deployment**: Vercel/Netlify Ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (Get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anujchauhann09/code-tutor-ai.git
   cd code-tutor-ai
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables**
   
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
   NEXT_PUBLIC_SYSTEM_INSTRUCTION=You are a helpful programming tutor...
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key | - | ✅ |
| `NEXT_PUBLIC_GEMINI_MODEL` | Gemini model to use | `gemini-1.5-flash` | ❌ |
| `NEXT_PUBLIC_SYSTEM_INSTRUCTION` | System prompt for AI | Default tutor prompt | ❌ |

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home page
│   │   └── history/           # Chat history page
│   ├── components/            # React components
│   │   ├── AppShell.jsx       # Main app layout
│   │   ├── Header.jsx         # Header component
│   │   ├── Sidebar.jsx        # Desktop sidebar
│   │   ├── MobileSidebar.jsx  # Mobile sidebar
│   │   └── HomeDashboard.jsx  # Main dashboard
│   └── lib/
│       └── gemini.js          # Gemini AI integration
├── public/                    # Static assets
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🎯 Usage

### Basic Usage

1. **Ask a Question**: Type your programming question in the input field
2. **Get AI Response**: Receive detailed explanations with code examples
3. **Copy Code**: Use the copy button on code blocks
4. **View History**: Access your previous conversations in the History page

### Example Questions

- "How do React useEffect hooks work?"
- "Implement merge sort in Python"
- "Explain JavaScript closures with examples"
- "What's the difference between let, const, and var?"
- "How to handle async/await in JavaScript?"

### Features Overview

- **💡 Smart Responses**: Get contextual programming help
- **🔄 Conversation History**: All chats are saved locally
- **📋 Copy Code**: One-click code copying
- **🌙 Theme Support**: Dark and light modes
- **📱 Responsive**: Works on desktop, tablet, and mobile

## 🎨 Customization

### Themes

The app supports both dark and light themes. Users can toggle between themes using the theme switcher in the header.

### Styling

The project uses TailwindCSS for styling. You can customize:

- Colors in `globals.css` CSS variables
- Component styles in individual component files
- Layout and spacing using Tailwind utilities

### AI Behavior

Modify the system instruction in your environment variables to change how the AI responds:

```env
NEXT_PUBLIC_SYSTEM_INSTRUCTION="You are a helpful programming tutor. Provide clear explanations with code examples..."
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to [Netlify](https://netlify.com)
3. Set environment variables in Netlify dashboard

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for providing the AI capabilities
- [Next.js](https://nextjs.org/) for the amazing React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) for the beautiful icons

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the [documentation](https://nextjs.org/docs)
- Visit [Google AI documentation](https://ai.google.dev/docs)

---
