export function addNewSimilarityInfo(similarity, count) {
    var newSimDiv = document.getElementById('newSim');

    newSimDiv.textContent = 'New similarity: ' + similarity;

    var shapeCountDiv = document.getElementById('shapeCount');

    shapeCountDiv.textContent = 'Shape count: ' + count;
};

export function setInfoDiv(mainColor, mainSimilarity, simPerc) {
    var infoDiv = document.getElementById('info');
    infoDiv.innerHTML = '';

    var colorDiv = document.createElement('div');
    var colorSpan = document.createElement('span');
    colorSpan.textContent = mainColor;
    colorSpan.style.color = mainColor;

    colorDiv.textContent = 'Main color: ';
    colorDiv.id = 'mainColor';
    colorDiv.appendChild(colorSpan);

    infoDiv.appendChild(colorDiv);

    var mainSimDiv = document.createElement('div');
    var mainSimSpan = document.createElement('span');
    mainSimSpan.textContent = (Math.round(mainSimilarity * 100) / 100) + " (" + (Math.round(simPerc * 100) / 100) + "%)";

    mainSimDiv.textContent = 'Main color similarity: ';
    colorDiv.id = 'mainSimilarity';
    mainSimDiv.appendChild(mainSimSpan);

    infoDiv.appendChild(mainSimDiv);

    var newSimDiv = document.createElement('div');
    newSimDiv.id = 'newSim';

    infoDiv.appendChild(newSimDiv);

    var shapeCountDiv = document.createElement('div');
    shapeCountDiv.id = 'shapeCount';

    infoDiv.appendChild(shapeCountDiv);
};
