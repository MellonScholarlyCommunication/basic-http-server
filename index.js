/**
 * Thanks : Arthur Vercruysse & Jesse Wright
 */
const fs = require("fs");
const http = require("http");
const { execFile } = require("child_process");

const json = fs.readFileSync('./config.json', { encoding: 'utf8' , flag: 'r' });
const conf = JSON.parse(json);

const host = conf['host'];
const port = conf['port'];

const requestListener = function (req,res) {

    const key = req.url;

    if (conf['keys'][key]) {
        console.log(`${currentDate()} : ${key} - start`);
        const child = execFile('bash', [conf['keys'][key]], (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                throw error;
            }
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