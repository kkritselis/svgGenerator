document.getElementById('svgForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const tileWidth = parseFloat(document.getElementById('tileWidth').value);
    const options = Array.from(document.querySelectorAll('input[name="options"]:checked')).map(el => el.value);
    console.log(options, width, height, tileWidth);
    // Generate SVG based on form values
    let svgData = generateSVG(width, height, options, tileWidth);

    // Display SVG in preview
    let svgPreview = document.getElementById('svgPreview');
    svgPreview.innerHTML = svgData;

    // // Show download button
    // const downloadBtn = document.getElementById('downloadBtn');
    // downloadBtn.style.display = 'block';
    // downloadBtn.onclick = function() {
    //     downloadSVG(svgData);
    // };
});

function generateSVG(widthInInches, heightInInches, options, tileWidthInInches) {
    // Calculate the number of columns and rows based on the tile width
    let cols = Math.floor(widthInInches / tileWidthInInches);
    let rows = Math.floor(heightInInches / tileWidthInInches);

    // Define the SVG, setting its physical width and height in inches, and its viewBox in arbitrary units
    let svgRaw = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="${widthInInches}in" height="${heightInInches}in" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 ${widthInInches*1000} ${heightInInches*1000}" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
    <style type="text/css">
        .st0{fill:none;stroke:#FF0000;stroke-width:0.001;stroke-miterlimit:10;}
        .st1{fill:#000000;}
        .st2{fill:#ffffff;}
    </style>
    <!-- Define the symbol for a tile -->
    <symbol id="cut" viewBox="0 0 ${tileWidthInInches} ${tileWidthInInches}">
        <rect x="0" y="0" style="fill:none;stroke:#FF0000;stroke-width:0.001;stroke-miterlimit:10;" width="${tileWidthInInches}in" height="${tileWidthInInches}in" rx=".15" class="st0"/> <!-- Removed the content placeholder -->
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
    ${plates}`;

    let tile= 0;
    // Create the rows and columns of tiles
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            svgRaw += `<use href="#cut" width="${tileWidthInInches*10}in" height="${tileWidthInInches*10}in" x="${j * tileWidthInInches*10}in" y="${i * tileWidthInInches*10}in"/></use>`;
            console.log(tile, tile%options.length, options[tile%options.length]);
            if (options[tile%options.length] == "qr") {
                var qrcode = new QRCode({ content: `https://www.householdhunt.com/${tile}`, join: true });
                console.log(qrcode.svg());
                let svg = extractSVGContents(qrcode.svg());
                svgRaw += `<symbol id="qr" viewBox="0 0 101.93 101.93">${svg}</symbol>`;
            } else {
                svgRaw += `<use href="#${options[tile%options.length]}" class="st1" width="${tileWidthInInches*10}in" height="${tileWidthInInches*10}in" x="${j * tileWidthInInches*10}in" y="${i * tileWidthInInches*10}in"/></use>`;
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

function extractSVGContents(svgObject) {
    var tempDiv = document.createElement('div');
    console.log(tempDiv);
    tempDiv.innerHTML = svgObject.outerHTML;
    console.log(tempDiv);
    var svgContents = tempDiv.querySelector('svg').innerHTML;
    console.log(svgContents);
    return svgContents;
}