const btnBase64 = document.getElementById("btnForm")
const btnHand = document.getElementById("handformFile")
let currentFile = []
let fd = new FormData()

btnBase64.addEventListener("change", function() {
  let files = this.files
  if (files) {
    [].forEach.call(files, readAndPreview);
  }
  function readAndPreview(file){
    let fileName = file.name
    let fileType = file.type
    let reader  = new FileReader();
    reader.addEventListener("load", function (e) {
      arrayBufferStr = e.target.result
      let file = new File([arrayBufferStr],fileName, { type: fileType })
      fd.append("sampleFile", file)
    });
    reader.readAsArrayBuffer(file);
  }
})

btnHand.addEventListener("click", () => {
  fetch('/uploadFormFile', {
    method: 'POST',
    body: fd
  })
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
})
