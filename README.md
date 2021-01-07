This is an example giraffe app for a lineplot,  using a query grabbed from the influxdata dashboard (via the network tab).

This README is in progress.

started on 12/29/2020





Prerequisites:

   1. a working, running  influxdata server.  it can be on your machine or on the cloud, it doesn't matter.
   2. node


Steps:

1) get your influxdata server up and running,  have at least one cell in a dashboard up and running and displaying a line graph
   A. note the url for the server; for example; either of these:

```
       https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/query
       https://kubernetes.docker.internal:8080/api/v2/query

      Note that the local server is using https and not http 

   B.  go to your server, and note the orgId:
        the url will be something like this:
	```
	https://kubernetes.docker.internal:8080/orgs/xxyy88a

whatever is after the "orgs/"; that is your orgId.  in this case, xxyy88a

copy this orgId into the 'index.js' file in the proxy directory; on line 39 overwrite the string with this new value.

   C.  get and paste in the token.
        i) make the token (part 1):
	    go to Data (on the left nav menu), then the "Tokens" Tab; and press the "Generate" dropdown button on the right; select the "all Access token"
	ii) a dialog will pop up, give it a name in the form, and click "save"
	iii) click on the just-created token, a dialog will pop up, and there will be a long string at the top of the dialog.  below that there will be a 'copy to clipboard button'.  press that button to copy the long token string to the clipboard
	iv) go to line 38 of index.js, and paste in the token you just copied over '<put-your-token-here>'.
	    leave the preamble "Token " there.
	    so if your token string is 'abcdefg=='  the line should be:
```javascript
const newToken = 'Token abcdefg==';
	    ```
	 save index.js
	    
   D. Decide what you want to do about ssl

    starting in late 2020/early 2021; the influxdata server is now uses a certificate for ssl.

    Therefore,  the proxy either needs to use the certificate for the server or ignore it.

    Currently, the proxy is setup to ignore it; using this code:

```javascript
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});
```
 and the agent is passed into the proxy.

 there is instructions in index.js about how to use a certificate instead; details are at:
 https://stackoverflow.com/questions/51363855/how-to-configure-axios-to-use-ssl-certificate


   E.  get a query:

        i) go to a dashboard, or to the explorer, and make a line graph
	   you may need to set the data time period to the last week .

         a good default is:  defbuck->docker_container_cpu ->usage_percent
	    then click "submit"

          you should see a graph.  don't go to the next step til you can see something
	  (see screen shot; 3:05pm; 12/29)

       ii) go to the network tab in the developer tools
            find a line that says 'query'; right click on it, select "Copy"-> "Copy as fetch"

