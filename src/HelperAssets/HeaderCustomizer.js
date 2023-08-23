
(function() {
    var nTimer = setInterval(function() {
      if (window.jQuery) {
        try {
          //  addSearchBox();
            addCustomLinkInHeaderRegion();
         
        } catch (ex) {
    
        }
        clearInterval(nTimer);
      }
    }, 100);
  })();
// $(document).ready(function () {
   
//     try {
//         addSearchBox();
//         addCustomLinkInHeaderRegion();
     
//     } catch (ex) {

//     }
// });
function addSearchBox() {
    //console.clear();
    //console.log('addSearchBox');
    if ($('.ms-suiteux-search-box').length < 1 && $("button[id='SearchButton']").length < 1) {
        setTimeout(function () { addSearchBox(); }, 1000);
    } else {
        if($('.ms-suiteux-search-box').length==1){
            //desktopmode
            $("#sbcId").html('<input placeholder="Search" id="searchSuggestion" autocomplete="off"><i class="searchSuggestionIcon ms-Icon ms-Icon--Search" aria-hidden="true"></i>');
            $("#sbcId input").attr("id", "searchSuggestion");
           
            $("#searchSuggestion").attr("placeholder", "find.pg.com")
            bindKeyUp();
        }else{
            
            $("button[id='SearchButton']").on("click", function (event) {
                //$("#O365_SearchBoxContainer_container div div").html('<div id="sbcId"><input placeholder="Search" id="searchSuggestion" autocomplete="off"></div>');
                findTextBoxInMobileMode();
            });
        }
        
    }
}

function findTextBoxInMobileMode(){
    if($("#sbcId").length>0){
        $("#sbcId").html('<input placeholder="Search" id="searchSuggestion" autocomplete="off" class=""><i class="searchSuggestionIcon ms-Icon ms-Icon--Search" aria-hidden="true"></i>');
        $("#sbcId input").attr("id", "searchSuggestion");
        $("#sbcId").addClass("mobileSearchBar"); 
        $("#searchSuggestion").attr("placeholder", "find.pg.com");
        bindKeyUp();
        setTimeout(function () { 
        if( $("button[id='SearchButton']").length>0){
            $("button[id='SearchButton']").click();
        }
    }, 500);
    }else{
        setTimeout(function () { findTextBoxInMobileMode(); }, 1000);
    }

}


