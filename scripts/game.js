var count_good = 0;
var timer = null;
var countdown = null; // Variable pour le setInterval
var item_wanted = null;


function start_game() {
    count_good = 0;
    timer = 60;

    new_wanted_item();
    start_countdown();
    var game_div = document.getElementById("container");
    game_div.style.display = "flex";
}

function is_good_craft(item) {
    if (item.code.replace("_", ":") === item_wanted.result.id) {
        good_item();
    }
}
    
function good_item() {
    count_good++;
    var score_display = document.getElementById("score");
    score_display.textContent = count_good;
    new_wanted_item();

    clear_table();

    timer += 5;
}

function new_wanted_item() {
    item_wanted = crafts[Math.floor(Math.random() * crafts.length)];
    console.log("Nouvel item voulu: " + item_wanted.result.id);

    var wanted_item_display = document.getElementById("wanted-item");
    wanted_item_display.innerHTML = "<img src=\"items/texture/" + item_wanted.result.id.replace("minecraft:", "minecraft_") + ".png\" alt=\"" + item_wanted.result.id + "\"> " + item_wanted.result.id;
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