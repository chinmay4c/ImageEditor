const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
let image = null;
let originalImageData = null;

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
        data[i] = data[i] + (avg - data[i]) * factor;
        data[i + 1] = data[i + 1] + (avg - data[i + 1]) * factor;
        data[i + 2] = data[i + 2] + (avg - data[i + 2]) * factor;
    });
});

document