function addCustomLinkInHeaderRegion() {
    try {
        
    
    //console.log('addCustomLinkInHeaderRegion');
    if ($('#HeaderButtonRegion').length < 1 || $("#searchSuggestionConfigValues").attr('YammerLabel')==undefined) {
        setTimeout(function () { addCustomLinkInHeaderRegion(); }, 1000);

    } else {
        $("#searchSuggestion").attr("placeholder", "find.pg.com");
        //console.log('## addCustomLinkInHeaderRegion added successfull');
//         var linkHtml = `<div class="customHeaderLink">
//  <button class=" o365sx-button siteTour" id="siteTour" aria-haspopup="true" aria-label="" role="button" type="button" title="Watch the site tour" aria-expanded="false"><div class="o365cs-base" aria-hidden="true"><span class="ms-Icon--OfficeVideoLogo" role="presentation" style="display: inline-block; font-size: 16px;"></span></div></button>
//  <button class=" o365sx-button goToYammer" id="goToYammer" aria-haspopup="true" aria-label="" role="button" type="button" title="Go to our yammer group" aria-expanded="false"><div class="o365cs-base" aria-hidden="true"><span class="ms-Icon--YammerLogo" role="presentation" style="display: inline-block; font-size: 16px;"></span></div></button>
//  </div>`;


        //$("#HeaderButtonRegion").prepend(linkHtml);

        //overlay for Vedio Player
        $("body").append('<div id="overlay"  onclick="overlayOff()"><i class="ms-Icon ms-Icon--ChromeClose iFrameCloseButton" aria-hidden="true" title="Close"></i><IFRAME title="PGOne Corporate Intranet Portal - Basic Features Overview" id="siteTourVideo" src="" allow="autoplay; fullscreen"> </IFRAME></div>');

        
        //localStorage.setItem("isFirstTimeUser", "1");
      //if($(".customLinkSection").length==0){
        if($("[data-automationid='SiteHeader'] div[class^='sideActionsWrapper']").length>0){
            $("[data-automationid='SiteHeader'] div[class^='sideActionsWrapper']").addClass("customLinkSection")
            var links = '<div class="customLinks">'+
            '<a href="#" class="goToYammer"><i class="ms-Icon ms-Icon--YammerLogo" aria-hidden="true"></i><span></span></a>'+
            '<a href="#" class="siteTour"><i class="ms-Icon ms-Icon--MSNVideos" aria-hidden="true"></i><span></span></a></div>';
            $("[data-automationid='SiteHeader'] div[class^='sideActionsWrapper']").html(links);
        }else{
            //console.log("Compact Mode");
            $("[data-automationid='SiteHeader'] span[data-automationid^='SiteHeaderGroupInfo']").addClass("customLinkSection compactMode");
            var links = '<div class="customLinks">'+
            '<a href="#" class="goToYammer"><i class="ms-Icon ms-Icon--YammerLogo" aria-hidden="true"></i><span></span></a>'+
            '<a href="#" class="siteTour"><i class="ms-Icon ms-Icon--MSNVideos" aria-hidden="true"></i><span></span></a></div>';
            $("[data-automationid='SiteHeader'] span[data-automationid^='SiteHeaderGroupInfo']").html(links);
            $("[data-automationid='SiteHeader'] span[data-automationid^='SiteHeaderGroupInfo']").addClass("customLinkSection compactMode");
        }
     // }
        





        $(".goToYammer").bind("click", function () {
           yammerHelpClickGA();
            window.open($("#searchSuggestionConfigValues").attr('yammerurllink'), '_blank');

        });
        $(".siteTour").bind("click", function () {
            rewatchTourClickGA();
            overlayOn();
            

        });
        
        $(".goToYammer span").html($("#searchSuggestionConfigValues").attr('YammerLabel'));
        $(".siteTour span").html($("#searchSuggestionConfigValues").attr('SiteTourLabel'));
        
        //$(".goToYammer").attr("title",$("#searchSuggestionConfigValues").attr('YammerLabel'));
        //$(".siteTour").attr("title",$("#searchSuggestionConfigValues").attr('SiteTourLabel'));
       
        //runSiteTour();
        checkAndAddModelForFirstTimeUser()
        
    }} catch (error) {
        
    }

}
function overlayOn() {
    document.getElementById("overlay").style.display = "block";
    $('#siteTourVideo').attr("src", $("#searchSuggestionConfigValues").attr('sitetourvideourl'));
}

function overlayOff() {
    document.getElementById("overlay").style.display = "none";
    $('#siteTourVideo').attr("src", "");
    $("a.siteTour").focus();
}


