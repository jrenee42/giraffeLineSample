const express = require('express');
const morgan = require("morgan");
const axios = require ('axios');
const https = require('https');

const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";

//decoupling so easier to swap out/use different servers
const localUrl = 'http://kubernetes.docker.internal:8080/api/v2/query' ;
const remoteUrl= "https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/query";

//point this to the server you are using
const API_SERVICE_URL= localUrl

// Logging
app.use(morgan('dev'));

// Info GET endpoint; use for testing to make sure the proxy is up and working!
app.get('/info', (req, res, next) => {
    res.send("This is a proxy service which proxies APIs for giraffe development.");
});

//allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const newToken = 'Token <put-your-token-here>';
const orgId = '<put your orgId here>';

//hack:  to get past the self-signed cert issue
const agent = new https.Agent({  
  rejectUnauthorized: false
});

const query= {"query":"from(bucket: \"defbuck\")\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  |> filter(fn: (r) => r[\"_measurement\"] == \"docker_container_cpu\")\n  |> filter(fn: (r) => r[\"_field\"] == \"usage_percent\")\n  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)\n  |> yield(name: \"mean\")","extern":{"type":"File","package":null,"imports":null,"body":[{"type":"OptionStatement","assignment":{"type":"VariableAssignment","id":{"type":"Identifier","name":"v"},"init":{"type":"ObjectExpression","properties":[{"type":"Property","key":{"type":"Identifier","name":"timeRangeStart"},"value":{"type":"UnaryExpression","operator":"-","argument":{"type":"DurationLiteral","values":[{"magnitude":1,"unit":"h"}]}}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStop"},"value":{"type":"CallExpression","callee":{"type":"Identifier","name":"now"}}},{"type":"Property","key":{"type":"Identifier","name":"windowPeriod"},"value":{"type":"DurationLiteral","values":[{"magnitude":10000,"unit":"ms"}]}}]}}}]},"dialect":{"annotations":["group","datatype","default"]}};

app.post('/giraffe_influxData',(req,res) => {

    axios({
	httpsAgent: agent,
	method: 'post',
	url: API_SERVICE_URL,
	params: {
	    'orgID': orgId 
	},
	headers: {
	    "Authorization": newToken,
	    'Content-Type': 'application/json'
	},
	data:query
    }).then(resp => {
	console.log('got response! ', resp);
	res.send(resp.data);
    }).catch(err => {
	console.log('have a problem; ', err);
	res.status(500).send('internal error');
    });
});

// Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
