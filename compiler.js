const fs = require('fs');
const path = require('path');

const markdownFile = process.argv[2] || 'slides.md';

if (!fs.existsSync(markdownFile)) {
    console.log(`[-] File ${markdownFile} not found.`);
    process.exit(1);
}

const content = fs.readFileSync(markdownFile, 'utf-8');
const slides = content.split('---').map(s => s.trim());

let htmlSlides = '';
slides.forEach((slide, index) => {
    const lines = slide.split('\n');
    let slideHtml = `<div class="slide" id="slide-${index + 1}">`;
    lines.forEach(line => {
        if (line.startsWith('# ')) {
            slideHtml += `<h1>${line.replace('# ', '')}</h1>`;
        } else if (line.startsWith('## ')) {
            slideHtml += `<h2>${line.replace('## ', '')}</h2>`;
        } else if (line.startsWith('- ')) {
            slideHtml += `<li>${line.replace('- ', '')}</li>`;
        } else if (line.trim() !== '') {
            slideHtml += `<p>${line}</p>`;
        }
    });
    slideHtml += `</div>`;
    htmlSlides += slideHtml;
});

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Compiled Presentation Slides</title>
    <style>
        body { background: #000; color: #00FF88; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .slide { background: #050505; border: 2px solid #003318; border-radius: 16px; padding: 40px; max-width: 800px; width: 100%; box-shadow: 0 20px 40px rgba(0,255,136,0.05); margin-bottom: 30px; display: none; }
        .slide:first-child { display: block; }
        h1 { color: #00FF88; font-size: 36px; border-bottom: 1px solid #003318; padding-bottom: 10px; }
        h2 { color: #FFB800; font-size: 24px; }
        p, li { color: #8FBC8F; font-size: 18px; line-height: 1.6; }
        .controls { display: flex; gap: 20px; }
        button { background: #003318; border: 1px solid #00FF88; color: #00FF88; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 4px; }
    </style>
</head>
<body>
    ${htmlSlides}
    <div class="controls">
        <button onclick="prevSlide()">PREV</button>
        <button onclick="nextSlide()">NEXT</button>
    </div>
    <script>
        let current = 1;
        const total = ${slides.length};
        function showSlide(num) {
            document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
            document.getElementById('slide-' + num).style.display = 'block';
        }
        function nextSlide() { if(current < total) { current++; showSlide(current); } }
        function prevSlide() { if(current > 1) { current--; showSlide(current); } }
    </script>
</body>
</html>
`;

fs.writeFileSync('presentation.html', template);
console.log('[+] Presentation slides compiled successfully to presentation.html!');