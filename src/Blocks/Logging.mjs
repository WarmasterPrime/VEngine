import BlockElement from "../Block.mjs";
import Types from "../Types.mjs";

export default class Logging extends BlockElement {
	
	constructor() {
        super();
    }
	
    init() {
        this.title = "Console Log";
        this.headerColor = "#444";
        this.addInput("In", Types.flow);
        this.addInput("Message", Types.string);
        this.addOutput("Out", Types.flow);
    }
    
    static {
		this.ini();
	}
    
}
