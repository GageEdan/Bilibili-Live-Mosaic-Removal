// ==UserScript==
// @name         B站直播遮罩清除器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动移除B站直播间的指定遮罩元素
// @author       YourName
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const targetSelector = 'div.web-player-module-area-mask';
    const maxAttempts = 50; // 最大尝试次数
    const interval = 200; // 检测间隔（毫秒）

    let attempts = 0;

    const removeElement = () => {
        const element = document.querySelector(targetSelector);
        if (element) {
            element.remove();
            console.log('目标元素已成功移除');
            return true;
        }
        return false;
    };

    const observer = new MutationObserver(() => {
        if (removeElement() || attempts > maxAttempts) {
            observer.disconnect();
        }
    });

    const periodicCheck = setInterval(() => {
        if (removeElement() || attempts++ > maxAttempts) {
            clearInterval(periodicCheck);
        }
    }, interval);

    // 同时使用两种检测方式确保可靠性
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 最终清理
    setTimeout(() => {
        observer.disconnect();
        clearInterval(periodicCheck);
    }, maxAttempts * interval + 1000);
})();
