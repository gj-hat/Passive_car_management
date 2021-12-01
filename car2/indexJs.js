$(function () {

        // 全局变量
        let DISCONNECTTIME = 2
        let CONNECTING = 5


        //初始化变量
        let second = 0;     // 当前时间
        let millisecond = 0;
        let int;
        let resAllArray = [];      // 全局arr


        /**
         * 每次点击小车按钮都会触发计算
         计算逻辑:
         1. 遍历:
         1. 如果大于超时时间没有连接 调用移除函数
         2. 处于持续连接的 判断总时长 -> 总时长小于临界值?调用移除函数(移除所有):判断是否大于超时时间
         3. 接上2 大于超时时间 抛出`[小车名,首次连接时间,断开时间]`
         4. 小于超时时间 且处于连接中 忽略交由下次执行

         2. 相关函数
         1. 移除函数1    -----  只顺序移除一组      ok
         2. 移除函数2    -----  移除所有            ok
         3. 返回总时长数组   ----  参数(小车名)    返回值 [小车名,总时长,初始连接时长,断连的时间]      ok
         4. 判断是否大于超时时间函数   ----  参数(`[小车名,时间][false]`)   返回值   t or f           ok
         */


        /**
         * 主函数
         * resArr = [小车名,初始连接时长,断连的时间,总时长]
         */
        function main() {
            let resArr = []
            for (let i = 0; i < resAllArray.length; i++) {
                let temp = []
                let temp1 = 0
                if (resAllArray[i][2] === true) {
                    temp1 = 1
                    temp.push(resAllArray[i][0]);
                    temp.push(resAllArray[i][1]);
                }
                for (let j = i + 1; (j < resAllArray.length); j++) {
                    if (isOverTime(resAllArray[j]) && (resAllArray[j][0] === resAllArray[i][0]) && (resAllArray[j][2] === false)) {
                        temp.push(resAllArray[j][1])
                        temp.push(temp[2] - temp[1]);
                        if (temp[3] > CONNECTING) {
                            resArr.push([temp[0], temp[1], temp[2], temp[3]]);
                        }
                        break
                    }
                }
            }
            let st = ''
            $.each(resArr, function (index, value) {
                st += value[0] + '连接时间:' + value[1] + '-' + value[2] + '\n'
            });
            $('#textarea').val(st);
        }


        /**
         * 判断小车是否断开连接了
         * 断开为t   连接为f
         *  遵循以下事实:
         *  1. 既然能穿参数 则说明已经断开了
         *  2. 判断是条件是  参数时间+超时时间内无连接   即  这个时间内没有参数的小车名
         *  3. 如果穿参是最后一个值     则视为连接  交由下次处理
         * @param carInfo           断开连接的小车(`[小车名,时间][false]`)
         * @returns {boolean}       true:断开  false:连接中
         */
        function isOverTime(carInfo) {
            try {
                if (carInfo[2] === true) throw '参数有误'
            } catch (e) {
                console.log(e)
            }
            let findIndex = resAllArray.indexOf(carInfo);                              // 返回找到的下标
            let overTime = carInfo[1] + DISCONNECTTIME;                                 // 超时的时间节点
            let temp = true                                                             // 返回结果   默认值为断开

            if (findIndex === (resAllArray.length - 1)) {                              // 如果传的是最后一个数字  视为连接 交由下次处理    主要是怕不能进入for里面
                temp = false
            }
            for (let i = findIndex + 1; i < (resAllArray.length) && (resAllArray[i][1] < overTime); i++) {              // 将循环控制在超时时间内
                if (resAllArray[i][0] === carInfo[0]) {
                    temp = false
                    break
                }
            }
            return temp
        }


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
        })

        $("#connectingTime").blur(function () {
            CONNECTING = $("#connectingTime").val();
        });
        $("#disconnectionTime").blur(function () {
            DISCONNECTTIME = $("#disconnectionTime").val();
            console.log(DISCONNECTTIME)
        });


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
         * 获取并处理鼠标点击事件     连接为t    断开f
         * * @param ele    被点击的元素
         */
        function clickStatus(ele) {
            let classVal = $(ele).attr('class')
            let reg = RegExp(/active/);
            let res = reg.test(classVal);
            if (!res) {
                $(ele).addClass('active');
                resAllArray.push([ele, second, true])
            } else {
                $(ele).removeClass('active')
                resAllArray.push([ele, second, false])
            }
        }


        $('#car1').click(function () {
            clickStatus('#car1')
            main()
        })
        $('#car2').click(function () {
            clickStatus('#car2')
            main()

        })
        $('#car3').click(function () {
            clickStatus('#car3')
            main()
        })
        $('#car4').click(function () {
            clickStatus('#car4')
            main()
        })
        $('#car5').click(function () {
            clickStatus('#car5')
            main()
        })
        $('#car6').click(function () {
            clickStatus('#car6')
            main()
        })
        $('#car7').click(function () {
            clickStatus('#car7')
            main()
        })
        $('#car8').click(function () {
            clickStatus('#car8')
            main()
        })
        $('#car9').click(function () {
            clickStatus('#car9')
            main()
        })
        $('#car10').click(function () {
            clickStatus('#car10')
            main()
        })
        $('#car11').click(function () {
            clickStatus('#car11')
            main()
        })
        $('#car12').click(function () {
            clickStatus('#car12')
            main()
        })

        /**
         * 移除函数1    -----  只顺序移除一组  即 连接and断开
         * @param data
         */
        function removeData(data) {
            let sum = 0
            for (let i = 0; i < resAllArray.length; i++) {
                if (data === 2) {
                    break
                }
                if (resAllArray[i][0] === data) {
                    resAllArray.splice(i, 1);
                    sum++;
                }
            }
            return resAllArray;
        }


        /**
         * 移除函数2    -----  移除所有
         * @param data
         */

        function removeDatas(data) {
            for (let i = 0; i < resAllArray.length; i++) {
                if (resAllArray[i][0] === data) {
                    resAllArray.splice(i, 1);
                }
            }
            return resAllArray;
        }

    }
)

