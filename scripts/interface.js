function information () {
    var btn_info = document.querySelector('#information_btn');
    if (btn_info.getAttribute('data-open') === 'true') {
        btn_info.setAttribute('data-open', 'false');
    } else {
        btn_info.setAttribute('data-open', 'true');
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