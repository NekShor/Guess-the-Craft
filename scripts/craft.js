var is_left_click = false;

window.addEventListener("load", function() {
    var crafting_places_obj = document.querySelectorAll(".grid-item");
    crafting_places_obj.forEach(function(place) {
      place.addEventListener("mouseover", function() {
        if (is_left_click) {
            place_item(place);
        }
      });
    });
});

function place_item(case_place) {
    try{
        var item_selected_code = item_selected ? item_selected.code : null;
        case_place.setAttribute("data-item", item_selected_code);
        case_place.setAttribute("data-id", item_selected_code);
        case_place.style.backgroundImage = item_selected ? "url('items/texture/" + item_selected.code + ".png')" : "none";
        craft_item();
    } catch (error) {
    }
}

function clear_table() {
    var crafting_grid = document.getElementById("crafting-grid");
    var crafting_places_obj = crafting_grid.querySelectorAll(".grid-item");
    crafting_places_obj.forEach(function(place) {
        place.setAttribute("data-item", 'null');
        place.setAttribute("data-id", 'null');
        place.style.backgroundImage = "none";
    });
    document.getElementById("craft-result").innerHTML = "";
}

function craft_item() {
    var array_craft = formate_craft_item();
    
    var item_crafted = validateCraft(array_craft.array_craft, crafts, tagMap, array_craft.type_craft);
    if(!item_crafted) {
        var array_craft_flip_horizontal = [
            array_craft.array_craft[0].reverse(),
            array_craft.array_craft[1].reverse(),
            array_craft.array_craft[2].reverse()
        ];
        item_crafted = validateCraft(array_craft_flip_horizontal, crafts, tagMap, array_craft.type_craft);
    }
    var result = document.getElementById("craft-result");
    if (item_crafted) {
        var item_formated = item_crafted.id.replace('minecraft:', 'minecraft_');
        var obj = items.find(function(item) {
            return item.code === item_formated;
        });
        
        result.innerHTML = "<img src=\"items/texture/" + obj.code + ".png\" alt=\"" + obj.name + "\"> ";
        is_good_craft(obj);
    } else {
        result.innerHTML = "";
    }
}

function get_type_craftinf () {
    var tab_active = document.querySelector(".tab-active");
    if (tab_active.getAttribute('id') === "tab-craft") {
        return "craft";
    } else if (tab_active.getAttribute('id') === "tab-furnace") {
        return "furnace";
    }
    return "craft";
}

function formate_craft_item() {
    var type_craft = get_type_craftinf();

    if( type_craft === "craft") {
        var array_craft = formate_craft_table();
    } else if (type_craft === "furnace") {
        var array_craft = formate_furnace_table();
    }

   return {array_craft: array_craft, type_craft: type_craft};
}

function formate_craft_table() {
    var crafting_grid = document.querySelector("#crafting-grid .mcui-input");

    var crafting_places_obj = crafting_grid.querySelectorAll(".grid-item");
    var array = [];
    crafting_places_obj.forEach(function(place) {
        var item_code = place.getAttribute("data-item");
        if (item_code) {
            item_code = item_code.replace('minecraft_', 'minecraft:'); 
            if(item_code === "null") {
                item_code = null;
            }
            array.push(item_code);
        } else {
            array.push(null);
        }
    });

    var array_craft = [
        array.slice(0, 3),
        array.slice(3, 6),
        array.slice(6, 9)
    ]

   return array_craft;
}

function formate_furnace_table() {
    var furnace_grid = document.querySelector("#crafting-grid .mcui-furnace");
    
    var furnace_places_obj = furnace_grid.querySelector(".grid-item");
    var array = [
        [null, null, null],
        [null, furnace_places_obj.getAttribute("data-item").replace('minecraft_', 'minecraft:') || null, null],
        [null, null, null]
    ];
    return array;
}


document.addEventListener("contextmenu", function(event) {
    var target = event.target;
    if (target.classList.contains("grid-item") || target.tagName === "IMG") {
        event.preventDefault();
        var item = target.closest(".grid-item");
        item.setAttribute("data-item", 'null');
        item.setAttribute("data-id", 'null');
        item.style.backgroundImage = "none";

        craft_item();
    }
});

document.addEventListener("mousedown", function(event) {
    if(event.target.classList.contains("grid-item")) {
        event.preventDefault(); 
        var place = event.target.closest(".grid-item");
        if (event.button === 0) {
            is_left_click = true;
            place_item(place);
        } else if (event.button === 2) {
            is_left_click = false;
        }
    }
});

