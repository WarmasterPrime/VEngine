# VEngine – Class‑Based Visual Graph Engine

VEngine is a **browser‑based, class‑driven visual programming / logic‑graph engine** built with modern **ES Modules (JavaScript)** and HTML5 Canvas concepts. It allows you to visually compose logic using **blocks (nodes)** connected by **wires**, then execute or evaluate the resulting graph.

The project is intentionally lightweight, dependency‑free, and designed to be **extensible at the code level**—new block types, editors, and behaviors can be added by simply introducing new modules.

---

## ✨ Key Features

* 🧩 **Visual block‑based editor** (nodes + wires)
* 🧠 **Class‑oriented architecture** (Block, Node, Wire, Graph, Editor)
* 🧱 **Modular block definitions** (Math, Variables, Events, Logging)
* 🧭 **Pan & zoom canvas workspace**
* 🔌 **Typed connection points** via block sockets
* ⚙️ **No external libraries** – pure JavaScript ES modules
* 🖥️ Runs entirely in the browser

---

## 📁 Project Structure

```
VEngine/
├── index.html              # Entry HTML file
├── main.css                # Editor styling
├── src/
│   ├── main.mjs            # Application bootstrap
│   ├── Editor.mjs          # Visual editor & interaction logic
│   ├── Graph.mjs           # Graph execution & evaluation
│   ├── Block.mjs           # Base block class
│   ├── Node.mjs            # Input/output socket representation
│   ├── Wire.mjs            # Connection between nodes
│   ├── Rect.mjs            # Geometry helper
│   ├── Vec2.mjs            # 2D vector math
│   ├── Types.mjs           # Shared type definitions
│   ├── Config.mjs          # Global configuration
│   ├── BlockRegistry.mjs   # Block registration system
│   └── Blocks/
│       ├── Math.mjs        # Arithmetic & math blocks
│       ├── Variables.mjs   # Variable get/set blocks
│       ├── Events.mjs      # Event‑driven blocks
│       └── Logging.mjs     # Debug / output blocks
└── LICENSE.txt
```

---

## 🧠 Core Architecture

### **Editor**

Responsible for:

* Rendering the canvas
* Handling mouse / keyboard input
* Dragging blocks
* Creating wires
* Camera panning & zooming

> Think of `Editor` as the **UI + interaction layer**.

---

### **Graph**

The logical backbone of the system.

Responsibilities:

* Stores blocks and wires
* Resolves execution order
* Evaluates block outputs
* Manages runtime state

> This is the **execution engine** behind the visuals.

---

### **Block**

Base class for all visual logic units.

A block:

* Has a position and size
* Owns input and output `Node`s
* Implements custom evaluation logic

All blocks inherit from this class.

---

### **Node**

Represents a **connection point** on a block.

Nodes:

* Are typed (input/output)
* Can accept or emit values
* Are connected via `Wire`

---

### **Wire**

A directional link between two nodes.

Wires:

* Visually connect blocks
* Transmit values during graph execution
* Enforce type compatibility

---

### **BlockRegistry**

Central registry for available block types.

Used to:

* Register blocks globally
* Populate context menus
* Dynamically instantiate blocks

---

## 🧩 Built‑In Block Categories

### 📐 Math Blocks

* Add
* Subtract
* Multiply
* Divide

### 🧮 Variables

* Set Variable
* Get Variable

### ⚡ Events

* Trigger / Start blocks
* Execution flow control

### 📝 Logging

* Console output blocks
* Debug visualization

Each block category lives in its own module under `src/Blocks/`.

---

## ▶️ Running the Project

No build step required.

1. Open `index.html` in a modern browser
2. The editor initializes automatically
3. Right‑click to add blocks
4. Drag to connect nodes
5. Press **▶ Run** to execute the graph

> For local module loading, use a simple HTTP server if your browser restricts `file://` module imports.

Example:

```
python -m http.server
```

---

## 🛠 Extending VEngine

### Adding a New Block

1. Create a new file in `src/Blocks/`
2. Extend the `Block` base class
3. Define inputs, outputs, and logic
4. Register it in `BlockRegistry`

This design allows **plug‑and‑play expansion** without modifying the core engine.

---

## 🧪 Intended Use Cases

* Visual scripting systems
* Game logic prototyping
* Educational programming tools
* Circuit‑style logic simulations
* Workflow / automation visualization

---

## 🚧 Roadmap Ideas (Optional)

* Serialization / save‑load graphs
* Undo / redo system
* Custom block UI controls
* Type validation rules
* WebWorker‑based execution
* Export to JSON or code

---

## 📜 License

See `LICENSE.txt` for licensing details.

---

## 🧠 Philosophy

VEngine is designed to be:

* **Readable** over clever
* **Extensible** over opinionated
* **Visual‑first**, but logic‑sound

It is a foundation—not a locked‑down framework.

---

If you want, I can also generate:

* Full class‑by‑class API documentation
* A block authoring guide
* Execution flow diagrams
* A plugin system design
