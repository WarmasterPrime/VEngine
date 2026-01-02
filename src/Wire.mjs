export default class Wire {
    constructor(outputNode, inputNode) {
        this.outputNode = outputNode;
        this.inputNode = inputNode;
        this.isValid = true;
    }

    draw(ctx) {
        const start = this.outputNode.worldPos;
        const end = this.inputNode ? this.inputNode.worldPos : this.tempEnd;

        if (!end) return;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        // Bezier Curve Logic
        const dist = Math.abs(end.x - start.x) * 0.5;
        ctx.bezierCurveTo(
            start.x + dist,
            start.y,
            end.x - dist,
            end.y,
            end.x,
            end.y
        );

        ctx.lineWidth = 3; // Scalable line width would depend on camera zoom
        ctx.strokeStyle = this.isValid ? this.outputNode.type.color : "#ff0000";
        ctx.stroke();

        if (!this.isValid) {
            // Error Icon X
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            ctx.fillStyle = "red";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("✖", midX, midY);
        }
    }
}