it will look something like this:
fetch("https://kubernetes.docker.internal:8080/api/v2/query?orgID=196bd810109198d1", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://kubernetes.docker.internal:8080/orgs/196bd810109198d1/dashboards/06be601e99448000/cells/06be603b49c48000/edit",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"query\":\"from(bucket: \\\"defbuck\\\")\\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\\n  |> filter(fn: (r) => r[\\\"_measurement\\\"] == \\\"docker_container_cpu\\\")\\n  |> filter(fn: (r) => r[\\\"_field\\\"] == \\\"usage_percent\\\")\\n  |> filter(fn: (r) => r[\\\"com.docker.compose.config-hash\\\"] == \\\"6e9622da18d4404986de0d8ba44b307ee40b98e339102f801ae6b7855884884b\\\" or r[\\\"com.docker.compose.config-hash\\\"] == \\\"5cbccd84b5d78036ead529b15714b7faf428d8f6b5821487ac83b3b80fda9333\\\" or r[\\\"com.docker.compose.config-hash\\\"] == \\\"466cd0e7c4e4fd146d33f1d07d7e8b539a6c65824491117627eefaab7fa890d9\\\" or r[\\\"com.docker.compose.config-hash\\\"] == \\\"1d14622fcfadd38626f13755974298715c69e67af51bdc0164dd46e2cc6cf344\\\" or r[\\\"com.docker.compose.config-hash\\\"] == \\\"b0d04666d8916f9b574091ab3eef58366cfb79c9132d3eecfd7d1aa657af1858\\\" or r[\\\"com.docker.compose.config-hash\\\"] == \\\"b40fff5de7767100314e30cc77e455877fc0913d1d0171e13be049bf1061dfbb\\\")\\n  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)\\n  |> yield(name: \\\"mean\\\")\",\"extern\":{\"type\":\"File\",\"package\":null,\"imports\":null,\"body\":[{\"type\":\"OptionStatement\",\"assignment\":{\"type\":\"VariableAssignment\",\"id\":{\"type\":\"Identifier\",\"name\":\"v\"},\"init\":{\"type\":\"ObjectExpression\",\"properties\":[{\"type\":\"Property\",\"key\":{\"type\":\"Identifier\",\"name\":\"timeRangeStart\"},\"value\":{\"type\":\"UnaryExpression\",\"operator\":\"-\",\"argument\":{\"type\":\"DurationLiteral\",\"values\":[{\"magnitude\":7,\"unit\":\"d\"}]}}},{\"type\":\"Property\",\"key\":{\"type\":\"Identifier\",\"name\":\"timeRangeStop\"},\"value\":{\"type\":\"CallExpression\",\"callee\":{\"type\":\"Identifier\",\"name\":\"now\"}}},{\"type\":\"Property\",\"key\":{\"type\":\"Identifier\",\"name\":\"windowPeriod\"},\"value\":{\"type\":\"DurationLiteral\",\"values\":[{\"magnitude\":1800000,\"unit\":\"ms\"}]}}]}}}]},\"dialect\":{\"annotations\":[\"group\",\"datatype\",\"default\"]}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});


    take the "query" part, and un-escape the json.

       you can do that via pasting the result you just got into an unescaper, like here:
       https://www.freeformatter.com/json-escape.html#ad-output

the result for above:; using the website posted above (it may take a few minutes, be patient)

{"query":"from(bucket: \"defbuck\")\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  |> filter(fn: (r) => r[\"_measurement\"] == \"docker_container_cpu\")\n  |> filter(fn: (r) => r[\"_field\"] == \"usage_percent\")\n  |> filter(fn: (r) => r[\"com.docker.compose.config-hash\"] == \"6e9622da18d4404986de0d8ba44b307ee40b98e339102f801ae6b7855884884b\" or r[\"com.docker.compose.config-hash\"] == \"5cbccd84b5d78036ead529b15714b7faf428d8f6b5821487ac83b3b80fda9333\" or r[\"com.docker.compose.config-hash\"] == \"466cd0e7c4e4fd146d33f1d07d7e8b539a6c65824491117627eefaab7fa890d9\" or r[\"com.docker.compose.config-hash\"] == \"1d14622fcfadd38626f13755974298715c69e67af51bdc0164dd46e2cc6cf344\" or r[\"com.docker.compose.config-hash\"] == \"b0d04666d8916f9b574091ab3eef58366cfb79c9132d3eecfd7d1aa657af1858\" or r[\"com.docker.compose.config-hash\"] == \"b40fff5de7767100314e30cc77e455877fc0913d1d0171e13be049bf1061dfbb\")\n  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)\n  |> yield(name: \"mean\")","extern":{"type":"File","package":null,"imports":null,"body":[{"type":"OptionStatement","assignment":{"type":"VariableAssignment","id":{"type":"Identifier","name":"v"},"init":{"type":"ObjectExpression","properties":[{"type":"Property","key":{"type":"Identifier","name":"timeRangeStart"},"value":{"type":"UnaryExpression","operator":"-","argument":{"type":"DurationLiteral","values":[{"magnitude":7,"unit":"d"}]}}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStop"},"value":{"type":"CallExpression","callee":{"type":"Identifier","name":"now"}}},{"type":"Property","key":{"type":"Identifier","name":"windowPeriod"},"value":{"type":"DurationLiteral","values":[{"magnitude":1800000,"unit":"ms"}]}}]}}}]},"dialect":{"annotations":["group","datatype","default"]}}


take the above escaped query, and paste this over the current query in line 38 of index.js in the proxy directory.



2)  set up your proxy server:  these instructions are from https://www.twilio.com/blog/node-js-proxy-server

    cd  into the proxy folder.

   A.  initiate a new node project and add dependencies:
       ```
       yarn init
       
       yarn add express http-proxy-middleware morgan
       ```

   B.  set up the start command
       make sure the package.json  in the proxy dir has this start script; which is nestled in the proxy block.
      (including entire block for clarity, you should only have to add the 'scripts' portion.  the rest should be approximately the same; version numbers may be different)

   ```
   {
 "name": "simple-nodejs-proxy",
 "version": "1.0.0",
 "main": "index.js",
 "license": "MIT",
 "dependencies": {
   "express": "^4.17.1",
   "http-proxy-middleware": "^1.0.5",
   "morgan": "^1.10.0"
 },
 "scripts": {
   "start": "node index.js"
 }
}
```

   C.  start it with the command: 'yarn start'
   D.  test it; goto:  http://localhost:3000/info in your browser.
      you should see the message: 'This is a proxy service which proxies APIs for giraffe development.'
      if so, your proxy is up and running!
	


3) set up the client and use it:
    the client dir was created with create-react-app.

    cd into the client directory, then:

     A.  install needed packages:
         %npm install

     B.  start the client:
        %npm start

         allow it to start on a port other than 3000
	 and click 'yes' when the terminal asks you about permissions.


     depending on your configuration, a browser may be launched with the new page.

    if not, bring up localhost on the new port; ie:

http://localhost:3001/

then, click the 'fetch' button.  you should next see a graph  displaying data, the same one that you were able to see in the influxdata dashboard.


Congratulations!  you now have a giraffe sample app up and running.


  
     
   
    
    