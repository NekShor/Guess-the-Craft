var count_good = 0;
var timer = null;
var countdown = null; // Variable pour le setInterval
var item_wanted = null;

function start_game() {
    count_good = 0;
    timer = 60;

    new_wanted_item();
    start_countdown();
}

function is_good_craft(item) {
    if (item.code.replace("_", ":") === item_wanted.result.id) {
        good_item();
    }
}
    
function good_item() {
    count_good++;
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
            console.log("Time left: " + timer);
        } else {
            clearInterval(countdown);
            console.log("Game over!");
        }
    }, 1000); // Décompte toutes les secondes
}