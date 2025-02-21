document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("input_text");
    const inputFile = document.getElementById("input_file");

    // Detecta cambios en el campo de texto
    inputText.addEventListener("input", () => {
        if (inputText.value.trim() !== "") {
            inputFile.value = ""; // Limpia el campo de archivo
        }
    });

    // Detecta cambios en el campo de archivo
    inputFile.addEventListener("change", () => {
        if (inputFile.files.length > 0) {
            inputText.value = ""; // Limpia el campo de texto
        }
    });
});

document.getElementById('emotionForm').addEventListener('submit', function(event) {  
    event.preventDefault(); // Evita el envío del formulario normal  

    let inputText = document.getElementById('input_text').value;  
    let inputFile = document.getElementById('input_file').files[0];  
    let xhr = new XMLHttpRequest();  

    // Muestra el loader  
    document.getElementById('loader').style.display = 'block';  
    document.getElementById('predictionResult').innerText = ''; // Limpia la predicción anterior  

    xhr.open('POST', '/', true);  

    xhr.onload = function() {  
        document.getElementById('loader').style.display = 'none'; // Oculta el loader al recibir respuesta

        if (xhr.status === 200) {  
            const contentType = xhr.getResponseHeader('Content-Type');

            if (contentType && contentType.includes('application/json')) {
                // Si la respuesta es JSON
                let response = JSON.parse(xhr.responseText);  
                if (response.prediction) {
                    // Cambia el color de fondo según la predicción
                    if (response.prediction === "positiva") {  
                        document.body.style.backgroundColor = "#d4edda";  
                    } else if (response.prediction === "negativa") {  
                        document.body.style.backgroundColor = "#f8d7da";  
                    } else if (response.prediction === "neutral") {  
                        document.body.style.backgroundColor = "#fff3cd";  
                    } else {  
                        document.body.style.backgroundColor = "#f0f0f0";  
                    }  
                    document.getElementById('predictionResult').innerText = 'Predicción: ' + response.prediction;  
                } else {
                    document.getElementById('predictionResult').innerText = 'Error en la respuesta del servidor';
                }
            } else if (contentType && (contentType.includes('text/plain') || contentType.includes('text/csv') || contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))) {
                // Si la respuesta es un archivo (TXT, CSV o Excel)
                const blob = new Blob([xhr.response], { type: contentType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // Determina el nombre del archivo según el tipo
                if (contentType.includes('text/csv')) {
                    a.download = 'resultados.csv';
                } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {  
                    a.download = 'resultados.xlsx';
                } else {
                    a.download = 'resultados.txt';
                }
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url); // Libera el objeto URL
            } else {
                document.getElementById('predictionResult').innerText = 'Tipo de respuesta no reconocido';
            }
        } else {
            document.getElementById('predictionResult').innerText = 'Error al procesar la solicitud';
        }  
    };  

    // Enviar el archivo o el texto
    let formData = new FormData();
    if (inputText) {
        formData.append('input_text', inputText);
    }
    if (inputFile) {
        formData.append('input_file', inputFile);
        document.body.style.backgroundColor = "#f0f0f0";
        xhr.responseType = 'blob';
    }
    if(inputText && inputFile){
        alert("Por favor, envía solo uno: texto o archivo.");
        document.getElementById('loader').style.display = 'none';
        return false;
    }

    xhr.send(formData); // Envía el formulario con texto o archivo
});