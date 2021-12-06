const btnBase64 = document.getElementById("btnBase64")
const btnHand = document.getElementById("handBase64File")
let multipleFile = []

btnBase64.addEventListener("change", function() {
  let files = this.files
  if (files) {
    [].forEach.call(files, readAndPreview);
  }
  function readAndPreview(file){
    let currentFile = {}
    currentFile.fileName = file.name
    currentFile.fileType = file.type
    let reader  = new FileReader();
    reader.addEventListener("load", function (e) {
      currentFile.base64String = e.target.result
      multipleFile.push(currentFile)
    });
    reader.readAsDataURL(file);
  }
})

btnHand.addEventListener("click", () => {
  fetch('/uploadMultipleBase64File', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(multipleFile)
  })
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
})