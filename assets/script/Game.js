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
        people: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.peoplePos = 0
        this.newPeople()
    },

    start() {

    },

    newPeople() {
        let pos = [
            {x: -200, y: 80},
            {x: 0, y: 80},
            {x: 200, y: 80},
            {x: -200, y: 160},
            {x: 0, y: 160},
            {x: 200, y: 160},
        ]
        if (this.peoplePos++ >= 6) this.peoplePos = 0
        var people = cc.instantiate(this.people)
        this.node.addChild(people)
        people.setPosition(cc.v2(200, 560))
        people.runAction(
            cc.moveTo(5, cc.v2(pos[this.peoplePos].x, pos[this.peoplePos].y))
        )
    }

    // update (dt) {},
});