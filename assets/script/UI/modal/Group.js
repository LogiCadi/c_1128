cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            type: cc.Label,
            default: null,
        },
        container: {
            type: cc.Node,
            default: null,
        },
        item: {
            default: null,
            type: cc.Prefab,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
    },

    init(data) {
        // 分组标题
        this.title.string = data.title
        // 分组item
        for (const key in data["itemList"]) {
            const ele = data["itemList"][key];

            let item = cc.instantiate(this.item)
            this.container.addChild(item)
            
            item.type = 'build'
            item.groupData = data
            item.infoData = ele

            item.getChildByName('menu_item').getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList[ele["ID"]]
        }
        // group.title.string = ele.title
    },

    start() {

    },

    // update (dt) {},
});