import { CONFIG } from "./Config.mjs";
import Node from "./Node.mjs";
import Types from "./Types.mjs";
import Vec2 from "./Vec2.mjs";

export default class Block {
	constructor(x, y, def) {
		this.pos = new Vec2(x, y);
		this.def = def; // Class definition
		this.title = def.name;
		this.width = 160;
		this.inputs = [];
		this.outputs = [];
		this.headerColor = def.color || "#444";

		// Initialize Nodes from Definition
		def.inputs.forEach((inp) =>
			this.addInput(inp.name, inp.type, inp.isRest, inp.options)
		);
		def.outputs.forEach((out) => this.addOutput(out.name, out.type));

		this.calculateHeight();
	}

	addInput(name, type, isRest = false, options = null) {
		const node = new Node(this, name, type, true, isRest);
		if (options) node.dropdownOptions = options;
		this.inputs.push(node);
		return node;
	}

	addOutput(name, type) {
		const node = new Node(this, name, type, false);
		this.outputs.push(node);
		return node;
	}

	// Special logic for "...params"
	handleRestConnections(graph) {
		// Find inputs that are rest parameters
		for (let i = 0; i < this.inputs.length; i++) {
			const input = this.inputs[i];
			if (input.isRest) {
				const wires = input.getConnectedWires(graph);

				// If this is the last rest node and it has a wire, add a new one below
				const allRestNodes = this.inputs.filter((n) => n.name === input.name);
				const isLast = allRestNodes[allRestNodes.length - 1] === input;

				if (isLast && wires.length > 0) {
					const newNode = this.addInput(input.name, input.type, true);
					// Move it to correct index if needed, usually push is fine for visual order
				}

				// If a middle rest node is disconnected, shift wires up (Complex logic simplified here)
				// In a full implementation: check for gaps in connections among rest nodes and bubble wires up.
			}
		}
		this.calculateHeight();
	}

	calculateHeight() {
		const maxNodes = Math.max(this.inputs.length, this.outputs.length);
		this.height = CONFIG.headerHeight + maxNodes * 25 + 10;
		// Update Node Positions
		let y = CONFIG.headerHeight + 15;
		this.inputs.forEach((n) => {
			n.pos = new Vec2(0, y);
			y += 25;
		});
		y = CONFIG.headerHeight + 15;
		this.outputs.forEach((n) => {
			n.pos = new Vec2(this.width, y);
			y += 25;
		});
	}

	draw(ctx, graph) {
		// Draw Main Body
		roundRect(
			ctx,
			this.pos.x,
			this.pos.y,
			this.width,
			this.height,
			5,
			this.headerColor
		);

		// Title
		ctx.fillStyle = "#fff";
		ctx.font = CONFIG.headerFont;
        ctx.textAlign = "left";
		ctx.fillText(this.title, this.pos.x + 10, this.pos.y + 20);
        
		// Inputs
		ctx.font = CONFIG.font;
		ctx.textAlign = "left";
		this.inputs.forEach((n) => {
			n.worldPos = this.pos.add(n.pos);
			drawNodeShape(ctx, n.worldPos.x, n.worldPos.y, n.type);
			ctx.fillStyle = "#ccc";
			ctx.fillText(n.name, n.worldPos.x + 12, n.worldPos.y + 4);

			// Draw Input Field for Primitives if not connected
			const connected = n.getConnectedWires(graph).length > 0;
			if (
				!connected &&
				!n.type.shape.includes("triangle") &&
				n.type !== Types.object
			) {
				// Draw tiny input box (Visual representation)
				ctx.fillStyle = "#111";
				ctx.fillRect(
					n.worldPos.x + 12 + ctx.measureText(n.name).width + 5,
					n.worldPos.y - 8,
					40,
					14
				);
				if (n.value !== null) {
					ctx.fillStyle = "#eee";
					ctx.fillText(
						n.value.toString(),
						n.worldPos.x + 12 + ctx.measureText(n.name).width + 8,
						n.worldPos.y + 3
					);
				}
			}
		});

		// Outputs
		ctx.textAlign = "right";
		this.outputs.forEach((n) => {
			n.worldPos = this.pos.add(n.pos);
			drawNodeShape(ctx, n.worldPos.x, n.worldPos.y, n.type);
			ctx.fillStyle = "#ccc";
			ctx.fillText(n.name, n.worldPos.x - 12, n.worldPos.y + 4);
		});
	}

	isInside(x, y) {
		return (
			x > this.pos.x &&
			x < this.pos.x + this.width &&
			y > this.pos.y &&
			y < this.pos.y + this.height
		);
	}
    
    canShowInput(node) {
        // Show input box if primitive and NOT connected
        const connected = node.getConnectedWires(editor.graph).length > 0;
        const isPrimitive = [TYPES.STRING, TYPES.NUMBER, TYPES.BOOL].includes(node.type);
        return isPrimitive && !connected;
    }
    /**
     * 
     * @param {Graph} graph 
     */
    getConnections(graph) {
        let allConnections = graph.blocks.find( sel => {
            return sel.id === this.id;
        });
        console.log(allConnections);
        //.inputs[0].getConnectedWires(graph);
    }
    
    getConnectedInputs(graph) {
        return this.inputs.map( inp => {
            return {
                name: inp.name,
                connections: inp.getConnectedWires(graph).map( w => w.outputNode.block )
            };
        });
    }
    
    getConnectedOutputs(graph) {
        return this.outputs.map( inp => {
            return {
                name: inp.name,
                connections: inp.getConnectedWires(graph).map( w => w.inputNode.block )
            };
        });
    }
    
}


function roundRect(ctx, x, y, w, h, r, headerColor) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	// Fill Body
	ctx.fillStyle = CONFIG.blockBg;
	ctx.fill();
	// Header
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + CONFIG.headerHeight);
	ctx.lineTo(x, y + CONFIG.headerHeight);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.fillStyle = headerColor || "#444";
	ctx.fill();
	// Border
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
	ctx.strokeStyle = CONFIG.blockBorder;
	ctx.lineWidth = 1;
	ctx.stroke();
}
function drawNodeShape(ctx, x, y, type) {
	ctx.fillStyle = type.color|"#888";
	ctx.beginPath();
	if (type.shape === "triangle") {
		ctx.moveTo(x - 5, y - 5);
		ctx.lineTo(x + 5, y);
		ctx.lineTo(x - 5, y + 5);
	} else if (type.shape === "square") {
		ctx.rect(x - 5, y - 5, 10, 10);
	} else {
		ctx.arc(x, y, 5, 0, Math.PI * 2);
	}
	ctx.fill();
	ctx.stroke();
}