var count_good = 0;
var timer = null;
var countdown = null;
var item_wanted = null;

var list_item_found = [];

function start_game() {
    count_good = 0;
    timer = 60;
    list_item_found = [];

    new_wanted_item();
    display_found_items();
    start_countdown();
    var game_div = document.getElementById("container");
    game_div.style.display = "flex";
}

function is_good_craft(item) {
    if (!item_wanted) {
        return;
    }
    if (item.code.replace("_", ":") === item_wanted.result.id) {
        good_item();
    }
}
    
function good_item() {
    count_good++;
    var score_display = document.getElementById("score");
    score_display.textContent = count_good;
    list_item_found.push(item_wanted.result.id.replace("minecraft:", "minecraft_"));
    new_wanted_item();

    display_found_items();
    clear_table();

    timer += 5;
}

function new_wanted_item() {
    item_wanted = crafts[Math.floor(Math.random() * crafts.length)];
    console.log("Nouvel item voulu: " + item_wanted.result.id);
}

function start_countdown() {
    countdown = setInterval(function () {
        if (timer > 0) {
            timer--;
            set_timer(timer);
        } else {
            clearInterval(countdown); 
            lose();
        }
    }, 1000); // Décompte toutes les secondes
}

function set_timer (seconds) {
    var timerDisplay = document.getElementById("timer");
    var minutes = Math.floor(seconds / 60);
    var secs = seconds % 60;
    timerDisplay.textContent = (minutes < 10 ? "0" : "") + minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

function lose () {
    var game_div = document.getElementById("container");
    game_div.style.display = "none";
    alert("Game Over! You scored: " + count_good + " points.");
}

function display_found_items() {
    var found_items_div = document.getElementById("found-items");
    var html = "";
    html += "<div class='btn_in_game'>" + "<img src=\"items/texture/" + item_wanted.result.id.replace('minecraft:' , 'minecraft_') + ".png\"><p>"+item_wanted.result.id.replace('minecraft:', '').replaceAll('_', ' ')+"</p></div>";

    list_item_found = list_item_found.reverse(); 
    list_item_found.forEach(function(item) {
        var name_tag = item;
        html += "<div class='btn_in_game shadow_btn'>" + "<img src=\"items/texture/" + name_tag + ".png\"><p>"+name_tag.replace('minecraft_', '').replaceAll('_', ' ')+"</p></div>";
    });
    found_items_div.innerHTML = html;
}