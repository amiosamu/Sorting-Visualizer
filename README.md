# Sorting Algorithm Visualizer

Interactive visualization of sorting algorithms built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Features

- Six sorting algorithms: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort
- Customizable array size (10-100 elements) and animation speed
- Color-coded operations: comparing, swapping, highlighting, and sorted elements
- Real-time algorithm complexity information
- Responsive design with modern UI

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Sorting-Visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Usage

1. Select a sorting algorithm from the available options
2. Generate a new array or adjust the array size
3. Control animation speed with the speed slider
4. Click Start to begin visualization
5. Use Pause/Resume and Reset controls as needed

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── SortingVisualizer.tsx
│   ├── ControlPanel.tsx
│   └── ArrayVisualization.tsx
└── types/
    └── sorting.ts
```

## Color Legend

- Default: Gray bars
- Comparing: Red bars
- Swapping: Amber bars  
- Highlighting: Purple bars
- Sorted: Green bars
