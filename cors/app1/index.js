const corsBtn = document.getElementById("corsBtn")

corsBtn.addEventListener("click", () => {
  fetch('http://localhost:3002/getJson', {
    credentials: 'include'
  })
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
})