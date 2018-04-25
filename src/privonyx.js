"use strict";

// const ONYX = '#353839';
const ONYX = '#2F3233';
const GREY_90 = '#0c0c0d';
const GREY_70 = '#38383d';
const GREY_60 = '#4a4a4f';
const GREY_10_A60 = '#f9f9fa99';
const GREY_10_A80 = '#f9f9facc';
const TEAL_70 = '#008ea4';

const YELLOW_90 = '#3e2800';
const YELLOW_70 = '#a47f00';

const PURPLE_90 = '#25003e';
const PURPLE_70 = '#6200a4';
const PURPLE_60 = '#8000d7';

const themes = {
    'onyx': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: GREY_90,
            textcolor: GREY_10_A80,
            toolbar: ONYX,
            toolbar_text: GREY_10_A80,
            toolbar_field: GREY_60,
            toolbar_field_text: GREY_10_A80,
            icons: GREY_10_A80,
            icons_attention: TEAL_70,
            tab_line: TEAL_70,
            tab_loading: TEAL_70,
            popup: ONYX,
            popup_text: GREY_10_A80,
            popup_border: GREY_90,
        }
    },
    'private': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: PURPLE_90,
            textcolor: GREY_10_A80,
            toolbar: ONYX,
            toolbar_text: GREY_10_A80,
            toolbar_field: GREY_60,
            toolbar_field_text: GREY_10_A80,
            icons: GREY_10_A80,
            icons_attention: TEAL_70,
            tab_line: TEAL_70,
            tab_loading: TEAL_70,
            popup: ONYX,
            popup_text: GREY_10_A80,
            popup_border: GREY_90,
        }
    },
    'insecure': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: GREY_90,
            textcolor: GREY_10_A80,
            toolbar: YELLOW_90,
            toolbar_text: GREY_10_A80,
            toolbar_field: GREY_60,
            toolbar_field_text: GREY_10_A80,
            icons: GREY_10_A80,
            icons_attention: TEAL_70,
            tab_line: YELLOW_70,
            tab_loading: YELLOW_70,
            popup: ONYX,
            popup_text: GREY_10_A80,
            popup_border: GREY_90,
        }
    },
    'private-insecure': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: PURPLE_90,
            textcolor: GREY_10_A80,
            toolbar: YELLOW_90,
            toolbar_text: GREY_10_A80,
            toolbar_field: GREY_60,
            toolbar_field_text: GREY_10_A80,
            icons: GREY_10_A80,
            icons_attention: TEAL_70,
            tab_line: YELLOW_70,
            tab_loading: YELLOW_70,
            popup: ONYX,
            popup_text: GREY_10_A80,
            popup_border: GREY_90,
        }
    }
}

// Theme all currently open windows
browser.windows.getAll().then(wins => wins.forEach(themeWindow));

// Theme new windows
browser.windows.onCreated.addListener(themeWindow);

function themeWindow(window) {
    themeByTab(window.id);
}

function themeByTab(windowId) {
    var gettingActiveTab = browser.tabs.query({
        active: true,
        windowId: windowId
    });
    gettingActiveTab.then((tabs) => {
        setTheme(tabs[0]);
    });
}

function setTheme(tab) {
    if (tab.incognito) {
        if (tab.url && tab.url.startsWith('http:')) {
            browser.theme.update(tab.windowId, themes['private-insecure']);
        } else {
            browser.theme.update(tab.windowId, themes['private']);
        }
    } else if (tab.url && tab.url.startsWith('http:')) {
        browser.theme.update(tab.windowId, themes['insecure']);
    } else {
        browser.theme.update(tab.windowId, themes['onyx']);
    }
}

/*
Set theme for the currently active tab, whenever a new tab becomes active.
*/
browser.tabs.onActivated.addListener((activeInfo) => {
    var gettingTab = browser.tabs.get(activeInfo.tabId);
    gettingTab.then((tab) => {
        setTheme(tab);
    })
});

/*
Set theme for the currently active tab, whenever the user navigates.
*/
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) {
        return;
    }
    var gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    gettingActiveTab.then((tabs) => {
        if (tabId == tabs[0].id) {
            setTheme(tab);
        }
    });
});
