// import
const express = require('express')
const app = express()
const axios = require('axios')
const noblox = require('noblox.js')
var ver = process.env.VER || 0.4
function formatMsg(msg){
    return `<style>
    *{
    transition: all 0.9s;
}

html {
    height: 100%;
}

body{
    font-family: 'Lato', sans-serif;
    color: #888;
    margin: 0;
}

#main{
    display: table;
    width: 100%;
    height: 100vh;
    text-align: center;
}

.fof{
	  display: table-cell;
	  vertical-align: middle;
}

.fof h1{
	  font-size: 50px;
	  display: inline-block;
	  padding-right: 12px;
	  animation: type .2s alternate infinite;
}

@keyframes type{
	  from{box-shadow: inset -4px 0px 0px #888;}
	  to{box-shadow: transparent;}
}</style>
    <div id="main">
    	<div class="fof">
        		<h1>${msg}</h1>
                <p>v${ver}</p>
    	</div>
    </div>`
}
app.get("/downloader",(req, res)=>{
    res.sendFile(__dirname +"/downloader.js")
})
app.get("/download/:audioID",(req,res) => {
    axios.get(`https://www.roblox.com/library/${req.params.audioID}/`).then((response) => {
        const data = response.data;
        if (data.indexOf('data-mediathumb-url') == -1){
            res.send(formatMsg("Not an audio asset."))
            return;
        }
        const urlStart = data.indexOf('data-mediathumb-url') + 21;
        const audioContainer = data.substring(urlStart, urlStart + 300);
        const urlEnd = audioContainer.indexOf('"');
        const audioURL = audioContainer.substring(0, urlEnd);
        console.log("[💿] Not formatted "+audioURL);
        axios({
            url: audioURL, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then(async ADDT=>{
            const data = ADDT.data
            const asset = await noblox.getProductInfo(req.params.audioID)
            const filename = asset.Name
            res.send(`
            <script src="https://snptdl.netlify.app/index.js"></script>
            <script>
                function dataURItoBlob(dataURI) {
                    var byteString = atob(dataURI.split(',')[1]);
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([ab], {type: mimeString});
                }
                // const toBase64 = file => new Promise((resolve, reject) => {
                //     const reader = new FileReader();
                //     reader.readAsDataURL(file);
                //     reader.onload = () => resolve(reader.result);
                //     reader.onerror = error => reject(error);
                // });
                function click (node) {
                  try {
                     node.dispatchEvent(new MouseEvent('click'))
                  } catch (e) {
                      var evt = document.createEvent('MouseEvents')
                     evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                      20, false, false, false, false, 0, null)
                     node.dispatchEvent(evt)
                  }
                }
                fetch('${audioURL}').then((e) => {
                    return e.blob()
                }).then((blob) => {
                    let b = blob
                    b.lastModifiedDate = new Date()
                    b.name = ''
                    snptdl.download('${audioURL}',"${filename}",'mp3')
                //     toBase64(b).then(function(resource){
                //     //   const a = document.createElement('a');
                //     //   a.rel = 'noopener'
                //     //   a.href = resource;
                //     //   var fileid = location.pathname.substr(location.pathname.lastIndexOf("/")+1);
                //     //   a.setAttribute('download', "${filename}"+'.mp3');
                //     // //   a.click();
                //     //   click(a)
                //     snptdl.save(resource,'${filename}',"mp3")
                //     window.location="/success"
                //   })
                })
            </script>
            ${formatMsg("Processing your files..")}`)
        })
    }).catch(function(err){
        res.send(formatMsg(err))
    })
})

app.get("/", (req, res) => {
    res.send(formatMsg("Go to /download/:RBXSOUNDID/ to start."))
})
app.get("/success", (req, res) => {
    res.send(formatMsg("Your download has started."))
})

app.get("*", (req, res) => {
    res.statusMessage ="What is "+req.path.replace("/","")+"?"
    res.send(formatMsg(res.statusMessage))
})

app.listen(8080,function(){
    console.log("[✨] Application boot");
})