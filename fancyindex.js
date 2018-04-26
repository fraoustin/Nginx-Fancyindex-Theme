console.log("run fancyindex.js");

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function clickSearch() {
    var listOfItems =  document.getElementsByClassName("search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.remove("search-novisible");
    }
    var listOfItems =  document.getElementsByClassName("no-search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.add("search-novisible");
    }
    document.getElementById("search-field").select();
}

function clickResetSearch() {
    var listOfItems =  document.getElementsByClassName("no-search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.remove("search-novisible");
    }
    var listOfItems =  document.getElementsByClassName("search");
    for (var i = 0; i < listOfItems.length; ++i) {
        var item = listOfItems[i];
        item.classList.add("search-novisible");
    }
    document.getElementById("search-field").value = "";

    var listOfItems =  document.getElementsByClassName("item");
    for (var i = 0; i < listOfItems.length; ++i) {
        listOfItems[i].classList.remove("resultsearch-novisible");
    }
}

// Get enter in the input field search
var input = document.getElementById("search-field");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        searchregex = document.getElementById("search-field").value;
        var listOfItems =  document.getElementsByClassName("item");
        for (var i = 0; i < listOfItems.length; ++i) {
            var item = listOfItems[i];
            value = item.getElementsByTagName("a")[0].name;
            if (value.match(searchregex)) {
                item.classList.remove("resultsearch-novisible");
            } else {
                item.classList.add("resultsearch-novisible");
            };
        }
    }
}); 


// manage title, bar, ...
var currentPath = document.getElementById("original_fancyindex").childNodes[0].textContent.trim();
document.getElementById("currentPathTitle").innerHTML = currentPath;
var arrayOfCurrentPath = currentPath.split("/");
arrayOfCurrentPath.splice(0, 1);
arrayOfCurrentPath.splice(arrayOfCurrentPath.length-1, 1);

if (arrayOfCurrentPath.length > 0) {
    document.getElementById("currentTitle").innerHTML = arrayOfCurrentPath[arrayOfCurrentPath.length-1];
} else {
    document.getElementById("currentTitle").innerHTML = "Root";
};
document.getElementById("homelink").href = "../".repeat(arrayOfCurrentPath.length);
document.getElementById("homebtn").href = "../".repeat(arrayOfCurrentPath.length);

// manage sort
if (window.location.href.split('?')[1] == "C=M&O=D") {
    document.getElementById("sorByDate").href = "?C=M&O=A";
};
if (window.location.href.split('?')[1] == "C=N&O=D") {
    document.getElementById("sortByName").href = "?C=N&O=A";
};
if (window.location.href.split('?')[1] == "C=S&O=D") {
    document.getElementById("sortBySize").href = "?C=S&O=A";
};

// menu
var templateLink=`
    <li class="mdl-list__item mdl-navigation__link">
        <a href="specHref">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-icon">specIcon</i>
                specLib
            </span>
        </a>
    </li>`

var pathelt="/"
arrayOfCurrentPath.forEach(function(element) {
    pathelt = pathelt + element + "/";
    document.getElementById("menuNav").appendChild(htmlToElement(templateLink.replace("specHref",pathelt)
                                                                                .replace("specIcon","subdirectory_arrow_right")
                                                                                .replace("specLib",element)));
});

// list table
var templateItem=`
    <li class="mdl-list__item item">
        <span class="mdl-list__item-primary-content">
            <span class="mdl-list__item-avatar specColor"><i class="material-icons">specIcon</i></span>
            <a name="specLib" href="specHref">
            <span>
                specLib
                <span class="second_line">specDte</span>
                <span class="second_line">specSize</span>
            </span>
            </a>
        </span>
        <span class="mdl-list__item-secondary-content">
            <!--
            <a class="mdl-list__item-secondary-action mdl-color-text--accent" href="#">
                <i class="material-icons">more_vert</i>
            </a>
            -->
        </span>
    </li>
`

var listOfItems = document.getElementById("list").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
var href = "";
var lib = "";
var size = "";
var dte = "";
var icon = ""; // folder_open or insert_drive_file
var color = ""; // mdl-color--accent or mdl-color--accent-dark 
for (var i = 0; i < listOfItems.length; ++i) {
    var item = listOfItems[i];
    href = item.childNodes[0].childNodes[0].href;
    lib = item.childNodes[0].childNodes[0].textContent;
    size = item.childNodes[1].textContent;
    dte = item.childNodes[2].textContent;
    if (lib.substring(lib.length-1) == "/") {
        icon = "folder_open";
        color = "mdl-color--accent";
        lib = lib.substring(0,lib.length-1)
    } else {
        icon = "insert_drive_file";
        color = "mdl-color--accent-dark";
    }
    if (size == '-') {
        size=''
    }
    if (dte == '-') {
        dte=''
    }

    document.getElementById("listItems").appendChild(htmlToElement(templateItem.replace("specHref",href)
                                                                                .replace("specIcon",icon)
                                                                                .replace("specSize",size)
                                                                                .replace("specDte",dte)
                                                                                .replace("specColor",color)
                                                                                .replace("specLib",lib)
                                                                                .replace("specLib",lib)
                                                                            ));
    
}
var out = window.location.href.replace(/:\/\//, '://log:out@');
document.getElementById("logOut").href = out;

