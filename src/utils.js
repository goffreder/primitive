export function getColorHex(r, g, b) {
    var hr = r.toString(16);
    var hg = g.toString(16);
    var hb = b.toString(16);

    hr.length === 1 && (hr = '0' + hr);
    hg.length === 1 && (hg = '0' + hg);
    hb.length === 1 && (hb = '0' + hb);

    return ['#', hr, hg, hb].join('');
};

export function getColorAnalysis(imgData, minFrequency = 0) {
    var pxNum = imgData.data.length / 4;
    var meanColor = { r: 0, g: 0, b: 0, a: 255 };
    var r, g, b, colors = {};

    imgData.data.forEach((v, i) => {
        switch (i % 4) {
            case 0:
                r = v;
                meanColor.r += v;
                break;
            case 1:
                g = v;
                meanColor.g += v;
                break;
            case 2:
                b = v;
                meanColor.b += v;
                break;
            case 3:
                var hexColor = getColorHex(r, g, b);

                if (colors[hexColor] === undefined) {
                    colors[hexColor] = 0;
                }

                colors[hexColor]++;
                break;
        }
    });

    meanColor.r = ~~(meanColor.r / pxNum);
    meanColor.g = ~~(meanColor.g / pxNum);
    meanColor.b = ~~(meanColor.b / pxNum);

    var colors = Object.keys(colors).map(c => {
        var color = {};
        color[c] = colors[c];
        return color;
    });

    if (minFrequency > 0) {
        colors = colors.filter(c => c[Object.keys(c)[0]] >= minFrequency);
    }

    colors = colors.sort((a, b) => b[Object.keys(b)[0]] - a[Object.keys(a)[0]]);

    return {
        colors,
        meanColor
    };
};

export function getImageSimilarityToColor(imgData, color) {
    var da = imgData.data;

    var delta = 0;
    var sum = 0;

    for (var i=0; i<da.length; i++) {
        switch (i % 4) {
            case 0:
                delta = da[i] - color.r;
                sum += delta * delta;
                break;
            case 1:
                delta = da[i] - color.g;
                sum += delta * delta;
                break;
            case 2:
                delta = da[i] - color.b;
                sum += delta * delta;
                break;
            case 3:
                break;
        }
    }

    return Math.sqrt(sum);
};

export function getMostSimilarColor(imgData, baseColor, baseSimilarity) {
    if (baseSimilarity === 0) {
        return baseColor;
    }

    var delta = 5;
    var minSimilarity = baseSimilarity;
    var bestColor = baseColor;

    for (var r=Math.max(baseColor.r-delta, 0); r<Math.min(baseColor.r+delta, 256); r++) {
        for (var g=Math.max(baseColor.g-delta, 0); g<Math.min(baseColor.g+delta, 256); g++) {
            for (var b=Math.max(baseColor.b-delta, 0); b<Math.min(baseColor.b+delta, 256); b++) {
                var color = {r, g, b};
                var sim = getImageSimilarityToColor(imgData, color);

                if (sim < minSimilarity) {
                    minSimilarity = sim;
                    bestColor = color;
                }
            }
        }
    }

    return bestColor;
};

export function getImagesSimilarity(imgDataA, imgDataB) {
    var da = imgDataA.data;
    var db = imgDataB.data;

    var delta = 0;
    var sum = 0;

    if (da.length !== db.length) {
        throw new Error('ImageData not valid');
    }

    for (var i=0; i<da.length; i++) {
        switch (i % 4) {
            case 0:
            case 1:
            case 2:
                delta = da[i] - db[i];
                sum += delta * delta;
                break;
            case 3:
                break;
        }
    }

    return Math.sqrt(sum);
};

export function clampInt(x, lo, hi) {
    return x < lo ? lo : (x > hi ? hi : x);
};
