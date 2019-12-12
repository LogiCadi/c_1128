cc.Class({
    extends: cc.Component,

    properties: {
        group: {
            default: null,
            type: cc.Prefab,
        },
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
        // this.loadData()
    },
    start() {

    },

    init(type = 'build') {
        this.content.removeAllChildren()
        if (type == 'build') {
            this.node.getChildByName('wrap').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList["菜单栏"]
            for (const key in this.dataStore.buildData) {
                const ele = this.dataStore.buildData[key]

                let group = cc.instantiate(this.group)
                this.content.addChild(group)

                group.getComponent('Group').init(ele)
            }
        } else if (type == 'dish') {
            this.node.getChildByName('wrap').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList["菜谱"]

            for (const key in this.dataStore.dish) {
                const ele = this.dataStore.dish[key]

                let item = cc.instantiate(this.item)
                this.content.addChild(item)

                item.type = 'dish'
                item.infoData = ele

                item.getChildByName('menu_item').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList[ele["ID"]]

                // item.getComponent('Item').init()
            }
        }

    },

    topClick(e, c) {
        this.init(c)
    },

    loadData() {
        // 加载列表group
        for (let index = 0; index < 5; index++) {
            let group = cc.instantiate(this.group)
            this.content.addChild(group)
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