function bindKeyUp() {
    $("#sbcId input").attr("id", "searchSuggestion");
    
    $("#searchSuggestion").attr("placeholder", "find.pg.com")
    addSearchBoxButtonAreaLable();
    if ($('input#searchSuggestion').length < 1) {

        setTimeout(function () { bindKeyUp(); }, 1000);

    } else {

        $("#searchSuggestion").attr("placeholder", "find.pg.com");
        //$("#searchSuggestion").attr("searchurl", "https://pgone.sharepoint.com/Search/Pages/results.aspx?k=");
       // $("#searchSuggestion").attr("countryname", "India");
       // $("#searchSuggestion").attr("SearchSuggesterError", "* Please connect with VPN to get search suggestions *");

        bindOnClickArrorw();
       // addCustomLinkInHeaderRegion();
            if(jQuery.ui==undefined){
                //console.log("Not Found");
                jQuery.getScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js', function() {
                jQuery.noConflict(true);  
                });
            
            }else{
           // console.log("UI Found")
            }

        $("input#searchSuggestion").on("keyup", function (event) {

            

            if (event.keyCode === 38 || event.keyCode === 40) {
                event.preventDefault();
            } else if (event.keyCode === 27) {
                $(this).val("");
            }
            else if (event.keyCode === 13) {
                searchClick();
            }
            else {
                //$("#searchSuggestion").autocomplete({source: []});
                //var suggetionReasult=[];
                 //bindSearchSuggestion(suggetionReasult);
                //$(".ui-autocomplete").hide();
               if ($('input#searchSuggestion').val().trim().length > 1) {                   
                    retrieveSearchSuggestion($('input#searchSuggestion').val().trim());
                }
                 else{
                 //var suggetionReasult=JSON.parse('[{"title":"","value":"","url":"","type":"","icon":""}]')
                 //bindSearchSuggestion([]);
                 }
            }


        });
        $("#filtersubmit").click(function () {

            searchClick();
        });
        $("input#searchSuggestion").focus(function () {
            $(this).attr("placeholder", "find.pg.com");
        });

        
    }

}
function bindOnClickArrorw() {

    // if ($("button[aria-label='Search']").length < 1) {

    //     setTimeout(function () { bindOnClickArrorw(); }, 1000);

    // } else {
    //     $("#searchSuggestion").attr("placeholder", "find.pg.com");
    //     document.querySelector("button[aria-label='Search']").addEventListener("click", function (event) {
    //         searchClick();
    //         event.preventDefault();
    //     }, false);
       
    // }
    var commandsButton = $(".ms-suiteux-search-box button");
    if (commandsButton[2] == undefined) {
        setTimeout(function () { bindOnClickArrorw(); }, 1000);
    } else {
        $("#searchSuggestion").attr("placeholder", "find.pg.com");
        $(commandsButton[2]).click(function (event) {
            searchClick();
            event.preventDefault();
        });
    }


}

 function makefunction(){
     debugger;
    this.context.aadHttpClientFactory
    .getClient('c1700521-1700-4098-b903-7c7e17322b20')
    .then((client) => {
      console.log(client); 
    })

 }

