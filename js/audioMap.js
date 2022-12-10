
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
	console.log(currentId);
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
var compsAudio = {};
compsAudio['∈'] = " is in ";
compsAudio['∉'] = " is not in ";
compsAudio['≠'] = " is not equal to ";
compsAudio['≠='] = " is not equal to ";
compsAudio['≤'] = " is less than or equal to ";
compsAudio['≥'] = " is greater than or equal to ";
compsAudio['±'] = " plus or minus ";
compsAudio['='] = " equals ";
compsAudio['=='] = " equals ";
compsAudio['==='] = " equals ";
comps['=='] = " = ";
comps['==='] = " = ";
comps['≠='] = "\\neq ";
for (var i in comps) {
    toAudioOp[i] = function(stack, stackIndex, op, currentId) {
        var lastPrec = prec[stack[stackIndex - 2].op];
		
        if (lastPrec && lastPrec < prec[op]) {
            stack[stackIndex - 2].katex = "\\htmlId{id-"+stack[stackIndex - 2].lci+"}{\\left(" + stack[stackIndex - 2].katex + "\\right)}\\htmlId{id-"+currentId+"}{" + comps[op]+"}";
        } else {
            stack[stackIndex - 2].katex = stack[stackIndex - 2].katex + "\\htmlId{id-"+currentId+"}{" + comps[op]+"}";
        }
        lastPrec = prec[stack[stackIndex - 1].op];
        if (lastPrec && lastPrec < prec[op]) {
            stack[stackIndex - 2].katex  += "\\htmlId{id-"+stack[stackIndex - 1].lci+"}{\\left(" + stack[stackIndex - 1].katex  + "\\right)}";
        } else {
            stack[stackIndex - 2].katex  += stack[stackIndex - 1].katex ;
        }

		stack[stackIndex - 2].audio = stack[stackIndex - 2].audio + " {"+currentId+"}"+compsAudio[op];
		stack[stackIndex - 2].audio += stack[stackIndex - 1].audio + " ";

        stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
    	stack[stackIndex-2].pf.push(op);
    	stack[stackIndex - 2].op = op;
		stack[stackIndex - 2].lci = currentId;
		stackIndex--;
    	currentId++;
        return [stack, stackIndex, currentId];
    }
}
var trig = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'sinh', 'cosh', 'tanh'];
var trigAudio = {};
trigAudio['sin']="sine";
trigAudio['cos']="cosine";
trigAudio['tan']="tangent";
trigAudio['csc']="cosecant";
trigAudio['sec']="secant";
trigAudio['cot']="cotangent";
trigAudio['sinh']="hyperbolic sine";
trigAudio['cosh']="hyperbolic cosine";
trigAudio['tanh']="hyberbolic tangent";
for (var i = 0; i < trig.length; i++) {
    toAudioOp[trig[i]] = function(stack, stackIndex, op,currentId) {
        var lastPrec = prec[stack[stackIndex - 1].op];
        if (stack[stackIndex - 1].op == "#") {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op + "{" + stack[stackIndex - 1].katex + "}}";
        } else {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op + "\\left(" + stack[stackIndex - 1].katex + "\\right)}";
        }
		stack[stackIndex - 1].audio = " {"+currentId+"}" + trigAudio[op] + " of " + stack[stackIndex - 1].audio + " ";
        
    	stack[stackIndex-1].pf.push(op);
    	stack[stackIndex - 1].op = op;
		stack[stackIndex - 1].lci = currentId;
    	currentId++;
        return [stack, stackIndex,currentId];
    }
}
var arctrig = ['arcsin', 'arccos', 'arctan', 'arcsinh', 'arccosh', 'arctanh', 'atan2'];
var arctrigAudio = {};
arctrigAudio['arcsin']="arcsine";
arctrigAudio['arccos']="arccosine";
arctrigAudio['arctan']="arctangent";
arctrigAudio['arcsinh']="hyperbolic arcsine";
arctrigAudio['arccosh']="hyperbolic arccosine";
arctrigAudio['arctanh']="hyberbolic arctangent";
arctrigAudio['atan2']="arctan two";
for (var i = 0; i < arctrig.length; i++) {
    toAudioOp[arctrig[i]] = function(stack, stackIndex, op,currentId) {
        if (stack[stackIndex - 1].op == "#") {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op.replace('arc','a') + "{" + stack[stackIndex - 1].katex + "}}";
        } else {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op.replace('arc','a') + "\\left(" + stack[stackIndex - 1].katex + "\\right)}";
        }
		stack[stackIndex - 1].audio = " {"+currentId+"}" + arctrigAudio[op] + " of " + stack[stackIndex - 1].audio + " ";
        
    	stack[stackIndex-1].pf.push(op);
    	stack[stackIndex - 1].op = op;
		stack[stackIndex - 1].lci = currentId;
    	currentId++;
        return [stack, stackIndex,currentId];
    }
}
toAudioOp['der'] = function(stack, stackIndex, op,currentId) {
    var lastPrec = prec[stack[stackIndex - 1].op];
    if (stack[stackIndex - 1].op == ",") {
        var split = stack[stackIndex - 1].katex.split(",");
		var splita = stack[stackIndex - 1].audio.split(",");
		if (split.length == 2 && splita.length == 2){
			stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\frac{\\mathrm{d}}{\\mathrm{d}" + split[1] + "}[" + split[0] + "]}";
			stack[stackIndex - 1].audio = " {"+currentId+"}the derivative with respect to " + splita[1] + " of " + splita[0] + " ";
		}
		else {
			stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\frac{\\mathrm{d}}{\\mathrm{d}x}[" + stack[stackIndex - 1].katex + "]}";
			stack[stackIndex - 1].audio = " {"+currentId+"}the derivative with respect to x of " + stack[stackIndex - 1].audio + " ";
		}
    } else {
		stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\frac{\\mathrm{d}}{\\mathrm{d}x}[" + stack[stackIndex - 1].katex + "]}";
		stack[stackIndex - 1].audio = " {"+currentId+"}the derivative with respect to x of " + stack[stackIndex - 1].audio + " ";
    }
    stack[stackIndex - 1].op = op;
	stack[stackIndex-1].pf.push(op);
	stack[stackIndex - 1].lci = currentId;
    currentId++;
    return [stack, stackIndex,currentId];
}
toAudioOp['int'] = function(stack, stackIndex, op,currentId) {
    var lastPrec = prec[stack[stackIndex - 1].op];
    if (stack[stackIndex - 1].op == ",") {
        var split = stack[stackIndex - 1].katex.split(",");
		var splita = stack[stackIndex - 1].audio.split(",");
        if (split.length == 4) {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\int_{" + split[2] + "}^{" + split[3] + "} \\!{" + split[0] + "} \\, \\mathrm{d}{" + split[1] + "}}";
			stack[stackIndex - 1].audio = " {"+currentId+"}the integral from " + splita[2] + " to " + splita[3] + " of " + splita[0] + " with respect to " + splita[1] + " ";
        }
		else if (split.length == 3) {
			stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\int_{" + split[2] + "}^{" + split[3] + "} \\!{" + split[0] + "} \\, \\mathrm{d}x}";
			stack[stackIndex - 1].audio = " {"+currentId+"}the integral from " + splita[2] + " to " + splita[3] + " of " + splita[0] + " with respect to x ";

        }
		else if (split.length == 2) {
			stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\int \\!{" + split[0] + "} \\, \\mathrm{d}{" + split[1] + "}}";
			stack[stackIndex - 1].audio = " {"+currentId+"}the integral of " + splita[0] + " with respect to " + splita[1] + " ";

        }
		else {
			stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\int \\!{" + stack[stackIndex - 1].katex + "} \\, \\mathrm{d}x}";
			stack[stackIndex - 1].audio = " {"+currentId+"}the integral of " + stack[stackIndex - 1].audio + " with respect to x ";

        }
    }
	else {
        stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\int \\!{" + stack[stackIndex - 1].katex + "} \\, \\mathrm{d}x}";
		stack[stackIndex - 1].audio = " {"+currentId+"}the integral of " + stack[stackIndex - 1].audio + " with respect to x ";

    }
    stack[stackIndex - 1].op = op;
	stack[stackIndex-1].pf.push(op);
	stack[stackIndex - 1].lci = currentId;
    currentId++;
    return [stack, stackIndex,currentId];
}

