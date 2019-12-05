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
        },

        coin: {
            default: null,
            type: cc.Prefab
        },

        coin_score: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad 主要作用获取到场景中的其他节点，以及节点关联的资源数据
    onLoad() {
        // 
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')

        // this.loadRes()

        // var remoteUrl = "https://ss0.baidu.com/73F1bjeh1BF3odCf/it/u=4096285239,1793525520&fm=85&s=D386D2AA0C81E9534AB9122C0300E0F4";
        // cc.loader.load({
        //     url: remoteUrl,
        //     type: 'png'
        // }, (err, texture) => {
        //     console.log('err', err)
        //     console.log('texture', texture)
        //     var spriteFrame  = new cc.SpriteFrame(texture)
        //     // Use texture to create sprite frame
        //     this.game.map.getChildByName('scene_1').getComponent(cc.Sprite).spriteFrame = spriteFrame
        //     // console.log(this.game.map.getChildByName('scene_1').getComponent(cc.Sprite))
        // });

    },
    // 通常用于初始化一些中间状态的数据，这些数据可能在 update 时会发生改变，并且被频繁的 enable 和 disable
    start() {

    },

    /**新增一个客人 */
    newPeople() {
        let people = cc.instantiate(this.people)
        let scene_1 = this.map.getChildByName('scene_1')

        scene_1.addChild(people)
        people.getComponent('People').init()
    },

    // 新增桌子
    newMenuItem(e) {
        let tableData, idx
        // 找空地
        for (let i = 0; i < this.dataStore.tableData.length; i++) {
            if (!this.dataStore.tableData[i].itemId) {
                idx = i
                tableData = this.dataStore.tableData[i]
                break
            }
        }

        if (tableData) {
            let menu_item = cc.instantiate(this.menu_item)
            let scene_1 = this.map.getChildByName('scene_1')
            scene_1.addChild(menu_item)

            menu_item.setPosition(cc.v2(tableData.x, tableData.y))

            this.dataStore.tableData[idx].itemId = 1
            this.dataStore.tableData[idx].node = menu_item
            // 障碍物
            this.dataStore.barrier.push(menu_item)
        } else {
            console.log('已满')
        }
    },

    /**掉小鱼 */
    dropCoin(x, y) {
        let coin = cc.instantiate(this.coin)
        let scene_1 = this.map.getChildByName('scene_1')
        scene_1.addChild(coin)
        let offsetX = this.dataStore.getRandom(-10, 10)
        let offsetY = this.dataStore.getRandom(-10, 10)
        coin.setPosition(cc.v2(x + offsetX, y + offsetY))
        coin.getChildByName('inner').getComponent(cc.Animation).play()
    },



    // update (dt) {},
});