new ClipboardJS("#btnCopyURL", {
    container: document.querySelector("dialog"),
    text: function() {
        return document.querySelector("dialog").getAttribute("url");
    }
});

function htmlToElement(html) {
    var template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function clickCloseInfo() {
    var dialog = document.querySelector("dialog");
    dialog.removeAttribute("url");
    dialog.close();
}

function clickSearch() {
    var listOfItems = document.getElementsByClassName("search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.remove("search-novisible");
    }
    var listOfItems = document.getElementsByClassName("no-search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.add("search-novisible");
    }
    document.getElementById("search-field").select();
}

function clickResetSearch() {
    var listOfItems = document.getElementsByClassName("no-search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.remove("search-novisible");
    }
    var listOfItems = document.getElementsByClassName("search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.add("search-novisible");
    }
    document.getElementById("search-field").value = "";

    var listOfItems = document.getElementsByClassName("item");
    for (var i = 0; i < listOfItems.length; ++i) {
        listOfItems[i].classList.remove("resultsearch-novisible");
    }
}

var templateDialog = `    
    <div>
        <li class="mdl-list__item item">
            <span class="mdl-list__item-primary-content">
            <span class="mdl-list__item-avatar specColor"><i class="material-icons">specIcon</i></span>
                specLib
            <span>
        </li>
        <div class="mdl-dialog__content" id="dialog-content">
        </div>
    </div>`;

function clickGetInfo(id) {
    var dialog = document.querySelector("dialog");
    var showDialogButton = document.querySelector("#show-dialog");
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    var listOfItems = document
        .getElementById("list")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");
    var item = listOfItems[id];
    lib = item.childNodes[0].childNodes[0].textContent;
    size = item.childNodes[1].textContent;
    dte = item.childNodes[2].textContent;
    if (lib.substring(lib.length - 1) == "/") {
        icon = "folder_open";
        color = "mdl-color--accent";
    } else {
        icon = "insert_drive_file";
        color = "mdl-color--accent-dark";
    }
    while (document.getElementById("templateDialog").firstChild) {
        document
            .getElementById("templateDialog")
            .removeChild(document.getElementById("templateDialog").firstChild);
    }
    var elt = htmlToElement(
        templateDialog
            .replace("specIcon", icon)
            .replace("specLib", lib)
            .replace("specColor", color)
    );
    document.getElementById("templateDialog").appendChild(elt);

    var listOfItems = document
        .getElementById("list")
        .getElementsByTagName("thead")[0]
        .getElementsByTagName("th");
    for (var i = 0; i < listOfItems.length; ++i) {
        var info = document.createElement("div");
        info.innerHTML =
            listOfItems[i].childNodes[0].textContent + " : " + item.childNodes[i].textContent;
        document.getElementById("dialog-content").appendChild(info);
    }

    var url = window.location.href;
    url = url.substr(0, url.lastIndexOf("/") + 1);
    dialog.setAttribute("url", url + encodeURIComponent(lib));

    //search info and insert into dialog
    dialog.showModal();
}

// GLOBAL

function runSearch() {
    searchregex = document.getElementById("search-field").value;
    var listOfItems = document.getElementsByClassName("item");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        value = item.getElementsByTagName("a")[0].name;
        if (value.match(new RegExp(searchregex, 'i'))) {
            item.classList.remove("resultsearch-novisible");
        } else {
            item.classList.add("resultsearch-novisible");
        }
    }
}

//// Get enter in the input field search
var input = document.getElementById("search-field");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    runSearch();
});


// manage title, bar, ...
var currentPath = document.getElementById("original_fancyindex").childNodes[0].textContent.trim();
document.getElementById("currentPathTitle").innerHTML = currentPath;
var arrayOfCurrentPath = currentPath.split("/");
arrayOfCurrentPath.splice(0, 1);
arrayOfCurrentPath.splice(arrayOfCurrentPath.length - 1, 1);

