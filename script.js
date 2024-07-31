const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
let image = null;

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
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
