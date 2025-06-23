var count_good = 0;
var timer = null;
var timer_total = 0;
var countdown = null;
var item_wanted = null;

var list_item_found = [];

function start_game() {
    count_good = 0;
    timer = 60;
    // timer = 60000;
    timer_total = timer;
    list_item_found = [];
    set_timer(timer);
    clearInterval(countdown);

    var end_game_div = document.getElementById("end-game");
    end_game_div.style.display = "none";

    new_wanted_item();
    display_found_items();
    start_countdown();

    var body = document.querySelector("body");
    body.classList.add("game");
}

function stop_game() {
    clearInterval(countdown);
    var body = document.querySelector("body");
    body.classList.remove("game");
    var end_game_div = document.getElementById("end-game");
    end_game_div.style.display = "block";
    var final_score = document.getElementById("final-score");
    final_score.textContent = count_good;
    var final_time = document.getElementById("final-time");
    var minutes = Math.floor(timer_total / 60);
    var seconds = timer_total % 60;
    final_time.textContent = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    set_timer(0);
    count_good = 0;
    var score_display = document.getElementById("score-value");
    score_display.textContent = count_good;
    list_item_found = [];
    item_wanted = null;
    try{
        display_found_items();
    } catch (e) {
    }
    clear_table();
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
    var score_display = document.getElementById("score-value");
    score_display.textContent = count_good;
    list_item_found.push(item_wanted.result.id.replace("minecraft:", "minecraft_"));
    new_wanted_item();

    display_found_items();
    clear_table();

    var time_win = 10;
    timer += time_win;
    timer_total += time_win;
    set_timer(timer);
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
    }, 1000);
}

function set_timer (seconds) {
    var timerDisplay = document.getElementById("time");
    var minutes = Math.floor(seconds / 60);
    var secs = seconds % 60;
    timerDisplay.textContent = (minutes < 10 ? "0" : "") + minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

function lose () {
    stop_game();
}

function display_found_items() {
    var found_items_div = document.getElementById("found-items");
    var html = "";
    html += "<div class='btn_in_game found_list'>" + "<img src=\"items/texture/" + item_wanted.result.id.replace('minecraft:' , 'minecraft_') + ".png\"><p>"+item_wanted.result.id.replace('minecraft:', '').replaceAll('_', ' ')+"</p></div>";

    list_item_found = list_item_found.reverse(); 
    list_item_found.forEach(function(item) {
        var name_tag = item;
        html += "<div class='btn_in_game found_list shadow_btn'>" + "<img src=\"items/texture/" + name_tag + ".png\"><p>"+name_tag.replace('minecraft_', '').replaceAll('_', ' ')+"</p></div>";
    });
    found_items_div.innerHTML = html;
}