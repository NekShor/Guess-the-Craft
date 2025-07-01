var slot_size = "30px";

function get_one_item () {
    var randomIndex = Math.floor(Math.random() * items.length);
    var item = items[randomIndex];
    return item;
}

function lauch_items () {
    set_item_to_page();
    // random time between 1000 et 45000
    var randomTime = Math.floor(Math.random() * (9000 - 2000 + 1));
    setTimeout(function() {
        lauch_items();
    }, randomTime);
}

function set_item_to_page(){
    var new_item = get_one_item();
    var div = document.createElement("div");
    div.className = "back-items invslot items_inv";
    div.innerHTML = `<img src="items/texture/${new_item.code}.png">`;
    div.setAttribute('onClick', `do_sound('drop')`);

    var top_position = Math.floor(Math.random() * (window.innerHeight - parseInt(slot_size)));
    div.style.top = top_position + 'px';

    document.body.appendChild(div);
    setTimeout(function() {
        div.style.left = '100%';
    }, 100);

    setTimeout(function() {
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }, 30000);
}