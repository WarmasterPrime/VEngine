export default class Graph {
    constructor() {
        this.blocks = [];
        this.wires = [];
        this.idCounter = 0;
    }
    /**
     * 
     * @param {Block} block 
     * @returns {Block}
     */
    addBlock(block) {
        block.id = ++this.idCounter;
        this.blocks.push(block);
        return block;
    }

    removeBlock(block) {
        // Disconnect all wires
        this.wires = this.wires.filter(w => {
            if(w.inputNode.block === block || w.outputNode.block === block) {
                // Logic to cleanup duplicates for rest params would go here
                return false;
            }
            return true;
        });
        this.blocks = this.blocks.filter(b => b !== block);
    }
}