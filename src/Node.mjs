import Vec2 from "./Vec2.mjs";

export default class Node {
    constructor(block, name, type, isInput, isRest = false) {
        this.block = block;
        this.name = name;
        this.type = type; // From TYPES
        this.isInput = isInput;
        this.pos = new Vec2(0,0); // Relative to block
        this.worldPos = new Vec2(0,0);
        this.value = null; // Default value if primitive
        this.isRest = isRest; // For ...params
        this.dropdownOptions = null; // If it's a struct/enum
    }

    getConnectedWires(graph) {
        return graph.wires.filter(w => (this.isInput ? w.inputNode : w.outputNode) === this);
    }
}