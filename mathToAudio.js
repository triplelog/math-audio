function mathToAudio(){
	var input = document.getElementById('textEntry').value;
	var cleaned = clean(input);
	console.log(cleaned);
	var postfixed = postfixify(cleaned);
	console.log(postfixed);
}