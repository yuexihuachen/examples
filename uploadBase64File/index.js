const btnBase64 = document.getElementById("btnBase64")
const btnHand = document.getElementById("handBase64File")
let base64String = '',fileName = '',fileType =''

btnBase64.addEventListener("change", function() {
  let file = this.files[0]
  fileName = file.name
  fileType = file.type
  let reader  = new FileReader();
  reader.addEventListener("load", function (e) {
    base64String = e.target.result
  });
  reader.readAsDataURL(file);
})

btnHand.addEventListener("click", () => {
  fetch('/uploadBase64File', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file:base64String,
      fileName,
      fileType
    })
  })
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
})