cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')
    },

    start() {

    },

    /**收集小鱼 */
    settle() {
        let target = this.game.canvas.getChildByName('coin_score')
        let distance = this.dataStore.getDistance(target, this.node)

        for (const node of this.dataStore.coinPool[this.node.coinGroup]) {
            // 动画
            node.runAction(cc.sequence(cc.moveTo(distance / 1500, cc.v2(target.x, target.y)), cc.callFunc(function () {
                this.game.coin += parseInt(node.count)
                localStorage.setItem('coin', this.game.coin)
                node.destroy()
            }, this)))
        }
        this.dataStore.coinPool[this.node.coinGroup] = []

    },

    update(dt) {
        // this.node.zIndex = 1000 - this.node.y
    },
});