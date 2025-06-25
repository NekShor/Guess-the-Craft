var item_selected = null;

function display_item(text) {
    var items_inv = document.querySelectorAll(".items_inv");
    items_inv.forEach(function(item) {
      if (item.getAttribute("data-id").toLowerCase().includes(text.toLowerCase())) {
        item.style.display = "inline-block";
      } else {
        item.style.display = "none";
      }
    });
}

function initialise_items(text) {
  var items = get_items(text);
  var div = document.getElementById("items_list");
  if (items.length === 0) {
      div.innerHTML = "<p>Aucun item trouvé</p>";
      return;
  }
  var html = "";
  items.forEach(function(item) {
      var name_tag = item.code;
      html += "<div class='invslot items_inv' data-id='"+item.code+"' onClick=\"set_item_selected('"+item.code+"')\">" + "<img src=\"items/texture/"+name_tag+".png\"></div>";
  });
  div.innerHTML = html;
}

function set_item_selected (item) {
    var itemObject = items.find(function(i) { return i.code === item; });
    item_selected = itemObject;
    document.getElementById("item_selected").innerHTML = "<img src=\"items/texture/"+item_selected.code+".png\"><p>" + item_selected.name.replace('minecraft ', '').trim() + "</p>";
    
    var crafting_grid = document.getElementById("crafting-grid");
    crafting_grid.style.cursor = "url('items/texture/"+item_selected.code+".png') 32 32, auto";
    var found_items = document.getElementById("found-items");
    found_items.style.cursor = "url('items/texture/"+item_selected.code+".png') 32 32, auto";
    var select_item = document.getElementById("select-item");
    select_item.style.cursor = "url('items/texture/"+item_selected.code+".png') 32 32, auto";
}

function get_items (text) {
    var itemsList = items || [];
    var filteredItems = itemsList
    .filter(function(item) {
      if (item.name.replace('minecraft', '').toLowerCase().includes(text.toLowerCase()) || item.code.replace('minecraft', '').toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
    })
    .map(function(item) {
      return item;
    });

    filteredItems.sort(function(a, b) {
		const distanceA = levenshteinDistance(text.toLowerCase(), a.name.replace('minecraft', '').toLowerCase());
		const distanceB = levenshteinDistance(text.toLowerCase(), b.name.replace('minecraft', '').toLowerCase());
		return distanceA - distanceB;
    });

    return filteredItems;
}

function levenshteinDistance (str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  return dp[len1][len2];
}