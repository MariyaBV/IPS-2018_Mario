const canvas = document.getElementById('canvas');
let width;
if (window.innerWidth >= 1200) {
    width = 1200;
} else {
    width = window.innerWidth;
}
canvas.width = width;
const height = canvas.offsetHeight;
canvas.height = height;
const ctx = canvas.getContext('2d');

export {ctx, width, height};
