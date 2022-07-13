
<template>
    <div class="wrapper">
        <h1> Site Blocker</h1>
        <div class="buttons">
            <button type="button" class="state-off" :class="{'is-active': !active}" @click="setActive(false)">Off</button>
            <button type="button" class="state-on" :class="{'is-active': active}" @click="setActive(true)">On</button>
        </div>
        <div class="sites">
            <p>List the websites to block below, one per line</p>
            <textarea v-model="list" rows="8" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
        </div>
        <button type="button" class="state-save" @click="saveList">Add Site</button>
    </div>
</template>
<script>
export default{

    data(){
        return{
            active: true,
            list: 'example.com',
            icons:{
                active: 'images/icon-48x48.png',
                inactive: 'images/icon-48x48-off.png'
            }
        }
    },
    created(){
        chrome.storage.sync.get(['toggleSitesActive', 'toggleSitesList'], (result)=>{
            this.active = result.toggleSitesActive
            this.list = result.toggleSitesList
        })
    },
    methods:{
        setActive(state){
            this.active = state
            chrome.storage.sync.set({
                toggleSitesActive: state
            }, () => {})
            chrome.browserAction.setIcon({path: this.icons[state ? 'active': 'inactive']})
        },
        saveList(){
            chrome.storage.sync.set({
                toggleSitesList: this.list
            }, () => {})
        }
    }

}
</script>