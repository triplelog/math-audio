
function toNumberAudio(input){
	return " " + input + " ";
}

var toAudioOp = {};
toAudioOp["~"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-1].audio = " {"+currentId+"}negative "+stack[stackIndex - 1].audio+" ";
	var lastPrec = prec[stack[stackIndex - 1].op];
	if (lastPrec && lastPrec <= prec[op]){
    	stack[stackIndex-1].katex = " \\htmlId{id-"+currentId+"}{-\\left("+stack[stackIndex - 1].katex+"\\right)}";
	}
	else {
		stack[stackIndex-1].katex = " \\htmlId{id-"+currentId+"}{-"+stack[stackIndex - 1].katex+"}";
	}
    stack[stackIndex-1].pf.push("~");
	stack[stackIndex - 1].op = op;
	stack[stackIndex - 1].lci = currentId;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["*"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}times "+stack[stackIndex - 1].audio+" ";
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
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["+"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}plus "+stack[stackIndex - 1].audio+" ";
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
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["-"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}minus "+stack[stackIndex - 1].audio+" ";
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
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["/"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}divided by "+stack[stackIndex - 1].audio+" ";
	stack[stackIndex-2].katex = "\\frac{"+stack[stackIndex - 2].katex+"}{\\htmlId{id-"+currentId+"}{"+stack[stackIndex - 1].katex+"}}";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["frac"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}divided by "+stack[stackIndex - 1].audio+" ";
	stack[stackIndex-2].katex = "\\frac{"+stack[stackIndex - 2].katex+"}{\\htmlId{id-"+currentId+"}{"+stack[stackIndex - 1].katex+"}}";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["^"] = function(stack, stackIndex, op, currentId){
	
	if (stack[stackIndex - 1].pf.length == 1 && stack[stackIndex - 1].pf[0] == "2"){
		stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}squared ";
	}
	else if (stack[stackIndex - 1].pf.length == 1 && stack[stackIndex - 1].pf[0] == "3"){
		stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}cubed ";
	}
	else {
		stack[stackIndex-2].audio = stack[stackIndex - 2].audio+" {"+currentId+"}to the power "+stack[stackIndex - 1].audio+" ";
	}
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
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["!"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-1].audio = stack[stackIndex - 1].audio+" {"+currentId+"}factorial ";
	var lastPrec = prec[stack[stackIndex - 1].op];
	if (lastPrec && lastPrec < prec[op]){
    	stack[stackIndex-1].katex = "\\htmlId{id-"+stack[stackIndex - 1].lci+"}{\\left("+stack[stackIndex - 1].katex+"\\right)}\\htmlId{id-"+currentId+"}{!}";
	}
	else {
		stack[stackIndex-1].katex = stack[stackIndex - 1].katex+"\\htmlId{id-"+currentId+"}{!}";
	}
    stack[stackIndex-1].pf.push(op);
	stack[stackIndex - 1].op = op;
	stack[stackIndex - 1].lci = currentId;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp[","] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].audio = stack[stackIndex - 2].audio+", "+stack[stackIndex - 1].audio;
	stack[stackIndex-2].katex = stack[stackIndex - 2].katex+", "+stack[stackIndex - 1].katex+"";
	
    stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    stack[stackIndex-2].pf.push(op);
    stack[stackIndex - 2].op = op;
	stack[stackIndex - 2].ops = [stack[stackIndex - 2].op, stack[stackIndex - 1].op];
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["sqrt"] = function(stack, stackIndex, op, currentId){
	var lastPrec = prec[stack[stackIndex - 1].op];
	if (stack[stackIndex-1].op == ","){
		var split = stack[stackIndex - 1].katex.split(",");
		var splita = stack[stackIndex - 1].audio.split(",");
		if (split.length == 2 && splita.length == 2){
			stack[stackIndex-1].katex = "\\htmlId{id-"+currentId+"}{\\sqrt["+split[0]+"]{"+split[1]+"}}";
			stack[stackIndex-1].audio = " {"+currentId+"}the root base "+splita[0]+" of "+splita[1]+" ";
		}
		else {
			stack[stackIndex-1].katex = "\\htmlId{id-"+currentId+"}{\\sqrt{"+stack[stackIndex-1].katex+"}}";
			stack[stackIndex-1].audio = " {"+currentId+"}the square root of "+stack[stackIndex-1].audio+" ";
		}
	}
	else {
		stack[stackIndex-1].katex = "\\htmlId{id-"+currentId+"}{\\sqrt{"+stack[stackIndex-1].katex+"}}";
		stack[stackIndex-1].audio = " {"+currentId+"}the square root of "+stack[stackIndex-1].audio+" ";
	}
	
    stack[stackIndex-1].pf.push(op);
	stack[stackIndex - 1].op = op;
	stack[stackIndex - 1].lci = currentId;
    currentId++;
	return [stack, stackIndex,currentId];
}

