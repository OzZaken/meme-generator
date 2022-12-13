'use strict'

function onShareMeme() {
  var elCanvas = getElCanvas()
  console.log('elCanvas:', elCanvas)
  const imgDataUrl = elCanvas.toDataURL('image/jpeg')
  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    // console.log(encodedUploadedImgUrl)
    document.querySelector(
      '.url-msg'
    ).innerText = `Your photo is available here: ${uploadedImgUrl}`
    document.querySelector('.sharing-btn').innerHTML = `
          <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
             Share   
          </a>`
  }
  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {

  const formData = new FormData();
  formData.append('img', imgDataUrl)

  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.text())
    .then((url) => {


      console.log('Got back live url:', url)
      onSuccess(url)
    })
    .catch((err) => {
      console.error(err)
    })
}