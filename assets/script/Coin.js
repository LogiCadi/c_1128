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
        let distance = this.dataStore.getDistance(this.game.coin_score, this.node)
        // 动画
        this.node.runAction(cc.sequence(cc.moveTo(200 / distance, cc.v2(this.game.coin_score.x, this.game.coin_score.y)), cc.callFunc(function () {
            this.node.destroy()
            this.game.coin_score.getComponent('CoinScore').addCoinScore(10)
        }, this)))
    },

    update(dt) {

    },
});