
var w = [], y = [], z = [];
const pwd = "hola";


function cifrar()
{
    var imgEntrada = document.getElementById('BotonImg');
    const canvas = document.getElementById('Canvas');
    const dosD = canvas.getContext('2d');
    const colores = document.getElementById('color');

    imgEntrada.addEventListener('change', () => {

        const archivo = imgEntrada.files[0];
        const lectura = new FileReader();

        var x = 0;

        console.log("hola");

        lectura.onload = (event) => 
        {

            const imgBMP = new Image();
            imgBMP.src = event.target.result;

            console.log("hola");

            imgBMP.onload = () =>
            {
                canvas.width = imgBMP.width;
                canvas.height = imgBMP.height;
                dosD.drawImage(imgBMP,0,0);

                const datosImagen = dosD.getImageData(0,0,imgBMP.width,imgBMP.height);
                const pixels = datosImagen.data;
                
                const rgbInput = document.getElementById('color');
                rgbInput.innerHTML = '';

                const modo = document.getElementById('modoDecEnc').value;
                const operacion = document.querySelector('input[name="operacion"]:checked').value;

                console.log(operacion);
                console.log(modo);

                if(operacion === "Cifrar")
                {
                    if(modo === "ECB")
                    {
                        cifradorECB(pixels, rgbInput, x, imgBMP, canvas);
                    }
                }
                else if(operacion === "Descifrar")
                {
                    console.log("lll");
                    if(modo === "ECB")
                    {
                        console.log("lll");
                        descifradoECB(pixels, rgbInput, x, imgBMP, canvas);
                    }
                }

            };          
        };

        lectura.readAsDataURL(archivo);

    });
}

function cifradorECB(pixels, rgbInput, x, imgBMP, canvas)
{
    for(let i = 0; i < pixels.length ; i += 4){

        var r = pixels[i];
        var g = pixels[i+1];
        var b = pixels[i+2];

        console.log(pixels[i], pixels[i+1], pixels[i+2]);

        const rgbTexto = document.createElement('div');
        rgbTexto.textContent = `RGB: (${r}, ${g}, ${b})`;

        const conjunto = [r,g,b];

        const muestraResultado = document.createElement('div');
        muestraResultado.textContent = `RGB: ${conjunto}`;
        rgbInput.appendChild(muestraResultado);

        //console.log("hola");

        for(let j = 0; j < conjunto.length; j += 4)
        {
            //console.log("hola");
            var aux = conjunto[0].toString();
            console.log(aux);
            var cif = CryptoJS.AES.encrypt(aux, pwd);
            console.log(cif);

            aux = cif.toString().slice(0, 9);

            aux = hexadecimal(aux);

            //aux = cif.toString(CryptoJS.format.Hex);

            console.log(aux);
            w[x] = (parseInt(aux, 16)%255);
            console.log(w[x]);
            
            aux = conjunto[1].toString();
            cif = CryptoJS.AES.encrypt(aux, pwd);
            aux = cif.toString(CryptoJS.format.Hex);
            y[x] = (parseInt(aux, 16)%255);

            aux = conjunto[2].toString();
            cif = CryptoJS.AES.encrypt(aux, pwd);
            aux = cif.toString(CryptoJS.format.Hex);
            z[x] = (parseInt(aux, 16)%255);

            console.log(w[x], y[x], z[x]);

            x ++;

            var rgbSuma = document.createElement('div');
            rgbSuma.textContent = `SUMA RGB: (${conjunto[0]}, ${conjunto[1]}, ${conjunto[2]})`
            rgbInput.appendChild(rgbSuma);

            conjunto[0] = [];
            conjunto[1] = [];
            conjunto[2] = [];


        }    
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for(i = 0; i < canvasDos.height; i++){

        for(j = 0; j < canvasDos.width; j++)
        {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillRect(j,i,canvasDos.height, canvasDos.width);
            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;

            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');

    download.href = canvasURL;
    download.download = "img_c.bmp";

    download.click();

    w = [];
    y = [];
    z = [];

}


function descifradoECB(pixels, rgbInput, x, imgBMP, canvas){
    
    for(let i = 0; i < pixels.length ; i += 4){

        var r = pixels[i];
        var g = pixels[i+1];
        var b = pixels[i+2];

        console.log(pixels[i], pixels[i+1], pixels[i+2]);

        const rgbTexto = document.createElement('div');
        rgbTexto.textContent = `RGB: (${r}, ${g}, ${b})`;

        const conjunto = [r,g,b];

        const muestraResultado = document.createElement('div');
        muestraResultado.textContent = `RGB: ${conjunto}`;
        rgbInput.appendChild(muestraResultado);

        console.log("xxx");

        for(let j = 0; j < conjunto.length; j += 4)
        {
            var aux = conjunto[0].toString();
            console.log(aux);
            var cif = CryptoJS.AES.decrypt(aux, pwd);
            aux = cif.toString(CryptoJS.format.Hex);
            w[x] = (parseInt(aux, 16)%255);
            
            aux = conjunto[1].toString();
            cif = CryptoJS.AES.decrypt(aux, pwd);
            aux = cif.toString(CryptoJS.format.Hex);
            y[x] = (parseInt(aux, 16)%255);

            aux = conjunto[2].toString();
            cif = CryptoJS.AES.decrypt(aux, pwd);
            aux = cif.toString(CryptoJS.format.Hex);
            z[x] = (parseInt(aux, 16)%255);

            console.log(w[x], y[x], z[x]);

            x ++;

            var rgbSuma = document.createElement('div');
            rgbSuma.textContent = `SUMA RGB: (${conjunto[0]}, ${conjunto[1]}, ${conjunto[2]})`
            rgbInput.appendChild(rgbSuma);
        }    
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for(i = 0; i < canvasDos.height; i++){

        for(j = 0; j < canvasDos.width; j++)
        {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillRect(j,i,canvasDos.height, canvasDos.width);
            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;

            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');

    download.href = canvasURL;
    download.download = "img_c_d.bmp";

    download.click();

}


function hexadecimal(aux){
    let hex = '';
    for (let i = 0; i < aux.length; i++) {
        hex += aux.charCodeAt(i).toString(16);
    }
    return hex;
}