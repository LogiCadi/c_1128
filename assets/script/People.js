cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        
        this.ani()


    },

    // 两针的动画
    ani() {
        var self = this
        var people = []
        cc.loader.loadRes("image/7010101", cc.SpriteFrame, function (err, spriteFrame) {
            people.push(spriteFrame)
            cc.loader.loadRes("image/7010101-1", cc.SpriteFrame, function (err, spriteFrame) {
                people.push(spriteFrame)

                let index = 0
                self.schedule(function () {
                    self.node.getComponent(cc.Sprite).spriteFrame = people[index]
                    if (++index >= people.length) index = 0
                }, 1);
            });
        });
    },

    start() {

    },

    // update (dt) {},
});