/*
 * @Author: shaddollxz
 * @Date: 2021-06-30 12:38:16
 * @LastEditTime: 2021-08-05 22:29:26
 * @Description: 我的JS工具库，含有一些常用函数和扩展类
 */

/**
 * 防抖：在设定时间内多次调用回调时不会执行 超出设定时间后才执行一次
 * @param {function} callback 要被执行的回调函数
 * @param {number} delay 限流间隔 默认300ms
 * @param {boolean} style 默认为true true为第一次触发时触发回调 false为最后次触发时触发回调
 * @param {any} arg 其它传入回调的参数
 */
function debounce(callback, delay = 300, style = true) {
    let timeoutId = null;
    if (style) {
        return function(...events) {
            if (!timeoutId) {
                callback.apply(this, events);
            } else {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                timeoutId = null;
            }, delay);
        };
    } else {
        return function(...events) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback.apply(this, events);
            }, delay);
        };
    }
}

//!===========================================================================================!//

/**
 * 节流：每次时间间隔内只触发一次回调
 * @param {function} callback 执行的回调函数
 * @param {number} delay 时间间隔 默认500ms
 * @param {boolean} style 默认为true true为第一次触发时触发回调 false为最后次触发时触发回调
 * @param {any} arg 其它传入回调的参数
 */
function throttle(callback, delay = 500, style = true) {
    let timeoutId = null;
    if (style) {
        return function(...events) {
            if (!timeoutId) {
                callback.apply(this, events);
                timeoutId = setTimeout(() => {
                    timeoutId = null;
                }, delay);
            }
        };
    } else {
        return function(...events) {
            if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    timeoutId = null;
                    callback.apply(this, events);
                }, delay);
            }
        };
    }
}

export { throttle, debounce };
