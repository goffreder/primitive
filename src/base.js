import { drawRectangle, drawTriangle } from './shapes';
import {
    getColorHex,
    getColorAnalysis,
    getImageSimilarityToColor,
    getMostSimilarColor,
    getImagesSimilarity
} from './utils';
import { setInfoDiv, addNewSimilarityInfo } from './ui';

(function() {
    var baseColors = {};
    var shapeCount = 0;

    var analyzeImage = function() {
        var oc = document.getElementById('sourceCanvas');
        var octx = oc.getContext('2d');
        var tc = document.getElementById('targetCanvas');
        var tctx = tc.getContext('2d');

        var w = oc.clientWidth;
        var h = oc.clientHeight;

        var octxImageData = octx.getImageData(0, 0, w, h);

        var minFrequency = document.getElementById('minFrequency').value;

        var { meanColor, colors } = getColorAnalysis(octxImageData, minFrequency);
        var mostSimilarColor = getMostSimilarColor(octxImageData, meanColor, getImageSimilarityToColor(octxImageData, meanColor));
        var mostSimilarColorHex = getColorHex(mostSimilarColor.r, mostSimilarColor.g, mostSimilarColor.b);

        tc.width = w;
        tc.height = h;

        tctx.fillStyle = mostSimilarColorHex;
        tctx.fillRect(0, 0, w, h);

        var tctxImageData = tctx.getImageData(0, 0, w, h);

        var sim = getImageSimilarityToColor(octxImageData, mostSimilarColor);
        var simPerc = sim * 100 / Math.sqrt(255 * 255 * 3 * octxImageData.data.length);

        setInfoDiv(mostSimilarColorHex, sim, simPerc);

        baseColors = colors;
        shapeCount = 0;
    }

    var drawRandomShape = function(colors, shapeType) {
        var colorObj = colors[Math.floor(Math.random() * colors.length)];
        var color = Object.keys(colorObj)[0];

        var shape = null;

        var alpha = document.getElementById('opacity').value;

        var oc = document.getElementById('sourceCanvas');
        var octx = oc.getContext('2d');
        var tc = document.getElementById('targetCanvas');
        var tctx = tc.getContext('2d');
        var ac = document.getElementById('auxCanvas');
        var actx = ac.getContext('2d');
        var w = tc.clientWidth;
        var h = tc.clientHeight;

        ac.width = w;
        ac.height = h;

        actx.drawImage(tc, 0, 0);

        switch (shapeType) {
            case 'rectangle':
                drawRectangle(color, actx, w, h, alpha);
                break;
            case 'triangle':
                drawTriangle(color, actx, w, h, alpha);
                break;
        }

        var curSimilarity = getImagesSimilarity(octx.getImageData(0, 0, w, h), tctx.getImageData(0, 0, w, h));
        var newSimilarity = getImagesSimilarity(octx.getImageData(0, 0, w, h), actx.getImageData(0, 0, w, h));

        if (newSimilarity < curSimilarity) {
            tctx.drawImage(ac, 0, 0);
            addNewSimilarityInfo(newSimilarity, ++shapeCount);
        }

        return newSimilarity;
    }

    this.setup = function() {
        var img = document.getElementById('image');
        var w = img.clientWidth;
        var h = img.clientHeight;

        var oc = document.getElementById('sourceCanvas');
        var octx = oc.getContext('2d');

        oc.width = w;
        oc.height = h;

        octx.drawImage(img, 0, 0);

        var button = document.getElementById('startAnalysis');
        button.addEventListener('click', () => analyzeImage());

        button = document.getElementById('startProcess');
        button.addEventListener('click', () => {
            var shape = document.getElementById('shapeSelector').value;
            var startTime = Date.now();
            var sim = drawRandomShape(baseColors, shape);

            var interval = setInterval(() => {
                sim = drawRandomShape(baseColors, shape);

                if (sim < document.getElementById('minSimilarity').value) {
                    clearInterval(interval);

                    var infoDiv = document.getElementById('info');
                    var timeDiv = document.createElement('div');
                    timeDiv.textContent = 'Total time: ' + ((Date.now() - startTime) / 1000) + 's';

                    infoDiv.appendChild(timeDiv);
                }
            }, 1);
        });
    }

}.bind(window))();
