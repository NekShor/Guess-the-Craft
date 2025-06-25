function information (elem) {
    if (elem.getAttribute('data-open') === 'true') {
        elem.setAttribute('data-open', 'false');
    } else {
        elem.setAttribute('data-open', 'true');
    }

    var info = document.querySelector('#information');
    if (info) {
        if (info.style.display === 'none' || info.style.display === '') {
            info.style.display = 'block';
        } else {
            info.style.display = 'none';
        }
    }
}