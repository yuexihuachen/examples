function logger(...args) {
    console.log(args)
}

const width = 640;
const height = 480;

const params = new URLSearchParams(window.location.search.slice(1));

const constraints = window.constraints = {
  video: {
      facingMode: params.get("mode") || 'environment'
  }
};

function handleSuccess(video,openCV) {
    canvasInput.getContext('2d').drawImage(video, 0, 0, width, height);
    canvasToBoundingRect(openCV,'canvasInput')
}
  


async function initMedia() {
    let openCV = await cv;

    try {
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
            const video = document.getElementById('video');
            video.width = width;
            video.height = height;
            window.stream = stream; 
            video.srcObject = stream;

            // setTimeout(() => {
            //     handleSuccess(video, openCV)
            // },2000)
        })
    } catch (e) {
        logger(e)
    }




    canvasToCv(openCV,'canvasInput')
}

function canvasToCv(openCV, canvasId){
    let src = openCV.imread('canvasInput');
    let dst = new openCV.Mat();
    let gray = new openCV.Mat();
    let opening = new openCV.Mat();
    let coinsBg = new openCV.Mat();
    let coinsFg = new openCV.Mat();
    let distTrans = new openCV.Mat();
    let unknown = new openCV.Mat();
    let markers = new openCV.Mat();
    // gray and threshold image
    openCV.cvtColor(src, gray, openCV.COLOR_RGBA2GRAY, 0);
    openCV.threshold(gray, gray, 0, 255, openCV.THRESH_BINARY_INV + openCV.THRESH_OTSU);
    // get background
    let M = openCV.Mat.ones(3, 3, openCV.CV_8U);
    openCV.erode(gray, gray, M);
    openCV.dilate(gray, opening, M);
    openCV.dilate(opening, coinsBg, M, new openCV.Point(-1, -1), 3);
    // distance transform
    openCV.distanceTransform(opening, distTrans, openCV.DIST_L2, 5);
    openCV.normalize(distTrans, distTrans, 1, 0, openCV.NORM_INF);
    // get foreground
    openCV.threshold(distTrans, coinsFg, 0.7 * 1, 255, openCV.THRESH_BINARY);
    coinsFg.convertTo(coinsFg, openCV.CV_8U, 1, 0);
    openCV.subtract(coinsBg, coinsFg, unknown);
    // get connected components markers
    openCV.connectedComponents(coinsFg, markers);
    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
            if (unknown.ucharPtr(i, j)[0] == 255) {
                markers.intPtr(i, j)[0] = 0;
            }
        }
    }
    openCV.cvtColor(src, src, openCV.COLOR_RGBA2RGB, 0);
    openCV.watershed(src, markers);
    // draw barriers
    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            if (markers.intPtr(i, j)[0] == -1) {
                src.ucharPtr(i, j)[0] = 255; // R
                src.ucharPtr(i, j)[1] = 0; // G
                src.ucharPtr(i, j)[2] = 0; // B
            }
        }
    }
    openCV.imshow('canvasOutput', src);
    src.delete(); dst.delete(); gray.delete(); opening.delete(); coinsBg.delete();
    coinsFg.delete(); distTrans.delete(); unknown.delete(); markers.delete(); M.delete();
    
    
}

// 边界
function canvasToBoundingRect(openCV, canvasId){
    let src = openCV.imread(canvasId);
    let dst = openCV.Mat.zeros(src.rows, src.cols, openCV.CV_8UC3);
    openCV.cvtColor(src, src, openCV.COLOR_RGBA2GRAY, 0);
    openCV.threshold(src, src, 177, 200, openCV.THRESH_BINARY);
    let contours = new openCV.MatVector();
    let hierarchy = new openCV.Mat();
    openCV.findContours(src, contours, hierarchy, openCV.RETR_CCOMP, openCV.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    // You can try more different parameters
    let rect = openCV.boundingRect(cnt);
    let contoursColor = new openCV.Scalar(255, 255, 255);
    let rectangleColor = new openCV.Scalar(255, 0, 0);
    openCV.drawContours(dst, contours, 0, contoursColor, 1, 8, hierarchy, 100);
    let point1 = new openCV.Point(rect.x, rect.y);
    let point2 = new openCV.Point(rect.x + rect.width, rect.y + rect.height);
    openCV.rectangle(dst, point1, point2, rectangleColor, 2, openCV.LINE_AA, 0);
    openCV.imshow('canvasOutput', dst);
    src.delete(); dst.delete(); contours.delete(); hierarchy.delete(); cnt.delete();
}

const loadImageToCanvas = function (url, cavansId) {
    let ctx = cavansId.getContext('2d');
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        cavansId.width = 640;
        cavansId.height = 480;
        ctx.drawImage(img, 0, 0, 640, 480);
    };
    img.src = url;
};

loadImageToCanvas('shape1.jpeg', canvasInput)

initMedia()