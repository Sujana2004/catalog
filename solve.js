const fs = require("fs");

// Read the JSON file passed as argument
const fileName = process.argv[2];
const jsonData = JSON.parse(fs.readFileSync(fileName, "utf8"));




// Safe base conversion for any base up to 36
function decodeBase(valueStr, base) {
    return [...valueStr.toLowerCase()].reduce((acc, digit) => {
        const num = parseInt(digit, 36); // handles 0-9, a-z
        return acc * BigInt(base) + BigInt(num);
    }, 0n);
}

// Lagrange interpolation to find f(0)
function lagrangeInterpolation(points) {
    let total = 0n;

    for (let i = 0; i < points.length; i++) {
        let { x: xi, y: yi } = points[i];
        let term = yi;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let { x: xj } = points[j];
                term = term * (0n - BigInt(xj)) / (BigInt(xi) - BigInt(xj));
            }
        }
        total += term;
    }
    return total;
}

// Parse keys
const n = jsonData.keys.n;
const k = jsonData.keys.k;

let points = [];
for (let key of Object.keys(jsonData)) {
    if (key === "keys") continue;
    const x = parseInt(key, 10); // Keep x as normal integer
    const base = Number(jsonData[key].base);
    const valueStr = jsonData[key].value;
    const y = decodeBase(valueStr, base); // y is decoded BigInt
    points.push({ x, y });
}

// Sort points by x
points.sort((a, b) => a.x - b.x);

// Use first k points
const firstKPoints = points.slice(0, k);

// Debug print
console.log("Decoded points:");
firstKPoints.forEach(p => {
    console.log(`x=${p.x}, y=${p.y}`);
});

// Find secret (constant term c)
const secret = lagrangeInterpolation(firstKPoints);
console.log(`Secret (c) = ${secret}`);