document.addEventListener("mouseup", function(event) {
    if (event.button === 0) {
        is_left_click = false;
    }
});

if ('ontouchstart' in window) {
    let lastTouchTime = 0;

    document.addEventListener("touchstart", function(event) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastTouchTime;

        if (timeDifference < 300) { // Si deux tapotements en moins de 300ms
            event.preventDefault(); // Empêche le zoom
        }

        lastTouchTime = currentTime;
    }, { passive: false }); // Définit l'écouteur comme non passif
}

let touchTimeout;

document.addEventListener("touchstart", function(event) {
    if (event.target.classList.contains("grid-item")) {
        event.preventDefault(); // Prevent default behavior
        var place = event.target.closest(".grid-item");

        touchTimeout = setTimeout(() => {
            is_left_click = true; // Simule un clic gauche prolongé
            place_item(place); // Place l'élément
        }, 0); // 500ms pour considérer comme un maintien
    }
}, { passive: false });

document.addEventListener("touchend", function(event) {
    clearTimeout(touchTimeout); // Annule le timeout si le toucher est relâché
    is_left_click = false;
});

document.addEventListener("touchmove", function(event) {
    var cursor_position = event.touches[0];
    var target = document.elementFromPoint(cursor_position.clientX, cursor_position.clientY);
    
    if (target.classList.contains("grid-item")) {
        event.preventDefault(); // Empêche le comportement par défaut du déplacement
        if (is_left_click) {
            place_item(target.closest(".grid-item")); // Place l'élément si le clic gauche est actif
        }
    }
}, { passive: false });



function matchesIngredient(expected, actual, tagMap) {
    if (!expected) return false;

    const matchOne = (exp) => {
        if (exp.startsWith("#")) {
            const tagItems = tagMap[exp] || [];
            return tagItems.includes(actual);
        }
        return exp === actual;
    };

    if (Array.isArray(expected)) {
        return expected.some(e => matchOne(e));
    } else {
        return matchOne(expected);
    }
}
  
function matchShaped(recipe, inputGrid, tagMap) {
    const pattern = recipe.pattern;
    const height = pattern.length;
    const width = pattern[0].length;

    for (let yOffset = 0; yOffset <= 3 - height; yOffset++) {
        for (let xOffset = 0; xOffset <= 3 - width; xOffset++) {
            let match = true;
    
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const symbol = pattern[y][x];
                    const expected = recipe.key[symbol];
                    const actual = inputGrid[y + yOffset]?.[x + xOffset];
        
                    if (symbol === " " && actual) {
                    match = false;
                    } else if (symbol !== " " && !matchesIngredient(expected, actual, tagMap)) {
                    match = false;
                    }
        
                    if (!match) break;
                }
                if (!match) break;
            }
    
            if (match) {
                for (let y = 0; y < 3; y++) {
                    for (let x = 0; x < 3; x++) {
                        const inPatternY = y >= yOffset && y < yOffset + height;
                        const inPatternX = x >= xOffset && x < xOffset + width;
            
                        if (!inPatternY || !inPatternX) {
                            const extra = inputGrid[y][x];
                            if (extra) {
                            match = false;
                            break;
                            }
                        }
                    }
                    if (!match) break;
                }
            }
            if (match) return true;
        }
    }
    return false;
}

const flatten = grid => grid.flat().filter(x => x);
  
const matchTransmute = (recipe, inputGrid, tagMap) => {
    const input = flatten(inputGrid);
    if (input.length !== 2) return false;

    const item = input[0];
    const item2 = input[1];
    const matchesInput = matchesIngredient(recipe.input, item, tagMap) ||
                         matchesIngredient(recipe.input, item2, tagMap);
    const matchesMaterial = matchesIngredient(recipe.material, item, tagMap) ||
                            matchesIngredient(recipe.material, item2, tagMap);
    return matchesInput && matchesMaterial;
};

const matchShapeless = (recipe, inputGrid) => {
    const input = flatten(inputGrid);
    const required = [...recipe.ingredients];

    for (const item of input) {
        const index = required.findIndex(ing => matchesIngredient(ing, item, tagMap));
        if (index === -1) return false;
        required.splice(index, 1);
    }

    return required.length === 0;
};

const matchStonecutting = (recipe, inputGrid) => {
    const input = flatten(inputGrid);
    return input.length === 1 &&
        matchesIngredient(recipe.ingredient, input[0], tagMap);
};

