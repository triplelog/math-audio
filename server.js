const express = require('express')
const nunjucks = require('nunjucks')
const http = require('http');
const { Server } = require("socket.io");
const { SynthesizeSpeechCommand, StartSpeechSynthesisTaskCommand } = require("@aws-sdk/client-polly");
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
		Text: input,
		TextType: "text",
		VoiceId: "Matthew",
		SampleRate: "22050",
		Engine: "neural"
  	};
  	try {
		var result = await pollyClient.send(new SynthesizeSpeechCommand(params));
		//console.log("Success, audio file added to " + params.OutputS3BucketName);
		//var id = result.SynthesisTask.TaskId;
		//console.log(id);
		var ws = fs.createWriteStream('./audio/output2.mp3');
		result.AudioStream.pipe(ws);
		ws.on('finish', function() {
			console.log('output2');
			socket.emit('done','output2');
		})
		/*
		var result2 = await pollyClient.send(new SynthesizeSpeechCommand(paramsMarks));
		//var rs = fs.createReadStream();
		var ws = fs.createWriteStream('./marks/output.json');
		result2.AudioStream.pipe(ws);*/
		console.log("Done");
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