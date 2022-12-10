
function toNumberAudio(input){
	return " " + input + " ";
}

var toAudioOp = {};
toAudioOp["~"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-1].audio = " {"+currentId+"}negative "+stack[stackIndex - 1].audio;
	var lastPrec = prec[stack[stackIndex - 1].op];
	if (lastPrec && lastPrec <= prec[op]){
    	stack[stackIndex-1].katex = " \\htmlId{id-"+currentId+"}{-\\left("+stack[stackIndex - 1].katex+"\\right)}";
	}
	else {
		stack[stackIndex-1].katex = " \\htmlId{id-"+currentId+"}{-"+stack[stackIndex - 1].katex+"}";
	}
    stack[stackIndex-1].pf.push("~");
	stack[stackIndex - 1].op = op;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["*"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}times "+stack[stackIndex - 1].audio;
	console.log(JSON.stringify(stack));
	var lastPrec = prec[stack[stackIndex - 2].op];
	console.log(lastPrec,op,prec[op])
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex = "\\htmlId{id-"+stack[stackIndex - 2].lci+"}{\\left("+stack[stackIndex - 2].katex+"\\right)}\\htmlId{id-"+currentId+"}{\\cdot";
	}
	else {
		stack[stackIndex-2].katex = stack[stackIndex - 2].katex+"\\htmlId{id-"+currentId+"}{\\cdot";
	}
	lastPrec = prec[stack[stackIndex - 1].op];
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex += "\\left("+stack[stackIndex - 1].katex+"\\right)}";
	}
	else {
		stack[stackIndex-2].katex += stack[stackIndex - 1].katex+"}";
	}
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["+"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}plus "+stack[stackIndex - 1].audio;
	var lastPrec = prec[stack[stackIndex - 2].op];
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex = "\\htmlId{id-"+stack[stackIndex - 2].lci+"}{\\left("+stack[stackIndex - 2].katex+"\\right)}\\htmlId{id-"+currentId+"}{+";
	}
	else {
		stack[stackIndex-2].katex = stack[stackIndex - 2].katex+"\\htmlId{id-"+currentId+"}{+";
	}
	lastPrec = prec[stack[stackIndex - 1].op];
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex += "\\left("+stack[stackIndex - 1].katex+"\\right)}";
	}
	else {
		stack[stackIndex-2].katex += stack[stackIndex - 1].katex+"}";
	}
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["-"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}minus "+stack[stackIndex - 1].audio;
	var lastPrec = prec[stack[stackIndex - 2].op];
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex = "\\htmlId{id-"+stack[stackIndex - 2].lci+"}{\\left("+stack[stackIndex - 2].katex+"\\right)}\\htmlId{id-"+currentId+"}{-";
	}
	else {
		stack[stackIndex-2].katex = stack[stackIndex - 2].katex+"\\htmlId{id-"+currentId+"}{-";
	}
	lastPrec = prec[stack[stackIndex - 1].op];
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex += "\\left("+stack[stackIndex - 1].katex+"\\right)}";
	}
	else {
		stack[stackIndex-2].katex += stack[stackIndex - 1].katex+"}";
	}
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
toAudioOp["frac"] = function(stack, stackIndex, op, currentId){
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
	var lastPrec = prec[stack[stackIndex - 2].op];
	if (lastPrec && lastPrec < prec[op]){
		stack[stackIndex-2].katex = "\\htmlId{id-"+stack[stackIndex - 2].lci+"}{\\left("+stack[stackIndex - 2].katex+"\\right)}\\htmlId{id-"+currentId+"}{^{";
	}
	else {
		stack[stackIndex-2].katex = stack[stackIndex - 2].katex+"\\htmlId{id-"+currentId+"}{^{";
	}
	stack[stackIndex-2].katex += stack[stackIndex - 1].katex+"}}";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}

var toAudioExp = {};