if (arrayOfCurrentPath.length > 0) {
    document.getElementById("currentTitle").innerHTML =
        arrayOfCurrentPath[arrayOfCurrentPath.length - 1];
} else {
    document.getElementById("currentTitle").innerHTML = "Root";
}
document.getElementById("homelink").href = "../".repeat(arrayOfCurrentPath.length);
document.getElementById("homebtn").href = "../".repeat(arrayOfCurrentPath.length);

// manage sort
if (window.location.href.split("?")[1] == "C=M&O=D") {
    document.getElementById("sortByDate").href = "?C=M&O=A";
}
if (window.location.href.split("?")[1] == "C=N&O=D") {
    document.getElementById("sortByName").href = "?C=N&O=A";
}
if (window.location.href.split("?")[1] == "C=S&O=D") {
    document.getElementById("sortBySize").href = "?C=S&O=A";
}

// menu
var templateLink = `
    <li class="mdl-list__item mdl-navigation__link">
        <a href="specHref">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-icon">specIcon</i>
                specLib
            </span>
        </a>
    </li>`;

var pathelt = "/";
arrayOfCurrentPath.forEach(function(element) {
    pathelt = pathelt + element + "/";
    document.getElementById("menuNav").appendChild(
        htmlToElement(
            templateLink
                .replace("specHref", pathelt)
                .replace("specIcon", "subdirectory_arrow_right")
                .replace("specLib", element)
        )
    );
});

// list table
var templateItem = `
    <li class="mdl-list__item item">
        <span class="mdl-list__item-primary-content">
            <span class="mdl-list__item-avatar specColor"><i class="material-icons">specIcon</i></span>
            <a name="specLib" href="specHref">
            <span>
                specLib
                <span class="second_line">specInfo</span>
                <!-- <span class="second_line">specDte</span>
                <span class="second_line">specSize</span>-->
            </span>
            </a>
        </span>
        <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action mdl-color-text--accent specViewGetInfo" href="#" onclick="clickGetInfo(specId)">
                <i class="material-icons">more_vert</i>
            </a>
        </span>
    </li>
`;

var listOfItems = document
    .getElementById("list")
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");
var href = "";
var lib = "";
var size = "";
var dte = "";
var icon = ""; // folder_open or insert_drive_file
var color = ""; // mdl-color--accent or mdl-color--accent-dark
var viewGetInfo = "";
var txtInfo = "";
var typOfSort = "name";
try {
    if (window.location.href.split("?")[1].split("&")[0] == "C=M") {
        typOfSort = "date";
    }
    if (window.location.href.split("?")[1].split("&")[0] == "C=S") {
        typOfSort = "size";
    }
} catch (error) {}
for (var i = 0; i < listOfItems.length; ++i) {
    var item = listOfItems[i];
    href = item.childNodes[0].childNodes[0].href;
    lib = item.childNodes[0].childNodes[0].textContent;
    size = item.childNodes[1].textContent;
    dte = item.childNodes[2].textContent;
    viewGetInfo = "";
    txtInfo = "";
    if (lib.substring(lib.length - 1) == "/") {
        icon = "folder_open";
        color = "mdl-color--accent";
        lib = lib.substring(0, lib.length - 1);
    } else {
        icon = "insert_drive_file";
        color = "mdl-color--accent-dark";
    }
    if (size == "-") {
        size = "";
    }
    if (dte == "-") {
        dte = "";
    }
    if (size == "" && dte == "" && lib == "Parent directory") {
        icon = "arrow_back";
        color = "mdl-color--primary";
        viewGetInfo = "getinfo-novisible";
    }
    if (typOfSort == "date") {
        txtInfo = dte;
    }
    if (typOfSort == "size") {
        txtInfo = size;
    }

    document.getElementById("listItems").appendChild(
        htmlToElement(
            templateItem
                .replace("specHref", href)
                .replace("specIcon", icon)
                //.replace("specSize",size)
                //.replace("specDte",dte)
                .replace("specInfo", txtInfo)
                .replace("specColor", color)
                .replace("specLib", lib)
                .replace("specLib", lib)
                .replace("specViewGetInfo", viewGetInfo)
                .replace("specId", i)
        )
    );
}

var out = window.location.href.replace(/:\/\//, "://log:out@");
document.getElementById("logOut").href = out;
