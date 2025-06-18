# Frontend MBPP Optimizer

A 3D visualization tool for Multi-Bin Packing Problem (MBPP) optimization solutions.

## Overview

This project is a front-end application for visualizing bin packing solutions in 3D. It allows users to:

- Load container configurations from JSON files
- Visualize packed items in 3D with interactive controls
- Configure optimization parameters
- Explore multi-bin packing solutions
- Toggle various visual elements (grid, axes, slots)
- Switch between different color schemes

## Project Structure

```
frontend-mbpp-optimizer/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Layout/         # Layout main components
│   │   └── ThreeD/         # 3D scene visualization components
│   │   └── UI/             # UI panels components
│   ├── context/            # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Service classes
│   ├── states/             # Jotai state atoms
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/frontend-mbpp-optimizer.git
   cd frontend-mbpp-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Key Components

### ThreeDView

The main container component that orchestrates the 3D visualization. It manages:
- Camera controls
- View settings
- Container selection
- Debug information

### Camera System

Camera management is handled through:
- `CameraContext`: Provides camera controls to components outside Three.js
- `CameraController`: Connects the Three.js camera to UI controls
- `CameraControls`: UI buttons for different camera presets

### Bin Management

The application supports visualizing multiple bins:
- `BinSelector`: UI for switching between containers
- `BinScene`: Renders a container and its packed items
- Automatic switching to containers with packed items

### Visualization Options

Users can customize the visualization with:
- Color modes (by material or assembly)
- Toggling grid, axes, and slots
- Different camera angles (isometric, top, side, front)
- Fit-to-container view

## State Management

The application uses Jotai for state management:

- `binDataState`: Container specifications
- `binCountState`: Number of containers
- `partsDataState`: Parts to be packed
- `optimizationState`: Optimization parameters and status

## File Formats

### Bin JSON Format

```json
{
  "bins": [
    {
      "guid": "bin-guid",
      "id": 0,
      "modules": [
        {
          "guid": "module-guid",
          "index": 0,
          "module_type": "LARGE_SLOTS",
          "slots": [
            {
              "guid": "slot-guid",
              "index": 0,
              "global_index": 0,
              "origin": { "X": 0, "Y": 0, "Z": 0 },
              "size": { "X": 100, "Y": 100, "Z": 100 }
            }
          ],
          "origin": { "X": 0, "Y": 0, "Z": 0 },
          "size": { "X": 1000, "Y": 600, "Z": 1000 },
          "area": 1000000
        }
      ],
      "size": { "X": 1000, "Y": 600, "Z": 1000 },
      "area": 1000000
    }
  ]
}
```

### Solution Format

```json
{
  "bins_used": [0, 1],
  "packed_parts": [
    {
      "part_id": "part-guid",
      "bin_id": 0,
      "rotation": [0, 0, 0],
      "position": [100, 0, 200],
      "dimensions": [200, 300, 400]
    }
  ],
  "unpacked_parts": ["unpacked-part-guid"],
  "metrics": {
    "volume_utilization": 0.85,
    "bin_count": 2
  }
}
```

## Extending the Project

### Adding New Features

1. **New UI Controls**:
   - Create a new component in `src/components/ThreeD/controls/`
   - Import and add to `ThreeDView.tsx`

2. **New Visualization Elements**:
   - Create components in `src/components/ThreeD/scene/`
   - Add to `BinScene.tsx` or other scene components

3. **New API Endpoints**:
   - Extend the `useOptimizationApi` hook in `src/hooks/`

### Modifying 3D Rendering

1. **Camera Behaviors**:
   - Update the `cameraManager.ts` in `src/utils/`
   - Modify camera presets in `CameraController.tsx`

2. **Visual Styles**:
   - Adjust materials in `PartModel.tsx` and `BinScene.tsx`
   - Update colors and transparency settings

## Technologies Used

- **React**: UI framework
- **TypeScript**: Type safety and developer experience
- **Three.js**: 3D rendering
- **React Three Fiber**: React bindings for Three.js
- **drei**: Helper components for React Three Fiber
- **Jotai**: State management
- **Tailwind CSS**: Styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) for 3D rendering capabilities
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for React integration with Three.js
- [Jotai](https://jotai.org/) for state management
