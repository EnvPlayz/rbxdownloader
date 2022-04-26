const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
var snptdl = {
    save: function(resourceData, fileName, extension) {
        const a = document.createElement('a');
        a.rel = 'noopener'
        a.href = resourceData;
        a.setAttribute('download', `${fileName}.${extension}`);
        click(a)
    },
    download: function (url, name, extension) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.onload = function () {
            toBase64(xhr.response).then(function (resource) {
                snptdl.save(resource, name, extension)
            })
        }
        xhr.onerror = function(ev){
            console.error('Error: Requested resource had an error: ' + ev)
        }
        xhr.send()
    }
}