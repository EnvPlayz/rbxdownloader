function download(resourceData,fileName,extension) {
    const a = document.createElement('a');
    a.rel = 'noopener'
    a.href = resourceData;
    a.setAttribute('download', `${fileName}.${extension}`);
    click(a)
}