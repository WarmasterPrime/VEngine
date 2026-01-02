
export default class Types {
	
	static s_flow = new Types('#ffffff', 'triangle');
	static s_string = new Types('#ff00cc', 'circle');
	static s_number = new Types('#00ccff', 'circle');
	static s_bool = new Types('#cc0000', 'circle');
	static s_any = new Types('#aaaaaa', 'square');
	static s_undefined = new Types('#f101f0', 'square');
	static s_object = new Types('#A0f101', 'square');
	
    static get flow() {return Types.s_flow;}
	static get string() {return Types.s_string;}
	static get number() {return Types.s_number;}
	static get bool() {return Types.s_bool;}
	static get boolean() {return Types.s_bool;}
	static get any() {return Types.s_any;}
	static get undefined() {return Types.s_undefined;}
	static get object() {return Types.s_object;}
	
	
	color;
	shape;
	
	constructor(color, shape) {
		this.color = color;
		this.shape = shape;
	}
	
};
