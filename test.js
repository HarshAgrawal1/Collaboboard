const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Default drawing settings
let drawing = false;
let color = '#000000';
let lineWidth = 2;

ctx.strokeStyle = color;
ctx.lineWidth = lineWidth;
ctx.lineCap = 'round';

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

// Draw on mousemove
canvas.addEventListener('mousemove', (e) => {
  if (drawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Change color of the drawing
document.getElementById('colorPicker').addEventListener('input', (e) => {
  color = e.target.value;
  ctx.strokeStyle = color;
});

// Change line thickness
document.getElementById('lineWidth').addEventListener('input', (e) => {
  lineWidth = e.target.value;
  ctx.lineWidth = lineWidth;
});

// Clear the canvas
document.getElementById('clearButton').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save drawing as an image
document.getElementById('saveButton').addEventListener('click', () => {
  const imageURL = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = imageURL;
  link.download = 'whiteboard.png';
  link.click();
});
