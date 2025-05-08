# React Native (Expo) + Optimizely SDK Starter

This repository provides a starter template for integrating the Optimizely SDK with a React Native application using Expo.

## Prerequisites

- Node.js and npm installed
- Xcode (for iOS development) or Android Studio (for Android development)

## Installation

### Step 1: Set up the Optimizely SDK

1. Clone the Optimizely JavaScript SDK repository:
   ```bash
   git clone https://github.com/optimizely/javascript-sdk.git
   ```

2. Navigate to the SDK directory and install dependencies:
   ```bash
   cd javascript-sdk
   npm install
   ```

3. Create a tarball of the SDK:
   ```bash
   npm pack
   ```

### Step 2: Set up the React Native Expo project

1. Clone this repository (if you haven't already)

2. Install the Optimizely SDK from the tarball you created:
   ```bash
   # Path may vary depending on your directory structure
   npm install ../../sdk/javascript-sdk/optimizely-optimizely-sdk-5.3.4.tgz
   ```

3. Install other project dependencies:
   ```bash
   npm install
   ```

## Optimizely SDK Integration

This project already includes a basic implementation of the Optimizely SDK in the `app/(tabs)/explore.tsx` file. The implementation includes:

- Creating a polling project config manager with an SDK key from environment variables
- Setting up an ODP (Optimizely Data Platform) manager
- Configuring a logger with debug level
- Initializing the Optimizely client with these configurations
- A React useEffect hook that calls `optimizely.onReady()` to initialize the SDK when the component mounts

To use this implementation, create a `.env` file at the project root with your SDK key: `EXPO_PUBLIC_OPTIMIZELY_SDK_KEY=your-sdk-key-here`

## Running the Application

### On iOS:
```bash
npm run ios
```

### On Android:
```bash
npm run android
```

### On Web:
```bash
npm run web
```

## Project Structure

- `app/` - Contains the main application screens and navigation
- `components/` - Reusable React components
- `constants/` - Application constants and theme configuration
- `hooks/` - Custom React hooks
- `assets/` - Images, fonts, and other static resources

## Additional Resources

- [v6 pre-release doc](https://docs.developers.optimizely.com/feature-experimentation/docs/javascript-browser-sdk-v6)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Troubleshooting

If you encounter any issues with the SDK integration, please check:
- Ensure the tarball path is correct when installing the SDK
- Verify that all dependencies are properly installed
- Check the Optimizely SDK version compatibility
- Make sure your environment variables are properly set up
