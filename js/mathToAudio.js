function mathToAudio(){
	var input = document.getElementById('textEntry').value;
	var cleaned = clean(input);
	var postfixed = postfixify(cleaned);
	console.log(postfixed);
	var audio = toAudio(postfixed);
	//TODO: remove consecutive spaces
    audio = audio.replace(/\s+/g," ");
	console.log(audio);
	socket.emit('toAudio',audio);
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
    for (var i = 0; i < postfixList.length; i++) {
        var c = postfixList[i];
        if (prec[c]) {
            var fn = toAudioOp[c];
            if (fn) {
                var result = fn(stack, stackIndex, c);
                stack = result[0];
                stackIndex = result[1];
            } else {
                var lastPrec = prec[stack[stackIndex - 1].op];
                stack[stackIndex - 1].exp = c + " of open parentheses " + stack[stackIndex - 1].exp + " close parentheses ";
                stack[stackIndex - 1].op = c;
            }
        } else if (c[0] == "\\") {
            var fn = toAudioOp[c.substring(1)];
            if (fn) {
                var result = fn(stack, stackIndex, c);
                stack = result[0];
                stackIndex = result[1];
            } else {
                if (c.length > 1 && c[1] == ":") {
                    stack[stackIndex - 1].exp = " " + c.replace("\\:", "") + " of open parentheses " + stack[stackIndex - 1].exp + " close parentheses ";
                    stack[stackIndex - 1].op = '#';
                } else {
                    if (toAudioExp[c]) {
                        c = toAudioExp[c];
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
                c = toAudioExp[c];
            } else if (isNumber(c)) {
                c = toNumberAudio(c);
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
toAudioOp["~"] = function(stack, stackIndex, op){
	stack[stackIndex-1].exp = " negative one times "+stack[stackIndex - 1].exp;
	stack[stackIndex - 1].op = op;
	return [stack, stackIndex];
}
toAudioOp["*"] = function(stack, stackIndex, op){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" times "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
	return [stack, stackIndex];
}
toAudioOp["+"] = function(stack, stackIndex, op){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" plus "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
	return [stack, stackIndex];
}
toAudioOp["-"] = function(stack, stackIndex, op){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" minus "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
	return [stack, stackIndex];
}
toAudioOp["/"] = function(stack, stackIndex, op){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" divided by "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
	return [stack, stackIndex];
}
toAudioOp["^"] = function(stack, stackIndex, op){
	stack[stackIndex-2].exp = stack[stackIndex - 2].exp+" to the power "+stack[stackIndex - 1].exp;
	stack[stackIndex - 2].op = op;
	stackIndex--;
	return [stack, stackIndex];
}

var toAudioExp = {};