var spfns = ['sum', 'prod'];
for (var i = 0; i < spfns.length; i++) {
    toAudioOp[spfns[i]] = function(stack, stackIndex, op,currentId) {
		var opAudio = " the sum ";
		if (op = "prod"){
			opAudio = " the product ";
		}
        if (stack[stackIndex - 1].op == ",") {
            var split = stack[stackIndex - 1].katex.split(",");
			var splita = stack[stackIndex - 1].audio.split(",");
            if (split.length == 3) {
                stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op + "_{" + split[1] + "}^{" + split[2] + "} {" + split[0] + "}}";
				stack[stackIndex - 1].audio = " {"+currentId+"}" + opAudio + " from " + splita[1] + " to " + splita[2] + " of " + splita[0] + " ";

			}
			else if (split.length == 2) {
				stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op + "_{" + split[1] + "} {" + split[0] + "}}";
				stack[stackIndex - 1].audio = " {"+currentId+"}" + opAudio + " over " + splita[1] + " of " + splita[0] + " ";
            }
			else {
				stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op + " {" + stack[stackIndex - 1].katex + "}}";
				stack[stackIndex - 1].audio = " {"+currentId+"}" + opAudio + " of " + stack[stackIndex - 1].audio + " ";
            }
        }
		else {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\" + op + " {" + stack[stackIndex - 1].katex + "}}";
			stack[stackIndex - 1].audio = " {"+currentId+"}" + opAudio + " of " + stack[stackIndex - 1].audio + " ";
        }
        stack[stackIndex - 1].op = op;
		stack[stackIndex-1].pf.push(op);
		stack[stackIndex - 1].lci = currentId;
		currentId++;
        return [stack, stackIndex,currentId];
    }
}
toAudioOp['lim'] = function(stack, stackIndex, op,currentId) {
    if (stack[stackIndex - 1].op == ",") {
        var split = stack[stackIndex - 1].katex.split(",");
		var splita = stack[stackIndex - 1].audio.split(",");
        if (split.length == 4) {
            if (split[3].length > 0 && split[3].toLowerCase().indexOf('rig') >= 0) {
                stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\lim\\limits_{" + split[1] + "\\to " + split[2] + "^+}{" + split[0] + "}}";
				stack[stackIndex - 1].audio = "{"+currentId+"}the limit as " + splita[1] + " approaches " + splita[2] + " from the right of " + splita[0] + " ";
            }
			else if (split[3].length > 0 && split[3].toLowerCase().indexOf('lef') >= 0) {
				stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\lim\\limits_{" + split[1] + "\\to " + split[2] + "^-}{" + split[0] + "}}";
				stack[stackIndex - 1].audio = "{"+currentId+"}the limit as " + splita[1] + " approaches " + splita[2] + " from the left of " + splita[0] + " ";
            }
			else {
				stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\lim\\limits_{" + split[1] + "\\to " + split[2] + "^-}{" + split[0] + "}}";
				stack[stackIndex - 1].audio = "{"+currentId+"}the limit as " + splita[1] + " approaches " + splita[2] + " of " + splita[0] + " ";
            }

        }
		else if (split.length == 3) {
            stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\lim\\limits_{" + split[1] + "\\to " + split[2] + "^-}{" + split[0] + "}}";
			stack[stackIndex - 1].audio = "{"+currentId+"}the limit as " + splita[1] + " approaches " + splita[2] + " of " + splita[0] + " ";

        }
		else {
			stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\lim{" + stack[stackIndex-1].katex + "}}";
			stack[stackIndex - 1].audio = "{"+currentId+"}the limit of " + stack[stackIndex-1].audio + " ";

        }
    }
	else {
        stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\lim{" + stack[stackIndex-1].katex + "}}";
		stack[stackIndex - 1].audio = "{"+currentId+"}the limit of " + stack[stackIndex-1].audio + " ";
    }
    stack[stackIndex - 1].op = op;
	stack[stackIndex-1].pf.push(op);
	stack[stackIndex - 1].lci = currentId;
	currentId++;
    return [stack, stackIndex,currentId];
}

