var katexDiv = document.getElementById('result');
var timings = [
    {
        "time": 24,
        "type": "word",
        "start": 0,
        "end": 1,
        "value": "1"
    },
    {
        "time": 287,
        "type": "word",
        "start": 2,
        "end": 6,
        "value": "plus"
    },
    {
        "time": 587,
        "type": "word",
        "start": 7,
        "end": 8,
        "value": "2"
    },
    {
        "time": 762,
        "type": "word",
        "start": 9,
        "end": 13,
        "value": "plus"
    },
    {
        "time": 1087,
        "type": "word",
        "start": 14,
        "end": 15,
        "value": "3"
    },
    {
        "time": 1300,
        "type": "word",
        "start": 16,
        "end": 21,
        "value": "times"
    },
    {
        "time": 1700,
        "type": "word",
        "start": 22,
        "end": 24,
        "value": "51"
    },
    {
        "time": 2249,
        "type": "word",
        "start": 25,
        "end": 30,
        "value": "minus"
    },
    {
        "time": 2624,
        "type": "word",
        "start": 31,
        "end": 32,
        "value": "4"
    },
    {
        "time": 2874,
        "type": "word",
        "start": 33,
        "end": 35,
        "value": "to"
    },
    {
        "time": 2974,
        "type": "word",
        "start": 36,
        "end": 39,
        "value": "the"
    },
    {
        "time": 3062,
        "type": "word",
        "start": 40,
        "end": 45,
        "value": "power"
    },
    {
        "time": 3387,
        "type": "word",
        "start": 46,
        "end": 47,
        "value": "2"
    }
];
var idMap = {};
var idTimings = {};
var audioEl = document.getElementById('audioPlayback');

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
    idMap = {};
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
    katex.render(latex, katexDiv, {
        throwOnError: false,
        trust: true,
        strict: "ignore"
    });
    for (var id in idMap){
        var el = katexDiv.querySelector('#id-'+id);
        if (el){
            el.style.opacity = "0.5";
        }
    }
	//socket.emit('toAudio',audio);
    var audio = document.getElementById('audioSource');
    audio.src = "audio/output2.mp3";
    audioEl.load();
}

function showKatex(id){
    var el = katexDiv.querySelector('#id-'+id);
    if (el){
        el.style.opacity = "1";
    }
}

function updateAudioTime(time){
    var ms = time*1000;
    for (var id in idTimings){
        if (idTimings[id] < ms + 100){
            showKatex(id);
            delete idTimings[id];
        }
    }
}
function playKatex(){
    idTimings = {};
    audioEl.currentTime = 0;
    for (var id in idMap){
        for (var i=timings.length-1;i>=0;i--){
            if (idMap[id] >= timings[i].start){
                var pctDone = 0;
                if ((idMap[id] > timings[i].start) && (timings[i].end > timings[i].start)){
                    pctDone = (idMap[id] - timings[i].start)/(timings[i].end - timings[i].start);
                }
                var nextTime = timings[i].time;
                if (i < timings.length-1){
                    nextTime = timings[i+1].time;
                }
                idTimings[id]=timings[i].time*(1-pctDone)+nextTime*pctDone;
                break;
            }
        }
    }
    audioEl.play();
}

var socket = io();
socket.on('connect', (msg) => {
});
socket.on('done', (msg) => {
	console.log(msg);
    var audio = document.getElementById('audioSource');
    audio.src = "audio/"+msg.name+".mp3";
    document.getElementById('audioPlayback').load();
    timings = msg.timings;
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