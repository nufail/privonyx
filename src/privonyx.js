"use strict";

const themes = {
    'onyx': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: "black",
            textcolor: "silver",
            toolbar: "#353839",
            toolbar_text: "silver"
        }
    },
    'private': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: "#1A0437",
            textcolor: "silver",
            toolbar: "#353839",
            toolbar_text: "silver"
        }
    },
    'insecure': {
        images: {
            headerURL: "",
        },
        colors: {
            accentcolor: "black",
            textcolor: "silver",
            toolbar: "#321E09",
            toolbar_text: "silver"
        }
    }
}

// Theme all currently open windows
browser.windows.getAll().then(wins => wins.forEach(themeWindow));

// Theme new windows
browser.windows.onCreated.addListener(themeWindow);

function themeWindow(window, theme) {
    // Check if the window is in private browsing
    if (window.incognito) {
        browser.theme.update(window.id, themes['private']);
    }

    // Reset to the default theme otherwise
    else {
        //browser.theme.reset(window.id);
        themeByTab(window.id);
    }
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
        browser.theme.update(tab.windowId, themes['private']);
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
