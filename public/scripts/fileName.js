let input = document.getElementById('file-input');
let infoArea = document.getElementById('file-name');

input.addEventListener('change', showFileName);

function showFileName(event) {
    let input = event.srcElement;

    let fileName = input.files[0].name;


    infoArea.textContent = '';
    infoArea.textContent = 'File name: ' + fileName;
}