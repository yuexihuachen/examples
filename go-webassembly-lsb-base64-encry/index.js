/**
 * build main.wasm cammand 
 * 安装 go
 * GOARCH=wasm GOOS=js go build -o main.wasm main.go
 * cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" . 
 * LSB（最低有效位，Least Significant Bit）
 */
if (!WebAssembly.instantiateStreaming) {
  // polyfill
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
  };
}

const go = new Go();
let mod, inst;
WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(
  async result => {
      mod = result.module;
      inst = result.instance;
      await go.run(inst);
  }
);

/**
 * init video
 */
const constraints = {
  audio: false,
  video: { width: { exact: 640 }, height: { exact: 480 } }
};

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);


/**
 *  encrypt and decrypt
 */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let summary = null
 document.getElementById("encrypt").onclick = () => {
  // go wasm function
  summary = mergeData("id-assurance").summary
}
document.getElementById("decrypt").onclick = () => {
  // request
  fetch('/uploadBase64File', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64: canvas.toDataURL("image/png"),
      summary
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log('node decrypt:', result);
  })
  .catch(error => {
    console.error('node Error:', error);
  });
}