toAudioOp['mod'] = function(stack, stackIndex, op,currentId) {
    if (stack[stackIndex - 1].op == ",") {
        stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\mod(" + stack[stackIndex - 1].katex.replace(/,/g, ", ") + ")}";
        stack[stackIndex - 1].audio = stack[stackIndex - 1].katex.replace(/,/g, " {"+currentId+"}modulo ") + " ";
		stack[stackIndex - 1].op = op;
		stack[stackIndex-1].pf.push(op);
		stack[stackIndex - 1].lci = currentId;
    } else {
        stack[stackIndex - 2].katex = stack[stackIndex - 2].katex + "\\htmlId{id-"+currentId+"}{\\mod " + stack[stackIndex - 1].katex+"}";
		stack[stackIndex - 2].audio = stack[stackIndex - 2].audio + " {"+currentId+"}modulo " + stack[stackIndex - 1].audio+" ";
        stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
		stack[stackIndex-2].pf.push(op);
		stack[stackIndex - 2].op = op;
		stack[stackIndex - 2].lci = currentId;
        stackIndex--;
    }
	currentId++;
    return [stack, stackIndex,currentId];
}
toAudioOp['_'] = function(stack, stackIndex, op,currentId) {


	stack[stackIndex - 2].katex = stack[stackIndex - 2].katex + "\\htmlId{id-"+currentId+"}{_{" + stack[stackIndex - 1].katex+"}}";
	stack[stackIndex - 2].audio = stack[stackIndex - 2].audio + " {"+currentId+"}sub " + stack[stackIndex - 1].audio+" ";
	stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
	stack[stackIndex-2].pf.push(op);
	stack[stackIndex - 2].op = op;
	stack[stackIndex - 2].lci = currentId;
	stackIndex--;
	currentId++;

    return [stack, stackIndex,currentId];
}