toAudioOp["pow"] = function(stack, stackIndex, op, currentId){
	var splitk = stack[stackIndex-1].katex.split(",");
	var splita = stack[stackIndex-1].audio.split(",");
	if (splitk.length == 2 && splita.length == 2){
		var mTwo = stack[stackIndex - 1].pf.length-2;
		var power = false;
		if (mTwo >=0){
			power = stack[stackIndex - 1].pf[mTwo];
			if (power == "2"){
				power = "squared";
				stack[stackIndex-1].audio = splita[0]+" {"+currentId+"}squared ";
			}
			else if (power == "3"){
				power = "cubed";
				stack[stackIndex-1].audio = splita[0]+" {"+currentId+"}cubed ";
			}
			else {
				power = false;
			}
		}
		if (!power){
			stack[stackIndex-1].audio = splita[0]+" {"+currentId+"}to the power "+splita[1]+" ";
		}
		var lastPrec = prec[stack[stackIndex - 1].op];
		if (stack[stackIndex - 1].ops && stack[stackIndex - 1].ops.length == 2) {
			lastPrec = prec[stack[stackIndex - 1].ops[0]];
		}
		if (lastPrec && lastPrec < prec['^']) {
			stack[stackIndex - 1].katex = "\\htmlId{id-"+stack[stackIndex - 1].lci+"}{\\left(" + splitk[0] + "\\right)}\\htmlId{id-"+currentId+"}{^{";
		} else {
			stack[stackIndex - 1].katex = splitk[0] + "\\htmlId{id-"+currentId+"}{^{";
		}
		stack[stackIndex-1].katex += splitk[1]+"}}";
	}
	
	
    stack[stackIndex-1].pf.push(op);
    stack[stackIndex - 1].op = op;
	stack[stackIndex - 1].lci = currentId;
    currentId++;
	return [stack, stackIndex,currentId];
}
var logfns = ['log', 'loglog', 'logloglog'];
for (var i = 0; i < logfns.length; i++) {
    toAudioOp[logfns[i]] = function(stack, stackIndex, op, currentId) {
        
        if (op == "loglog") {
            op = "log\\log";
        } else if (op == "logloglog") {
            op = "log\\log\\log";
        }
		if (stack[stackIndex - 2].pf.length == 1 && stack[stackIndex - 2].pf[0] == "e") {
			if (op == "log") {
				op = "ln";
			}
			stack[stackIndex - 2].katex = "\\htmlId{id-"+currentId+"}{\\" + op + "{(" + stack[stackIndex - 1].katex + ")}}";
			if (op == "ln") {
				op = "natural log";
			};
			stack[stackIndex - 2].audio = " {"+currentId+"}the "+op+" of " + stack[stackIndex - 1].audio + " ";
		}
		else {
			stack[stackIndex - 2].katex = "\\htmlId{id-"+currentId+"}{\\" + op + "_{" + stack[stackIndex - 2].katex + "}{(" + stack[stackIndex - 1].katex + ")}}";
			
			stack[stackIndex - 2].audio = " {"+currentId+"}the "+op+" base "+stack[stackIndex - 2].audio+" of " + stack[stackIndex - 1].audio + " ";
		
		}

        stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    	stack[stackIndex-2].pf.push(op);
    	stack[stackIndex - 2].op = 'log';
		stack[stackIndex - 2].lci = currentId;
		stackIndex--;
    	currentId++;
		return [stack, stackIndex,currentId];
    }
}
var toAudioExp = {};





