cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')

        this.node.getComponent(cc.Animation).play()
    },
    start() {

    },

    init(msg) {
        this.content.getComponent(cc.Label).string = msg
    },

    /**关闭modal */
    closeModal() {
        this.node.destroy()
    },

    start() {

    },

    // update (dt) {},
});