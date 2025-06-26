var nb_items_set = 25;
var max_craft = 0;

var get_date_str = get_date();
if(localStorage.getItem("today") !== get_date_str) {
    localStorage.setItem("items_crafted", JSON.stringify([]));
    localStorage.setItem("today", get_date_str);
}
var items_crafted = localStorage.getItem("items_crafted") ? JSON.parse(localStorage.getItem("items_crafted")) : [];

function select_set_items (min = [], prevent = 0){
    if (min.length >= nb_items_set) {
        min = min.slice(0, nb_items_set);
    }

    var items_set = min;
    var nb_restant = nb_items_set - items_set.length;
    for (var i = 0; i < nb_restant; i++) {
        var random_item = items[Math.floor(get_random(i, prevent) * items.length)];
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
        add_found_item_to_list()
        display_good_items();
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

    if(!max_craft) {
        var items_restrain_codes = items_restrain.map(function(item) {
            return item.code;
        });
        max_craft = filterCraftableRecipes(items_restrain_codes, crafts, tagMap);
    }
    if( items_restrain.length >= max_craft.length) {
        document.getElementById("end-game").style.display = "block";
        document.getElementById("end-game").innerHTML = "<p>Well done, you have found all the crafts !</p><br><a class='interface_btn' href='index.html' style='text-align: center;display: block;'>Home</a>";
    }
}

function add_found_item_to_list () {
    if(urlParams.get('cumulative') === 'true') {
        items_crafted = items_crafted.map(function(item) {
            return {
                code: item.code,
                name: item.name,
                spec: true
            };
        });
        items_restrain = [...items_restrain, ...items_crafted];
        items_restrain = items_restrain.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.code === item.code
            ))
        );
        initialise_items();
    }
}

function get_random(discriminant, prevent = 0) {
    var today_string = get_date(prevent);
    var str = "xcbfvgwdsv";
    var seed = discriminant + today_string + str;
    return seededRandom(seed);
}

function get_date(prevent = 0) {
    var now = new Date();
    var utcOffset = now.getTimezoneOffset() * 60000; 
    var franceOffset = 16 * 60 * 60 * 1000;
    
    var noonFrance = new Date(now.getTime() + utcOffset + franceOffset);
    
    noonFrance.setDate(noonFrance.getDate() - prevent);
    
    console.log(noonFrance.toISOString().split('T')[0]);
    
    return noonFrance.toISOString().split('T')[0];
}

function seededRandom(seed = '') {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = Math.abs(hash);
    return (hash % 10000) / 10000;
}

function display_score_value() {
    var items_restrain_codes = items_restrain.map(function(item) {
        return item.code;
    });
    max_craft = filterCraftableRecipes(items_restrain_codes, crafts, tagMap);
    var score_value_div = document.getElementById("score-value");
    score_value_div.innerHTML = items_restrain.length + " / " + max_craft.length;
}

function display_prevent_day() {
    var list_set_prevent_day = select_set_items([], 1);
    var list_possible_items = filterCraftableRecipes(list_set_prevent_day.map(item => item.code), crafts, tagMap);
    
    var list_set_prevent_day_div = document.getElementById("list_set_prevent");
    var html = "";
    list_set_prevent_day.forEach(function(item) {
        var name_tag = item.code;
        html += "<div class='mini_icon' title='"+name_tag.replace('minecraft_', 'minecraft:')+"'>" + "<img src=\"items/texture/" + name_tag + ".png\"></div>";
    });
    list_set_prevent_day_div.innerHTML = html;

    var list_possible_items_div = document.getElementById("list_possible_prevent");
    html = "";
    list_possible_items.forEach(function(item) {
        var name_tag = item;
        html += "<div class='mini_icon' title='"+name_tag.replace('minecraft_', 'minecraft:')+"'>" + "<img src=\"items/texture/" + name_tag + ".png\"></div>";
    });
    list_possible_items_div.innerHTML = html;
}