function retrieveSearchSuggestion(k) {

    // this.makefunction();

    try {
        var SearchSuggester = $("#searchSuggestionConfigValues").attr('SearchSuggester');
        $.ajax({
            url: SearchSuggester + k,
            success: function (data) {
                //console.log(data);
                var keyWordResult = data[0];
                var searchResult = data[1];
                var suggetionReasultArray = [];

                for (i = 0; i < searchResult.length; i++) {
                    var suggetionData = {
                        title: searchResult[i].title,
                        value: searchResult[i].title,
                        url: searchResult[i].url,
                        type: 'searchResult',
                        icon: "World"
                    }
                    suggetionReasultArray.push(suggetionData);
                }
                var searchUrl = $("#searchSuggestionConfigValues").attr('searchUrl');
                var countryName = $("#searchSuggestionConfigValues").attr('countryName').toLocaleLowerCase().trim();
                var countryCode = "*";
                try {
                    var filterCountry = getCountryCode(countryName);
                    if (filterCountry.length > 0) {
                        countryCode = getCountryCode(countryName)[0]['CC']
                    }
                }
                catch (ex) {

                }

                for (i = 0; i < keyWordResult.length; i++) {
                    var suggetionData = {
                        title: keyWordResult[i].searchKeyword,
                        value: keyWordResult[i].searchKeyword,
                        type: 'keyword',
                        url: searchUrl + keyWordResult[i].searchKeyword + "&code=" + countryCode,
                        icon: "Search"
                    }
                    suggetionReasultArray.push(suggetionData);
                }
                //setTimeout(function(){ bindSearchSuggestion(suggetionReasult); }, 1000);
                
                this.bindSearchSuggestion(suggetionReasultArray);
            }
            ,
            error: function (textStatus, errorThrown) {
                //console.log(textStatus);
                //console.log(errorThrown);
                if (textStatus.status == 0 || textStatus.status == 404) {

                    bindErrorMessage()
                    //var suggetionReasult ='[{"title":"Power of You (PoY)","value":"Power of You (PoY)","url":"http://www.pgawards.com/","type":"searchResult","icon":"Globe"},{"title":"Coupa","value":"Coupa","url":"https://pg.coupahost.com","type":"searchResult","icon":"Globe"},{"title":"ServiceNow","value":"ServiceNow","url":"https://pgglobalenterprise.service-now.com","type":"searchResult","icon":"Globe"},{"title":"Peoplefinder","value":"Peoplefinder","url":"http://peoplefinder.internal.pg.com","type":"searchResult","icon":"Globe"},{"title":"Manage your Ping settings","value":"Manage your Ping settings","url":"http://ping.pg.com","type":"searchResult","icon":"Globe"},{"title":"(Not Set)","value":"(Not Set)","type":"keyword","url":"https://pgone.sharepoint.com/Search/Pages/results.aspx?k=(Not Set)","icon":"Search"},{"title":"Service Now","value":"Service Now","type":"keyword","url":"https://pgone.sharepoint.com/Search/Pages/results.aspx?k=Service Now","icon":"Search"},{"title":"Information Security","value":"Information Security","type":"keyword","url":"https://pgone.sharepoint.com/Search/Pages/results.aspx?k=Information Security","icon":"Search"},{"title":"Pulse Secure","value":"Pulse Secure","type":"keyword","url":"https://pgone.sharepoint.com/Search/Pages/results.aspx?k=Pulse Secure","icon":"Search"},{"title":"Servicenow","value":"Servicenow","type":"keyword","url":"https://pgone.sharepoint.com/Search/Pages/results.aspx?k=Servicenow","icon":"Search"}]';
                    //bindSearchSuggestion(JSON.parse(suggetionReasult));
                }
            }
        });
    } catch (ex) {
       // console.log('Error in Search Suggetion');
        console.log(ex);

    }
}
function bindErrorMessage() {
    var suggetionReasult = [];
    jQuery("#searchSuggestion").autocomplete({
        minLength:2,
        source: function (request, response) {
            response(suggetionReasult);
        },
        response: function (event, ui) {
            if (!ui.content.length) {
                var noResult = { value: "", title: $("#searchSuggestionConfigValues").attr('SearchSuggesterError') };
                ui.content.push(noResult);
                //$("#message").text("No results found");
            } else {
                $("#message").empty();
            }
        },
        search: "",
        select: function (event, ui) {
            this.value = "";
            //openSearchUrl(ui.item.url)
            return false;
        },
        focus: function (event, ui) {
            return false;
         //   event.preventDefault();
        },

    }).focus(function () {
        $(this).autocomplete("search", "");
    }).autocomplete("instance")._renderItem = function (ul, item) {
        var urlToShow = item.url;
        if (item.type == 'searchResult') {
            if (urlToShow.length != 0 && urlToShow.length > 30) {

                urlToShow = " - <div class='urlToShow'>" + urlToShow.substr(0, 30) + "</div>";
            } else {
                urlToShow = " - <div class='urlToShow'>" + urlToShow + "</div>";
            }
        }
        else {
            urlToShow = "";
        }

        return $("<li class='suggestionLi suggetionError'>")
            .append("<div class='ms-SPLegacyFabricBlock suggetionDiv'  url=" + encodeURI(item.url) + " ><i class='ms-Icon ms-Icon--" + item.icon + "' aria-hidden='true'></i>" + item.title + "<div class='anchorDiv'>" + urlToShow + "</div></div>")
            .appendTo(ul);
    };
    $('#searchSuggestion').autocomplete("search");

}

