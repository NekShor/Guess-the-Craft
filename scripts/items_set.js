var nb_items_set = 25;
var max_craft = 0;
var time_stamp = localStorage.getItem("time_stamp") ? parseInt(localStorage.getItem("time_stamp")) : new Date().getTime();
if (localStorage.getItem("time_stamp") === null || localStorage.getItem("time_stamp") === undefined) {
    localStorage.setItem("time_stamp", time_stamp);
} else {
    time_stamp = parseInt(localStorage.getItem("time_stamp"));
}
var data_collect = [];

var interval = setInterval(function () {
    display_timer();
}, 1000);

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

    var items_ingredients = items.filter(function(item) {
        return item.isIngredient === true;
    });

    var items_set = min;
    var nb_restant = nb_items_set - items_set.length;
    for (var i = 0; i < nb_restant; i++) {
        var random_item = get_random_items_set(i, items_ingredients, prevent);
        if (!items_set.includes(random_item)) {
            items_set.push(random_item);
        }
    }
    return items_set;
}

function get_random_items_set (seed, items_ingredients, prevent = 0) {
    return items_ingredients[Math.floor(get_random(seed, prevent) * items_ingredients.length)]
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

        var date_now = new Date().getTime();
        var time_diff = date_now - time_stamp;
        data_collect.push({
            item: item.code,
            time: time_diff
        });

        console.log(items_crafted.length % 5)
        if(items_crafted.length % 5 === 0) {
            send_data_collect();
        }
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
        send_data_collect();
        document.getElementById("end-game").style.display = "block";
        localStorage.setItem("time_end", new Date().getTime());
        document.getElementById("end-game").innerHTML = "<p>Well done, you have found all the crafts in "+get_timer_str()+" !</p><br><div class='buttons'><a class='interface_btn go_home' href='index.html' style='text-align: center;display: block;'>Home</a><button class='interface_btn close' onClick='this.parentElement.parentElement.remove()'>Close</button></div>";
        clearInterval(interval);
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
    filterCraftableRecipes(items_restrain_codes, crafts, tagMap).forEach(function(item) {
        console.log(item);
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

function send_data_collect() {
    console.log("Sending data collect...");
    var count_good = items_crafted.length;

    if( localStorage.getItem("random_str") === null || localStorage.getItem("random_str") === undefined) {
        var random_str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("random_str", random_str);
    } else {
        var random_str = localStorage.getItem("random_str");
    }

    var data_complete = {
        mode : "items-set",
        game :  random_str,
        data : data_collect,
        score : count_good,
        date : new Date().getTime(),
        items_possible : filterCraftableRecipes(items_restrain.map(item => item.code), crafts, tagMap).length,
    }

    var data_formate = {
        json: JSON.stringify(data_complete),
    }

    fetch("https://zdaigtrxwbjcvxdtwwgk.supabase.co/rest/v1/recipe-craft", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYWlndHJ4d2JqY3Z4ZHR3d2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzU4MDQsImV4cCI6MjA2NjYxMTgwNH0.IkcTKvbiMeBuLnrEupcMwx7LzBGfFG6U7SLbkRHvtFM", // Replace with your actual API key
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYWlndHJ4d2JqY3Z4ZHR3d2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTAzNTgwNCwiZXhwIjoyMDY2NjExODA0fQ.8SrAbBiC5UaxeugZ-7c8Q2k3GqMFtgHfxG1Z6dgFX6I" // Replace with your actual auth token
        },
        body: JSON.stringify(data_formate)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
    })
}

function display_timer() {
    var timer_div = document.getElementById("time");
    var timer_str = get_timer_str();
    timer_div.innerHTML = timer_str;
}

function get_timer_str() {
    if (localStorage.getItem("time_end") !== null && localStorage.getItem("time_end") !== undefined) {
        var time_stamp_now = parseInt(localStorage.getItem("time_end"));
    } else {
        var time_stamp_now = new Date().getTime();
    }
    
    var time_diff = time_stamp_now - time_stamp;
    var seconds = Math.floor((time_diff / 1000) % 60);
    var minutes = Math.floor((time_diff / (1000 * 60)) % 60);
    var hours = Math.floor((time_diff / (1000 * 60 * 60)) % 24);
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}