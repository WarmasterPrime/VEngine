import Block from "./Block.mjs";
import { CONFIG } from "./Config.mjs";
import Graph from "./Graph.mjs";
import Types from "./Types.mjs";
import Vec2 from "./Vec2.mjs";
import Wire from "./Wire.mjs";

export default class Editor {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext("2d");
		this.graph = new Graph();

		this.camera = { x: 0, y: 0, zoom: 1 };
		this.isDragging = false;
		this.isPanning = false;
		this.dragBlock = null;
		this.dragOffset = new Vec2(0, 0);
		this.tempWire = null;
		
		this.inputEl = document.getElementById('floating-input');
        this.contextMenu = document.getElementById('context-menu');
        this.contextTargetBlock = null;

		this.mouse = new Vec2(0, 0);
		this.worldMouse = new Vec2(0, 0);

		this.initListeners();
		this.resize();

		// Start Loop
		requestAnimationFrame(() => this.loop());
	}

	resize() {
		this.canvas.width = this.canvas.parentElement.offsetWidth;
		this.canvas.height = this.canvas.parentElement.offsetHeight;
	}

	screenToWorld(x, y) {
		return new Vec2(
			(x - this.camera.x) / this.camera.zoom,
			(y - this.camera.y) / this.camera.zoom
		);
	}

	loop() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.save();
		this.ctx.translate(this.camera.x, this.camera.y);
		this.ctx.scale(this.camera.zoom, this.camera.zoom);

		this.drawGrid();

		// Draw Wires (Bottom Layer)
		this.graph.wires.forEach((w) => w.draw(this.ctx));
		if (this.tempWire) this.tempWire.draw(this.ctx);

		// Draw Blocks
		this.graph.blocks.forEach((b) => b.draw(this.ctx, this.graph));

		this.ctx.restore();
		requestAnimationFrame(() => this.loop());
	}

	drawGrid() {
		const size = CONFIG.gridSize;
		const width = this.canvas.width / this.camera.zoom;
		const height = this.canvas.height / this.camera.zoom;

		// Optimally only draw lines visible in viewport
		const startX = Math.floor(-this.camera.x / this.camera.zoom / size) * size;
		const startY = Math.floor(-this.camera.y / this.camera.zoom / size) * size;

		this.ctx.beginPath();
		this.ctx.strokeStyle = "#333";
		this.ctx.lineWidth = 0.5;

		for (let x = startX; x < startX + width + size; x += size) {
			this.ctx.moveTo(x, startY);
			this.ctx.lineTo(x, startY + height + size);
		}
		for (let y = startY; y < startY + height + size; y += size) {
			this.ctx.moveTo(startX, y);
			this.ctx.lineTo(startX + width + size, y);
		}
		this.ctx.stroke();
	}

	initListeners() {
		window.addEventListener("resize", () => this.resize());

		this.canvas.addEventListener("mousedown", (e) => {
			const rect = this.canvas.getBoundingClientRect();
			this.mouse = new Vec2(e.clientX - rect.left, e.clientY - rect.top);
			this.worldMouse = this.screenToWorld(this.mouse.x, this.mouse.y);

			// 1. Check Node Click (Start Wire)
			let clickedNode = null;
			for (let b of this.graph.blocks) {
				// Check Outputs
				for (let n of b.outputs) {
					if (this.worldMouse.dist(n.worldPos) < 10) clickedNode = n;
				}
				// Check Inputs (Disconnect existing)
				for (let n of b.inputs) {
					if (this.worldMouse.dist(n.worldPos) < 10) {
						// If wire exists, detach it and let user drag it
						const existingWire = this.graph.wires.find(
							(w) => w.inputNode === n
						);
						if (existingWire) {
							this.graph.wires = this.graph.wires.filter(
								(w) => w !== existingWire
							);
							clickedNode = existingWire.outputNode; // Resume dragging from source
						}
					}
				}
			}

			if (clickedNode) {
				this.tempWire = new Wire(clickedNode, null);
				this.tempWire.tempEnd = this.worldMouse;
				return;
			}

			// 2. Check Block Header Click (Drag Block)
			for (let i = this.graph.blocks.length - 1; i >= 0; i--) {
				const b = this.graph.blocks[i];
				if (b.isInside(this.worldMouse.x, this.worldMouse.y)) {
					// Only drag if on header
					if (this.worldMouse.y < b.pos.y + CONFIG.headerHeight) {
						this.isDragging = true;
						this.dragBlock = b;
						this.dragOffset = this.worldMouse.sub(b.pos);
						return; // Found top-most block
					}
					// If clicked in body (input value edit), we'd handle that here
				}
			}

			// 3. Else Pan Canvas
			this.isPanning = true;
		});

		this.canvas.addEventListener("mousemove", (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const dx = x - this.mouse.x;
			const dy = y - this.mouse.y;

			this.mouse = new Vec2(x, y);
			this.worldMouse = this.screenToWorld(x, y);

			if (this.isPanning) {
				this.camera.x += dx;
				this.camera.y += dy;
			} else if (this.isDragging && this.dragBlock) {
				// Snap to Grid
				let newX = this.worldMouse.x - this.dragOffset.x;
				let newY = this.worldMouse.y - this.dragOffset.y;
				newX = Math.round(newX / CONFIG.gridSize) * CONFIG.gridSize;
				newY = Math.round(newY / CONFIG.gridSize) * CONFIG.gridSize;

				this.dragBlock.pos.x = newX;
				this.dragBlock.pos.y = newY;
			} else if (this.tempWire) {
				this.tempWire.tempEnd = this.worldMouse;

				// Hover Effects & Validation
				// Check if hovering over a compatible input node
				let hoverNode = null;
				for (let b of this.graph.blocks) {
					for (let n of b.inputs) {
						if (this.worldMouse.dist(n.worldPos) < 15) hoverNode = n;
					}
				}

				if (hoverNode) {
					// Check compatibility
					const typesMatch =
						this.tempWire.outputNode.type === hoverNode.type ||
						this.tempWire.outputNode.type === Types.any ||
						hoverNode.type === Types.any;
					this.tempWire.isValid = typesMatch;
					// Snap visually
					if (typesMatch) this.tempWire.tempEnd = hoverNode.worldPos;
				} else {
					this.tempWire.isValid = true; // Default to normal color when in open space
				}
			}

			// Tooltip Logic
			const tooltip = document.getElementById("tooltip");
			let hoveredNode = null;
			for (let b of this.graph.blocks) {
				[...b.inputs, ...b.outputs].forEach((n) => {
					if (this.worldMouse.dist(n.worldPos) < 10) hoveredNode = n;
				});
			}
			if (hoveredNode) {
				tooltip.style.opacity = 1;
				tooltip.style.left = e.clientX + 10 + "px";
				tooltip.style.top = e.clientY + 10 + "px";
				tooltip.innerText =
					hoveredNode.type === Types.flow
						? "Execution Flow"
						: Object.keys(Types).find((key) => Types[key] === hoveredNode.type);
			} else {
				tooltip.style.opacity = 0;
			}
		});

		this.canvas.addEventListener("mouseup", (e) => {
			if (this.tempWire) {
				// Find target node
				let targetNode = null;
				for (let b of this.graph.blocks) {
					for (let n of b.inputs) {
						if (this.worldMouse.dist(n.worldPos) < 15) targetNode = n;
					}
				}

				if (targetNode) {
					// Create Permanent Wire
					const typesMatch =
						this.tempWire.outputNode.type === targetNode.type ||
						this.tempWire.outputNode.type === Types.any ||
						targetNode.type === Types.any;

					if (typesMatch) {
						// Remove existing wire to this input (single input rule)
						this.graph.wires = this.graph.wires.filter(
							(w) => w.inputNode !== targetNode
						);

						const newWire = new Wire(this.tempWire.outputNode, targetNode);
						this.graph.wires.push(newWire);

						// Handle Rest Params logic
						targetNode.block.handleRestConnections(this.graph);
					}
				}
				this.tempWire = null;
			}
			
			this.canvas.addEventListener('contextmenu', e => {
				e.preventDefault();
				const rect = this.canvas.getBoundingClientRect();
				const mouse = this.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
				
				// Find block under mouse
				let block = null;
				for(let i = this.graph.blocks.length -1; i >= 0; i--) {
					const b = this.graph.blocks[i];
					if(b.isInside(mouse.x, mouse.y)) {
						block = b;
						break;
					}
				}
	
				if(block) {
					this.contextTargetBlock = block;
					this.contextMenu.style.display = 'block';
					this.contextMenu.style.left = e.clientX + 'px';
					this.contextMenu.style.top = e.clientY + 'px';
					
					// Build Menu HTML
					this.contextMenu.innerHTML = `
						<div id="cm-delete">Delete Block</div>
						<div id="cm-duplicate">Duplicate</div>
						<div class="separator"></div>
						<div id="cm-toggle">${block.disabled ? "Enable" : "Disable"}</div>
					`;
					
					// Attach Events
					document.getElementById('cm-delete').onclick = () => {
						this.graph.removeBlock(block);
						this.contextMenu.style.display = 'none';
					};
					
					document.getElementById('cm-duplicate').onclick = () => {
						const newBlock = new Block(block.pos.x + 20, block.pos.y + 20, block.def);
						// Copy Input values
						for(let i=0; i<block.inputs.length; i++) {
							if(newBlock.inputs[i]) newBlock.inputs[i].value = block.inputs[i].value;
						}
						this.graph.addBlock(newBlock);
						this.contextMenu.style.display = 'none';
					};
					
					document.getElementById('cm-toggle').onclick = () => {
						block.disabled = !block.disabled;
						this.contextMenu.style.display = 'none';
					};
				} else {
					this.contextMenu.style.display = 'none';
				}
			});

			this.isDragging = false;
			this.isPanning = false;
			this.dragBlock = null;
		});

		this.canvas.addEventListener("wheel", (e) => {
			e.preventDefault();
			const zoomSpeed = 0.1;
			const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
			const newZoom = Math.max(0.2, Math.min(3, this.camera.zoom + delta));

			// Zoom towards mouse
			const worldPosBefore = this.screenToWorld(e.clientX, e.clientY);
			this.camera.zoom = newZoom;
			const worldPosAfter = this.screenToWorld(e.clientX, e.clientY);

			this.camera.x += (worldPosAfter.x - worldPosBefore.x) * this.camera.zoom;
			this.camera.y += (worldPosAfter.y - worldPosBefore.y) * this.camera.zoom;
		});

		// Drag from Header (Toolbox)
		document.addEventListener("dragend", (e) => {
			// If dropped on canvas
			// This requires HTML5 drag api integration with Canvas.
			// Simplified: We assume clicking items adds them to center for now
			// or we check coordinates.
		});
	}
}