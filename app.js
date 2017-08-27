var http = require('http');
var qs = require('querystring');
var items = [];
function show(res){
	var html = '<html><head><title>To do List</title></head><body>'
			 + '<h1> Todo list </h1>'
			 + '<ul>'
			 + items.map(function(item){
			 	return '<li>' + item + '</li>'
			 }).join('')
			 + '</ul>'
			 + '<form method = "post" action = "/">'
			 + '<p><input type = "text" name = "item" /></p>'
			 + '<p><input type = "submit" value = "add item" /></p>'
			 + '</form></body></html>';
	res.setHeader('Content-type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.write(html);
	res.end();
}	
function notFound(res){
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Not found');
}
function badRequest(res){
	res.statusCode = 400;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Invalid Request');	
}
function add(req, res){
	var body = '';
	req.setEncoding('utf-8');
	req.on('data', function(chunk){
		body += chunk
	});
	req.on('end', function(){
		var obj = qs.parse(body);
		items.push(obj.item);
		show(res);
	})
}
var server = http.createServer(function(req, res){
	if('/' == req.url){
		switch(req.method){
			case 'GET':
				show(res);
				break;
			case 'POST':
				add(req, res);
				break;
			default:
				badRequest(res);
		}

	}else{
		notFound(res);
	}
});

server.listen(3000);