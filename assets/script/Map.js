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
        this.registerTouch()
        this.game = cc.find('Game').getComponent('Game')
    },

    start() {
        this.mapScene = 'canting'

        // this.node.getChildByName('canting').width = this.game.canvas.width
        // this.node.getChildByName('canting').height = this.game.canvas.height
    },

    /**监听滑动事件切换页面 */
    registerTouch() {

        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            // 触摸起始点
            this.start = {
                x: e.getLocation().x,
                y: e.getLocation().y
            }
            // 移动方向
            this.direction = ''
        }, this, true)

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            let x = e.getLocation().x - e.getPreviousLocation().x

            // map移动
            this.node.runAction(cc.moveBy(0, cc.v2(x, 0)))
        }, this, true)

        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {

            let x = e.getLocation().x - this.start.x
            this.node.stopAllActions()

            if (x < 0) {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(-this.game.canvas.width / 2, 0)).easing(cc.easeExponentialOut()))

            } else if (x > 0) {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(this.game.canvas.width / 2, 0)).easing(cc.easeExponentialOut()))
            }
        }, this, true)

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {

            let x = e.getLocation().x - this.start.x
            this.node.stopAllActions()

            if (x < 0) {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(-this.game.canvas.width / 2, 0)).easing(cc.easeExponentialOut()))
            } else if (x > 0) {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(this.game.canvas.width / 2, 0)).easing(cc.easeExponentialOut()))
            }
        }, this, true)
    },

    mapChange(map) {
        if (map == 'canting') {
            this.node.runAction(cc.moveTo(0.3, cc.v2(this.game.canvas.width / 2, 0)).easing(cc.easeExponentialOut()))
        } else if (map == 'chufang') {
            this.node.runAction(cc.moveTo(0.3, cc.v2(-this.game.canvas.width / 2, 0)).easing(cc.easeExponentialOut()))
        }
    },

    update(dt) {

    },
});