# Three.js Experiments

An interactive Three.js playground built with Next.js, TypeScript, Tailwind CSS, and React Three Fiber. This project provides a clean, minimal interface for exploring 3D graphics concepts with a floating sidebar navigation system.

## Features

- ✨ **Interactive Three.js Experiments** - Explore various 3D concepts
- 🎨 **Floating Sidebar Navigation** - Clean, collapsible sidebar with experiment categories
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔍 **Search & Filter** - Find experiments by name, description, or tags
- 🏷️ **Categorized Content** - Organized by difficulty and topic
- ⚡ **Modern Tech Stack** - Next.js 15, TypeScript, React Three Fiber

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Three.js** for 3D graphics
- **@react-three/fiber** for React Three.js integration
- **@react-three/drei** for Three.js helpers and abstractions
- **@heroicons/react** for icons

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main page
├── components/
│   └── ui/               # UI components
│       └── ExperimentSidebar.tsx
├── experiments/          # Three.js experiment components
│   ├── BasicCube.tsx
│   ├── MaterialSpheres.tsx
│   └── index.ts         # Experiments registry
├── lib/                 # Utility functions
│   └── experiments.ts   # Experiment helpers
└── types/               # TypeScript definitions
    └── experiments.ts
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Adding New Experiments

1. **Create a new experiment component** in `src/experiments/`:
   ```tsx
   // src/experiments/MyExperiment.tsx
   'use client';
   
   import { Canvas } from '@react-three/fiber';
   import { OrbitControls } from '@react-three/drei';
   
   export default function MyExperiment() {
     return (
       <div className="w-full h-full">
         <Canvas>
           {/* Your Three.js content */}
           <OrbitControls />
         </Canvas>
       </div>
     );
   }
   ```

2. **Register the experiment** in `src/experiments/index.ts`:
   ```tsx
   import MyExperiment from './MyExperiment';
   
   export const experiments: Experiment[] = [
     // ...existing experiments
     {
       id: 'my-experiment',
       title: 'My Experiment',
       description: 'Description of what this experiment demonstrates',
       component: MyExperiment,
       category: 'basics', // or other category
       difficulty: 'beginner',
       tags: ['tag1', 'tag2'],
     },
   ];
   ```

## Available Categories

- `basics` - Fundamental Three.js concepts
- `materials` - Different material types and properties
- `geometry` - Creating and manipulating 3D shapes
- `animation` - Motion and transitions
- `lighting` - Illumination and shadows
- `postprocessing` - Visual effects and filters
- `physics` - Physics simulations and interactions
- `shaders` - Custom GLSL shaders

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [React Three Drei](https://github.com/pmndrs/drei)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
