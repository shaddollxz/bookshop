/*
 * @Author: shaddollxz
 * @Date: 2021-06-30 12:38:16
 * @LastEditTime: 2021-08-03 23:11:16
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

//!===========================================================================================!//

function choseFiles(num = 1) {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.multiple = num == 1 ? "" : "multiple";
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);

    return new Promise((resolve, reject) => {
        input.addEventListener("change", (e) => {
            if ((num = 1)) {
                resolve(e.target.files[0]);
            } else {
                resolve(Array.prototype.slice.call(e.target.files, 0, num));
            }
        });
    });
}

//!===========================================================================================!//

/**
 * 深复制 （该函数复制到get set选择器时会复制成get到的值
 * @param {object} oldvalue 要被复制的对象或数组
 * @param {boolean} TooDeep 是否复制不可遍历对象(get set函数无法复制 会复制成get的返回值)
 * @param {boolean} isClonePrototype 是否深复制原型上的属性(配合TooDeep能复制构造函数 原型方法)
 * @returns 新的对象
 */
function deepClone(oldvalue, TooDeep = false, isClonePrototype = false) {
    if (typeof oldvalue !== "object") throw "应该放入对象";

    let newvalue = Array.isArray(oldvalue) ? [] : Object.create(null);
    let oldkeys = TooDeep ? Reflect.ownKeys(oldvalue) : Object.keys(oldvalue);

    for (const key of oldkeys) {
        if (typeof oldvalue[key] == "object") {
            if (oldvalue[key] === null) {
                //? 如果是null
                newvalue[key] = null;
            } else if (oldvalue[key] instanceof RegExp) {
                //? 如果是正则表达式
                newvalue[key] = oldvalue[key];
            } else {
                //? 剩下的是数组，对象
                newvalue[key] = deepClone(oldvalue[key], TooDeep, isClonePrototype);
            }
        } else {
            //? 如果不是object
            newvalue[key] = oldvalue[key];
        }
    }

    let oldPrototype = Object.getPrototypeOf(oldvalue);
    if (oldPrototype) {
        if (!isClonePrototype) {
            //? 将旧对象的原型指向新对象
            Object.setPrototypeOf(newvalue, oldPrototype);
        } else {
            //? 深复制old的原型链 如果下一层是Object则把Object的原型复制上去
            if (oldPrototype.constructor.name !== "Object") {
                Object.setPrototypeOf(
                    newvalue,
                    deepClone(oldPrototype, TooDeep, isClonePrototype)
                );
            } else {
                Object.setPrototypeOf(newvalue, Object.getPrototypeOf({}));
            }
        }
    }
    return newvalue;
}

//!===========================================================================================!//

/**
 * 判断两个值是否相等 (无法判断set是否相同)
 * @param {any} F 对比的值
 * @param {any} S 对比的值
 * @param {boolean} ToopDeep 是否比较不可遍历对象 包含symbol做键的obj
 * @returns boolen
 */
