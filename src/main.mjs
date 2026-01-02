import Block from "./Block.mjs";
import { BLOCK_REGISTRY } from "./BlockRegistry.mjs";
import Editor from "./Editor.mjs";

/**
 * APPLICATION INIT
 */
const editor = new Editor("editor-canvas");

// Populate Toolbox
const toolbox = document.getElementById("toolbox-content");
const categories = {};

BLOCK_REGISTRY.forEach((def) => {
	if (!categories[def.category]) categories[def.category] = [];
	categories[def.category].push(def);
});

Object.keys(categories).forEach((cat) => {
	const catDiv = document.createElement("div");
	catDiv.className = "category-item";
	catDiv.innerHTML = `<div class="category-header">${cat}</div>`;

	categories[cat].forEach((def) => {
		const item = document.createElement("div");
		item.className = "block-item";
		item.innerText = def.name;
		item.draggable = true;

		// Drag start: Store data
		item.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("blockName", def.name);
		});

		catDiv.appendChild(item);
	});

	toolbox.appendChild(catDiv);
});

// Drop Handling on Canvas
const canvasContainer = document.getElementById("center-dock");
canvasContainer.addEventListener("dragover", (e) => e.preventDefault());
canvasContainer.addEventListener("drop", (e) => {
	e.preventDefault();
	const name = e.dataTransfer.getData("blockName");
	const def = BLOCK_REGISTRY.find((b) => b.name === name);
	if (def) {
		const rect = editor.canvas.getBoundingClientRect();
		const worldPos = editor.screenToWorld(
			e.clientX - rect.left,
			e.clientY - rect.top
		);
		const block = new Block(worldPos.x, worldPos.y, def);
		editor.graph.addBlock(block);
	}
});

// Console Toggle
document.getElementById("btn-console").addEventListener("click", () => {
	document.getElementById("bottom-dock").classList.toggle("open");
});
document.getElementById("btn-close-console").addEventListener("click", () => {
	document.getElementById("bottom-dock").classList.remove("open");
});

// Custom Code Editor Logic
const overlay = document.getElementById("code-editor-overlay");
let currentEditingBlock = null;

editor.canvas.addEventListener("dblclick", (e) => {
	const rect = editor.canvas.getBoundingClientRect();
	const worldPos = editor.screenToWorld(
		e.clientX - rect.left,
		e.clientY - rect.top
	);

	for (let b of editor.graph.blocks) {
		if (b.isInside(worldPos.x, worldPos.y)) {
			if (b.def.customCode) {
				currentEditingBlock = b;
				document.getElementById("custom-code-input").value =
					b.codeContent ||
					"// Enter JS Code Here\n// Inputs are accessed via input_1, input_2\n";
				overlay.style.display = "flex";
			}
		}
	}
});

document.getElementById("btn-save-code").addEventListener("click", () => {
	if (currentEditingBlock) {
		currentEditingBlock.codeContent =
			document.getElementById("custom-code-input").value;
	}
	overlay.style.display = "none";
});

document.getElementById("btn-run").addEventListener("click", () => {
    let code = editor.graph.blocks.map((b) => ({
        id: b.id,
        name: b.title,
        pos: b.pos,
        inputs: b.inputs.map((i) => ({ name: i.name, value: i.value })),
        outputs: b.outputs.map((o) => o.name),
    }));
    
    
    
    
    console.log(editor.graph.blocks[1].getConnectedInputs(editor.graph));
    console.log(editor.graph.blocks[1].getConnectedOutputs(editor.graph));
    
    
    
});

// Exporter (Simple JSON representation for now)
document.getElementById("btn-export").addEventListener("click", () => {
	const json = JSON.stringify(
		editor.graph.blocks.map((b) => ({
			id: b.id,
			name: b.title,
			pos: b.pos,
			inputs: b.inputs.map((i) => ({ name: i.name, value: i.value })),
			outputs: b.outputs.map((o) => o.name),
		})),
		null,
		2
	);

	// Log to console panel
	const con = document.getElementById("console-output");
	con.innerText = json;
	document.getElementById("bottom-dock").classList.add("open");
});
