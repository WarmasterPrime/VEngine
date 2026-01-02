import Types from "./Types.mjs";

export const BLOCK_REGISTRY = [
	{
		category: "Events",
		name: "On Start",
		color: "#880000",
		inputs: [],
		outputs: [{ name: "Exec", type: Types.flow }],
	},
	{
		category: "Variables",
		name: "Set Number",
		color: "#006688",
		inputs: [
			{ name: "Exec", type: Types.flow },
			{ name: "Value", type: Types.number },
		],
		outputs: [
			{ name: "Exec", type: Types.flow },
			{ name: "Out", type: Types.number },
		],
	},
	{
		category: "Logic",
		name: "Branch (If)",
		color: "#555",
		inputs: [
			{ name: "Exec", type: Types.flow },
			{ name: "Condition", type: Types.boolean },
		],
		outputs: [
			{ name: "True", type: Types.flow },
			{ name: "False", type: Types.flow },
		],
	},
	{
		category: "Math",
		name: "Add",
		color: "#228822",
		inputs: [
			{ name: "A", type: Types.number },
			{ name: "B", type: Types.number },
		],
		outputs: [{ name: "Result", type: Types.number }],
	},
	{
		category: "Math",
		name: "Subtract",
		color: "#228822",
		inputs: [
			{ name: "A", type: Types.number },
			{ name: "B", type: Types.number },
		],
		outputs: [{ name: "Result", type: Types.number }],
	},
	{
		category: "Debug",
		name: "Print String",
		color: "#444",
		inputs: [
			{ name: "Exec", type: Types.flow },
			{ name: "Message", type: Types.string },
		],
		outputs: [{ name: "Exec", type: Types.flow }],
	},
	{
		category: "Utilities",
		name: "Format Text",
		color: "#880088",
		inputs: [
			{ name: "Format", type: Types.string },
			{ name: "Args", type: Types.any, isRest: true }, // Rest param example
		],
		outputs: [{ name: "Result", type: Types.string }],
	},
	{
		category: "Custom",
		name: "Custom Code",
		color: "#333",
		inputs: [{ name: "Exec", type: Types.flow }],
		outputs: [{ name: "Exec", type: Types.flow }],
		customCode: true, // Flag to open editor on dblclick
	},
];
