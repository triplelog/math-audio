/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/polly-examples.html.

Purpose:
polly.ts demonstrates how to convert text to speech using Amazon Polly,
and automatically upload an audio file of the speech to an
Amazon Simple Storage Service (Amazon S3) bucket.

Inputs (replace in code):
- BUCKET_NAME
- IDENTITY_POOL_ID

Running the code:
node polly_synthesize_to_s3.js
*/
// snippet-start:[Polly.JavaScript.general-examples.synthesizetos3_V3]
const { SynthesizeSpeechCommand, StartSpeechSynthesisTaskCommand } = require("@aws-sdk/client-polly");
const { pollyClient } = require("./libs/pollyClient.js");
const fs = require('fs');

// Create the parameters
var params = {
  OutputFormat: "mp3",
  OutputS3BucketName: "math-audio",
  Text: "The derivative of cosine is negative sine",
  TextType: "text",
  VoiceId: "Matthew",
  SampleRate: "22050",
  Engine: "neural"
};
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

const run = async () => {
  try {
    var result = await pollyClient.send(new SynthesizeSpeechCommand(params));
    //console.log("Success, audio file added to " + params.OutputS3BucketName);
	//var id = result.SynthesisTask.TaskId;
	//console.log(id);
	var ws = fs.createWriteStream('./output.mp3');
	result.AudioStream.pipe(ws);
	var result2 = await pollyClient.send(new SynthesizeSpeechCommand(paramsMarks));
	//var rs = fs.createReadStream();
	var ws = fs.createWriteStream('./output.json');
	result2.AudioStream.pipe(ws);
	console.log("Done");
  } catch (err) {
    console.log("Error putting object", err);
  }
};
run();

// snippet-end:[Polly.JavaScript.general-examples.synthesizetos3_V3]