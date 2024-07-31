const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const cropOverlay = document.getElementById('crop-overlay');
const historyList = document.getElementById('history-list');
const loadingScreen = document.getElementById('loading');
let image = null;
let originalImageData = null;
let isCropping = false;
let cropStart = { x: 0, y: 0 };
let cropEnd = { x: 0, y: 0 };
let editHistory = [];
let currentHistoryIndex = -1;

function addToHistory(action) {
    currentHistoryIndex++;
    editHistory.splice(currentHistoryIndex);
    editHistory.push({
        action: action,
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height)
    });
    updateHistoryUI();
}

function updateHistoryUI() {
    historyList.innerHTML = '';
    editHistory.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.action;
        if (index === currentHistoryIndex) {
            li.style.fontWeight = 'bold';
        }
        const undoButton = document.createElement('button');
        undoButton.textContent = 'Revert to this';
        undoButton.addEventListener('click', () => revertToHistory(index));
        li.appendChild(undoButton);
        historyList.appendChild(li);
    });
}

function revertToHistory(index) {
    currentHistoryIndex = index;
    ctx.putImageData(editHistory[index].imageData, 0, 0);
    updateHistoryUI();
}

function resetCanvas() {
    ctx.putImageData(originalImageData, 0, 0);
    addToHistory('Reset');
}

function applyFilter(filterFunction) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    filterFunction(imageData);
    ctx.putImageData(imageData, 0, 0);
    addToHistory('Apply Filter');
}

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            addToHistory('Image Upload');
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('brighten').addEventListener('click', () => applyFilter((imageData) => {
    // Brighten filter logic
}));

document.getElementById('darken').addEventListener('click', () => applyFilter((imageData) => {
    // Darken filter logic
}));

document.getElementById('invert').addEventListener('click', () => applyFilter((imageData) => {
    // Invert colors filter logic
}));

document.getElementById('grayscale').addEventListener('click', () => applyFilter((imageData) => {
    // Grayscale filter logic
}));

document.getElementById('sepia').addEventListener('click', () => applyFilter((imageData) => {
    // Sepia filter logic
}));

document.getElementById('saturate').addEventListener('click', () => applyFilter((imageData) => {
    // Saturate filter logic
}));

document.getElementById('desaturate').addEventListener('click', () => applyFilter((imageData) => {
    // Desaturate filter logic
}));

document.getElementById('reset').addEventListener('click', resetCanvas);

document.getElementById('undo').addEventListener('click', () => {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        ctx.putImageData(editHistory[currentHistoryIndex].imageData, 0, 0);
        updateHistoryUI();
    }
});

document.getElementById('redo').addEventListener('click', () => {
    if (currentHistoryIndex < editHistory.length - 1) {
        currentHistoryIndex++;
        ctx.putImageData(editHistory[currentHistoryIndex].imageData, 0, 0);
        updateHistoryUI();
    }
});

document.getElementById('download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'edited-image.png';
    link.click();
});

document.getElementById('crop').addEventListener('click', () => {
    isCropping = !isCropping;
    cropOverlay.style.display = isCropping ? 'block' : 'none';
});

document.getElementById('resize').addEventListener('click', () => {
    const newWidth = prompt('Enter new width:', canvas.width);
    const newHeight = prompt('Enter new height:', canvas.height);
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    addToHistory('Resize');
});

document.getElementById('rotate').addEventListener('click', () => {
    const degrees = prompt('Enter rotation degrees:', '0');
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    addToHistory('Rotate');
});

document.getElementById('flip-horizontal').addEventListener('click', () => {
    ctx.scale(-1, 1);
    ctx.drawImage(image, -canvas.width, 0);
    addToHistory('Flip Horizontal');
});

document.getElementById('flip-vertical').addEventListener('click', () => {
    ctx.scale(1, -1);
    ctx.drawImage(image, 0, -canvas.height);
    addToHistory('Flip Vertical');
});

document.getElementById('funky-filter').addEventListener('click', () => {
    // Apply a funky filter
    addToHistory('Funky Filter');
});

document.getElementById('blur').addEventListener('click', () => applyFilter((imageData) => {
    // Blur filter logic
}));

document.getElementById('sharpen').addEventListener('click', () => applyFilter((imageData) => {
    // Sharpen filter logic
}));

document.getElementById('edge-detect').addEventListener('click', () => applyFilter((imageData) => {
    // Edge detect filter logic
}));

document.getElementById('emboss').addEventListener('click', () => applyFilter((imageData) => {
    // Emboss filter logic
}));

canvas.addEventListener('mousedown', (e) => {
    if (isCropping) {
        cropStart.x = e.offsetX;
        cropStart.y = e.offsetY;
        cropOverlay.style.left = `${cropStart.x}px`;
        cropOverlay.style.top = `${cropStart.y}px`;
        cropOverlay.style.width = '0px';
        cropOverlay.style.height = '0px';
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isCropping) {
        cropEnd.x = e.offsetX;
        cropEnd.y = e.offsetY;
        const width = cropEnd.x - cropStart.x;
        const height = cropEnd.y - cropStart.y;
        cropOverlay.style.width = `${width}px`;
        cropOverlay.style.height = `${height}px`;
    }
});

canvas.addEventListener('mouseup', () => {
    if (isCropping) {
        isCropping = false;
        cropOverlay.style.display = 'none';
        // Implement crop functionality here
    }
});

document.getElementById('contrast').addEventListener('input', (e) => {
    ctx.filter = `contrast(${e.target.value}%)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});

document.getElementById('hue-rotate').addEventListener('input', (e) => {
    ctx.filter = `hue-rotate(${e.target.value}deg)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});

document.getElementById('brightness').addEventListener('input', (e) => {
    ctx.filter = `brightness(${e.target.value}%)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});

function showLoading() {
    loadingScreen.style.display = 'flex';
}

function hideLoading() {
    loadingScreen.style.display = 'none';
}
