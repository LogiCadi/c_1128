cc.Class({
    extends: cc.Component,

    properties: {
        score: 0,// 金币
        star: 0,// 星级
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {},

    addCoinScore(add) {
        if (this.node.name == 'coin_score') {
            this.targetScore = this.score + add
        }
    },

    start() {
        this.node.getChildByName('label').getComponent(cc.Label).string = this.score
    },

    update(dt) {
        if (this.targetScore > this.score) {
            this.node.getChildByName('label').getComponent(cc.Label).string = ++this.score
        }
    },
});