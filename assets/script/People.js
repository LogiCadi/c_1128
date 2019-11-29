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
        this.node.setPosition(cc.v2(200, 700))
        this.node.runAction(cc.moveTo(3, cc.v2(200, 400)))
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

    start() {

    },
    /**找桌子 */
    findTable() {
        let tableIndex = this.dataStore.getBlankTable()
        if (tableIndex !== false) {
            this.target = 'food'
            this.dataStore.tableData[tableIndex].hasPeople = true
            this.node.stopAllActions()
            let x = this.dataStore.tableData[tableIndex].x
            let y = this.dataStore.tableData[tableIndex].y

            this.node.runAction(cc.moveTo(5, cc.v2(x, y + 100)))
        }
    },
    

    update (dt) {
        if (this.target == 'table') {
            this.findTable()
        }
    },
});