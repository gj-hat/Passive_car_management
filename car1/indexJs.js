/**
 * 算法的结果遵循以下几个事实:
 *  1. 拖车在开始的STARTANDSTOP(全局参数可配置)时间里 或许会扫描多个小车但是其中一定有正确的小车
 *  2. 拖车在结束前的STARTANDSTOP(全局参数可配置)时间里 或许会扫描多个小车但是其中一定有正确的小车
 *  3. 正确的小车处于连接状态的时间不一定最长但是一定在TOPNUM(全局参数可以配置)中
 *  4. 结果集来源于上述三个集合的交集
 */
$(function () {

    // 全局变量
    const STARTANDSTOP = 10;
    const TOPNUM = 3;


    //初始化变量
    let second = 0;
    let millisecond = 0;
    let int;
    let resAllAyy = [];
    let frontN = [];
    let afterN = [];


    //开始按钮
    $('#startBtn').click(function () {
        window.clearInterval(int);
        millisecond = second = 0;
        $('#timetext').val(0 + '秒' + 0 + '毫秒')
        int = setInterval(timer, 50);
    })

    //停止按钮
    $('#stopBtn').click(function () {
        window.clearInterval(int);

        frontN = findFrontN(resAllAyy)
        afterN = findAfterN(resAllAyy)

        let resCar1 = twoArrIntersection(frontN, afterN)

        let findLongTimeCar = findLongTime(resAllAyy)
        let res = twoArrIntersection(resCar1, findLongTimeCar)


        if (res.length) {
            $('#textarea').val('猜测可能的跟随小车是:' + res);
        } else {
            $('#textarea').val('没猜到你跟随的小车是什么诶');
        }

    })


    $('#car1').click(function () {
        clickStatus('#car1')
    })
    $('#car2').click(function () {
        clickStatus('#car2')
    })
    $('#car3').click(function () {
        clickStatus('#car3')
    })
    $('#car4').click(function () {
        clickStatus('#car4')
    })
    $('#car5').click(function () {
        clickStatus('#car5')
    })
    $('#car6').click(function () {
        clickStatus('#car6')
    })
    $('#car7').click(function () {
        clickStatus('#car7')
    })
    $('#car8').click(function () {
        clickStatus('#car8')
    })
    $('#car9').click(function () {
        clickStatus('#car9')
    })
    $('#car10').click(function () {
        clickStatus('#car10')
    })
    $('#car11').click(function () {
        clickStatus('#car11')
    })
    $('#car12').click(function () {
        clickStatus('#car12')
    })


    /**
     * 计时函数
     */
    function timer() {
        millisecond = millisecond + 50;
        if (millisecond >= 1000) {
            millisecond = 0;
            second = second + 1;
        }
        $('#timetext').val(second + '秒' + millisecond + '毫秒')
    }


    /**
     * 获取并处理鼠标点击事件
     * @param ele    被点击的元素
     */
    function clickStatus(ele) {
        let classVal = $(ele).attr('class')

        let reg = RegExp(/active/);
        let res = reg.test(classVal);
        if (!res) {
            $(ele).addClass('active');
            resAllAyy.push([ele, second, true])
        } else {
            $(ele).removeClass('active')
            resAllAyy.push([ele, second, false])
        }
    }

    /**
     *   前n秒内处于连接的小车
     * @param resAllAyy
     * @returns {*[]}
     */
    function findFrontN(resAllAyy) {
        $.each(resAllAyy, function (index, value) {
            if (value[1] < STARTANDSTOP) {
                frontN.push(value[0])
            }
        });
        return noRepeat(frontN)
    }


    /**
     * 后10秒内处于连接的小车
     * @param resAllAyy
     * @returns {*[]}
     */
    function findAfterN(resAllAyy) {
        let conning = findConning(resAllAyy);
        $.each(resAllAyy, function (index, value) {
            if (value[1] > second - STARTANDSTOP) {
                afterN.push(value[0])
            }
        });
        $.each(conning, function (index, value) {
            afterN.push(value)
        });
        return noRepeat(afterN)
    }

    function findConning(arrAll) {
        let noRepCar = []
        let res = []
        $.each(arrAll, function (index, value) {
            noRepCar.push(value[0])
        });
        noRepCar = noRepeat(noRepCar);
        $.each(noRepCar, function (index, value) {
            let mark = 1;
            for (let i = 0; i < arrAll.length; i++) {
                if ((value === arrAll[i][0])) {
                    mark = mark + 1
                }
            }
            if (!(mark % 2)) {
                res.push(value);
            }
        })
        return res
    }


    /**
     * 两个数组的交集
     * @returns {*[]}
     * @param temp1
     * @param temp2
     */
    function twoArrIntersection(temp1, temp2) {
        return temp1.filter(function (v) {
            return temp2.indexOf(v) > -1
        })
    }


    /**
     * 返回所有小车的连接时长   并按照时长排序   返回时间时间前TOPNUM的元素
     * @param arrAll
     */

    function findLongTime(arrAll) {

        let noRepCar = []
        let res = []
        $.each(arrAll, function (index, value) {
            noRepCar.push(value[0])
        });
        noRepCar = noRepeat(noRepCar);
        $.each(noRepCar, function (index, value) {
            let connTime = 0;
            for (let i = 0; i < arrAll.length; i++) {
                if ((value === arrAll[i][0]) && arrAll[i][2]) {
                    for (let j = i + 1; j < arrAll.length; j++) {
                        if ((value === arrAll[j][0]) && !arrAll[j][2]) {
                            connTime = connTime + arrAll[j][1] - arrAll[i][1]
                            break
                        }
                    }
                }

            }
            if (connTime) {
                res.push([value, connTime]);
            }
            if (!connTime) {
                let tempNum = (value) => {
                    for (let i = 0; i < arrAll.length; i++) {
                        if (value === arrAll[i][0]) {
                            return second - arrAll[i][1]
                        }

                    }
                }
                res.push([value, tempNum(value)])
            }
        })


        // sort
        let temp = []
        for (let i = 0; i < res.length; i++) {
            for (let j = i + 1; j < res.length; j++) {
                if (res[i][1] < res[j][1]) {
                    temp = res[i]
                    res[i] = res[j]
                    res[j] = temp
                }
            }
        }
        let resArr = [];
        for (let i = 0; i < TOPNUM; i++) {
            resArr.push(res[i][0])
        }
        return resArr
    }


    /**
     * arr去重
     * @param arr
     * @returns {*[]}
     */
    function noRepeat(arr) {
        let setArr = new Set();
        $.each(arr, function (index, value) {
            setArr.add(value)
        });
        let res = []
        for (let i of setArr) {
            res.push(i)
        }
        return res;
    }


})

