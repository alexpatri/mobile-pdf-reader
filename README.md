# PDF Reader App

A React Native application built with Expo that allows users to manage and read PDF documents on mobile devices.

## Features

- Browse and manage your PDF library
- Read PDFs with a clean, intuitive interface
- Create and organize bookmarks for important pages
- Store information about authors and other document metadata
- Persistent storage for your PDFs and settings

## Tech Stack

- **React Native**: Core framework for building the mobile application
- **Expo**: Development platform for React Native
- **TypeScript**: For type-safe code
- **AsyncStorage**: For persistent data storage
- **react-native-view-pdf**: PDF viewer component
- **expo-document-picker**: For selecting PDFs from the device
- **expo-file-system**: For file management operations

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for running on emulators)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pdf-reader-app.git
   cd pdf-reader-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open the app in your device or emulator
   - Scan the QR code with the Expo Go app
   - Press 'a' to open on Android emulator
   - Press 'i' to open on iOS simulator

## Project Structure

```
pdf-reader-app/
├── app/                   # Expo Router app directory
│   ├── index.tsx          # Home screen
│   ├── reader/[id].tsx    # PDF reader screen
│   └── ...                # Other screens
├── assets/                # Static assets
├── components/            # Reusable UI components
├── utils/                 # Utility functions
│   └── database.ts        # Database operations
├── types/                 # TypeScript type definitions
├── app.json               # Expo configuration
└── package.json           # Project dependencies
```

## Database Structure

The app uses AsyncStorage to persist data with the following structure:

### PDFs
```typescript
{
  id: number;
  title: string;
  path: string;
  author?: string;
  thumbnail?: string;
  created_at: string;
}
```

### Bookmarks
```typescript
{
  id: number;
  pdf_id: number;
  page: number;
  note?: string;
  created_at: string;
}
```

## Development

### Adding New Features

1. Create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Implement your feature
3. Test on different devices/emulators
4. Submit a pull request

### Building for Production

To create a production build:

```bash
npx expo prebuild
npx expo build:android  # For Android
npx expo build:ios      # For iOS
```

Or using EAS Build:

```bash
eas build --platform all
```

## Troubleshooting

- **PDF not rendering**: Ensure the file path is correct and accessible
- **Storage issues**: Try clearing AsyncStorage with `clearDatabase()` function
- **Build errors**: Make sure all dependencies are compatible with your Expo SDK version

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [react-native-view-pdf](https://github.com/rumax/react-native-PDFView)