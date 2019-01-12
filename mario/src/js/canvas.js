const canvasWrapper = document.getElementById('canvasWrapper');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');

let width;
let height;

function recalculateCanvasSize() {
    if (document.body.clientWidth > 568) {
        width = canvasWrapper.offsetWidth / 2;
        height = Math.min(canvasWrapper.offsetHeight, 800);
    } else {
        width = canvasWrapper.offsetWidth;
        height = canvasWrapper.offsetHeight / 2;
    };
    resizeCanvas();
}

function getCanvasSize() {
    return {
        width,
        height,
    };
}

function resizeCanvas() {
    const {width, height} = getCanvasSize();
    canvas1.width = width;
    canvas1.height = height;
    canvas2.width = width;
    canvas2.height = height;
}

window.addEventListener('resize', () => {
    recalculateCanvasSize();
});
recalculateCanvasSize();
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

export {ctx1, ctx2, getCanvasSize};
