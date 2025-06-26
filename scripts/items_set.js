var nb_items_set = 25;

var items_crafted = localStorage.getItem("items_crafted") ? JSON.parse(localStorage.getItem("items_crafted")) : [];
function select_set_items (min = []){
    if (min.length >= nb_items_set) {
        min = min.slice(0, nb_items_set);
    }

    var items_set = min;
    var nb_restant = nb_items_set - items_set.length;
    for (var i = 0; i < nb_restant; i++) {
        var random_item = items[Math.floor(get_random(i) * items.length)];
        if (!items_set.includes(random_item)) {
            items_set.push(random_item);
        }
    }
    
    return items_set;
}

function filter_items_list (list_selected){
    var new_list_items = [];
    var list_selected_name = list_selected.map(function(item) {
        return item.code;
    });
    items.filter(function(item) {
        if (list_selected_name.includes(item.code)) {
            new_list_items.push(item);
        }
    });
    items_restrain = new_list_items;
    add_found_item_to_list();
    initialise_items();
    set_item_selected(list_selected[0].code);
}

function is_good_craft (item) {
    var item_crafted_code = items_crafted.map(function(i) {
        return i.code;
    });
    if (!item_crafted_code.includes(item.code)) {
        items_crafted.push(item);
        localStorage.setItem("items_crafted", JSON.stringify(items_crafted));
        display_good_items();
        add_found_item_to_list()
        display_score_value();
    }
}

function display_good_items () {
    var found_items_div = document.getElementById("found-items");
    var html = "";

    var items_crafted_temp = items_crafted.reverse(); 

    items_crafted_temp.forEach(function(item) {
        var name_tag = item.code;
        html += "<div class='btn_in_game found_list shadow_btn'>" + "<img src=\"items/texture/" + name_tag + ".png\"><p>"+name_tag.replace('minecraft_', '').replaceAll('_', ' ')+"</p></div>";
    });
    found_items_div.innerHTML = html;
}

function add_found_item_to_list () {
    if(urlParams.get('cumulative') === 'true') {
        items_restrain = [...items_restrain, ...items_crafted];
        items_restrain = items_restrain.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.code === item.code
            ))
        );
        initialise_items();
    }

}

function get_random(discriminant) {
    var now = new Date();
    var utcOffset = now.getTimezoneOffset() * 60000; 
    var franceOffset = 2 * 60 * 60 * 1000;

    var noonFrance = new Date(now.getTime() + utcOffset + franceOffset);
    noonFrance.setHours(12, 0, 0, 0);

    var seed = noonFrance.getDate() + noonFrance.getMonth() * 31 + noonFrance.getFullYear() * 365;

    return seededRandom(discriminant + seed);
}

function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function display_score_value() {
    var score_value_div = document.getElementById("score-value");
    score_value_div.innerHTML = items_crafted.length;
}