const matchSmelting = (recipe, inputGrid) => {
    const input = flatten(inputGrid);
    return input.length === 1 &&
        matchesIngredient(recipe.ingredient, input[0], tagMap);
};
function validateCraft(inputGrid, recipes, tagMap = {}, type_craft = "craft") {
    const flatten = grid => grid.flat().filter(x => x);

    for (const recipe of recipes) {
        if (type_craft === "craft") {
            switch (recipe.type) {
                case "minecraft:crafting_shaped":
                    if (matchShaped(recipe, inputGrid, tagMap)) return recipe.result;
                    break;
                case "minecraft:crafting_shapeless":
                    if (matchShapeless(recipe, inputGrid, tagMap)) return recipe.result;
                    break;
                // case "minecraft:stonecutting":
                //     if (matchStonecutting(recipe, inputGrid, tagMap)) return recipe.result;
                //     break;
                // case "minecraft:smelting":
                //     if (matchSmelting(recipe, inputGrid, tagMap)) return recipe.result;
                //     break;
                case "minecraft:crafting_transmute":
                    if (matchTransmute(recipe, inputGrid, tagMap)) return recipe.result;
                    break;
                default:
            }
        } else if (type_craft === "furnace") {
            switch (recipe.type) {
                case "minecraft:smelting":
                    if (matchSmelting(recipe, inputGrid, tagMap)) return recipe.result;
                    break;
                case "minecraft:blasting":
                    if (matchSmelting(recipe, inputGrid, tagMap)) return recipe.result;
                    break;
                case "minecraft:smoking":
                    if (matchSmelting(recipe, inputGrid, tagMap)) return recipe.result;
                    break;
                // case "minecraft:campfire_cooking":
                //     if (matchSmelting(recipe, inputGrid, tagMap)) return recipe.result;
                //     break;
                default:
            }
        }
    }

    return null;
}