function bindSearchSuggestion(suggetionReasultForBind) {
//console.log("bindSearchSuggestion",$('input#searchSuggestion').val(),suggetionReasultForBind)

 var seuggetionForBind=suggetionReasultForBind;
 try {
    
        $("#searchSuggestion").autocomplete({
        minLength: 2,
        source: function (request, response) {
            response(seuggetionForBind);
        },
        search: "",
        select: function (event, ui) {
            if(ui.item.type=="keyword"){
                sendSuggestionGAEvent(ui.item.title,$('input#searchSuggestion').val().trim())
            }
            this.value = "";
            openSearchUrl(ui.item.url)
            return false;
        },
        
        focus: function (event, ui) {
            //console.log("on focus",ui.item)
            return false;
            // this.value = ui.item.label;
            // or $('#autocomplete-input').val(ui.item.label);

            // Prevent the default focus behavior.
          //  event.preventDefault();
            //return false;
            // or return false;
        },

    }).focus(function () {
        $(this).autocomplete("search", "");
     }).autocomplete("instance")._renderItem = function (ul, item) {
            var urlToShow = item.url;
            if (item.type == 'searchResult') {
                if (urlToShow.length != 0 && urlToShow.length > 30) {

                    urlToShow = " - <div class='urlToShow'>" + urlToShow.substr(0, 30) + "</div>";
                } else {
                    urlToShow = " - <div class='urlToShow'>" + urlToShow + "</div>";
                }
            }
            else {
                urlToShow = "";
            }

            return $("<li class='suggestionLi'>")
                .append("<div class='ms-SPLegacyFabricBlock suggetionDiv'  url=" + encodeURI(item.url) + " ><i class='ms-Icon ms-Icon--" + item.icon + "' aria-hidden='true'></i>" + item.title + "<div class='anchorDiv'>" + urlToShow + "</div></div>")
                .appendTo(ul);
        };
        if(seuggetionForBind.length>0){
            $(".ui-autocomplete").show();
        }else{
            $(".ui-autocomplete").hide();
        }
        //$("#searchSuggestion").autocomplete('option','source',suggetionReasult)
        $('#searchSuggestion').autocomplete("search");
       
    } catch (error) {
    console.log(error);
    }
}

function openSearchUrl(url) {

    //resetSearchBox();
    window.open(url, '_blank');
    resetSearchBox();

}
function searchClick() {
    var searchUrl = $("#searchSuggestionConfigValues").attr('searchUrl') + encodeURIComponent( $('input#searchSuggestion').val().trim());
    var countryName = $("#searchSuggestionConfigValues").attr('countryName').toLocaleLowerCase().trim();
    var countryCode = "*";
    try {
        var filterCountry = getCountryCode(countryName);
        if (filterCountry.length > 0) {
            countryCode = getCountryCode(countryName)[0]['CC']
        }
    }
    catch (ex) {

    }
    if($('input#searchSuggestion').val().trim().length>0){
        sendManualSearchGAEvent($('input#searchSuggestion').val().trim())
    }
    searchUrl += "&code=" + countryCode;
    
    //resetSearchBox();
    window.open(searchUrl, '_blank');
    resetSearchBox();
}

function getCountryCode(conuntryName) {
    var found_names = $.grep(countryWithCode, function (v) {
        return v.OFC === conuntryName;
    });
    return found_names;
}

