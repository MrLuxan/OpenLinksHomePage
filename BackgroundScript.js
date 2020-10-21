const eOpenIn = {  SameTab: 'sametab',  NewTab: 'newtab',  NewWindow: 'newwindow'}

function getBaseUrl(url)
{
  var pathArray = url.split( '/' );
  var protocol = pathArray[0];
  var host = pathArray[2];
  var baseurl = protocol + '//' + host;
  return baseurl;
}

function menuItemOnClick(info, tab) {
  chrome.storage.sync.get({
    OpenIn: eOpenIn.NewTab
    }, function(items) {
      let baseurl = getBaseUrl(info.linkUrl);
      switch(items.OpenIn)
      {
        case eOpenIn.SameTab :
          chrome.tabs.update(tab.id, {url: baseurl});
          break;

        case eOpenIn.NewTab :
          chrome.tabs.create({ url: baseurl });
          break;

        case eOpenIn.NewWindow :
          chrome.windows.create({url: baseurl}); 
          break;
      }
  });
}

var id = chrome.contextMenus.create({"title":"Open link's home page", 
                                  "contexts":["link"],
                                   "onclick":menuItemOnClick});


function radioOnClick(info, tab) {
 if(!info.wasChecked)
 {
  chrome.storage.sync.set({
    OpenIn: info.menuItemId,
  }, function() {
    console.log(info.menuItemId + " - Saved");
  });
 }
}


var optionMenu = chrome.contextMenus.create({"title":"Open link in:", 
                                          "contexts":["browser_action"]});

chrome.storage.sync.get({
  OpenIn: eOpenIn.NewTab
  }, function(items) {
    
  let optionsItems = [[eOpenIn.SameTab,"Same tab"],
                      [eOpenIn.NewTab,"New tab"],
                      [eOpenIn.NewWindow,"New window"]];

  optionsItems.forEach(element =>

    chrome.contextMenus.create({ "id":element[0],
                                 "title":element[1], 
                                 "type":"radio",
                                 "contexts":["browser_action"],
                                 "parentId": optionMenu,
                                 "checked":(items.OpenIn == element[0]),
                                 "onclick":radioOnClick})
  );
});