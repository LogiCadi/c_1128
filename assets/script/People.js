cc.Class({
    extends: cc.Component,

    properties: {
        people: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let index = 0
        this.schedule(function () {
            this.node.getComponent(cc.Sprite).spriteFrame = this.people[index]
            if (++index >= this.people.length) index = 0
        }, 1);
    },

    start() {

    },

    // update (dt) {},
});