function isSame(F, S, TooDeep = false) {
    if (F === S) return true;
    if (Number.isNaN(F) && Number.isNaN(S)) return true;

    if (typeof F === "symbol") {
        if (F.toString() === S.toString()) {
            return true;
        } else {
            return false;
        }
    }

    if (typeof F === "object") {
        const Fkeys = TooDeep ? Reflect.ownKeys(F) : Object.keys(F);
        const Skeys = TooDeep ? Reflect.ownKeys(S) : Object.keys(S);
        if (Fkeys.length != Skeys.length) return false;

        for (const key of Fkeys) {
            if (Skeys.includes(key)) {
                //? 如果是正则表达式以外的对象 都能递归该方法判断
                if (F[key] instanceof RegExp) {
                    if (!(F[key].source === S[key].source)) {
                        return false;
                    }
                } else if (!isSame(F[key], S[key])) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

//!===========================================================================================!//

/**
 * 判断传入数据是不是有效数据
 * 有效数据：被类型转换后为true的值 不包括`{},[]` 但包括0
 * 一个数组或对象只要含有一个有效数据都被判断为有效数据
 * @param {any} value 判断的值
 * @returns {boolean}
 */
function isTruthy(value) {
    if (value == null) return false;

    if (typeof value === "object") {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return false;
            } else {
                for (const item of value) {
                    if (isTruthy(item)) {
                        return true;
                    }
                }
                return false;
            }
        } else {
            if (Object.keys(value).length === 0) {
                return false;
            } else {
                for (const key in value) {
                    if (isTruthy(value[key])) {
                        return true;
                    }
                }
                return false;
            }
        }
    } else {
        if (value == 0) {
            return true;
        } else {
            return value ? true : false;
        }
    }
}

//!===========================================================================================!//

/**
 * 把数组或对象中的无效数据删去
 * 无效数据：被类型转换后为false的值 包括`{},[]` 但不包括0
 * 如果数组或对象中只有无效数据，该数组或对象也被判断为无效数据
 * @param {object} value 要去除无效数据的数组或对象
 * @returns 去除后的数据
 */
function getTruthy(value) {
    if (typeof value != "object") throw new TypeError("应该为对象或数组");

    if (Array.isArray(value)) {
        const result = [];
        value.forEach((item) => {
            if (isTruthy(item)) {
                if (typeof item != "object") {
                    result.push(item);
                } else {
                    result.push(getTruthy(item));
                }
            }
        });
        return result;
    } else {
        const result = {};
        for (const key in value) {
            if (isTruthy(value[key])) {
                if (typeof value[key] != "object") {
                    result[key] = value[key];
                } else {
                    result[key] = getTruthy(value[key]);
                }
            }
        }
        return result;
    }
}

//!===========================================================================================!//

/**
 * 不通过修改内存地址将一个对象或数组替换为另一个对象或数组
 * 在需要重写`const`定义的对象或在vue里需要改写对象或数组时有用
 */
function replaceObject(ov, ...nv) {
    if (Array.isArray(ov)) {
        ov.length = 0;
        nv.forEach((item) => {
            item.forEach((value) => {
                ov.push(value);
            });
        });
    } else {
        for (const key in ov) {
            delete ov[key];
        }
        Object.assign(ov, ...nv);
    }
}

//!===========================================================================================!//

/**
 * 用户使用时的浏览器及版本号
 * @returns {Array}
 */
function userBrowers() {
    const agent = navigator.userAgent;
    const regexp = /((?<opera>OPR)|(?<safari>Safari)|(?<chrome>Chrome)|(?<edge>Edg)|(?<ie>NET)|(?<firefox>Firefox))\/(?<version>(\d|\.)*)/g;
    const result = {};
    const matchAll = agent.matchAll(regexp);
    for (const { groups } of matchAll) {
        result[Object.keys(getTruthy(groups))[0]] = groups.version;
    }
    return result;
}

//!===========================================================================================!//

/**
 * 因为safari对scrollTo的smooth动画支持不好，所以这个方法用手动动画实现滚动
 * 该函数经过柯里化 第一次调用后返回函数 调用第二次的函数
 */
function rollTo(y = 0, x = 0) {
    if (userBrowers().mainBrower !== "safari") {
        return () =>
            window.scrollTo({
                top: y,
                left: x,
                behavior: "smooth",
            });
    }

    const point = {
        top: document.documentElement.scrollTop || document.body.scrollTop,
        left: document.documentElement.scrollLeft || document.body.scrollLeft,
    };
    const methouds = {
        t: (where) => {
            const end = where == "top" ? y : x;
            return Math.round(point[where]) == end ? end : (point[where] -= point[where] / 8);
        },
        f: (where) => {
            const end = where == "top" ? y : x;
            return Math.round(point[where]) == end
                ? end
                : (point[where] += (end - point[where]) / 8);
        },
    };

    // *=============== 初始位置相对于要到位置的表示 可以看作一个二维数组 [[tt,tf],[ft,ff]] ===============* //
    const state = [point.top > y ? "t" : "f", point.left > x ? "t" : "f"];
    function getPoint(state) {
        return state.map((value, index) => {
            const where = index ? "top" : "left";
            return methouds[value](where);
        });
    }

    return function inner() {
        console.log(point);
        if (Math.floor(point.top) != ~~y - 1 || Math.floor(point.left) != ~~x - 1) {
            window.requestAnimationFrame(inner);
            window.scrollTo.apply(null, getPoint(state));
        } else {
            window.scrollTo(x, y); //! 动画结束后再移动一次修正小数点
        }
    };
}

//!===========================================================================================!//

/**
 * 通过继承该类并在super中写入构造函数
 * 该类就会成为单例模式，只生成一个实例
 */
const SingletonConstructor = (function() {
    const instances = Object.create(null);
    return class {
        constructor(Constructor) {
            const className = new.target.name;
            if (className == "SingletonConstructor") return null;

            if (instances[className]) {
                return instances[className];
            } else {
                const instance = new Constructor();
                Object.setPrototypeOf(instance, new.target.prototype);
                return (instances[className] = instance);
            }
        }
    };
})();

//!===========================================================================================!//

/**
 * 通过继承该类在super上传入异步箭头函数实现异步实例化
 * 该类不能被实例化
 */
class AsyncConstructor {
    constructor(asyncConstructor) {
        if (new.target.name == "AsyncConstructor") return null;

        const init = (async () => {
            await Promise.resolve(); //! 在回调执行前开启一次微任务，回调里就能随意使用this
            await asyncConstructor();
            delete this.then;
            return this;
        })();
        this.then = init.then.bind(init);
    }
}

//!===========================================================================================!//

/** SDMath的基础 借鉴了MDN里的示例方法 */
function mathBase(methods) {
    const method = Math[methods];
    return function(number, precision = 0) {
        if (precision) {
            number = number + "e" + precision;
            return +(method(+number) + "e" + -precision);
        } else {
            return method(number);
        }
    };
}
const _mathMethods = {
    ADD: {
        getPoint: (point1, point2) => [
            point1 > point2 ? point1 : point2,
            point1 > point2 ? point1 : point2,
        ],
        method: (num1, num2) => num1 + num2,
    },
    SUB: {
        getPoint: (point1, point2) => [
            point1 > point2 ? point1 : point2,
            point1 > point2 ? point1 : point2,
        ],
        method: (num1, num2) => num1 - num2,
    },
    MUL: {
        getPoint: (point1, point2) => [point1 > point2 ? point1 : point2, point1 + point2],
        method: (num1, num2) => num1 * num2,
    },
    DIV: {
        getPoint: (point1, point2) => [point1 > point2 ? point1 : point2, 0],
        method: (num1, num2) => num1 / num2,
    },
};
function operateBase(type) {
    const methods = _mathMethods[type];
    return (num1, num2) => {
        const str1 = "" + num1;
        const str2 = "" + num2;
        let num1_point = str1.lastIndexOf(".");
        let num2_point = str2.lastIndexOf(".");
        if (~num1_point && ~num2_point) {
            num1_point = str1.length - 1 - num1_point;
            num2_point = str2.length - 1 - num2_point;
            const [point, finallyPiont] = methods.getPoint(num1_point, num2_point);
            const add1 = +(num1 + "e" + point);
            const add2 = +(num2 + "e" + point);
            return +(methods.method(add1, add2) + "e" + -finallyPiont);
        } else {
            return methods.method(num1, num2);
        }
    };
}

/**
 * 提供了Math方法的小数部分取值
 * 对浮点数运算的支持
 */
class SDMath {
    /** 四舍五入 */
    static round = mathBase("round");
    /** 向上取整 */
    static ceil = mathBase("ceil");
    /** 向下取整 */
    static floor = mathBase("floor");
    /** 加法 */
    static add = operateBase("ADD");
    /** 减法 */
    static sub = operateBase("SUB");
    /** 乘法 */
    static mul = operateBase("MUL");
    /** 除法 */
    static div = operateBase("DIV");
}

//!===========================================================================================!//

// *=============== 该类依赖于SDMath类 ===============* //
/**
 * 随机数生成器
 * 通过静态方法返回一个指定范围的随机数
 * 实例化对象的getRandom根据实例化时的参数返回不同结果：
 * 数组：返回不会重复的随机数
 * 字符串：返回字符串中的随机字符
 * @param {Array|String} range 生成数据的范围 如果生成数字输入最小最大值 如果是固定的一些字符输入字符串
 * @param {number} precision 生成数保留小数点位数 默认不保留
 */
class Random {
    constructor(range, precision = 0) {
        let arr = [];
        this.range = range;
        this.precision = precision;
        /**
         * 因为实际上只有safari实现了尾递归优化 所以不要用该函数生成太多数
         * 具体多少。。。因为是随机的所以没个大概值不要过一万吧
         */
        this.getRandom = (() => {
            if (Array.isArray(this.range)) {
                return () => {
                    const [min, max] = this.range;
                    if (Object.keys(arr).length == max - min + 1) return null;
                    let random = Random.getNumber(min, max, this.precision);
                    return arr[random] ? this.getRandom() : ((arr[random] = true), +random);
                };
            } else {
                return (len = 1) => {
                    if (len == 1) {
                        return this.range[Random.getNumber(0, this.range.length - 1)];
                    } else {
                        this.clear();
                        for (let i = 0; i < len; i++) {
                            this.arr.push(this.range[Random.getNumber(0, this.range.length - 1)]);
                        }
                        return this.arr.join("");
                    }
                };
            }
        })();
        this.clear = () => {
            arr = [];
        };
    }
    static getNumber(range, precision = 0) {
        const [min, max] = range;
        let random = Math.random() * (max - min + 1) + min;
        random = SDMath.floor(random, precision);
        return random;
    }
    static getBoolean() {
        return Math.random() > 0.5;
    }
    static getString = (() => {
        const charMap = {
            all: [33, 126],
            lower: [97, 122],
            upper: [65, 90],
            number: [48, 57],
            chinese: [0x4e00, 0x9fa5],
        };
        return function(len = 1, type = "all") {
            if (len == 1) {
                return String.fromCharCode(Random.getNumber(charMap[type]));
            } else {
                const chars = Array.from({ length: len }, () => Random.getNumber(charMap[type]));
                return String.fromCharCode(...chars);
            }
        };
    })();
}

//!===========================================================================================!//

/**
 * 扩展了原生Date类
 * 新增了静态获得当前时间的字符串 获得两个时间点的差值
 * 实例上新增了时间加减运算 与一个时间点的差值计算
 */
class SDDate extends Date {
    constructor(...arg) {
        if ([...arg].length > 0) {
            super(...arg);
        } else {
            super();
        }
    }
    //* ====================获得时刻==================== *//
    /**
     * 获得当前时间点的格式化后字符串
     * @param {string} formatStr 格式化字符串
     * @param {boolean} useChinese 是否将月份和周数转换为中文 默认为true
     */
    static now(formatStr, useChinese) {
        return new SDDate().format(formatStr, useChinese);
    }

    /**
     * 将该时间转换为指定格式的字符串
     * @param {string} formatStr 格式化字符串
     * @param {boolean} useChinese 是否将月份和周数转换为中文 默认为true
     */
    format(formatStr = "YYYY-MM-DD HH:mm:ss.ms TT 周W", useChinese = true) {
        //! 上下午分开判断 不然如果在小时之前或没有小时会无法判断出
        const isHaveTT = /TT/g.test(formatStr);
        if (isHaveTT) {
            formatStr = formatStr.replace(
                /TT/g,
                this.getHours() > 12
                    ? useChinese
                        ? "下午"
                        : "p.m."
                    : useChinese
                    ? "上午"
                    : "a.m."
            );
        }
        const regexp = /(?<FullYear>Y{4})|(?<month>M{2,3})|(?<Date>D{2})|(?<Hours>(h|H){2})|(?<Minutes>m{2})|(?<Seconds>s{2})|(?<Day>W{1})|(?<Milliseconds>ms)/g;
        if (regexp.test(formatStr) || isHaveTT) {
            const isHour12 = /hh/g.test(formatStr);
            return formatStr.replace(regexp, (...arg) => {
                const groups = arg.pop();
                const key = Object.keys(JSON.parse(JSON.stringify(groups)))[0]; //? 取得groups里的有效值，即当前遍历到的项
                let data = "" + this["get" + key]();

                if (key == "month" && groups.month.length === 3) {
                    data = useChinese
                        ? this.transformChinese[data]
                        : this.transformEnglish_Month[data];
                } else if (key == "Day") {
                    data = useChinese
                        ? this.transformChinese[data]
                        : this.transformEnglish_Week[data];
                } else if (key == "Hours") {
                    data = isHour12 ? (data > 12 ? data - 12 : data) : data;
                } else {
                    if (data.length < 2) {
                        data = "0" + data;
                    }
                }

                return data;
            });
        } else {
            throw new TypeError("格式化字符串不正确");
        }
    }

    /**
     * 在当前时间上加上指定的时间
     * @param {number} timeNumber 加上的时间
     * @param {string} precision 时间的精度 默认为秒
     */
    add(timeNumber, precision = "ss") {
        if (!SDDate.timeTable.hasOwnProperty(precision)) throw "时间精度错误";
        const newTime = this.getTime() + timeNumber * SDDate.timeTable[precision][1];
        return new SDDate(newTime);
    }
    /**
     * 在当前时间上减去指定的时间
     * @param {number} timeNumber 减去的时间
     * @param {string} precision 时间的精度 默认为秒
     */
    sub(timeNumber, precision = "ss") {
        if (!SDDate.timeTable.hasOwnProperty(precision)) throw "时间精度错误";
        const newTime = this.getTime() - timeNumber * SDDate.timeTable[precision][1];
        return new SDDate(newTime);
    }

    /**
     * 原生getMonth()得到的月份从0开始
     * 这里修改为从一开始
     * 不输入参数时返回数字
     * 输入true时返回中文
     * 输入false时返回英文
     */
    getmonth(...arg) {
        if (arg.length == 0) {
            return this.getMonth() + 1;
        } else {
            const [isuseChinese] = arg;
            if (isuseChinese) {
                return this.transformChinese[this.getMonth() + 1] + "月";
            } else {
                return this.transformEnglish_Month[this.getMonth() + 1];
            }
        }
    }
    //* ====================获得时间段==================== *//
    /**
     * 获得两个时间的时间差
     * 输入时间必须能被Date实例化
     */
    static difference(timeOne, timeTwo, precision = "mm", formatStr = "mm:ss") {
        const TimeOne = new Date(timeOne).getTime();
        const TimeTwo = new Date(timeTwo).getTime();
        const difference = TimeOne - TimeTwo;
        return SDDate.transformTimeNumber(Math.abs(difference), precision, formatStr);
    }
    /**
     * 获得输入时间到该时间的时间差
     * 输入时间必须能被Date实例化
     */
    difference(time, precision = "mm", formatStr = "mm:ss") {
        const now = this.getTime();
        const timeNumber = new Date(time).getTime();
        const difference = now - timeNumber;
        return SDDate.transformTimeNumber(Math.abs(difference), precision, formatStr);
    }

    /**
     * 将毫秒换成指定上限单位的时间字符串
     * @param {number} timeNumber 以毫秒为单位的时间数字
     * @param {string} precision 转换后的时间精度 即到了指定位时不会进位
     * @param {string} formatStr 格式化字符串
     */
    static transformTimeNumber(timeNumber, precision = "mm", formatStr = "mm:ss") {
        const TimeTable = SDDate.timeTable;
        if (!TimeTable.hasOwnProperty(precision)) throw "时间精度错误";
        const result = {};
        precision = TimeTable[precision][0];
        switch (precision) {
            case "Year":
                result.Year = ~~(timeNumber / TimeTable.YYYY[1]);
                timeNumber = timeNumber % TimeTable.YYYY[1];
            case "Month":
                result.Month = ~~(timeNumber / TimeTable.MM[1]);
                timeNumber = timeNumber % TimeTable.MM[1];
            case "Day":
                result.Day = ~~(timeNumber / TimeTable.DD[1]);
                timeNumber = timeNumber % TimeTable.DD[1];
            case "Hour":
                result.Hour = ~~(timeNumber / TimeTable.hh[1]);
                timeNumber = timeNumber % TimeTable.hh[1];
            case "Minute":
                result.Minute = ~~(timeNumber / TimeTable.mm[1]);
                timeNumber = timeNumber % TimeTable.mm[1];
            case "Second":
                result.Second = ~~(timeNumber / TimeTable.ss[1]);
                if (/ms/g.test(formatStr)) {
                    timeNumber = timeNumber % TimeTable.ss[1];
                } else {
                    break;
                }
            case "Millisecond":
                result.Millisecond = timeNumber;
        }
        return SDDate.formatTimeObj(result, formatStr);
    }

    /**
     * 将记录时间的一个对象格式化为指定的字符串
     * ! 不建议直接使用 该方法主要是在 transformTimeNumber 和 difference 中用来格式化 !
     * @param {Object} timeObj 将时间数字转换为的记录对象
     * @param {string} formatStr 格式化字符串 只能包含timeObj指定的属性
     */
    static formatTimeObj(timeObj, formatStr) {
        const regexp = /(?<Year>Y{4})|(?<Month>M{2})|(?<Day>D{2})|(?<Hour>h{2})|(?<Minute>m{2})|(?<Second>s{2})|(?<Millisecond>ms)/g;
        if (regexp.test(formatStr)) {
            return formatStr.replace(regexp, (...arg) => {
                const groups = arg.pop();
                const key = Object.keys(JSON.parse(JSON.stringify(groups)))[0];
                //? 毫秒以外的时间不足两位补零
                if (key != "Millisecond" && ("" + timeObj[key]).length < 2) {
                    return "0" + timeObj[key];
                }
                return timeObj[key];
            });
        } else {
            throw "格式化字符串不正确";
        }
    }

    static timeTable = {
        ms: ["Millisecond", 1],
        ss: ["Second", 1000],
        mm: ["Minute", 1000 * 60],
        hh: ["Hour", 1000 * 60 * 60],
        DD: ["Day", 1000 * 60 * 60 * 24],
        W: ["Week", 1000 * 60 * 60 * 24 * 7],
        MM: ["Month", 1000 * 60 * 60 * 24 * 30],
        YYYY: ["Year", 1000 * 60 * 60 * 24 * 365],
        set yearDay(newvalue) {
            this.YYYY = ["Year", 1000 * 60 * 60 * 24 * newvalue];
        },
        set monthDay(newvalue) {
            this.MM = ["Month", 1000 * 60 * 60 * 24 * newvalue];
        },
    };
}
SDDate.prototype.transformChinese = [
    "天",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二",
];
SDDate.prototype.transformEnglish_Week = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
SDDate.prototype.transformEnglish_Month = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sept",
    10: "Oct",
    11: "Nov",
    12: "Dec",
};

//!===========================================================================================!//

// *=============== 该类依赖于SDDate类且继承自SingletonConstructor ===============* //
/**
 * 包装一个localStorage
 * 该类只会有一个实例化对象
 * 实例化时检测浏览器是否支持locaStorage
 * 包装了getItem setItem removeItem
 * 新增了keys属性 setLimitTime方法
 */
class LocalStorage extends SingletonConstructor {
    constructor() {
        super(function() {
            //? 检测localStorage是否可用
            try {
                var x = "__storage_test__";
                window.localStorage.setItem(x, x);
                window.localStorage.removeItem(x);
                this.localStorage = window.localStorage;
            } catch (e) {
                return e;
            }
        });
    }
    setItem(key, value) {
        this.localStorage.setItem(key, JSON.stringify(value));
    }
    getItem(key) {
        const result = JSON.parse(this.localStorage.getItem(key));
        if (Array.isArray(result)) {
            const end = result[result.length - 1];
            if ("__LIMIT__" in end) {
                if (end.__LIMIT__ < Date.now()) {
                    this.remove(key);
                    return null;
                } else {
                    return result[0];
                }
            } else {
                return result;
            }
        } else {
            return result;
        }
    }
    removeItem(key) {
        try {
            this.localStorage.removeItem(key);
            return true;
        } catch (e) {
            return e;
        }
    }
    clear() {
        this.localStorage.clear();
    }
    /**
     * 设置一个会过期的本地存储
     * @param {string} key 键
     * @param {any} value 值
     * @param {Array} delay 经过多长时间过期 格式为["时间长度","时间单位"]
     */
    setLimitTime(key, value, delay) {
        this.localStorage.setItem(
            key,
            JSON.stringify([value, { __LIMIT__: new SDDate().add(delay[0], delay[1]).getTime() }])
        );
    }
    removeLimitTime(key) {
        const value = this.get(key);
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    /** 删除原来的window.localStorage 将该实例注入window */
    inject() {
        delete window.localStorage;
        window.localStorage = this;
    }

    get keys() {
        return Object.keys(this.localStorage);
    }
}

//!===========================================================================================!//

// *=============== 该类继承自AsyncConstructor ===============* //
/**
 * indexedDB的封装
 * 实例化时使用`await new SDIDB(xxx)`
 * 实例化时自动打开或创建当前版本的数据库
 */
const SDIDB = (function() {
    return class extends AsyncConstructor {
        constructor(dbname) {
            if (!window.hasOwnProperty("indexedDB")) throw "该浏览器不支持indexedDB";
            super(async () => {
                await openDB.call(this);
            });
            this.DBname = dbname;
            this.__DBcatch__;
            this.tableName;
            this.keyPath;
            this.indexs;
            this.tableList = [];
            this.version = null;
            this.callBacks = {
                insertSuccess() {
                    console.log("数据写入成功");
                },
                insertError() {
                    console.log("数据写入失败");
                },
                updataSuccess() {
                    console.log("数据修改成功");
                },
                updataError() {
                    console.log("数据修改失败");
                },
                deleteSuccess() {
                    console.log("数据删除成功");
                },
                deleteError() {
                    console.log("数据删除失败");
                },
            };
        }

        /**
         * 修改增删改时成功或失败时触发的回调
         * @param {function} callback 新的回调
         * @param {string} type 修改的回调的名字: `xxxSuccess` `xxxError`
         */
        setCallBack(callback, type) {
            this.callBacks[type] = callback;
        }

        /**
         * 创建新的表 只有不设置主键和索引时才能直接放入对象以外的数据
         * @property {string} tableName 表的名字 *必须
         * @param {object} settings 表的设定 该对象拥有以下三个属性
         * @--------------
         * @property {string} keyPath 主键 如果没有设定会自动生成一个递增的主键 但是该表就不能更新数据
         * @property {Array} index 索引 多个索引都放入该数组 索引见下
         * @--------------
         * @property {string} key 将该列设为索引
         * @property {boolean} unique 索引是否是唯一值 默认为false
         * @property {string} name 索引名字 搜索时用的索引以该值为准 没有时以key代替
         */
        async createTable(tableName, settings) {
            //? 如果有缓存 先把它关闭再重新升级建表
            //! 这里已经被openDB中success的onversionchange代替
            //// if (this.__DBcatch__) {this.__DBcatch__.close(); this.__DBcatch__ = null;}
            await openDB.call(this, "create", tableName, settings);
            return this;
        }

        /** 删除指定的表，没有指定表名将删除当前表 */
        async removeTable(tableName = null) {
            //? 如果有缓存 先把它关闭再重新升级建表
            await openDB.call(this, "remove", tableName || this.tableName);
            this.keyPath = undefined;
            this.indexs = null;
            this.tableList = []; //? 在数组中删除该表的名字
            return this;
        }

        /**
         * 选择一个表并返回一个布尔值表示是否成功打开
         * 需要使用该函数指定进行操作的表才能增删改查
         * @param {string} tableName 表名
         */
        async useTable(tableName) {
            if (this.tableList.includes(tableName)) {
                this.tableName = tableName;

                const IDBObjectStore = this.__DBcatch__
                    .transaction([this.tableName], "readonly")
                    .objectStore(this.tableName);
                this.keyPath = IDBObjectStore.keyPath;
                const indexNames = IDBObjectStore.indexNames;

                if (indexNames.length) {
                    const indexObj = {};
                    for (const indexName of indexNames) {
                        const { keyPath, multiEntry, unique, name } = IDBObjectStore.index(
                            indexName
                        );
                        indexObj[name] = { keyPath, multiEntry, unique };
                    }
                    this.indexs = indexObj;
                }
                return true;
            } else {
                return false;
            }
        }

        /**
         * 如果没有指定的表将创建一个新表并指向它
         * @property {string} tableName 表的名字 *必须
         * @param {object} settings 表的设定 该对象拥有以下三个属性
         * @--------------
         * @property {string} keyPath 主键 如果没有设定会自动生成一个递增的主键 但是该表就不能更新数据
         * @property {Array} index 索引 多个索引都放入该数组 索引见下
         * @--------------
         * @property {string} key 将该列设为索引
         * @property {boolean} unique 索引是否是唯一值 默认为false
         * @property {string} name 索引名字 搜索时用的索引以该值为准 没有时以key代替
         */
        async loadTable(tableName, settings) {
            if (!(await this.useTable(tableName))) {
                await this.createTable(tableName, settings);
                await this.useTable(tableName);
            }
            return this;
        }

        /**
         * 给指定的表添加数据
         * @param {any} data 添加进表的数据
         * @returns {Promise} 该实例本身 可以用then链式调用
         */
        async insert(data) {
            //? 创建请求
            let IDBrequest = this.__DBcatch__
                .transaction([this.tableName], "readwrite")
                .objectStore(this.tableName)
                .add(data);
            //? 等待请求的结果 成功与失败的回调都在这里面
            await requestCallBack.call(this, IDBrequest, "insert");
            return this;
        }

        /** 将数据全部插入数据库 数据必须是数组 */
        async insertAll(data) {
            if (!Array.isArray(data)) throw new TypeError("必须是数组类型");

            for (const item of data) {
                await this.insert(item);
            }
            return this;
        }

        /**
         * 更新表数据 只能把要更新的整行数据放入，不能只更新某一列对应数据
         * @param {any} data 要更新的数据
         */
        async updata(data) {
            //? 创建请求
            let IDBrequest = this.__DBcatch__
                .transaction([this.tableName], "readwrite")
                .objectStore(this.tableName)
                .put(data);
            await requestCallBack.call(this, IDBrequest, "updata");
            return this;
        }

        /** 将数据全部更新 数据必须是数组 */
        async updataAll(data) {
            if (!Array.isArray(data)) throw new TypeError("必须是数组类型");

            for (const item of data) {
                await this.updata(item);
            }
            return this;
        }

        /**
         * 删除指定主键的一行
         * @param {any} keyPath 主键
         */
        async delete(keyPath) {
            let IDBrequest = this.__DBcatch__
                .transaction([this.tableName], "readwrite")
                .objectStore(this.tableName)
                .delete(keyPath);
            await requestCallBack.call(this, IDBrequest, "delete");
            return this;
        }

        /**
         * 查找数据库表中匹配的第一条数据
         * @param {any} value 查找的数据 可以是数组但不能是对象
         * @param {string} index 查找的索引 如果不写就找主键
         */
        async select(value, index) {
            if (value === undefined) throw "不能查找undefined";

            const IDBrequest = index
                ? //? 使用索引查找
                  this.__DBcatch__
                      .transaction([this.tableName], "readonly")
                      .objectStore(this.tableName)
                      .index(index)
                      .getAll(value)
                : //? 没有用索引会使用主键查找
                  this.__DBcatch__
                      .transaction([this.tableName], "readonly")
                      .objectStore(this.tableName)
                      .get(value);
            return await requestCallback(IDBrequest);
        }

        /** 获得该表有多少条数据 */
        async count() {
            let IDBrequest = await this.__DBcatch__
                .transaction([this.tableName], "readonly")
                .objectStore(this.tableName)
                .count();

            return await requestCallback(IDBrequest);
        }

        /**
         * 查找数据库表中匹配的所有数据 不放入参数会查找所有数据
         * @param {any} value 查找的数据 可以是数组但不能是对象
         * @param {string} index 查找的索引
         * @returns {Promise} 以键值对形式的类数组对象
         */
        async selectAll(index) {
            const getcursor = this.__DBcatch__
                .transaction([this.tableName], "readonly")
                .objectStore(this.tableName)
                .openCursor();

            return await (() => {
                return new Promise((resolve, reject) => {
                    const result = [];

                    getcursor.onerror = () => {
                        resolve();
                        throw "查询失败";
                    };

                    if (index) {
                        //? 查找指定索引
                        getcursor.onsuccess = (e) => {
                            let cursor = e.target.result;
                            if (cursor) {
                                if (cursor.value[index]) {
                                    result.push(cursor.value);
                                }
                                cursor.continue();
                            } else {
                                resolve(result);
                            }
                        };
                    } else {
                        //? 查找所有
                        getcursor.onsuccess = (e) => {
                            let cursor = e.target.result;
                            if (cursor) {
                                result.push(cursor.value);
                                cursor.continue();
                            } else {
                                resolve(result);
                            }
                        };
                    }
                });
            })();
        }

        /**
         * 删库跑路
         * @param {string} dbname 数据库名字
         */
        static deleteDB(dbname) {
            window.indexedDB.deleteDatabase(dbname);
        }
    };

    //* ====================不暴露到实例上==================== *//

    //? 增删改的请求的回调
    function requestCallBack(IDBrequest, type) {
        return new Promise((resolve, reject) => {
            IDBrequest.onsuccess = () => {
                //todo 请求成功的回调
                this.callBacks[type + "Success"]();
                resolve(this);
            };
            IDBrequest.onerror = () => {
                //todo 请求成功的回调
                this.callBacks[type + "Error"]();
                resolve(this);
            };
        });
    }
    //? 进行查询的回调
    function requestCallback(IDBrequest) {
        return new Promise((resolve, reject) => {
            IDBrequest.onsuccess = (e) => {
                resolve(e.target.result);
            };
            IDBrequest.onerror = () => {
                resolve(false);
            };
        });
    }

    /**
     * 用来打开数据库使用
     * @param {string} type 升级数据库时是移除表还是添加表
     * @param {boolean} tableName 是否升级数据库 默认为false 在需要修改表结构或添加表时用true
     * @param {object} settings 创建新表时需要放入的设置
     * @returns
     */
    async function openDB(type, tableName, settings) {
        let DBRequest =
            type && this.version
                ? window.indexedDB.open(this.DBname, ++this.version)
                : window.indexedDB.open(this.DBname);

        //? onerror
        DBRequest.onerror = () => {
            throw "数据库打开失败";
        };

        //? onupgradeneeded
        await upgradeneeded(DBRequest, type, tableName, settings);

        //? onsuccess
        return await (() => {
            return new Promise((resolve, reject) => {
                DBRequest.onsuccess = (e) => {
                    const DB = e.target.result;
                    //? 在需要升级该数据库时关闭它
                    DB.onversionchange = () => DB.close();
                    this.__DBcatch__ = DB; //? 如果更新 DBcatch 会关闭 要给它重新赋值
                    this.version = DB.version;
                    this.tableList = Array.from(DB.objectStoreNames);
                    resolve();
                };
            });
        })();
    }
    //! 用来监听onupgradeneeded事件的函数 同时添加或删除表也是在里面进行 !
    function upgradeneeded(DBRequest, type, tableName, settings) {
        if (!type) return;

        return new Promise((resolve, reject) => {
            DBRequest.onupgradeneeded = (e) => {
                const DB = e.target.result;

                if (type == "create") {
                    //? 建表
                    (function(tableName, settings = {}) {
                        const table = DB.createObjectStore(
                            tableName,
                            "keyPath" in settings
                                ? { keyPath: settings.keyPath }
                                : { autoIncrement: true }
                        );
                        //? 设置索引 在查询时可以用索引查询
                        if ("index" in settings) {
                            for (const value of settings.index) {
                                table.createIndex(
                                    value.key, //? 索引对应的key
                                    value.name ?? value.key, //? 索引名称
                                    {
                                        unique: value.unique ?? false, //? 索引能否有重复值 默认为有
                                        multiEntry: value.multiEntry ?? true, //? 索引是数组时能否用数组中元素进行搜索 默认为能
                                    }
                                );
                            }
                        }
                    })(tableName, settings);
                } else if (type == "remove") {
                    DB.deleteObjectStore(tableName);
                }
                resolve(DB);
            };
        });
    }
})();

//!===========================================================================================!//

/**
 * 专用工作者线程的扩展类
 * 可以支持路径导入js或者直接传入另一线程的函数来实例化 函数会被立即调用
 */
class SDWorker extends Worker {
    constructor(URI, options) {
        if (typeof URI === "function") {
            let blob = URL.createObjectURL(new Blob([`(${URI.toString()})()`]));
            super(blob, options);
        } else {
            super(URI, options);
        }
    }
    /**
     * 向线程发送数据后异步接收线程返回的数据
     * @param {any} data 发送的数据
     * @param {Array} blobdata 要转移的ArrayBuffer组成的数组
     * @returns Promise 对发送出的数据操作后的返回数据
     */
    async send(data, blobdata) {
        this.postMessage(data, blobdata);
        return await new Promise((resolve, reject) => {
            this.onmessage = ({ data }) => {
                this.onmessage = null;
                resolve(data);
            };
            this.onerror = ({ message }) => {
                this.onerror = null;
                reject(message);
            };
        });
    }
    close() {
        super.terminate();
    }
}

//!===========================================================================================!//

export {
    throttle,
    debounce,
    choseFiles,
    deepClone,
    isSame,
    isTruthy,
    getTruthy,
    replaceObject,
    userBrowers,
    rollTo,
    SingletonConstructor,
    AsyncConstructor,
    SDMath,
    Random,
    SDDate,
    LocalStorage,
    SDIDB,
    SDWorker,
};
