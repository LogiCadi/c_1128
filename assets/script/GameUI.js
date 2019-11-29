cc.Class({
    extends: cc.Component,

    properties: {
        map: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.registerTouch()
    },

    start() {

    },

    /**监听滑动事件切换页面 */
    registerTouch() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            let x = e.getLocation().x - e.getPreviousLocation().x
            // map移动
            this.map.runAction(cc.moveBy(0, cc.v2(x, 0)))

        }, this)

        let startX
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            startX = e.getLocation().x
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {

            let x = e.getLocation().x - startX
            this.map.stopAllActions()

            if (x < 0) {
                // map移动
                this.map.runAction(cc.moveTo(0.3, cc.v2(-360, 0)).easing(cc.easeExponentialOut()))
            } else {
                // map移动
                this.map.runAction(cc.moveTo(0.3, cc.v2(360, 0)).easing(cc.easeExponentialOut()))
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {

            let x = e.getLocation().x - startX
            this.map.stopAllActions()

            if (x < 0) {
                // map移动
                this.map.runAction(cc.moveTo(0.3, cc.v2(-360, 0)).easing(cc.easeExponentialOut()))
            } else {
                // map移动
                this.map.runAction(cc.moveTo(0.3, cc.v2(360, 0)).easing(cc.easeExponentialOut()))
            }
        }, this)
    },

    // update (dt) {},
});