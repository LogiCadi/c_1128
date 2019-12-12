cc.Class({
    extends: cc.Component,

    properties: {
        dot: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')
    },

    init() {
        // 选定一个角色
        this.peopleData = this.dataStore.getPeople()

        // 创建后的目标是找桌子
        this.target = 'table'
        // 点菜隐藏
        this.node.getChildByName('bubble').active = false
        let initX = 200 + this.dataStore.getRandom(-1, 1) * 10
        this.node.setPosition(cc.v2(initX, this.game.canvas.height / 2 + this.node.height)) // 初始点
        // this.dataStore.queue.table.list.push(this.node)

        this.ani()
    },

    // 两帧的动画
    ani() {
        let imgAni = [
            this.dataStore.imageList[this.peopleData['ID']],
            this.dataStore.imageList[this.peopleData['ID'] + '-1'],
        ]

        let index = 0
        this.node.getComponent(cc.Sprite).spriteFrame = imgAni[index++]
        if (index >= imgAni.length) index = 0
        this.schedule(function () {
            this.node.getComponent(cc.Sprite).spriteFrame = imgAni[index++]
            if (index >= imgAni.length) index = 0
        }, 0.5);
    },

    start() {},

    // 人物移动到指定位置
    moveTo(x, y, callBack, step = 100) {
        // let step = 100 // 寻路像素密度，越大精度越差，但性能越好

        // 防止重复指定路径
        if (this.targetPosX == x && this.targetPosY == y) return
        this.targetPosX = x
        this.targetPosY = y

        let target = {
            x: Math.round(x / step) * step,
            y: Math.round(y / step) * step,
        }

        // console.log(this.target)

        let current = {
            x: Math.round(this.node.x / step) * step,
            y: Math.round(this.node.y / step) * step,
        }

        if (target.x == current.x && target.y == current.y) return
        if (this.dataStore.getBarrier(target)) return
        let time = Date.now()
        // ===============A* 寻路

        // 障碍物节点列表
        // let blockList = [{
        //     x: 100,
        //     y: 0
        // }]
        let openList = [] // 开启列表
        let closeList = [] // 关闭列表

        let isInList = function (node, list) {
            for (let i = 0; i < list.length; i++) {
                const ele = list[i];
                if (ele.x == node.x && ele.y == node.y) {
                    return i
                }
            }
            return false
        }

        // 两点距离
        let getDistance = function (pos1, pos2) {
            return Math.round(Math.sqrt((Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2))))
        }

        // 1. 把起点加入 open list 。
        openList.push({
            x: current.x, // 节点x值
            y: current.y, // 节点y值
            p_x: 0, // 父节点x值
            p_y: 0, // 父节点y值
            f: 0, // G值 + H值 = F值
            g: 0, // 从起点移动到该点的成本
            h: 0, // 从该点移动到终点的成本
        })
        // 重复如下过程
        let go = true
        while (go) {
            // 2. 遍历 open list ，查找 F 值最小的节点，把它作为当前要处理的节点
            let handleNode, handleNodeIndex
            for (let i = 0; i < openList.length; i++) {
                if (!handleNode || openList[i].f < handleNode.f) {
                    handleNodeIndex = i
                    handleNode = openList[i]
                }
            }
            // 3. 把这个节点移到 close list 。
            openList.splice(handleNodeIndex, 1)
            closeList.push(handleNode)
            // 4. 对当前方格的 8 个相邻方格的每一个方格,做如下处理
            let posList = [{
                    x: -1 * step + handleNode.x,
                    y: 1 * step + handleNode.y,
                },
                {
                    x: 0 * step + handleNode.x,
                    y: 1 * step + handleNode.y,
                },
                {
                    x: 1 * step + handleNode.x,
                    y: 1 * step + handleNode.y,
                },

                {
                    x: -1 * step + handleNode.x,
                    y: 0 * step + handleNode.y,
                },
                {
                    x: 1 * step + handleNode.x,
                    y: 0 * step + handleNode.y,
                },

                {
                    x: -1 * step + handleNode.x,
                    y: -1 * step + handleNode.y,
                },
                {
                    x: 0 * step + handleNode.x,
                    y: -1 * step + handleNode.y,
                },
                {
                    x: 1 * step + handleNode.x,
                    y: -1 * step + handleNode.y,
                },
            ]
            for (let i = 0; i < posList.length; i++) {
                // a. 如果它是不可抵达的或者它在 close list 中，忽略它
                let isBlock = this.dataStore.getBarrier(cc.v2(posList[i].x, posList[i].y))
                // let isBlock = isInList(posList[i], blockList)
                let isInCloseList = isInList(posList[i], closeList)

                let skip = isBlock !== false || isInCloseList !== false

                if (!skip) {
                    let isInOpenList = isInList(posList[i], openList)
                    if (isInOpenList === false) {
                        // b. 如果它不在 open list 中，把它加入 open list ，并且把当前方格设置为它的父亲，记录该方格的 F ， G 和 H 值。
                        let h = getDistance(posList[i], target)
                        let g = getDistance(posList[i], handleNode) + handleNode.g
                        let f = g + h

                        openList.push({
                            x: posList[i].x,
                            y: posList[i].y,
                            p_x: handleNode.x,
                            p_y: handleNode.y,
                            f,
                            g,
                            h
                        })
                    } else {
                        // c. 如果它已经在 open list 中，检查这条路径是否更好，用 G 值作参考。更小的 G 值表示这是更好的路径。
                        //    如果是这样，把它的父亲设置为当前方格，并重新计算它的 G 和 F 值。如果你的 open list 是按 F 值排序的话，改变后你可能需要重新排序。
                        let thisNode = openList[isInOpenList]
                        let g = getDistance(posList[i], handleNode) + handleNode.g // 新的g值

                        if (g < thisNode.g) {
                            openList[isInOpenList].p_x = handleNode.x
                            openList[isInOpenList].p_y = handleNode.y

                            openList[isInOpenList].g = g
                            openList[isInOpenList].f = openList[isInOpenList].g + openList[isInOpenList].h
                        }
                    }
                }
            }
            // d. 停止，当你
            // ◆ 把终点加入到了 open list 中，此时路径已经找到了，或者
            // ◆ 查找终点失败，并且 open list 是空的，此时没有路径。

            if (isInList(target, openList)) {
                go = false
                // console.log('已找到路径')
            } else if (openList.length === 0) {
                go = false
                // console.log('未找到路径')
            }
            // console.log('寻路')
        }
        // console.log('寻路消耗', Date.now() - time + 'ms')

        // console.log('openList', openList)
        // console.log('closeList', closeList)
        if (openList.length == 0) return

        // 3. 保存路径。从终点开始，每个方格沿着父节点移动直至起点，这就是你的路径。
        let drawPoint = closeList[closeList.length - 1]

        let pathList = []
        while (drawPoint.x != current.x || drawPoint.y != current.y) {
            pathList.push({
                x: drawPoint.x,
                y: drawPoint.y
            })
            // 描绘路径点
            // let dot = cc.instantiate(this.dot)
            // this.game.map.getChildByName('canting').addChild(dot)
            // dot.setPosition(cc.v2(drawPoint.x, drawPoint.y))

            let p_x = drawPoint.p_x
            let p_y = drawPoint.p_y

            for (let i = 0; i < closeList.length; i++) {
                if (closeList[i].x == p_x && closeList[i].y == p_y) {
                    drawPoint = closeList[i]
                    break
                }
            }
        }
        pathList = pathList.reverse()
        // 加上终点
        pathList.push({
            x: target.x,
            y: target.y
        })
        // // ===== 路径生成完毕

        // // 检查位置被占用
        // while (true) {
        //     if (pathList.length == 0) return
        //     // if (this.targetPosX != pathList[pathList.length - 1].x || this.targetPosY != pathList[pathList.length - 1].y) {

        //     // }
        //     if (this.dataStore.peoplePosition[pathList[pathList.length - 1].x + '-' + pathList[pathList.length - 1].y]) {
        //         // 被占用
        //         pathList.pop()
        //     } else {
        //         break
        //     }
        // }
        // // console.log(pathList)

        // // 放开当前坐标
        // this.dataStore.peoplePosition[current.x + '-' + current.y] = false
        // // 关闭终点坐标
        // this.dataStore.peoplePosition[pathList[pathList.length - 1].x + '-' + pathList[pathList.length - 1].y] = true

        let moveActionList = []
        let speed = 100 // 速度
        let distance
        for (let i = 0; i < pathList.length; i++) {
            if (i != 0 && (pathList[i].x == pathList[i - 1].x || pathList[i].y == pathList[i - 1].y)) {
                distance = 1.0 * step // 走直线
            } else {
                distance = 1.4 * step // 走斜线 
            }

            if (i != 0 && pathList[i].x > pathList[i - 1].x) {
                // 朝向右
                moveActionList.push(cc.flipX(true))
            } else if (i != 0 && pathList[i].x < pathList[i - 1].x) {
                // 朝向左
                moveActionList.push(cc.flipX(false))
            }

            moveActionList.push(cc.moveTo(distance / speed, cc.v2(pathList[i].x, pathList[i].y)))
        }
        // 移动到正确的终点
        // moveActionList.push(cc.moveTo(step / speed / 5, cc.v2(x, y)))

        if (callBack) {
            // 动作完成后
            let finished = cc.callFunc(callBack, this);
            moveActionList.push(finished)
        }

        this.node.stopAllActions()
        if (moveActionList.length > 1) {
            this.node.runAction(cc.sequence(...moveActionList))
        } else {
            this.node.runAction(...moveActionList)
        }
    },
    /**随机走动 */
    randomWalk(times, callBack) {
        let isBlock = true
        let x, y
        while (isBlock) {
            x = this.dataStore.getRandom(-this.game.canvas.width / 2, this.game.canvas.width / 2)
            y = this.dataStore.getRandom(-this.game.canvas.height / 2, this.game.canvas.height / 2)
            isBlock = this.dataStore.getBarrier({
                x,
                y
            })
        }

        this.moveTo(x, y, () => {
            this.scheduleOnce(function () {
                if (--times > 0) {
                    this.randomWalk(times, callBack)
                } else {
                    callBack()
                }
            }, 3)
        })
    },

    /**去吧台 */
    goBar(barList, times = 0, callBack) {
        this.moveTo(barList[times].position.x - 100, barList[times].position.y + 100, () => {
            this.node.runAction(cc.flipX(true))

            this.scheduleOnce(function () {
                this.game.dropCoin(this.node.x, this.node.y, barList[times].itemList[barList[times].current.itemId]["二次消费"], barList[times]["title"])

                if (++times < barList.length) {
                    this.goBar(barList, times, callBack)
                } else {
                    callBack()
                }
            }, 8)
        })
    },

    /**点餐 */
    order() {
        if (this.target == 'order') {
            if (this.dataStore.dish[this.dish.id]["已解锁"]) {
                this.dataStore.cookingQueue.push({
                    table: this.table,
                    dish: this.dish
                })
                // 隐藏气泡
                this.node.getChildByName('bubble').destroy()
                // 等待上菜
                this.target = 'wait'
            } else {
                // 没有解锁
                this.target = 'leave'
                this.node.getChildByName('bubble').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList["生气"]
                this.dataStore.buildData[this.table["id"]]["data"].curPeople = null
                this.leave()
            }

        }

        // this.scheduleOnce(function () {
        //     // 在桌子上显示食物
        //     this.table.current.node.getChildByName('food').active = true

        //     this.scheduleOnce(function () {
        //         // 掉小鱼
        //         this.game.dropCoin(this.node.x, this.node.y)

        //         this.scheduleOnce(function () {
        //             // 吃完le 
        //             this.table.current.node.getChildByName('food').active = false
        //             this.table.data.curPeople = false


        //             let barList = this.dataStore.getBar()
        //             if (barList.length > 0) {
        //                 this.goBar(barList, 0, () => {
        //                     this.moveTo(200, 600, () => {
        //                         this.node.destroy()
        //                     })
        //                 })
        //             } else {
        //                 this.moveTo(200, 600, () => {
        //                     this.node.destroy()
        //                 })
        //             }

        //         }, 3)
        //     }, 3)
        // }, 3)

    },
    // 离开
    leave() {
        this.moveTo(200, this.game.canvas.height / 2 + this.node.height, () => {
            this.node.destroy()
        })
    },

    update(dt) {
        this.node.zIndex = 1000 - this.node.y

        if (this.target == 'table') {
            // 找桌子
            this.table = this.dataStore.getBlankTable()
            // console.log(this.table)
            if (this.table) {
                if (this.dataStore.peoplePosition.table.length == 0 || this.dataStore.peoplePosition.table[0].uuid == this.node.uuid) {
                    this.dataStore.peoplePosition.table.shift()
                    for (const key in this.dataStore.peoplePosition.table) {
                        // 队列整体往前移
                        this.dataStore.peoplePosition.table[key].y -= 30
                    }
                    // 标记该桌子有人了
                    this.dataStore.buildData[this.table["id"]]["data"].curPeople = this

                    // 下一个目标点菜
                    this.target = 'order'
                    // 移动到桌子
                    this.moveTo(this.table.position.x, this.table.position.y + 100, () => {
                        // 重置朝向左
                        this.node.runAction(cc.flipX(false))
                        this.scheduleOnce(function () {
                            // 显示客人想吃什么
                            this.dish = this.dataStore.getPeopleFood(this.peopleData)
                            this.node.getChildByName('bubble').active = true
                            this.node.getChildByName('bubble').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList[this.dish["id"]]
                            this.scheduleOnce(function () {
                                if (this.target == 'order') {
                                    // 5s没人响应 生气离开
                                    this.target = 'leave'
                                    this.node.getChildByName('bubble').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList["生气"]
                                    this.dataStore.buildData[this.table["id"]]["data"].curPeople = null
                                    this.leave()
                                }
                            }, 5)

                        }, 3)
                    })
                }
            } else {
                // 排队等候
                let target
                for (const value of this.dataStore.peoplePosition.table) {
                    if (value['uuid'] == this.node.uuid) {
                        target = value
                        break
                    }
                }

                if (!target) {
                    // 首次排队
                    let queuePrev = this.dataStore.peoplePosition.table[this.dataStore.peoplePosition.table.length - 1]
                    if (queuePrev) {
                        target = {
                            uuid: this.node.uuid,
                            x: this.node.x,
                            y: queuePrev.y + 30
                        }
                    } else {
                        // 初始位置
                        target = {
                            uuid: this.node.uuid,
                            x: this.node.x,
                            y: 400
                        }
                    }
                    this.dataStore.peoplePosition.table.push(target)
                }
                this.moveTo(target.x, target.y, false, 10)
            }

        }
        if (this.target == 'bar') {
            // 吃完了 去找吧台
            this.target = 'leave'
            // 掉小鱼
            this.game.dropCoin(this.node.x, this.node.y, this.dataStore.dish[this.dish.id]["每卖出一份能收入"], this.table.title)
            // 桌子空闲
            this.dataStore.buildData[this.table["id"]]["data"].curPeople = null

            let barList = this.dataStore.getBar()
            if (barList.length > 0) {
                this.goBar(barList, 0, () => {
                    this.leave()
                })
            } else {
                this.leave()
            }

        }
    }
});