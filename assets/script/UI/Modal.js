cc.Class({
    extends: cc.Component,

    properties: {
        item: {
            default: null,
            type: cc.Prefab,
        },
        content: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')

        this.node.getComponent(cc.Animation).play()
        this.loadData()
    },
    start() {

    },

    loadData() {
        // 加载列表
        for (let index = 0; index < 100; index++) {
            let item = cc.instantiate(this.item)
            this.content.addChild(item)
            item.on(cc.Node.EventType.TOUCH_START, function (e) {
                this.game.newMenuItem()
                this.closeModal()
            }, this)
        }
    },

    /**关闭modal */
    closeModal() {
        this.node.destroy()
    },
    start() {

    },

    // update (dt) {},
});