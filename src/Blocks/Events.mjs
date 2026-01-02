import BlockElement from "../Block.mjs";
import Types from "../Types.mjs";

export default class Events extends BlockElement {
    
	constructor() {
		super();
	}

	init() {
		this.title = "On Start";
		this.headerColor = "#8b0000";
		this.addOutput("Out", Types.flow);
	}

	static {
		this.ini();
	}
}
