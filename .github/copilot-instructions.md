# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js project with TypeScript, Tailwind CSS, and Three.js for creating interactive 3D web experiences.

## Technology Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Three.js** for 3D graphics
- **@react-three/fiber** for React Three.js integration
- **@react-three/drei** for Three.js helpers and abstractions

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/components/ui` - UI components (sidebar, navigation, etc.)
- `/src/experiments` - Three.js experiment components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions

## Design Philosophy

Follow Vercel's design philosophy:
- **Minimal and clean** - Use whitespace effectively
- **Simple** - Focus on functionality over decoration
- **Modern** - Use contemporary design patterns
- **Responsive** - Mobile-first approach

## Three.js Guidelines

- Use React Three Fiber for React integration
- Organize experiments in separate components
- Use TypeScript for Three.js objects and materials
- Implement proper cleanup in useEffect hooks
- Use Drei helpers when appropriate for common Three.js patterns

## Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing and typography scales
- Prefer subtle shadows and transitions
- Use semantic HTML elements

## Code Standards

- Use TypeScript strictly (no `any` types unless absolutely necessary)
- Implement proper error handling
- Use descriptive component and function names
- Add JSDoc comments for complex functions
- Follow React best practices (hooks, state management)
