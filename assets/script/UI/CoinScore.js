
cc.Class({
    extends: cc.Component,

    properties: {
        score: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {},

    addCoinScore(add) {
        this.targetScore = this.score + add
    },

    start() {
        this.getComponent(cc.Label).string = '得分:' + this.score
    },

    update(dt) {
        if (this.targetScore > this.score) {
            this.getComponent(cc.Label).string = '得分:' + ++this.score
        }
    },
});