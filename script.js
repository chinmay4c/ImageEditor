const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const cropOverlay = document.getElementById('crop-overlay');
let image = null;
let originalImageData = null;

let isCropping = false;
let cropStart = { x: 0, y: 0 };
let cropEnd = { x: 0, y: 0 };

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
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function applyFilter(filter) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        filter(data, i);
    }
    ctx.putImageData(imageData, 0, 0);
}

document.getElementById('brighten').addEventListener('click', () => {
    applyFilter((data, i) => {
        data[i] = Math.min(255, data[i] + 20);
        data[i + 1] = Math.min(255, data[i + 1] + 20);
        data[i + 2] = Math.min(255, data[i + 2] + 20);
    });
});

document.getElementById('darken').addEventListener('click', () => {
    applyFilter((data, i) => {
        data[i] = Math.max(0, data[i] - 20);
        data[i + 1] = Math.max(0, data[i + 1] - 20);
        data[i + 2] = Math.max(0, data[i + 2] - 20);
    });
});

document.getElementById('invert').addEventListener('click', () => {
    applyFilter((data, i) => {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    });
});

document.getElementById('grayscale').addEventListener('click', () => {
    applyFilter((data, i) => {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    });
});

document.getElementById('sepia').addEventListener('click', () => {
    applyFilter((data, i) => {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    });
});

document.getElementById('saturate').addEventListener('click', () => {
    applyFilter((data, i) => {
        const max = Math.max(data[i], data[i + 1], data[i + 2]);
        const factor = 1.5;
        if (data[i] < max) data[i] += (max - data[i]) * factor;
        if (data[i + 1] < max) data[i + 1] += (max - data[i + 1]) * factor;
        if (data[i + 2] < max) data[i + 2] += (max - data[i + 2]) * factor;
    });
});

document.getElementById('desaturate').addEventListener('click', () => {
    applyFilter((data, i) => {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
               const factor = 0.5;
        data[i] = avg * factor + data[i] * (1 - factor);
        data[i + 1] = avg * factor + data[i + 1] * (1 - factor);
        data[i + 2] = avg * factor + data[i + 2] * (1 - factor);
    });
});

document.getElementById('reset').addEventListener('click', () => {
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
    }
});

document.getElementById('crop').addEventListener('click', () => {
    isCropping = !isCropping;
    cropOverlay.style.display = isCropping ? 'block' : 'none';
    if (isCropping) {
        cropOverlay.style.width = '0px';
        cropOverlay.style.height = '0px';
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (isCropping) {
        cropStart.x = e.offsetX;
        cropStart.y = e.offsetY;
        cropOverlay.style.left = `${cropStart.x}px`;
        cropOverlay.style.top = `${cropStart.y}px`;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isCropping) {
        cropEnd.x = e.offsetX;
        cropEnd.y = e.offsetY;
        cropOverlay.style.width = `${Math.abs(cropEnd.x - cropStart.x)}px`;
        cropOverlay.style.height = `${Math.abs(cropEnd.y - cropStart.y)}px`;
        cropOverlay.style.left = `${Math.min(cropStart.x, cropEnd.x)}px`;
        cropOverlay.style.top = `${Math.min(cropStart.y, cropEnd.y)}px`;
    }
});

canvas.addEventListener('mouseup', () => {
    if (isCropping) {
        const croppedWidth = Math.abs(cropEnd.x - cropStart.x);
        const croppedHeight = Math.abs(cropEnd.y - cropStart.y);
        const croppedImageData = ctx.getImageData(
            Math.min(cropStart.x, cropEnd.x),
            Math.min(cropStart.y, cropEnd.y),
            croppedWidth,
            croppedHeight
        );
        canvas.width = croppedWidth;
        canvas.height = croppedHeight;
        ctx.putImageData(croppedImageData, 0, 0);
        cropOverlay.style.display = 'none';
        isCropping = false;
    }
});

document.getElementById('resize').addEventListener('click', () => {
    const width = prompt('Enter new width:', canvas.width);
    const height = prompt('Enter new height:', canvas.height);
    if (width && height) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(canvas, 0, 0, width, height);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(tempCanvas, 0, 0);
    }
});

document.getElementById('funky-filter').addEventListener('click', () => {
    const filterClass = 'funky-rotate';
    if (canvas.classList.contains(filterClass)) {
        canvas.classList.remove(filterClass);
    } else {
        canvas.classList.add(filterClass);
    }
});

document.getElementById('contrast').addEventListener('input', (e) => {
    const contrast = e.target.value;
    ctx.filter = `contrast(${contrast}%)`;
    ctx.drawImage(image, 0, 0);
});

document.getElementById('hue-rotate').addEventListener('input', (e) => {
    const hue = e.target.value;
    ctx.filter = `hue-rotate(${hue}deg)`;
    ctx.drawImage(image, 0, 0);
});