var countryWithCode = [
    {
        OFC: "algeria",
        CC: "DZ"
    }, {
        OFC: "argentina",
        CC: "AR"
    }, {
        OFC: "australia",
        CC: "AU"
    }, {
        OFC: "austria",
        CC: "AT"
    }, {
        OFC: "azerbaijan",
        CC: "AZ"
    }, {
        OFC: "bangladesh",
        CC: "BD"
    }, {
        OFC: "belgium",
        CC: "BE"
    }, {
        OFC: "brazil",
        CC: "BR"
    }, {
        OFC: "bulgaria",
        CC: "BG"
    }, {
        OFC: "canada",
        CC: "CA"
    }, {
        OFC: "chile",
        CC: "CL"
    }, {
        OFC: "china",
        CC: "CN"
    }, {
        OFC: "colombia",
        CC: "CO"
    }, {
        OFC: "costa rica",
        CC: "CR"
    }, {
        OFC: "croatia",
        CC: "HR"
    }, {
        OFC: "czech republic",
        CC: "CZ"
    }, {
        OFC: "denmark",
        CC: "DK"
    }, {
        OFC: "dominican rep.",
        CC: "DO"
    }, {
        OFC: "egypt",
        CC: "EG"
    }, {
        OFC: "finland",
        CC: "FI"
    }, {
        OFC: "france",
        CC: "FR"
    }, {
        OFC: "germany",
        CC: "DE"
    }, {
        OFC: "greece",
        CC: "GR"
    }, {
        OFC: "guatemala",
        CC: "GT"
    }, {
        OFC: "hong kong",
        CC: "HK"
    }, {
        OFC: "hungary",
        CC: "HU"
    }, {
        OFC: "india",
        CC: "IN"
    }, {
        OFC: "indonesia",
        CC: "ID"
    }, {
        OFC: "ireland",
        CC: "IE"
    }, {
        OFC: "israel",
        CC: "IL"
    }, {
        OFC: "italy",
        CC: "IT"
    }, {
        OFC: "japan",
        CC: "JP"
    }, {
        OFC: "kazakhstan",
        CC: "KZ"
    }, {
        OFC: "kenya",
        CC: "KE"
    }, {
        OFC: "latvia",
        CC: "LV"
    }, {
        OFC: "luxembourg",
        CC: "LU"
    }, {
        OFC: "malaysia",
        CC: "MY"
    }, {
        OFC: "mexico",
        CC: "MX"
    }, {
        OFC: "morocco",
        CC: "MA"
    }, {
        OFC: "netherlands",
        CC: "NL"
    }, {
        OFC: "new zealand",
        CC: "NZ"
    }, {
        OFC: "nigeria",
        CC: "NG"
    }, {
        OFC: "norway",
        CC: "NO"
    }, {
        OFC: "pakistan",
        CC: "PK"
    }, {
        OFC: "panama",
        CC: "PA"
    }, {
        OFC: "peru",
        CC: "PE"
    }, {
        OFC: "philippines",
        CC: "PH"
    }, {
        OFC: "poland",
        CC: "PL"
    }, {
        OFC: "portugal",
        CC: "PT"
    }, {
        OFC: "puerto rico",
        CC: "PR"
    }, {
        OFC: "romania",
        CC: "RO"
    }, {
        OFC: "russia",
        CC: "RU"
    }, {
        OFC: "russian fed.",
        CC: "RU"
    }, {
        OFC: "saudi arabia",
        CC: "SA"
    }, {
        OFC: "serbia",
        CC: "RS"
    }, {
        OFC: "singapore",
        CC: "SG"
    }, {
        OFC: "slovakia",
        CC: "SK"
    }, {
        OFC: "south africa",
        CC: "ZA"
    }, {
        OFC: "south korea",
        CC: "KR"
    }, {
        OFC: "spain",
        CC: "ES"
    }, {
        OFC: "sri lanka",
        CC: "LK"
    }, {
        OFC: "sweden",
        CC: "SE"
    }, {
        OFC: "switzerland",
        CC: "CH"
    }, {
        OFC: "taiwan",
        CC: "TW"
    }, {
        OFC: "thailand",
        CC: "TH"
    }, {
        OFC: "turkey",
        CC: "TR"
    }, {
        OFC: "uk",
        CC: "UK"
    }, {
        OFC: "ukraine",
        CC: "UA"
    }, {
        OFC: "united arab emir",
        CC: "AE"
    }, {
        OFC: "united kingdom",
        CC: "UK"
    }, {
        OFC: "usa",
        CC: "US"
    }, {
        OFC: "venezuela",
        CC: "VE"
    }, {
        OFC: "vietnam",
        CC: "VN"
    }
];

// function resetSearchBox() {
//     //$("button[aria-label='Clear the search box']").click();
//     // var commandsButton = $(".ms-suiteux-search-box button");
//     // commandsButton[1].click();
//     $("#searchSuggestion").val("");
//     $("#searchSuggestion").attr("placeholder", "find.pg.com");
//     setTimeout(function () {
//         $("#searchSuggestion").attr("placeholder", "find.pg.com");
//     }, 2000);

// }
function runSiteTour(){
    setTimeout(
              function() 
              {
                if(localStorage.getItem('isFirstTimeUser')){
                  if(localStorage.getItem('isFirstTimeUser')=='1'){
                    $(".siteTour").click();
                    ga('set', 'dimension7', true); //true or false
                    localStorage.removeItem('isFirstTimeUser');
                  }
                }
              }
              .bind(this),
              1000
          );
    }

