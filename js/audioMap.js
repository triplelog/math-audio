
function toNumberAudio(input){
	return " " + input + " ";
}

var toAudioOp = {};
toAudioOp["~"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-1].audio = " {"+currentId+"}negative one times "+stack[stackIndex - 1].audio;
    stack[stackIndex-1].katex = " \\htmlId{id-"+currentId+"}{-1*("+stack[stackIndex - 1].katex+")}";
    stack[stackIndex-1].pf.push("~");
	stack[stackIndex - 1].op = op;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["*"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}times "+stack[stackIndex - 1].audio;
	stack[stackIndex-2].katex = "("+stack[stackIndex - 2].katex+")\\htmlId{id-"+currentId+"}{\\cdot}("+stack[stackIndex - 1].katex+")";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["+"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}plus "+stack[stackIndex - 1].audio;
	stack[stackIndex-2].katex = "("+stack[stackIndex - 2].katex+")\\htmlId{id-"+currentId+"}{+}("+stack[stackIndex - 1].katex+")";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["-"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}minus "+stack[stackIndex - 1].audio;
	stack[stackIndex-2].katex = "("+stack[stackIndex - 2].katex+")\\htmlId{id-"+currentId+"}{-}("+stack[stackIndex - 1].katex+")";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["/"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}divided by "+stack[stackIndex - 1].audio;
	stack[stackIndex-2].katex = "\\frac{"+stack[stackIndex - 2].katex+"}{\\htmlId{id-"+currentId+"}{"+stack[stackIndex - 1].katex+"}}";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["^"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}to the power "+stack[stackIndex - 1].audio;
	stack[stackIndex-2].katex = "("+stack[stackIndex - 2].katex+")\\htmlId{id-"+currentId+"}{^{"+stack[stackIndex - 1].katex+"}}";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}

var toAudioExp = {};





