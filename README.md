# 🕵️‍♂️ Crime Scene Mapper | Interactive Forensic Tool

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXh2b2VqY2R4ZzF1dG5tZ3J0dGJ4Y2VhNnRseDZ6eWJ6b2VhY3J0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMHxhOfscxPfIfm/giphy.gif" width="600" alt="Crime scene reconstruction demo"/>
  
  **Drag-and-Drop Digital Crime Scene Reconstruction**  
  *Dark Mode Optimized for Forensic Analysis*
</div>

---

## 🛠️ Core Features

| Feature | Preview | Description |
|---------|--------|-------------|
| **Evidence Placement** | ![Drag](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5tY2VlOGV4dW5tY2VlOGV4dW5tY2VlOGV4dW5tY2VlOGV4dW5tY2VlOGV4JmVwPXYx/giphy.gif) | Intuitive drag-and-drop with physics-based placement |
| **Forensic Marking** | ![Laser](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/giphy.gif) | Laser pointer for precise evidence highlighting |
| **Pattern Analysis** | ![Blood](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/giphy.gif) | Dynamic bloodstain pattern visualization |
| **Scene Examination** | ![Light](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZzJnZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/giphy.gif) | Adjustable forensic lighting modes |

---

## 🧰 Technical Implementation

```mermaid
graph LR
    A[GSAP] --> B(Evidence Animation)
    C[Canvas API] --> D(Bloodstain Rendering)
    E[Three.js] --> F(3D Measurements)
    G[Electron] --> H(Desktop Export)
