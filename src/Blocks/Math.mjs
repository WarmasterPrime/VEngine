import BlockElement from "../Block.mjs";
import Types from "../Types.mjs";

export default class Math extends BlockElement {
	
	constructor() {
        super();
    }
	
    init() {
        this.title = "Addition";
        this.headerColor = "#228b22";
        this.addInput("A", Types.number);
        this.addInput("B", Types.number);
        this.addOutput("Sum", Types.number);
    }
    
    static {
		this.ini();
	}
    
}