function filterCraftableRecipes(availableItems, recipes, tagMap = {}) {
    var crafts_possible = [];
    recipes.forEach(function(recipe) {
        var possible = false;
        switch (recipe.type) {
            case "minecraft:crafting_shaped":
                var items_requierd = recipe.key;
                for (var key in items_requierd) {
                    if (typeof items_requierd[key] === 'string') {
                        items_requierd[key] = [items_requierd[key]];
                    }
                    var found = false;
                    for (var i = 0; i < items_requierd[key].length; i++) {
                        var item = items_requierd[key][i];
                        var normalizedItem = item.replace('minecraft:', 'minecraft_');

                        if (availableItems.includes(normalizedItem)) {
                            found = true;
                            break;
                        }

                        if (tagMap[item]) {
                            for (var taggedItem of tagMap[item]) {
                                if (availableItems.includes(taggedItem.replace('minecraft:', 'minecraft_'))) {
                                    found = true;
                                    break;
                                }
                            }
                        }

                        if (found) break;
                    }
                    if (!found) {
                        possible = false;
                        break;
                    } else {
                        possible = true;
                    }
                }
                if (possible) {
                    crafts_possible.push(recipe);
                }
                break;
            case "minecraft:crafting_shapeless":
                var items_requierd = recipe.ingredients;
                for (var i = 0; i < items_requierd.length; i++) {
                    if (typeof items_requierd[i] === 'string') {
                        items_requierd[i] = [items_requierd[i]];
                    }
                    var found = false;
                    for (var j = 0; j < items_requierd[i].length; j++) {
                        var item = items_requierd[i][j];
                        var normalizedItem = item.replace('minecraft:', 'minecraft_');

                        if (availableItems.includes(normalizedItem)) {
                            found = true;
                            break;
                        }

                        if (tagMap[item]) {
                            for (var taggedItem of tagMap[item]) {
                                if (availableItems.includes(taggedItem.replace('minecraft:', 'minecraft_'))) {
                                    found = true;
                                    break;
                                }
                            }
                        }

                        if (found) break;
                    }
                    if (!found) {
                        possible = false;
                        break;
                    } else {
                        possible = true;
                    }
                }
                if (possible) {
                    crafts_possible.push(recipe);
                }
                break;
            // case "minecraft:stonecutting":
            //     is_possible = matchStonecutting(recipe, availableItems, tagMap);
            //     break;
            case "minecraft:smelting":
                var items_requierd = typeof recipe.ingredient === 'string' ? [recipe.ingredient] : recipe.ingredient;
                for (var i = 0; i < items_requierd.length; i++) {
                    var item = items_requierd[i];
                    var normalizedItem = item.replace('minecraft:', 'minecraft_');

                    if (availableItems.includes(normalizedItem)) {
                        possible = true;
                        break;
                    }

                    if (tagMap[item]) {
                        for (var taggedItem of tagMap[item]) {
                            if (availableItems.includes(taggedItem.replace('minecraft:', 'minecraft_'))) {
                                possible = true;
                                break;
                            }
                        }
                    }

                    if (possible) break;
                }
                if (possible) {
                    crafts_possible.push(recipe);
                }
                break;
            case "minecraft:campfire_cooking":
                var items_requierd = typeof recipe.ingredient === 'string' ? [recipe.ingredient] : recipe.ingredient;
                for (var i = 0; i < items_requierd.length; i++) {
                    var item = items_requierd[i];
                    var normalizedItem = item.replace('minecraft:', 'minecraft_');

                    if (availableItems.includes(normalizedItem)) {
                        possible = true;
                        break;
                    }

                    if (tagMap[item]) {
                        for (var taggedItem of tagMap[item]) {
                            if (availableItems.includes(taggedItem.replace('minecraft:', 'minecraft_'))) {
                                possible = true;
                                break;
                            }
                        }
                    }

                    if (possible) break;
                }
                if (possible) {
                    crafts_possible.push(recipe);
                }
                break;
            case "minecraft:blasting":
                var items_requierd = typeof recipe.ingredient === 'string' ? [recipe.ingredient] : recipe.ingredient;
                for (var i = 0; i < items_requierd.length; i++) {
                    var item = items_requierd[i];
                    var normalizedItem = item.replace('minecraft:', 'minecraft_');

                    if (availableItems.includes(normalizedItem)) {
                        possible = true;
                        break;
                    }

                    if (tagMap[item]) {
                        for (var taggedItem of tagMap[item]) {
                            if (availableItems.includes(taggedItem.replace('minecraft:', 'minecraft_'))) {
                                possible = true;
                                break;
                            }
                        }
                    }

                    if (possible) break;
                }
                if (possible) {
                    crafts_possible.push(recipe);
                }
                break;
            case "minecraft:smoking":
                var items_requierd = typeof recipe.ingredient === 'string' ? [recipe.ingredient] : recipe.ingredient;
                for (var i = 0; i < items_requierd.length; i++) {
                    var item = items_requierd[i];
                    var normalizedItem = item.replace('minecraft:', 'minecraft_');

                    if (availableItems.includes(normalizedItem)) {
                        possible = true;
                        break;
                    }

                    if (tagMap[item]) {
                        for (var taggedItem of tagMap[item]) {
                            if (availableItems.includes(taggedItem.replace('minecraft:', 'minecraft_'))) {
                                possible = true;
                                break;
                            }
                        }
                    }

                    if (possible) break;
                }
                if (possible) {
                    crafts_possible.push(recipe);
                }
                break;
                
            case "minecraft:crafting_transmute":
                var input = flatten(availableItems);
                if (input.length !== 2) return;
                if (matchesIngredient(recipe.input, input[0], tagMap) ||
                    matchesIngredient(recipe.input, input[1], tagMap)) {
                    crafts_possible.push(recipe);
                }
                break;
            default:
        }
    });
    var new_availableItems = [...availableItems, ...crafts_possible.map(recipe => recipe.result.id.replace('minecraft:', 'minecraft_'))];
    new_availableItems = [...new Set(new_availableItems)];

    if (new_availableItems.length > availableItems.length) {
        new_availableItems = filterCraftableRecipes(new_availableItems, recipes, tagMap);
    }

    return new_availableItems;
}

function change_tab(elem){
    var tabs = document.querySelectorAll(".tab");
    tabs.forEach(function(tab) {
        tab.classList.remove("tab-active");
    });

    elem.classList.add("tab-active");

    var inputs = document.querySelectorAll(".mcui-active");
    inputs.forEach(function(input) {
        input.classList.remove("mcui-active");
    });

    if (elem.getAttribute('id') === "tab-craft") {
        document.querySelector(".mcui-input").classList.add("mcui-active");
    } else if (elem.getAttribute('id') === "tab-furnace") {
        document.querySelector(".mcui-furnace").classList.add("mcui-active");
    }

    clear_table();
}