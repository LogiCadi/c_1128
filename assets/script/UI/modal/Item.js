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
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')
    },

    start () {

    },

    click(e) {
        const data = {
            type: e.target.type,
            group: e.target.groupData,
            item: e.target.infoData
        }
        
        this.game.canvas.getComponent('Canvas').newItemInfo(data)
    },

    init() {

    },

    // update (dt) {},
});
