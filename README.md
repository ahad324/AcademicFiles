# 📜 Academic Files 🚀

<div align="center">
    <img src="https://skillicons.dev/icons?i=react,vite,tailwind,css,appwrite" alt="Tech Stack" />
</div>

<p align="center">
    <em>This is an upgraded version of <a href="https://github.com/ahad324/DocNow">DocsNow</a></em>
</p>
<p align="center">
    Welcome to <strong>Academic Files</strong>! 🌟 A powerful and user-friendly file sharing platform built with modern web technologies. Upload, download, and manage files with ease, all wrapped in a sleek and responsive interface.
</p>

## 🌟 Features

- 📤 **Easy File Upload**: Drag and drop or select files to upload
- 📥 **Quick Downloads**: Download individual files or entire collections
- 🔐 **Secure Admin Panel**: Manage files, users, and permissions
- 🎨 **Responsive Design**: Looks great on desktop and mobile devices
- 🌓 **Dark/Light Mode**: Choose your preferred theme
- 📊 **Real-time Updates**: See changes instantly with live data updates
- 🔗 **Shareable Links**: Create and manage shareable file links
- 👥 **User Management**: Create and manage teacher accounts (Admin only)
- 📈 **Storage Analytics**: View detailed storage usage information

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Appwrite
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Toastify

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ahad324/AcademicFiles.git
   cd AcademicFiles
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Appwrite credentials:
   ```
   VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_BUCKET_ID=your_bucket_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_ID_TEACHERS=your_teachers_collection_id
   VITE_APPWRITE_COLLECTION_ID_FILES=your_files_collection_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

- `src/`: Source code
  - `components/`: React components
  - `contexts/`: React context providers
  - `utils/`: Utility functions
  - `styles/`: CSS files
  - `assets/`: Images and other static assets
- `public/`: Public assets

## 🔑 Key Components

- **Dashboard**: Central hub for file management and analytics
- **File Upload**: Handles file uploads with progress tracking
- **File List**: Displays uploaded files with search and pagination
- **User Management**: Admin interface for managing teacher accounts
- **Settings**: User profile and account settings

## 🛡️ Authentication

AcademicFiles uses Appwrite for authentication. Users can:
- Log in with email and password
- Update their profile information
- Change password
- Block their account (for security purposes)

## 🎨 Styling

The project uses Tailwind CSS for styling, with custom color variables for easy theming:

## 🔄 State Management

React Context API is used for global state management:
- `AuthContext`: Handles user authentication and profile
- `DataContext`: Manages file and storage data
- `ActionsContext`: Handles admin actions like creating teachers and URLs

## 📱 Responsive Design

The app is fully responsive, adapting to various screen sizes:

## 🚀 Deployment

The project is configured for easy deployment on platforms like Netlify or Vercel. A `_redirects` file is included for proper routing:

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Appwrite](https://appwrite.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

<p align="center">
  Made with ❤️ by AbdulAhad
</p>