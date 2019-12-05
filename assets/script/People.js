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
        this.characterIndex = this.dataStore.getRandom(1, 3)

        // 创建后的目标是找桌子
        this.target = 'table'
        // 点菜隐藏
        this.node.getChildByName('bubble').active = false
        this.node.setPosition(cc.v2(200, 600)) // 初始点

        // 点菜排队
        let queue = this.dataStore.queue.table
        let latest = queue.list[queue.list.length - 1]
        if (latest) {
            this.node.q_x = latest.q_x + queue.a_x
            this.node.q_y = latest.q_y + queue.a_y
        } else {
            this.node.q_x = queue.x
            this.node.q_y = queue.y
        }

        queue.list.push(this.node)
        this.moveTo(this.node.q_x, this.node.q_y)

        this.ani()
    },

    // 两帧的动画
    ani() {
        let imgAni = [
            this.dataStore.imageRes[`people_${this.characterIndex}_1`],
            this.dataStore.imageRes[`people_${this.characterIndex}_2`],
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
    moveTo(x, y, callBack) {
        if (this.targetPosX == x && this.targetPosY == y) return
        this.targetPosX = x
        this.targetPosY = y

        let step = 100 // 寻路像素密度，越大精度越差，但性能越好

        let target = {
            x: Math.round(x / step) * step,
            y: Math.round(y / step) * step,
        }

        let current = {
            x: Math.round(this.node.x / step) * step,
            y: Math.round(this.node.y / step) * step,
        }

        if (target.x == current.x && target.y == current.y) return

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
                console.log('已找到路径')
            } else if (openList.length === 0) {
                go = false
                console.log('未找到路径')
            }
        }
        console.log('寻路消耗', Date.now() - time + 'ms')

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
            // this.game.map.getChildByName('scene_1').addChild(dot)
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

        let moveActionList = []
        let speedFactor = 8 // 速度系数
        let speed
        for (let i = 0; i < pathList.length; i++) {
            if (i != 0 && (pathList[i].x == pathList[i - 1].x || pathList[i].y == pathList[i - 1].y)) {
                speed = 14 * speedFactor // 走直线
            } else {
                speed = 10 * speedFactor // 走斜线 速度要慢一点
            }

            if (i != 0 && pathList[i].x > pathList[i - 1].x) {
                // 朝向右
                moveActionList.push(cc.flipX(true))
            } else if (i != 0 && pathList[i].x < pathList[i - 1].x) {
                // 朝向左
                moveActionList.push(cc.flipX(false))
            }

            moveActionList.push(cc.moveTo(step / speed, cc.v2(pathList[i].x, pathList[i].y)))
        }
        // 移动到正确的终点
        moveActionList.push(cc.moveTo(step / speed / 5, cc.v2(x, y)))

        if (callBack) {
            // 动作完成后
            let finished = cc.callFunc(callBack, this);
            moveActionList.push(finished)
        }

        this.node.stopAllActions()
        this.node.runAction(cc.sequence(...moveActionList))
    },

    /**点餐 */
    order() {
        // 隐藏气泡
        this.node.getChildByName('bubble').destroy()
        this.scheduleOnce(function () {
            // 在桌子上显示食物
            this.table.node.getChildByName('food').active = true

            this.scheduleOnce(function () {
                // 掉小鱼
                this.game.dropCoin(this.node.x, this.node.y)

                this.scheduleOnce(function () {
                    // 吃完了，走人
                    this.table.node.getChildByName('food').active = false
                    this.table.hasPeople = false

                    this.moveTo(200, 640, () => {
                        this.node.runAction(cc.fadeOut(1))
                    })
                }, 3)
            }, 3)
        }, 3)

    },

    update(dt) {
        this.node.zIndex = 1000 - this.node.y

        if (this.target == 'table') {
            // 找桌子
            let tableIndex = this.dataStore.getBlankTable()
            if (tableIndex !== false) {
                // 有桌子
                this.table = this.dataStore.tableData[tableIndex]
                // 标记该桌子有人了
                this.dataStore.tableData[tableIndex].hasPeople = true
                // 下一个目标点菜
                this.target = 'food'
                // 移动到桌子
                this.moveTo(this.table.x, this.table.y + 100, () => {
                    // 重置朝向左
                    this.node.runAction(cc.flipX(false))
                    this.scheduleOnce(function () {
                        // 显示客人想吃什么
                        this.node.getChildByName('bubble').active = true
                    }, 3)
                })
            } else {
                // 排队等候
                this.moveTo(200, 400)
            }
        }
    }
});