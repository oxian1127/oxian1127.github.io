document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                // Mostrar el código QR
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = `<img src="${img.src}" alt="Código QR" width="200" height="200">`;
                resultDiv.innerHTML += `<p>¡Imagen encontrada y leída con éxito!</p>`;

                resultDiv.innerHTML += `<h6>Contenido del código QR</h6><hr><p> ${code.data}</p>`;
                
                // Crear un enlace basado en el contenido del código QR
                const link = document.createElement('a');
                link.href = code.data;
                link.textContent = 'Seguir enlace';
                resultDiv.appendChild(link);
            } else {
                alert('No se pudo encontrar un código QR en la imagen seleccionada.');
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});