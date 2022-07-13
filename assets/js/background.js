
chrome.runtime.onInstalled.addListener(() =>{
    chrome.storage.sync.set({
        toggleSitesActive: false,
        toggleSitesList: "example.com"
    }, ()=>{})
})

// Initial chrome storage values
let toggleSitesActive = false
let toggleSitesList = "example.com"

// replace intial values with ones from synced storage
chrome.storage.sync.get([
    'toggleSitesActive',
    "toggleSitesList"
], (result) =>{
    toggleSitesActive = result.toggleSitesActive
    toggleSitesList = result.toggleSitesList
})


// On each site request, block if it's in toggleSitesList
chrome.webRequest.onBeforeRequest.addListener((details) =>{
    // the extension is not active, don't block anything
    if(!toggleSitesActive) return {cancel:false} 

    // determine if url is in toggleSitesList
    let cancel = toggleSitesList.split(/\n/)
        .some(site =>{
            let url = new URL(details.url)
            return Boolean(url.hostname.indexOf(site) !== -1)
        })

    return {cancel: cancel}
}, 
    {
        urls:["<all_urls>"]
    },
    [
        "blocking"
    ]
)



// any time that a storage item is update, update the global scope varaibles
chrome.storage.onChanged.addListener((changes, namespace) =>{
    if(namespace === 'sync'){
        if(changes.toggleSitesActive){
            toggleSitesActive = changes.toggleSitesActive.newValue;
        }
        if(changes.toggleSitesList){
            toggleSitesList = changes.toggleSitesList.newValue
        }
    }
})