var count_good = 0;
var timer = null;
var timer_total = 0;
var countdown = null;
var item_wanted = null;
var time_stamp = 0;

var list_item_found = [];
var data_times_collect = [];

function start_game() {
    count_good = 0;
    timer = 60;
    // timer = 1;
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
    var best_score_display = document.getElementById("final-best-score");
    var best_score = localStorage.getItem("best_score") || 0;
    best_score_display.textContent = best_score;
    var score_display = document.getElementById("score-value");
    score_display.textContent = count_good;
    list_item_found = [];
    item_wanted = null;
    try{
        display_found_items();
    } catch (e) {
    }
    clear_table();

    send_data_times_collect();
}

function close_end_interface () {
    var end_game_div = document.getElementById("end-game");
    end_game_div.style.display = "none";
    var body = document.querySelector("body");
    body.classList.remove("game");
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
    do_sound('drop');
    count_good++;
    var score_display = document.getElementById("score-value");
    score_display.textContent = count_good;
    list_item_found.push(item_wanted.result.id.replace("minecraft:", "minecraft_"));
    var date_now = Date.now();
    var time_taken = date_now - time_stamp;
    data_times_collect.push({
        item: item_wanted.result.id,
        time: time_taken,
        skip: false
    });
    new_wanted_item();

    display_found_items();
    
    var time_win = 10;
    timer += time_win;
    timer_total += time_win;
    set_timer(timer);
    timer_color_effect("+", time_win);
    clear_table();
}

function new_wanted_item() {
    var craft_temp = crafts;

    var validCrafts = [];
    craft_temp.forEach(craft => {
        if (craft.result && craft.result.id) {
            validCrafts.push(craft);
        }
    });

    var filteredCrafts = [];
    validCrafts.forEach(craft => {
        craft.ponderation = craft.ponderation;
        if (craft.ponderation > 0) {
            filteredCrafts.push(craft);
        }
    });
    validCrafts = filteredCrafts;
    if (validCrafts.length === 0) {
        return;
    }

    for (let craft of validCrafts) {
        if (craft.result.id.includes('copper')) {
            craft.ponderation = (craft.ponderation) / 4;
            if (craft.result.id.includes('waxed')) {
                craft.ponderation = craft.ponderation / 2;
            }
        }

        const minecraft_colors = ['red', 'green', 'blue', 'yellow', 'black', 'white', 'brown', 'gray', 'light_gray', 'cyan', 'purple', 'pink'];
        if ((craft.result.id.includes('wool') || craft.result.id.includes('bed') || craft.result.id.includes('glass') || craft.result.id.includes('carpet') || craft.result.id.includes('concrete') || craft.result.id.includes('terracotta')) &&
            minecraft_colors.some(color => craft.result.id.includes(color))) {
            craft.ponderation = (craft.ponderation) / minecraft_colors.length;
        }

        const minecraft_woods = ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'mangrove', 'cherry', 'crimson', 'warped', 'pale'];
        if ((craft.result.id.includes('planks') || craft.result.id.includes('log') || craft.result.id.includes('stripped') || craft.result.id.includes('slab') || craft.result.id.includes('stairs') || craft.result.id.includes('fence') || craft.result.id.includes('fence_gate') || craft.result.id.includes('hanging')) &&
            minecraft_woods.some(wood => craft.result.id.includes(wood))) {
            craft.ponderation = (craft.ponderation) / minecraft_woods.length;
        }

        const stones = ['stone', 'granite', 'diorite', 'andesite', 'cobblestone', 'mossy_cobblestone', 'deepslate', 'tuff', 'calcite', 'prismarine', 'blackstone', 'nether_brick', 'red_nether_brick', 'quartz', 'sandstone', 'red_sandstone', 'end_stone', 'purpur', 'basalt', 'polished_basalt'];
        if ((craft.result.id.includes('slab') || craft.result.id.includes('stairs') || craft.result.id.includes('wall') || craft.result.id.includes('brick') || craft.result.id.includes('block')) &&
            stones.some(stone => craft.result.id.includes(stone))) {
            craft.ponderation = (craft.ponderation) / stones.length;
        }
    }

    const totalWeight = validCrafts.reduce((sum, craft) => sum + (craft.ponderation), 0);

    const cumulativeWeights = [];
    let cumulativeSum = 0;
    for (let craft of validCrafts) {
        cumulativeSum += (craft.ponderation);
        cumulativeWeights.push(cumulativeSum);
    }

    const randomWeight = getSecureRandom() * totalWeight;

    for (let i = 0; i < validCrafts.length; i++) {
        if (randomWeight < cumulativeWeights[i]) {
            item_wanted = validCrafts[i];
            time_stamp = Date.now();
            
            if(item_wanted.result.id.replace(':', '_') in list_item_found) {
                return new_wanted_item();
            }
            return;
        }
    }

    return new_wanted_item();
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
    if( seconds < 0) {
        seconds = 0;
    }
    var timerDisplay = document.getElementById("time");
    var minutes = Math.floor(seconds / 60);
    var secs = seconds % 60;
    timerDisplay.textContent = (minutes < 10 ? "0" : "") + minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

