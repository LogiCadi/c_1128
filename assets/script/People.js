cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.ani()
    },

    init() {
        // 创建后的目标是找桌子
        this.target = 'table'
        this.node.setPosition(cc.v2(0, 0))
        // this.node.setPosition(cc.v2(250, 700))
        // this.node.runAction(cc.moveTo(3, cc.v2(200, 400)))
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
        // 与目标点的距离
        let distanceX = x - this.node.x
        let distanceY = y - this.node.y



        let stepX, stepY, speed = 100
        if (Math.abs(distanceX) < 10) {
            // 距离很近 不移动
            stepX = 0
        } else {
            // 每帧移动步长
            stepX = speed * distanceX / Math.abs(distanceX)
        }
        if (Math.abs(distanceY) < 10) {
            stepY = 0
        } else {
            stepY = speed * distanceY / Math.abs(distanceY)
        }


        this.node.runAction(cc.moveBy(this.updateDt, cc.v2(stepX * this.updateDt, stepY * this.updateDt)))
    },


    update(dt) {
        this.node.zIndex = 1000 - this.node.y
        this.updateDt = dt
        // if (this.target == 'table') {
        //     this.findTable()
        // }

        let targetX = this.dataStore.x
        let targetY = this.dataStore.y

        if (targetX) {

            // 周围8个点坐标
            let pos = [
                [0, 1],

                [-1, 0],
                [1, 0],

                [0, -1],
            ]

            let speed = 200
            let mindistanceIndex
            let nextX
            let nextY

            for (let i = 0; i < pos.length; i++) {
                let x = this.node.x + pos[i][0] * speed * dt
                let y = this.node.y + pos[i][1] * speed * dt

                if (pos[i][0] == this.prePosX && pos[i][1] == this.prePosY) {
                    // console.log('无法返回')
                    continue
                } else if (this.dataStore.getBarrier(cc.v2(x, y))) {
                    // console.log('位置错误')
                    continue
                }

                let indexDistance = Math.sqrt(Math.pow((targetX - x), 2) + Math.pow((targetY - y), 2))

                if (!mindistanceIndex || mindistanceIndex > indexDistance) {
                    mindistanceIndex = indexDistance

                    if (mindistanceIndex < 1000 * dt) {
                        nextX = this.node.x
                        nextY = this.node.y
                    } else {
                        // 遇到障碍物防止向反方向走
                        this.prePosX = -pos[i][0]
                        this.prePosY = -pos[i][1]
                        nextX = x
                        nextY = y
                    }
                    console.log('=============')
                    console.log(this.prePosX)
                    console.log(this.prePosY)
                }

            }
            this.node.x = nextX
            this.node.y = nextY
        }

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