function rewatchTourClickGA() {
        ga('send', {
            'hitType': 'event', // Required.
            'eventCategory': 'Help', // Required.
            'eventAction': 'Watch tour', // Required.
            'eventLabel': 'Watch tour',
            'eventValue': 1
        });
}
function yammerHelpClickGA() {
        ga('send', {
            'hitType': 'event', // Required.
            'eventCategory': 'Help', // Required.
            'eventAction': 'Yammer help click', // Required.
            'eventLabel': 'Yammer help click',
            'eventValue': 1
        });
}
function sendManualSearchGAEvent(searchKeyword) {
    //alert("Manual Search");
    ga('send', {
        'hitType': 'event', // Required.
        'eventCategory': 'Search Bar', // Required.
        'eventAction': 'Manual Search', // Required.
        'eventLabel': searchKeyword,
        'eventValue': 1,
        'dimension7': window.location.href, // Source
        'dimension9': searchKeyword, // Search Term
    });
}

function sendSuggestionGAEvent(Suggetion,searchKeyword) {
    //alert("Suggetion Search");
    ga('send', {
        'hitType': 'event', // Required.
        'eventCategory': 'Search Bar', // Required.
        'eventAction': 'Suggestion', // Required.
        'eventLabel': Suggetion,
        'eventValue': 1,
        'dimension7': window.location.href, // Source
        'dimension9': searchKeyword, // Search Term
        'dimension12': Suggetion, // Suggestion Text
    });
}

// function addSearchBoxButtonAreaLable() {

//     if ($("#sbcId button[class*='magnifierButton']").length < 1) {
//         setTimeout(function () { addSearchBoxButtonAreaLable(); }, 1000);
//     } else {
//         $("#sbcId button[class*='magnifierButton']").attr("aria-label", "find.pg.com");
//         }
        
    
// } 

function checkAndAddModelForFirstTimeUser(){
//Adding Model 
//console.log("Checking..")
$('body').append('<div id="firstTimeUserDialog" class="w3-modal firstTimeUserDialog">'
+'<div class="w3-modal-content">'
+'<div class="w3-container configrationInProgress">'
+  '<p class="FirstTimeUser_LoginMessage1"></p>'
+ '<p class="FirstTimeUser_LoginMessage2"></p>'
+'</div>'
+ '<div class="w3-container configrationSuccess">'
+   '<p class="FirstTimeUser_LoginSuccessMessage"></p>'
+   '<input type="button" value="Ok" onclick="openSiteTour();"/>'
+'</div>'
+'</div>'
+'</div>');  
$(".FirstTimeUser_LoginMessage1").html($("#searchSuggestionConfigValues").attr('FirstTimeUser_LoginMessage1'));
$(".FirstTimeUser_LoginMessage2").html($("#searchSuggestionConfigValues").attr('FirstTimeUser_LoginMessage2'));
$(".FirstTimeUser_LoginSuccessMessage").html($("#searchSuggestionConfigValues").attr('FirstTimeUser_LoginSuccessMessage'));
 
    setTimeout(
        function() 
        {
            //console.log("First Time User");
          if(localStorage.getItem('isFirstTimeUser')){
            if(localStorage.getItem('isFirstTimeUser')=='1'){
              //First Time User - Show Model Pop Up
              
                $(".firstTimeUserDialog").show();
                $(".configrationSuccess").hide();
                $(".configrationInProgress").show();
                checkingifConfigurationDone();
                window.onbeforeunload = function () {
                    return true;
                }
                 
            }
          }
        }
        .bind(this),
        2000
    );
}
function  checkingifConfigurationDone(){
    if(localStorage.getItem('isFirstTimeUser')){
        if(localStorage.getItem('isFirstTimeUser')=='0'){
          //First Time User - Show Model Pop Up
            $(".configrationSuccess").show();
            $(".configrationInProgress").hide();
            window.onbeforeunload = function () {
                //return true;
            }
        }else{
            setTimeout(
                function() 
                {checkingifConfigurationDone()
                }
                .bind(this),
                2000
            );
        }
      }  
}
function openSiteTour(){
    $(".firstTimeUserDialog").hide();
    rewatchTourClickGA();
            overlayOn();
}