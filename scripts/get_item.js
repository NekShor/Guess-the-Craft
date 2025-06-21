var item_selected = null;

function display_item(text) {
    var items = get_items(text);
    var div = document.getElementById("items_list");
    if (items.length === 0) {
        div.innerHTML = "<p>Aucun item trouvé</p>";
        return;
    }
    var html = "";
    items.forEach(function(item) {
        var name_tag = item.code;
        html += "<div onClick=\"set_item_selected('"+item.code+"')\">" + item.name + "<img src=\"items/texture/"+name_tag+".png\"></div>";
    });
    div.innerHTML = html;
}

function set_item_selected (item) {
  var itemObject = items.find(function(i) { return i.code === item; });
    item_selected = itemObject;
    document.getElementById("item_selected").innerHTML = "<img src=\"items/texture/"+item_selected.code+".png\"> " + item_selected.name;
}

function get_items(text) {
    var itemsList = items || [];
    var filteredItems = itemsList
    .filter(function(item) {
      if (item.name.toLowerCase().includes(text.toLowerCase()) || item.code.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
    })
    .map(function(item) {
      return item;
    });

    return filteredItems;
}
