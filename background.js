const providers = [];

browser.runtime.onMessageExternal.addListener((message, sender, respond) => {
    console.log("messageExternal", message, sender.id);

    if (message.type === "register") {
        if (sender.hasOwnProperty("id") && !providers.includes(sender.id)) {
            providers.push(sender.id);
            respond(true);
        }
    }
});

/* context menu */

browser.menus.create({
    id: "query",
    title: "Yuika",
    contexts: ["selection"],
});

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "query") {
        const promises = [];
        for (const providerId of providers) {
            promises.push(browser.runtime.sendMessage(providerId, {
                type: "host-query",
                data: {
                    text: info.selectionText,
                    url: tab.url,
                },
            }));
        }
        // TODO: send results to content script for display
        Promise.all(promises).then(console.log);
    }
});