toAudioOp['perm'] = function(stack, stackIndex, op,currentId) {
    if (stack[stackIndex - 1].op == ",") {
        stack[stackIndex - 1].katex = "\\htmlId{id-"+currentId+"}{\\mathrm{perm}(" + stack[stackIndex - 1].katex.replace(/,/g, ", ") + ")}";
        stack[stackIndex - 1].audio = " " + stack[stackIndex - 1].audio.replace(/,/g, " {"+currentId+"}permutation ") + " ";
        stack[stackIndex - 1].op = op;
		stack[stackIndex-1].pf.push(op);
		stack[stackIndex - 1].lci = currentId;
    }
	else {
        stack[stackIndex - 2].katex = "\\htmlId{id-"+currentId+"}{\\mathrm{perm}(" + stack[stackIndex - 2].katex + ", " + stack[stackIndex - 1].katex + ")}";
		stack[stackIndex - 2].audio = stack[stackIndex - 2].audio + " {"+currentId+"}permutation " + stack[stackIndex - 1].audio+" ";
		stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
		stack[stackIndex-2].pf.push(op);
		stack[stackIndex - 2].op = op;
		stack[stackIndex - 2].lci = currentId;
		stackIndex--;
    }
	currentId++;
    return [stack, stackIndex,currentId];
}
toAudioOp['comb'] = function(stack, stackIndex, op,currentId) {
    if (stack[stackIndex - 1].op == ",") {
        var split = stack[stackIndex - 1].katex.split(",");
		var splita = stack[stackIndex - 1].audio.split(",");
        if (split.length == 2) {
            stack[stackIndex - 1].katex = "{" + split[0] + "\\choose " + split[1] + "}";
			stack[stackIndex - 1].audio = " " + splita[0] + " choose " + splita[1] + " ";
            stack[stackIndex - 1].op = op;
			stack[stackIndex-1].pf.push(op);
			stack[stackIndex - 1].lci = currentId;
        }
		else {
            stack[stackIndex - 1].katex = "\\mathrm{comb}(" + stack[stackIndex - 1].katex.replace(/,/g, ", ") + ")";
            stack[stackIndex - 1].audio = " " + stack[stackIndex - 1].audio.replace(/,/g, " choose ") + " ";
			stack[stackIndex - 1].op = op;
			stack[stackIndex-1].pf.push(op);
			stack[stackIndex - 1].lci = currentId;
        }
    }
	else {
		
        stack[stackIndex - 2].katex = "{" + stack[stackIndex - 2].katex + "\\choose " + stack[stackIndex - 1].katex + "}";
		stack[stackIndex - 2].audio = " " + stack[stackIndex - 2].audio + " choose " + stack[stackIndex - 1].audio + " ";
		stack[stackIndex-2].pf = stack[stackIndex-2].pf.concat(stack[stackIndex-1].pf);
		stack[stackIndex-2].pf.push(op);
		stack[stackIndex - 2].op = op;
		stack[stackIndex - 2].lci = currentId;
		stackIndex--;
    }
    return [stack, stackIndex,currentId];
}

var toAudioExp = {};





