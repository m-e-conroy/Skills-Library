---
name: game-math-expert
# argument-hint: "[topic]"
description: Advanced mathematical concepts and workflows for game development, graphics, and generative art. Covers coordinate systems, vectors, matrices, transformations, physics, curves, and geometric primitives with practical examples and when-to-use guidance.
allowed-tools: Read, Grep, Glob
---

# Game & Graphics Math Mastery

## Purpose
Empower expert developers and technical artists to solve complex spatial, geometric, and physical problems in games and generative art. This skill provides deep, actionable guidance on coordinate systems, transformations, vector/matrix math, physics, and curve modeling, with practical examples and best-use scenarios.

## Invocation
- **Manual**: `/game-math-expert [topic]`
- **Automatic**: Triggered for requests involving 2D/3D math, transformations, physics, or procedural geometry.
- **Arguments**: Optional `$0` to focus on a specific topic (e.g., `quaternions`, `projection`).

## Prerequisites & Permissions
- Standard workspace reading tools.
- No external dependencies required.

## Topics & Expanded Guidance

### 1. Cartesian Coordinate Systems
**Explanation**: 1D, 2D, and 3D spaces using perpendicular axes (x, y, z). Used for positioning, movement, and rendering in almost all games and graphics engines.
**When to Use**: Any time you need to represent or manipulate positions, directions, or distances.
**Example**:
- 2D: `position = (x, y)`
- 3D: `position = (x, y, z)`

### 2. Vectors
**Explanation**: Quantities with both magnitude and direction. Support operations like addition, subtraction, scaling, dot/cross products.
**When to Use**: Movement, forces, normals, directions, lighting, and more.
**Example**:
- Addition: `v3 = v1 + v2`
- Dot product: `v1 · v2` (angle/cosine, projection)
- Cross product: `v1 × v2` (perpendicular vector in 3D)

### 3. Multiple Coordinate Spaces
**Explanation**: Transforming between world, object, camera, and screen spaces using basis vectors and transformation matrices.
**When to Use**: Rendering pipelines, hierarchical models, camera movement.
**Example**:
- World to camera: `cameraMatrix * worldPosition`

### 4. Introduction to Matrices
**Explanation**: Rectangular arrays of numbers for representing linear transformations (rotation, scaling, translation).
**When to Use**: Chaining multiple transformations, animating, projecting, or rotating objects.
**Example**:
- 2D rotation: `R = [[cosθ, -sinθ], [sinθ, cosθ]]`
- Matrix multiplication: `M * v`

### 5. Matrices and Linear Transformations
**Explanation**: Use matrices to perform rotation, scaling, projection, reflection, shearing, and combine them efficiently.
**When to Use**: Animating, simulating, or rendering objects in 2D/3D.
**Example**:
- Combine: `M = T * R * S` (translate, rotate, scale)
- Orthographic projection: flattening 3D to 2D

### 6. More on Matrices
**Explanation**: Determinants (invertibility), matrix inversion (undoing transforms), orthogonal matrices (pure rotation), 4x4 homogeneous matrices (for 3D with translation), perspective projection.
**When to Use**: Camera/view transforms, undoing transforms, perspective rendering.
**Example**:
- Inverse: `M_inv = inverse(M)`
- Perspective: `P * v` (project 3D to 2D)

### 7. Polar Coordinate Systems
**Explanation**: 2D polar (r, θ), 3D cylindrical/spherical coordinates. Useful for circular motion, orbits, and procedural effects.
**When to Use**: Spirals, orbits, radial gradients, mapping textures to spheres.
**Example**:
- Convert: `x = r * cosθ, y = r * sinθ`
- Spherical: `(ρ, θ, φ)`

### 8. Rotation in Three Dimensions
**Explanation**: Representing orientation with matrices, Euler angles, axis-angle, and quaternions. Each has tradeoffs for interpolation, gimbal lock, and performance.
**When to Use**: 3D camera, object rotation, smooth interpolation (slerp), avoiding gimbal lock.
**Example**:
- Quaternion: `q = (w, x, y, z)`
- Euler to quaternion conversion

### 9. Geometric Primitives
**Explanation**: Mathematical representations of lines, rays, spheres, AABBs, planes, triangles, polygons. Used for collision, rendering, and spatial queries.
**When to Use**: Raycasting, hit detection, mesh generation, bounding volumes.
**Example**:
- Ray-sphere intersection
- AABB overlap test

### 10. Mathematical Topics from 3D Graphics
**Explanation**: The graphics pipeline, mesh representation, texture mapping, lighting models, and animation basics.
**When to Use**: Rendering, shading, animating, and simulating 3D scenes.
**Example**:
- Mesh: list of vertices + faces
- Phong lighting: `color = ambient + diffuse + specular`

### 11. Mechanics 1: Linear Kinematics and Calculus
**Explanation**: Describes motion using velocity, acceleration, derivatives, and integrals.
**When to Use**: Simulating movement, physics, and animation curves.
**Example**:
- Velocity: `v = dx/dt`
- Position from velocity: `x = ∫v dt`

### 12. Mechanics 2: Linear and Rotational Dynamics
**Explanation**: Newton's laws, forces, momentum, collisions, and rigid body simulation.
**When to Use**: Physics engines, collision response, real-time simulation.
**Example**:
- F = m * a (force)
- Conservation of momentum in collisions

### 13. Curves in 3D
**Explanation**: Parametric curves (Hermite, Bézier, splines), interpolation, and continuity. Used for animation paths, modeling, and procedural art.
**When to Use**: Camera paths, smooth animation, procedural geometry, drawing tools.
**Example**:
- Bézier curve: `B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2`
- Spline interpolation for smooth paths

## Safety & Guardrails
- Always clarify coordinate conventions (right-handed vs left-handed).
- Warn if using Euler angles for long interpolations (gimbal lock risk).
- For physics, ensure time steps are consistent to avoid instability.

## Notes for maintainers
- Expand with code snippets for each topic as needed.
- Reference: "3D Math Primer for Graphics and Game Development" (Dunn/Parberry), "Real-Time Rendering" (Akenine-Möller et al).