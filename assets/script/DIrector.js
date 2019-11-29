cc.Class({
    extends: cc.Component,

    properties: {
        people: {
            default: null,
            type: cc.Prefab
        },
        menu_item: {
            default: null,
            type: cc.Prefab
        },
        map: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 
        cc.director.getCollisionManager().enabled = true
        this.dataStore = cc.find('Game').getComponent('DataStore')

    },

    start() {

    },

    /**新增一个客人 */
    newPeople() {
        let people = cc.instantiate(this.people)
        let scene_1 = this.map.getChildByName('scene_1')
        scene_1.addChild(people)
        people.getComponent('People').init()
    },

    newMenuItem(e) {
        let dataStore = cc.find('Game').getComponent('DataStore')
        if (dataStore.tableData[0].itemId) {
            console.log('1号已满')
        } else {
            let menu_item = cc.instantiate(this.menu_item)
            menu_item.setPosition(cc.v2(-200, 80))
            this.node.addChild(menu_item)
            dataStore.tableData[0].itemId = 1
        }

    }

    // update (dt) {},
});