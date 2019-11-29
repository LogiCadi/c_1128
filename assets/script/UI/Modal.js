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
        map: {
            default: null,
            type: cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.node.active = false
        this.loadData()
    },

    loadData() {
        // 加载列表
        for (let index = 0; index < 10; index++) {
            let item = cc.instantiate(this.item)
            item.on(cc.Node.EventType.TOUCH_START, function (e) {

                this.map.getChildByName('scene_1').getComponent('Scene_1').newMenuItem()
                this.closeModal()
            }, this)
            this.content.addChild(item)
        }
    },

    showModal(e) {
        this.node.active = true
        this.node.getComponent(cc.Animation).play()
    },

    closeModal() {
        this.node.active = false
    },
    start() {

    },

    // update (dt) {},
});