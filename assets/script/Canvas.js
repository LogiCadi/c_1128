cc.Class({
    extends: cc.Component,

    properties: {
        map: {
            default: null,
            type: cc.Node,
        },
        modal: {
            default: null,
            type: cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
    },

    start() {

    },

    // 显示modal
    newModal() {
        let modal = cc.instantiate(this.modal)
        this.node.addChild(modal)
    },
    // update (dt) {},
});