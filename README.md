# Sorting Algorithm Visualizer

A beautiful and interactive sorting algorithm visualizer built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**. This modern web application allows you to visualize popular sorting algorithms with customizable speed and array size.

## 🚀 Features

- **Multiple Sorting Algorithms**: Support for Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort
- **Interactive Controls**: 
  - Choose from 6 different sorting algorithms
  - Generate random arrays with customizable size (10-100 elements)
  - Adjustable animation speed (1-100)
  - Play, pause, and reset functionality
- **Visual Feedback**: 
  - Bars represent array elements with heights corresponding to values
  - Color-coded animations for different operations (comparing, swapping, sorted, etc.)
  - Real-time status updates and algorithm information
- **Modern UI/UX**: 
  - Responsive design with glassmorphism effects
  - Smooth animations and transitions
  - Works perfectly on desktop and mobile devices
- **Algorithm Information**: Display time and space complexity for each algorithm

## 🛠️ Tech Stack

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Strict type safety and better developer experience
- **Tailwind CSS**: Modern utility-first CSS framework
- **ESLint**: Code linting and quality assurance

## 📁 Project Structure

```
Sorting-Visualizer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── SortingVisualizer.tsx    # Main visualizer component
│   │   ├── ControlPanel.tsx         # Control panel component
│   │   └── ArrayVisualization.tsx   # Array bars visualization
│   └── types/
│       └── sorting.ts          # TypeScript type definitions
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts           # Next.js configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Sorting-Visualizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🎮 Usage

1. **Select an Algorithm**: Click on any of the algorithm buttons (Bubble Sort, Selection Sort, etc.)

2. **Customize the Array**: 
   - Use the "Generate New Array" button to create a random array
   - Adjust the array size with the size slider (10-100 elements)

3. **Control the Speed**: Use the speed slider to adjust animation speed (1 = slowest, 100 = fastest)

4. **Start Sorting**: 
   - Click "Start Sorting" to begin the visualization
   - Use "Pause/Resume" to control playback
   - Click "Reset" to stop and generate a new array

5. **Learn**: View algorithm complexity information displayed below the visualizer

## 🎨 Color Legend

- **Blue Gradient**: Default bars
- **Red**: Bars being compared
- **Yellow/Pink**: Bars being swapped
- **Purple**: Pivot or highlighted elements
- **Green**: Sorted elements

## 🔧 Algorithm Implementation

The application uses a modular React architecture where sorting algorithms are implemented as methods that return arrays of `SortingStep` objects. Each step represents a single operation in the sorting process.

### Core Types

```typescript
export type SortingAlgorithm = 
  | 'bubble-sort' | 'selection-sort' | 'insertion-sort' 
  | 'merge-sort' | 'quick-sort' | 'heap-sort';

export interface SortingStep {
  type: 'compare' | 'swap' | 'set' | 'highlight' | 'sorted';
  indices: number[];
  values?: number[];
}
```

### Animation Types

- `compare`: Highlight bars being compared (red color)
- `swap`: Highlight bars being swapped (yellow/pink gradient)
- `set`: Set specific values at indices (blue highlight)
- `highlight`: Highlight pivot or special elements (purple)
- `sorted`: Mark elements as sorted (green)

## 🔬 Implementing Sorting Algorithms

The framework is ready for you to implement the sorting algorithms. Each algorithm should be implemented in its corresponding method in `src/components/SortingVisualizer.tsx`:

- `bubbleSortSteps()`: Implement bubble sort
- `selectionSortSteps()`: Implement selection sort
- `insertionSortSteps()`: Implement insertion sort
- `mergeSortSteps()`: Implement merge sort
- `quickSortSteps()`: Implement quick sort
- `heapSortSteps()`: Implement heap sort

### Example Implementation Pattern

```typescript
const bubbleSortSteps = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = [...array]; // Work with a copy
  
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Add compare step
      steps.push({ type: 'compare', indices: [j, j + 1] });
      
      if (arr[j] > arr[j + 1]) {
        // Add swap step
        steps.push({ type: 'swap', indices: [j, j + 1] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    // Mark as sorted
    steps.push({ type: 'sorted', indices: [arr.length - 1 - i] });
  }
  
  return steps;
};
```

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize:

- Colors in the component files
- Animation durations and effects
- Layout and spacing
- Responsive breakpoints

### Adding New Algorithms

1. Add the algorithm to the `SortingAlgorithm` type
2. Add algorithm info to the `ALGORITHMS` array
3. Implement the algorithm method
4. Add it to the `generateSortingSteps` switch statement

## 📱 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Implement your sorting algorithm or feature
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and educational purposes.

## 🔮 Future Enhancements

- [ ] Add more sorting algorithms (Radix Sort, Counting Sort, Bucket Sort)
- [ ] Add algorithm comparison mode
- [ ] Add sound effects for operations
- [ ] Add step-by-step mode with detailed explanations
- [ ] Add performance metrics and statistics
- [ ] Add dark/light theme toggle
- [ ] Add algorithm complexity visualization charts
- [ ] Add export functionality for sorting animations

## 🏗️ Development

This project uses:

- **Hot Reload**: Automatic page refresh on file changes
- **TypeScript**: Strict type checking for better code quality
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling with JIT compilation

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

Built with ❤️ using Next.js, React, and TypeScript