function timer_color_effect(type, time) {
    var timerDisplay = document.getElementById("time");

    timerDisplay.style.transition = "none"; 
    timerDisplay.style.color = (type === "+" ? "#39d52f" : "#cf1515");

    void timerDisplay.offsetWidth;

    timerDisplay.style.transition = "color 2s";
    timerDisplay.style.color = "white";
}

function lose () {
    var score = count_good;
    var best_score = localStorage.getItem("best_score") || 0;
    if (score > best_score) {
        localStorage.setItem("best_score", score);
        best_score = score;
    }
    stop_game();
}

function skip () {
    if (!item_wanted) {
        return;
    }
    new_wanted_item();
    var time_penalty = 10;
    timer -= time_penalty;
    set_timer(timer);
    timer_color_effect("-", time_penalty);

    var date_now = Date.now();
    var time_taken = date_now - time_stamp;
    data_times_collect.push({
        item: item_wanted.result.id,
        time: time_taken,
        skip: true
    });

    display_found_items();
}

function display_found_items() {
    var found_items_div = document.getElementById("found-items");
    var html = "";
    html += "<div class='btn_in_game found_list wanted_btn_'>" + "<img src=\"items/texture/" + item_wanted.result.id.replace('minecraft:' , 'minecraft_') + ".png\"><p>"+item_wanted.result.id.replace('minecraft:', '').replaceAll('_', ' ')+"</p></div>";

    list_item_found = list_item_found.reverse(); 
    list_item_found.forEach(function(item) {
        var name_tag = item;
        html += "<div class='btn_in_game found_list shadow_btn'>" + "<img src=\"items/texture/" + name_tag + ".png\"><p>"+name_tag.replace('minecraft_', '').replaceAll('_', ' ')+"</p></div>";
    });
    found_items_div.innerHTML = html;
}

function getSecureRandom() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
}

function send_data_times_collect () {
    var random_str = Math.random().toString(36).substring(2, 15); 
    var data_complete = {
        mode : "crafting",
        game :  random_str,
        data : data_times_collect,
        score : count_good,
        time : timer_total,
        best_score : localStorage.getItem("best_score") || 0,
        date : new Date().getTime()
    }
    
    var data_formate = {
        json: JSON.stringify(data_complete),
    }

    // supabase
    fetch("https://zdaigtrxwbjcvxdtwwgk.supabase.co/rest/v1/recipe-craft", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYWlndHJ4d2JqY3Z4ZHR3d2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzU4MDQsImV4cCI6MjA2NjYxMTgwNH0.IkcTKvbiMeBuLnrEupcMwx7LzBGfFG6U7SLbkRHvtFM", // Replace with your actual API key
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYWlndHJ4d2JqY3Z4ZHR3d2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTAzNTgwNCwiZXhwIjoyMDY2NjExODA0fQ.8SrAbBiC5UaxeugZ-7c8Q2k3GqMFtgHfxG1Z6dgFX6I" // Replace with your actual auth token
        },
        body: JSON.stringify(data_formate)
    })
}

function get_data() {
    // get all
    fetch("https://zdaigtrxwbjcvxdtwwgk.supabase.co/rest/v1/recipe-craft?select=*", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYWlndHJ4d2JqY3Z4ZHR3d2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzU4MDQsImV4cCI6MjA2NjYxMTgwNH0.IkcTKvbiMeBuLnrEupcMwx7LzBGfFG6U7SLbkRHvtFM", // Replace with your actual API key
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYWlndHJ4d2JqY3Z4ZHR3d2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTAzNTgwNCwiZXhwIjoyMDY2NjExODA0fQ.8SrAbBiC5UaxeugZ-7c8Q2k3GqMFtgHfxG1Z6dgFX6I" // Replace with your actual auth token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data fetched successfully:", data);
    })
}