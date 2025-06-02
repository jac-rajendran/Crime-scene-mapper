# Crime Scene Reconstruction Toolkit

![Header Image](https://via.placeholder.com/1200x400?text=Crime+Scene+Reconstruction+Toolkit+Demo)

A digital forensic platform for precise crime scene documentation and analysis. Designed for law enforcement and forensic professionals to create interactive scene diagrams with evidentiary metadata.

## Key Features

### Core Capabilities
- **Precision Evidence Placement**  
  Snap-to-grid positioning with millimeter-accurate measurement tools
- **Standardized Forensic Markers**  
  IAI-compliant evidence tagging system (Item-1, Item-2, etc.)
- **Trajectory Analysis**  
  Angle-of-impact calculators with 3D projection lines
- **Chain-of-Custody Logs**  
  Automated evidence tracking with timestamps

### Technical Highlights
- **Multi-Layer Workspace**  
  Separate visual layers for blood patterns, ballistic paths, and physical evidence
- **Scene Lighting Simulation**  
  Adjustable light sources to replicate time-of-day conditions
- **Measurement Annotations**  
  Automatic dimension labeling with configurable units (metric/imperial)

## Implementation

```mermaid
graph LR
    A[React Frontend] --> B(Redux State Management)
    A --> C(Fabric.js Canvas)
    D[Node.js Backend] --> E(Scene Data Persistence)
    D --> F(PDF Report Generation)
    G[Three.js] --> H(3D View Mode)


# Clone repository
git clone https://github.com/yourusername/crime-scene-mapper.git

# Install dependencies
npm install

# Launch development server
npm start

// Initialize scene with default forensic parameters
const scene = new ForensicScene({
  scale: '1:20',
  gridUnits: 'centimeters',
  defaultTags: 'IAI-2023'
});
