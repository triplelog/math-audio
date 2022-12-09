function mathToAudio(){
	var input = document.getElementById('textEntry').value;
	var cleaned = clean(input);
	var postfixed = postfixify(cleaned);
	console.log(postfixed);
	var audio = toAudio(postfixed);
	//TODO: remove consecutive spaces
    audio = audio.trim();
    audio = audio.replace(/\s+/g," ");
    audio = audio.replace(/}\s+/g,"}");
    console.log(audio);
    var idMap = {};
    var idLoc = -1;
    for (var i=0;i<audio.length;i++){
        if (audio[i] == "{"){
            idLoc = i;
        }
        else if (audio[i] == "}"){
            idMap[audio.substring(idLoc+1,i)]=idLoc;
            
            audio = audio.substring(0,idLoc)+audio.substring(i+1);
            i = idLoc-1;
            idLoc = -1;
        }
    }
	console.log(audio);
    console.log(idMap);
    var latex = toKatex(postfixed);
    console.log(latex);
    katex.render(latex, document.getElementById('result'), {
        throwOnError: false,
        trust: true,
        strict: "ignore"
    });
    var div = document.getElementById('result');
    console.log(div.querySelector('#id-1'));
	//socket.emit('toAudio',audio);
}

var socket = io();
socket.on('connect', (msg) => {
});
socket.on('done', (msg) => {
	console.log(msg);
    var audio = document.getElementById('audioSource');
    audio.src = "audio/"+msg+".mp3";
    document.getElementById('audioPlayback').load();
});

function toAudio(postfixList) {

    var stack = [];
    var stackIndex = 0;
    var currentId = 0;
    for (var i = 0; i < postfixList.length; i++) {
        var c = postfixList[i];
        if (prec[c]) {
            var fn = toAudioOp[c];
            if (fn) {
                var result = fn(stack, stackIndex, c, currentId);
                stack = result[0];
                stackIndex = result[1];
                currentId = result[2];
            } else {
                var lastPrec = prec[stack[stackIndex - 1].op];
                stack[stackIndex - 1].exp = " {"+currentId+"}"+c + " of " + stack[stackIndex - 1].exp + " ";
                stack[stackIndex - 1].op = c;
                currentId++;
            }
        } else if (c[0] == "\\") {
            var fn = toAudioOp[c.substring(1)];
            if (fn) {
                var result = fn(stack, stackIndex, c, currentId);
                stack = result[0];
                stackIndex = result[1];
                currentId = result[2];
            } else {
                if (c.length > 1 && c[1] == ":") {
                    stack[stackIndex - 1].exp = " {"+currentId+"}" + c.replace("\\:", "") + " of " + stack[stackIndex - 1].exp + " ";
                    stack[stackIndex - 1].op = '#';
                    currentId++;
                } else {
                    if (toAudioExp[c]) {
                        c = " {"+currentId+"}"+toAudioExp[c]+" ";
                        currentId++;
                    }
                    stack[stackIndex] = {
                        "exp": c,
                        "op": '#'
                    };
                    stackIndex++;
                }

            }
        } else {
            if (toAudioExp[c]) {
                c = " {"+currentId+"}"+toAudioExp[c]+" ";
                currentId++;
            } else if (isNumber(c)) {
                c = " {"+currentId+"}"+toNumberAudio(c)+" ";
                currentId++;
            }
            stack[stackIndex] = {
                "exp": c,
                "op": '#'
            };
            stackIndex++;
        }
    }
    return stack[0].exp;
}

function toNumberAudio(input){
	return " " + input + " ";
}

var toAudioOp = {};
toAudioOp["~"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-1].exp = " {"+currentId+"}negative one times "+stack[stackIndex - 1].exp;
	stack[stackIndex - 1].op = op;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["*"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" {"+currentId+"}times "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["+"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" {"+currentId+"}plus "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["-"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" {"+currentId+"}minus "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["/"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" {"+currentId+"}divided by "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toAudioOp["^"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" {"+currentId+"}to the power "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}

var toAudioExp = {};






function toKatex(postfixList) {

    var stack = [];
    var stackIndex = 0;
    var currentId = 0;
    for (var i = 0; i < postfixList.length; i++) {
        var c = postfixList[i];
        if (prec[c]) {
            var fn = toKatexOp[c];
            if (fn) {
                var result = fn(stack, stackIndex, c, currentId);
                stack = result[0];
                stackIndex = result[1];
                currentId = result[2];
            } else {
                var lastPrec = prec[stack[stackIndex - 1].op];
                stack[stackIndex - 1].exp = " \\htmlId{id-"+currentId+"}{"+c + "(" + stack[stackIndex - 1].exp + ")}";
                stack[stackIndex - 1].op = c;
                currentId++;
            }
        } else if (c[0] == "\\") {
            var fn = toKatexOp[c.substring(1)];
            if (fn) {
                var result = fn(stack, stackIndex, c, currentId);
                stack = result[0];
                stackIndex = result[1];
                currentId = result[2];
            } else {
                if (c.length > 1 && c[1] == ":") {
                    stack[stackIndex - 1].exp = " \\htmlId{id-"+currentId+"}{" + c.replace("\\:", "") + "(" + stack[stackIndex - 1].exp + ")}";
                    stack[stackIndex - 1].op = '#';
                    currentId++;
                } else {
                    if (toKatexExp[c]) {
                        c = " \\htmlId{id-"+currentId+"}{"+toKatexExp[c]+"} ";
                        currentId++;
                    }
                    stack[stackIndex] = {
                        "exp": c,
                        "op": '#'
                    };
                    stackIndex++;
                }

            }
        } else {
            if (toKatexExp[c]) {
                c = " \\htmlId{id-"+currentId+"}{"+toKatexExp[c]+"} ";
                currentId++;
            } else if (isNumber(c)) {
                c = " \\htmlId{id-"+currentId+"}{"+toNumberAudio(c)+"} ";
                currentId++;
            }
            stack[stackIndex] = {
                "exp": c,
                "op": '#'
            };
            stackIndex++;
        }
    }
    return stack[0].exp;
}

var toKatexOp = {};
toKatexOp["~"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-1].exp = " \\htmlId{id-"+currentId+"}{-1*("+stack[stackIndex - 1].exp+")}";
	stack[stackIndex - 1].op = op;
    currentId++;
	return [stack, stackIndex,currentId];
}
toKatexOp["*"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = "("+stack[stackIndex - 2].exp+")\\htmlId{id-"+currentId+"}{\\cdot}("+stack[stackIndex - 1].exp+")";
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toKatexOp["+"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = "("+stack[stackIndex - 2].exp+")\\htmlId{id-"+currentId+"}{+}("+stack[stackIndex - 1].exp+")";
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toKatexOp["-"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = "("+stack[stackIndex - 2].exp+")\\htmlId{id-"+currentId+"}{-}("+stack[stackIndex - 1].exp+")";
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toKatexOp["/"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = "\\frac{"+stack[stackIndex - 2].exp+"}{\\htmlId{id-"+currentId+"}{"+stack[stackIndex - 1].exp+"}}";
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}
toKatexOp["^"] = function(stack, stackIndex, op, currentId){
	stack[stackIndex-2].exp = "("+stack[stackIndex - 2].exp+")\\htmlId{id-"+currentId+"}{^{"+stack[stackIndex - 1].exp+"}}";
	stack[stackIndex - 2].op = op;
	stackIndex--;
    currentId++;
	return [stack, stackIndex,currentId];
}

var toKatexExp = {};