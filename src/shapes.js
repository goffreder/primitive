import Random from 'random-js';
import { clampInt } from './utils';
const { floor, max, sqrt, pow, acos } = Math;

const random = Random(Random.engines.browserCrypto);

export function drawRectangle(color, ctx, w, h, alpha) {
    var x = random() * w;
    var y = random() * h;

    var sw = random() * (w - x);
    var sh = random() * (h - y);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, sw, sh);
};

export function drawTriangle(color, ctx, w, h, alpha) {
    var shape = {
        a: {
            x: random.real(0, w, true),
            y: random.real(0, h, true)
        },
        b: {
            x: random.real(0, w, true),
            y: random.real(0, h, true)
        },
        c: {
            x: random.real(0, w, true),
            y: random.real(0, h, true)
        }
    };

    if (valid(shape)) {
        ctx.beginPath();
        ctx.moveTo(shape.a.x, shape.a.y);
        ctx.lineTo(shape.b.x, shape.b.y);
        ctx.lineTo(shape.c.x, shape.c.y);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fill();
    }
};

function getPointsDistance(a, b) {
    var deltaX = b.x - a.x;
    var deltaY = b.y - a.y;

    return sqrt(deltaX * deltaX + deltaY * deltaY);
}

function getAngleFromSides(AB, AC, BC) {
    return acos(clampInt((AC*AC + BC*BC - AB*AB) / (2 * AC * BC), -1, 1)) * 180 / Math.PI;
}

function valid(shape) {
    var minAngle = 15;

    var AB = getPointsDistance(shape.a, shape.b);
    var AC = getPointsDistance(shape.a, shape.c);
    var BC = getPointsDistance(shape.b, shape.c);

    var first = getAngleFromSides(AB, AC, BC);

    if (first < minAngle) {
        return false;
    }

    var second = getAngleFromSides(AC, AB, BC);

    if (second < minAngle) {
        return false;
    }

    if ((180 - first - second) < minAngle) {
        return false;
    }

    return true;
}
