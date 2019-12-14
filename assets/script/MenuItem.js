// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.game = cc.find('Game').getComponent('Game')
    },

    start() {
        this.node.getChildByName('food').active = false
        this.node.getChildByName('top_food').active = false
        this.node.getChildByName('bottom_bubble').active = false
    },

    click() {
        if (this.node.getChildByName('bottom_bubble').active) {
            this.game.settleTip()
        }

        if (this.node.dirty) {
            // 桌子上有脏盘
            // 收回脏盘
            this.node.getChildByName('food').active = false
            this.game.cd_dirty += this.node.dirty
            this.node.dirty = 0
        }
    },

    update(dt) {
        this.node.zIndex = 1000 - this.node.y

        this.top_food = this.node.getChildByName('top_food')

        if (this.top_food.x < -this.game.canvas.width / 2 - this.node.x + this.top_food.width / 2) {
            // 到边界了
            this.top_food.getComponent(cc.Animation).stop()
            this.top_food.active = false
            this.top_food.setPosition(cc.v2(0, 100))
        }
    },

});