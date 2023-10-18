/**
 * Thanks : Arthur Vercruysse & Jesse Wright
 */
const fs = require("fs");
const http = require("http");
const { spawn } = require("node:child_process");

const json = fs.readFileSync('./config.json', { encoding: 'utf8' , flag: 'r' });
const conf = JSON.parse(json);

const host = conf['host'];
const port = conf['port'];

const requestListener = function (req,res) {

    const key = req.url;

    if (conf['keys'][key]) {
        console.log(`${currentDate()} : ${key} - start`);
        const child = spawn('bash', [conf['keys'][key]]);
        child.stdout.on('data', (data) => {
            console.log(`${data}`);
        });
        child.stderr.on('data', (data) => {
            console.error(`${data}`);
        });
        child.on('close', () => {
            console.log(`${currentDate()} : ${key} - end`);
        });
        res.writeHead(200);
        res.end(
            JSON.stringify({
                spawned: key
            })
        );
    }
    else {
        res.writeHead(404);
        res.end(
            JSON.stringify({
              error: "Resource not found",
              available: Object.keys(conf['keys']),
            }),
        );
    }
};

const server = http.createServer(requestListener);

server.listen(port,host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

function currentDate() {
    return new Date().toString();
}