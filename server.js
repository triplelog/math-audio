const express = require('express')
const nunjucks = require('nunjucks')
const http = require('http');
const { Server } = require("socket.io");
const { SynthesizeSpeechCommand, StartSpeechSynthesisTaskCommand } = require("@aws-sdk/client-polly");
const { Readable } = require('stream');
const { pollyClient } = require("./libs/pollyClient.js");
const fs = require('fs');
const app = express()
const server = http.createServer(app);
const io = new Server(server);
const port = 3015;

// Create the parameters

var paramsMarks = {
	OutputFormat: "json",
	OutputS3BucketName: "math-audio",
	Text: "The derivative of cosine is negative sine",
	TextType: "text",
	VoiceId: "Matthew",
	SampleRate: "22050",
	Engine: "neural",
	SpeechMarkTypes: ["word"]
  };

const run = async (input,socket) => {
	var params = {
		OutputFormat: "mp3",
		OutputS3BucketName: "math-audio",
		Text: ""+input.text,
		TextType: "ssml",
		VoiceId: input.voice,
		SampleRate: "24000",
		Engine: "neural"
  	};
	var paramsMarks = {
		OutputFormat: "json",
		OutputS3BucketName: "math-audio",
		Text: input.text,
		TextType: "ssml",
		VoiceId: input.voice,
		SampleRate: "24000",
		Engine: "neural",
		SpeechMarkTypes: ["word"]
	};
  	try {
		var bothDone = 0;
		var jsonMessage = {offset:input.offset,filename:input.filename};
		var result = await pollyClient.send(new SynthesizeSpeechCommand(params));
		//console.log("Success, audio file added to " + params.OutputS3BucketName);
		//var id = result.SynthesisTask.TaskId;
		//console.log(id);
		var ws = fs.createWriteStream('./audio/'+input.filename+'.mp3');
		result.AudioStream.pipe(ws);
		ws.on('finish', function() {
			bothDone++;
			if (bothDone > 1){
				socket.emit('done',jsonMessage);
			}
		})
		
		var result2 = await pollyClient.send(new SynthesizeSpeechCommand(paramsMarks));
		//var rs = fs.createReadStream();
		const readable = Readable.from(result2.AudioStream, {encoding: 'utf8'});

		var timings = "[";
		readable.on('data', function(chunk) {
			timings += chunk+"\n";
		})
		readable.on('end', function() {
			timings = timings.trim()+"]";
			var jsonOut = timings.replace(/\n+/g,",");
			jsonMessage['timings'] = JSON.parse(jsonOut);
			bothDone++;
			if (bothDone > 1){
				socket.emit('done',jsonMessage);
			}
			
		})
		//var ws = fs.createWriteStream('./marks/output.json');
		//result2.AudioStream.pipe(ws);
		//console.log("Done");
  	}
	catch (err) {
    	console.log("Error putting object", err);
		return false;
  	}
};

app.use("/audio", express.static('./audio'));
app.use("/", express.static('./js'));

app.get('/', function(req,res) {
	var html = nunjucks.render('polly.html',{});
	res.send(html);
})

io.on('connection', (socket) => {
	console.log('connected');
	socket.on('toAudio', (msg) => {
		console.log(msg);
		//socket.emit('done','output2');
		run(msg,socket);
	})
})

server.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})