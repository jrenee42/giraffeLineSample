This is an example giraffe app for a lineplot,  using a query grabbed from the influxdata dashboard (via the network tab).

This README is in progress.

started on 12/29/2020





Prerequisites:

   1.a working, running  influxdata server.  it can be on your machine or on the cloud, it doesn't matter.
   2. node


Steps:

1) get your influxdata server up and running,  have at least one cell in a dashboard up and running and displaying a line graph
   A. note the url for the server; for example:
       https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/query

       or

       http://kubernetes.docker.internal:8080/api/v2/query

   B.  go to the network tab, and .....(TODO)
       find a query,
       save as a 'fetch' command,
       then un-escape the json.

       you can do that via pasting the result you just got into an unescaper, like here:
       https://www.freeformatter.com/json-escape.html#ad-output

       save this query.

  C.  create a token, and get the orgId  (add in gifs..TODO)


2)  set up your proxy server:  these instructions are from https://www.twilio.com/blog/node-js-proxy-server

    in this repo, create a folder called 'proxy'.  cd into it.

   A.  initiate a new node project and add dependencies:
       ```
       yarn init
       
       yarn add express http-proxy-middleware morgan
       ```

   B.  set up the start command
       make sure the package.json in the proxy dir has this start script; which is nestled in the proxy block.
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

  C.  copy the proxIndex to index.js in the proxy directory.



3) set up the client.
    create-react-app  (TODO put in exact command)

   copy clientApp.js to App.js in the src directory

 
  
     
   
    
    