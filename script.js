document.getElementById('svgForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const tileWidth = parseFloat(document.getElementById('tileWidth').value);
    const options = Array.from(document.querySelectorAll('input[name="options"]:checked')).map(el => el.value);

    // Generate SVG based on form values
    let svgData = generateSVG(width, height, options, tileWidth);

    // Display SVG in preview
    let svgPreview = document.getElementById('svgPreview');
    svgPreview.innerHTML = svgData;

    // Show download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = function() {
        downloadSVG(svgData);
    };
});

function generateSVG(widthInInches, heightInInches, options, tileWidthInInches) {
    // Calculate the number of columns and rows based on the tile width
    let cols = Math.floor(widthInInches / tileWidthInInches);
    let rows = Math.floor(heightInInches / tileWidthInInches);
    if ((widthInInches - (cols*tileWidthInInches))/ (cols+1) < .1) {
        cols--;
    };
    if ((heightInInches - (rows*tileWidthInInches))/(rows+1) < .1) {
        rows--;
    };
    let colGap = (widthInInches - (cols*tileWidthInInches))/ (cols+1);
    let rowGap = (heightInInches - (rows*tileWidthInInches))/(rows+1);

    // Define the SVG, setting its physical width and height in inches, and its viewBox in arbitrary units
    let svgRaw = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xml:space="preserve" width="${widthInInches}in" height="${heightInInches}in" version="1.1" style="shape-rendering:geometricPrecision; fill-rule:evenodd; clip-rule:evenodd" preserveAspectRatio="xMinYMin meet" viewBox="0 0 ${widthInInches*1000} ${heightInInches*1000}" xmlns:xlink="http://www.w3.org/1999/xlink" 
    <style type="text/css">.st1{fill:#000000;} .st2{fill:#ffffff;} </style>
    <symbol id="cut" viewBox="0 0 ${tileWidthInInches} ${tileWidthInInches}">
        <rect x="0" y="0" style="fill:none;stroke:#FF0000;stroke-width:0.001;stroke-miterlimit:10;" width="${tileWidthInInches}" height="${tileWidthInInches}" rx=".15"/>
    </symbol>
    ${baking}
    ${bathroom}
    ${recycling}
    ${trash}
    ${corkscrew}
    ${toiletPaper}
    ${closet}
    ${broomMop}
    ${wineGlasses}
    ${utensils}
    ${waterGlasses}
    ${pots}
    ${spices}
    ${coffeeCups}
    ${pans}
    ${bowls}
    ${cleaningSupplies}
    ${plates}`;

    let tile= 0;
    // Create the rows and columns of tiles
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            svgRaw += `<use xlink:href="#cut" class="st0" width="${tileWidthInInches*1000}" height="${tileWidthInInches*1000}" x="${j * (tileWidthInInches+colGap)*1000}" y="${i * (tileWidthInInches+rowGap)*1000}"/></use>`;

            if (options[tile%options.length] == "qr") {
                var qrcode = new QRCode({ content: `https://www.householdhunt.com/${tile}`, join: true });
                console.log(qrcode.svg());
                let svg = qrcode.svg();
                svgRaw += `<symbol id="qr${tile}" viewBox="0 0 256 256">${svg}</symbol><use xlink:href="#qr${tile}" class="st1" width="${tileWidthInInches*1000}" height="${tileWidthInInches*1000}" x="${j * (tileWidthInInches+colGap)*1000}" y="${i * (tileWidthInInches+rowGap)*1000}"/>`;
            } else {
                svgRaw += `<use xlink:href="#${options[tile%options.length]}" class="st1" width="${tileWidthInInches*1000}" height="${tileWidthInInches*1000}" x="${j * (tileWidthInInches+colGap)*1000}" y="${i * (tileWidthInInches+rowGap)*1000}"/></use>`;
            }
            tile++;
        }
    }

    // Close the SVG tag
    svgRaw += '</svg>';
    
    return svgRaw;
}


function downloadSVG(svgData) {
    // Function to download SVG
    const blob = new Blob([svgData], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
