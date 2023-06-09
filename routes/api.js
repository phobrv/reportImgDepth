var express = require('express');
var router = express.Router();

var colors = require('../service/colors')
const readline = require('readline');
const fs = require('fs');
const filePath = 'public/data.json';

router.get('/getData', function (req, res, next) {
    let type = req.params.id;
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    let labels = [];
    let lineInx = 0;
    let dataImg = [];
    let dataRay = [];
    let rayLen = 0;
    rl.on('line', (line) => {
        lineData = JSON.parse(line)
        if (rayLen === 0) {
            rayLen = lineData.length;
        }
        for (var i = 0; i < rayLen ; i++) {
            if (lineInx === 0) {
                dataImg[i] = [];
                dataRay[i] = [];
            }
            var rayData = lineData[i];
            dataImg[i].push(rayData['img']);
            
            dataRay[i].push(rayData['ray']);
        }
        lineInx++;
        labels.push(lineInx);

    });
    // Handle the end of file
    rl.on('close', () => {
        datasetsImg = []
        datasetsRay = []
        for (var i = 0; i <= rayLen; i++) {
            datasetsImg.push({
                lable: `d${i}`,
                data: dataImg[i],
                fill: false,
                borderColor: colors['colors'][i],
                tension: 0.1
            });
            datasetsRay.push({
                lable: `d${i}`,
                data: dataRay[i],
                fill: false,
                borderColor: colors['colors'][i],
                tension: 0.1
            });
        }
        dataCharImg = {
            labels: labels,
            datasets: datasetsImg,
        };
        dataCharRay = {
            labels: labels,
            datasets: datasetsRay,
        };
        // console.log(labels)
    });
    res.send({'img':dataCharImg, 'ray':dataCharRay});

});

module.exports = router;
