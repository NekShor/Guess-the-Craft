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
        case_place.style.backgroundImage = item_selected ? "url('items/texture/" + item_selected.code + ".png')" : "none";
        formate_craft_item();
    } catch (error) {
    }
}

function clear_table() {
    var crafting_grid = document.getElementById("crafting-grid");
    var crafting_places_obj = crafting_grid.querySelectorAll(".grid-item");
    crafting_places_obj.forEach(function(place) {
        place.setAttribute("data-item", 'null');
        place.style.backgroundImage = "none";
    });
    document.getElementById("craft-result").innerHTML = "";
}

function formate_craft_item() {
    var crafting_grid = document.getElementById("crafting-grid");

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

    var item_crafted = validateCraft(array_craft, crafts, tagMap);

    var result = document.getElementById("craft-result");
    if (item_crafted) {
        var item_formated = item_crafted.id.replace('minecraft:', 'minecraft_');
        var obj = items.find(function(item) {
            return item.code === item_formated;
        });
        is_good_craft(obj);

        result.innerHTML = "<img src=\"items/texture/" + obj.code + ".png\" alt=\"" + obj.name + "\"> ";
    } else {
        result.innerHTML = "";
    }
}


document.addEventListener("contextmenu", function(event) {
    var target = event.target;
    if (target.classList.contains("grid-item") || target.tagName === "IMG") {
        event.preventDefault();
        var item = target.closest(".grid-item");
        item.setAttribute("data-item", 'null');
        item.style.backgroundImage = "none";

        formate_craft_item();
    }
});

document.addEventListener("mousedown", function(event) {
    var place = event.target.closest(".grid-item");
    if (event.button === 0) {
        is_left_click = true;
        place_item(place);
    } else if (event.button === 2) {
        is_left_click = false;
    }
});

document.addEventListener("mouseup", function(event) {
    if (event.button === 0) {
        is_left_click = false;
    }
});

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
  
  

function validateCraft(inputGrid, recipes, tagMap = {}) {
    const flatten = grid => grid.flat().filter(x => x);

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

    for (const recipe of recipes) {
        switch (recipe.type) {
            case "minecraft:crafting_shaped":
                if (matchShaped(recipe, inputGrid, tagMap)) return recipe.result;
                break;
            case "minecraft:crafting_shapeless":
                if (matchShapeless(recipe, inputGrid, tagMap)) return recipe.result;
                break;
            case "minecraft:stonecutting":
                if (matchStonecutting(recipe, inputGrid, tagMap)) return recipe.result;
                break;
            case "minecraft:smelting":
                if (matchSmelting(recipe, inputGrid, tagMap)) return recipe.result;
                break;
        }
    }

    return null;
}