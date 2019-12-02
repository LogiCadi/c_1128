cc.Class({
    extends: cc.Component,

    properties: {
        dot: {
            default: null,
            type: cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')
        this.ani()

    },

    init() {
        // 创建后的目标是找桌子
        this.target = 'table'
        this.node.setPosition(cc.v2(0, 0))
        // this.node.setPosition(cc.v2(250, 700))
        // this.node.runAction(cc.moveTo(3, cc.v2(200, 400)))

        // this.moveTo(200, 0)

    },

    // 两帧的动画
    ani() {
        var self = this
        var people = []
        cc.loader.loadRes("image/7010101", cc.SpriteFrame, function (err, spriteFrame) {
            people.push(spriteFrame)
            cc.loader.loadRes("image/7010101-1", cc.SpriteFrame, function (err, spriteFrame) {
                people.push(spriteFrame)

                let index = 0
                self.node.getComponent(cc.Sprite).spriteFrame = people[index++]
                if (index >= people.length) index = 0
                self.schedule(function () {
                    self.node.getComponent(cc.Sprite).spriteFrame = people[index++]
                    if (index >= people.length) index = 0
                }, 0.5);
            });
        });
    },

    start() {},
    /**找桌子 */
    findTable() {
        let tableIndex = this.dataStore.getBlankTable()
        if (tableIndex !== false) {
            // 有桌子
            this.dataStore.tableData[tableIndex].hasPeople = true
            this.node.stopAllActions()

            this.target = 'food'
        } else {
            // 没有空桌子 排队
            this.moveTo(250, 400)
        }
    },
    // 人物移动到指定位置
    moveTo(x, y) {

        let step = 10

        let target = {
            x: Math.round(x / step) * step,
            y: Math.round(y / step) * step,
        }

        // 障碍物节点列表
        let blockList = [{
            x: 100,
            y: 0
        }]
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
            x: this.node.x, // 节点x值
            y: this.node.y, // 节点y值
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
                // let isBlock = this.dataStore.getBarrier(cc.v2(posList[i].x, posList[i].y))
                let isBlock = isInList(posList[i], blockList)
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
        console.log('openList', openList)
        console.log('closeList', closeList)

        // 3. 保存路径。从终点开始，每个方格沿着父节点移动直至起点，这就是你的路径。
        let drawPoint = closeList[closeList.length - 1]
        while (drawPoint) {
            let dot = cc.instantiate(this.dot)
            this.game.map.getChildByName('scene_1').addChild(dot)
            dot.setPosition(cc.v2(drawPoint.x, drawPoint.y))

            let p_x = drawPoint.p_x
            let p_y = drawPoint.p_y
            drawPoint = null
            for (let i = 0; i < closeList.length; i++) {
                if (closeList[i].x == p_x && closeList[i].y == p_y) {
                    drawPoint = closeList[i]
                    break
                }
            }


        }

        // // 与目标点的距离
        // let distanceX = x - this.node.x
        // let distanceY = y - this.node.y


        // let stepX, stepY, speed = 100
        // if (Math.abs(distanceX) < 10) {
        //     // 距离很近 不移动
        //     stepX = 0
        // } else {
        //     // 每帧移动步长
        //     stepX = speed * distanceX / Math.abs(distanceX)
        // }
        // if (Math.abs(distanceY) < 10) {
        //     stepY = 0
        // } else {
        //     stepY = speed * distanceY / Math.abs(distanceY)
        // }


        // this.node.runAction(cc.moveBy(this.updateDt, cc.v2(stepX * this.updateDt, stepY * this.updateDt)))
    },


    update(dt) {
        if (this.dataStore.x != this.targetX && this.dataStore.y != this.targetY) {
            this.targetX = this.dataStore.x
            this.targetY = this.dataStore.y
            this.moveTo(this.targetX, this.targetY)
        }
        return
        // this.node.zIndex = 1000 - this.node.y
        // this.updateDt = dt
        // // if (this.target == 'table') {
        // //     this.findTable()
        // // }

        // let targetX = this.dataStore.x
        // let targetY = this.dataStore.y

        // if (targetX) {

        //     // 周围8个点坐标
        //     let pos = [
        //         [-1, 1],
        //         [0, 1],
        //         [1, 1],

        //         [-1, 0],
        //         [1, 0],

        //         [-1, -1],
        //         [0, -1],
        //         [1, -1],
        //     ]

        //     let speed = 200
        //     let mindistanceIndex
        //     let nextX
        //     let nextY

        //     for (let i = 0; i < pos.length; i++) {
        //         let x = this.node.x + pos[i][0] * speed * dt
        //         let y = this.node.y + pos[i][1] * speed * dt

        //         if (pos[i][0] == this.prePosX && pos[i][1] == this.prePosY) {
        //             // console.log('无法返回')
        //             continue
        //         } else if (this.dataStore.getBarrier(cc.v2(x, y))) {
        //             // console.log('位置错误')
        //             continue
        //         }

        //         let indexDistance = Math.sqrt(Math.pow((targetX - x), 2) + Math.pow((targetY - y), 2))

        //         if (!mindistanceIndex || mindistanceIndex > indexDistance) {
        //             mindistanceIndex = indexDistance

        //             if (mindistanceIndex < 1000 * dt) {
        //                 nextX = this.node.x
        //                 nextY = this.node.y
        //             } else {
        //                 // 遇到障碍物防止向反方向走
        //                 this.prePosX = -pos[i][0]
        //                 this.prePosY = -pos[i][1]
        //                 nextX = x
        //                 nextY = y
        //             }
        //             console.log('=============')
        //             console.log(this.prePosX)
        //             console.log(this.prePosY)
        //         }

        //     }
        //     this.node.x = nextX
        //     this.node.y = nextY

    }




    // let distanceX = this.dataStore.x - this.node.x
    // let distanceY = this.dataStore.y - this.node.y


    // if (Math.abs(distanceX) < 10) {
    //     // 距离很近 不移动
    //     this.stepX = 0
    // } else {
    //     // 每帧移动步长
    //     this.stepX = speed * distanceX / Math.abs(distanceX)
    // }
    // if (Math.abs(distanceY) < 10) {
    //     this.stepY = 0
    // } else {
    //     this.stepY = speed * distanceY / Math.abs(distanceY)
    // }

    // this.node.runAction(cc.moveBy(this.updateDt, cc.v2(this.stepX * this.updateDt, this.stepY * this.updateDt)))



});