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

    onLoad () {
        this.registerTouch()
    },

    start () {

    },

    /**监听滑动事件切换页面 */
    registerTouch() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            let x = e.getLocation().x - e.getPreviousLocation().x
            // map移动
            this.node.runAction(cc.moveBy(0, cc.v2(x, 0)))

        }, this, true)

        let startX
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            startX = e.getLocation().x
        }, this, true)

        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {

            let x = e.getLocation().x - startX
            this.node.stopAllActions()

            if (x < 0) {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(-360, 0)).easing(cc.easeExponentialOut()))
            } else {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(360, 0)).easing(cc.easeExponentialOut()))
            }
        }, this, true)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {

            let x = e.getLocation().x - startX
            this.node.stopAllActions()

            if (x < 0) {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(-360, 0)).easing(cc.easeExponentialOut()))
            } else {
                // map移动
                this.node.runAction(cc.moveTo(0.3, cc.v2(360, 0)).easing(cc.easeExponentialOut()))
            }
        }, this, true)
    },

    // update (dt) {},
});
