const video = document.getElementById('video');//the video element
Promise.all([ //loading all the modules from face-api.js which is a api wrapper over tensor flow
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo (){ //to start the video (occurs as soon as the script loads)
navigator.getUserMedia( 
  { video: {} },
  stream => video.srcObject = stream, 
  error => console.error(error) //error handling 
)

}
startVideo();
video.addEventListener('playing', () => { //using 'playing' rather than play as it produces a bug on some devices
  const canvas = faceapi.createCanvasFromMedia(video)//face-api's canvas
  document.body.append(canvas)
  const displaySize = { width: video.width , height: video.height }//the heigh and width of the video are used here 
  faceapi.matchDimensions(canvas , displaySize)
  setInterval(async () => { //asynchronus setIntervel like the api wrapper
    const detections = await faceapi.detectAllFaces(video , new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()//detecting all the faces with landmarks and expressions 
    //console.log(detections) => the detections are displayed in the console (for test purposes)
    const resizeDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizeDetections);//show the detections in the video
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);//show landmarks in the video
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections);//show expressions 
  } , 50)//setting the timeout as 50 for this bcz lol i want too

})
//the above code is from a video by web dev mastery however i did not just simple copy this lol

//the comments are mine (Some of them relate to the video ) but i made them 