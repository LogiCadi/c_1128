cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
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

        coin_content: {
            default: null,
            type: cc.Prefab
        },

        coin_score: {
            default: null,
            type: cc.Node,
        },

        star_score: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad 主要作用获取到场景中的其他节点，以及节点关联的资源数据
    onLoad() {
        // 
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')

        // cc.director.getCollisionManager().enabled = true

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
        //     this.game.map.getChildByName('canting').getComponent(cc.Sprite).spriteFrame = spriteFrame
        //     // console.log(this.game.map.getChildByName('canting').getComponent(cc.Sprite))
        // });

    },
    // 通常用于初始化一些中间状态的数据，这些数据可能在 update 时会发生改变，并且被频繁的 enable 和 disable
    start() {
        // 金币
        this.coin = parseInt(localStorage.getItem('coin')) || 1000
        // 星级
        this.star = parseInt(localStorage.getItem('star')) || 0
        // this.dataStore.barrier.push(this.coin_score)
        // this.dataStore.barrier.push(this.star_score)

        // 手动招揽客人进度
        this.newPeoplePercent = 0
        // 手动招揽客人每次点击增加百分比
        this.newPeopleStep = 0.2

        // 小费
        this.tipCount = parseInt(localStorage.getItem('tipCount')) || 0
        // 小费结算时间
        this.tipSettleTime = parseInt(localStorage.getItem('tipSettleTime')) || Math.round(new Date().getTime() / 1000)

        // 初始化建筑
        this.buildAll()

        this.getTip()
        this.schedule(function () {
            this.getTip()
        }, 60)
    },

    /**计算小费 */
    getTip() {
        let total = 0
        // 统计所有设施每分钟增加小费的数额
        for (const key in this.dataStore.buildData) {
            const ele = this.dataStore.buildData[key]

            if (ele.current.itemId && ele.itemList[ele.current.itemId]["增加小费"]) {
                total += parseInt(ele.itemList[ele.current.itemId]["增加小费"])
            }
        }

        let duration = Math.round(new Date().getTime() / 1000) - this.tipSettleTime
        // 储存在小费台
        this.tipCount += Math.round(duration * total / 60)
        this.tipSettleTime = Math.round(new Date().getTime() / 1000)

        localStorage.setItem('tipCount', this.tipCount)
        localStorage.setItem('tipSettleTime', this.tipSettleTime)
    },
    // 收集小费
    settleTip() {
        this.coin += this.tipCount
        this.game.canvas.getComponent('Canvas').newMsg('获得小费' + this.tipCount)
        this.tipCount = 0
    },
    buildAll() {
        for (const key in this.dataStore.buildData) {
            const ele = this.dataStore.buildData[key]

            if (ele.current.itemId) {
                let item = ele.itemList[ele.current.itemId]
                this.build(ele, item)
            }
        }
    },

    newPeopleProgress() {
        this.newPeoplePercent += this.newPeopleStep
        if (this.newPeoplePercent >= 1) {
            this.newPeoplePercent = 0
            // 来一个客人
            this.newPeople(null, 1)
        }
        cc.find('Canvas/add_people_btn/progress').getComponent(cc.ProgressBar).progress = this.newPeoplePercent
    },

    /**新增客人 */
    newPeople(e, count = 1) {
        for (let i = 0; i < count; i++) {
            this.scheduleOnce(function () {
                let people = cc.instantiate(this.people)
                let canting = this.map.getChildByName('canting')

                canting.addChild(people)
                people.getComponent('People').init()
            }, i)
        }
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
            let canting = this.map.getChildByName('canting')
            canting.addChild(menu_item)

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
    dropCoin(x, y, count, group) {
        let coin = cc.instantiate(this.coin_content)
        let canting = this.map.getChildByName('canting')
        canting.addChild(coin)

        let offsetX = this.dataStore.getRandom(-10, 10)
        let offsetY = this.dataStore.getRandom(-10, 10)
        coin.setPosition(cc.v2(x + offsetX, y + offsetY))
        // 增加的金币
        coin.count = count
        // 分组
        coin.coinGroup = group
        coin.getChildByName('inner').getComponent(cc.Animation).play()

        if (!this.dataStore.coinPool[group]) this.dataStore.coinPool[group] = []
        this.dataStore.coinPool[group].push(coin)
    },

    update(dt) {
        // 金币
        this.coin_score.getChildByName('label').getComponent(cc.Label).string = this.coin
        // 星级
        this.star_score.getChildByName('label').getComponent(cc.Label).string = this.star
        // 小费
        if (this.dataStore.buildData["101"].current.node) {
            this.dataStore.buildData["101"].current.node.getChildByName('bottom_bubble').active = this.tipCount
            this.dataStore.buildData["101"].current.node.getChildByName('bottom_bubble').getChildByName('label').getComponent(cc.Label).string = this.tipCount
        }
    },

    /**建造设施 */
    build(group, item) {
        cc.loader.loadRes('image/' + item["ID"], cc.SpriteFrame, (err, spriteFrame) => {
            let thisNode = this.dataStore.buildData[group["id"]].current.node
            if (!thisNode) {
                // 新增
                thisNode = cc.instantiate(this.menu_item)

                let scene = this.map.getChildByName(group.scene)
                scene.addChild(thisNode)
                thisNode.setPosition(cc.v2(group["position"].x, group["position"].y))
                this.dataStore.buildData[group["id"]].current.node = thisNode
                // 障碍物
                this.dataStore.barrier.push(thisNode)
            }

            thisNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
            this.dataStore.buildData[group["id"]].current.itemId = item['ID']
            this.dataStore.buildData[group["id"]]['itemList'][item["ID"]]["已购买"] = true

            // 保存到storage
            let buildData = this.dataStore.Clone(this.dataStore.buildData)
            localStorage.setItem('buildData', JSON.stringify(buildData))
        })
    }
});