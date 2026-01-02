import BlockElement from "../Block.mjs";
import Types from "../Types.mjs";

export default class Variable extends BlockElement {
	
	constructor() {
        super();
    }
	
    init() {
        this.title = "Set Variable";
        this.headerColor = "#005a8b";
        this.addInput("In", Types.flow);
        this.addInput("Value", Types.any);
        this.addOutput("Out", Types.flow);
    }
    
    static {
		this.ini();
	}
    
}
