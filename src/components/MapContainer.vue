<script setup lang="ts" name="Map">
import AMapLoader from '@amap/amap-jsapi-loader'; // 地图map
const props = defineProps({
    latLng: {
        //设置地图中心点[经度，维度]，默认使用当前定位
        type: Array,
        default: () => [],
        required: false
    }
});

// /**实际生产中不要用 此处仅测试 具体实际使用方法看官网*/
// (window as any)._AMapSecurityConfig = {
//     securityJsCode: 'd768faa4dd1f2644977c989b3aee226e' // 应用生成的秘钥
// };

const searchValue: any = ref('');
const AMap: any = ref();
const state: any = ref({
    map: null,
    placeSearch: null,
    autoComplete: null,
    marker: null,
    form: {
        address: '',
        lng: '',
        lat: ''
    }
});

// 地图初始化
const initMap = (latlng: any[]) => {
    // 参数为中心点经纬度坐标
    AMapLoader.load({
        key: 'a0e0ebabac17b0282d882728bd676a8d',
        version: '2.0',
        plugins: ['AMap.ToolBar', 'AMap.ControlBar', 'AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.Marker', 'AMap.Geolocation'] // 地图插件 根据需求从高德开放平台添加
    })
        .then((Map: any) => {
            AMap.value = Map;
            state.value.map = new Map.Map('container', {
                viewMode: '3D', //  是否为3D地图模式
                zoom: 10, //  地图显示的缩放级别
                zooms: [2, 22], // 地图缩放范围
                center: latlng.length > 0 ? latlng : '', //  地图中心点坐标
                resizeEnable: true //  是否监控地图容器尺寸变化
            });
            // 地图放大缩小插件
            let toolBar = new Map.ToolBar({
                position: {
                    top: '120px',
                    right: '51px'
                }
            });
            // 3D地图插件
            let controlBar = new Map.ControlBar({
                position: {
                    top: '20px',
                    right: '20px'
                }
            });
            state.value.geoCoder = new Map.Geocoder({
                city: '全国', // 默认：“全国”
                radius: 10// 范围，默认：500
            });
            state.value.autoComplete = new Map.AutoComplete({ city: '全国' });
            state.value.placeSearch = new Map.PlaceSearch({
                map: state.value.map
            });
            let geolocation = new Map.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                maximumAge: 0, //定位结果缓存0毫秒，默认：0
                convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true, //显示定位按钮，默认：true
                buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new Map.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            state.value.map.on('click', clickMap);
            state.value.map.addControl(toolBar);
            state.value.map.addControl(controlBar); // 添加右上角的放大缩小
            if (latlng.length === 0) {
                state.value.map.addControl(geolocation);
                geolocation.getCurrentPosition();
            }
        })
        .catch(err => {
            console.error(err, '加载错误提示'); //加载错误提示
        })
        .finally(() => {
            AMap.value.convertFrom(props.latLng, 'gps', (status: String, result: any) => {
                if (status === 'complete' && result.info === 'ok') {
                    state.value.form.lng = result.locations[0].lng;
                    state.value.form.lat = result.locations[0].lat;
                    nextTick(() => {
                        removeMarker();
                        setMapMarker();
                    });
                }
            });
        });
};

// 地图点击事件
const clickMap = (e: any) => {
    console.log(e, 'e');
    if (!e && !e.lnglat) return;
    state.value.form.lng = e.lnglat.lng;
    state.value.form.lat = e.lnglat.lat;
    regeocoder();
    removeMarker(); // 先删除地图上标记点
    setMapMarker(); // 在添加新的标记点
};

// 关键字搜索
const seachAddress = () => {
    if (searchValue.value === '') return alert('请输入地址');
    //清除地图上的覆盖物
    state.value.map.clearMap();
    state.value.map.plugin('AMap.PlaceSearch', () => {
        let placeSearch = new AMap.value.PlaceSearch({
            city: '010', // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
            map: state.value.map,
            // type: "", //数据类别
            // pageSize: 10, //每页结果数,默认10
            // pageIndex: 1, //请求页码，默认1
            extensions: 'base' //返回信息详略，默认为base（基本信息）
        });
        placeSearch.search(searchValue.value, (status: String, result: any) => {
            if (status === 'complete' && result.info === 'ok') {
                console.log(result, '//查询成功时，result即对应匹配的POI信息');
                let pois = result.poiList.pois; // 查询成功时，result即对应匹配的POI信息
                pois.forEach((item: any) => {
                    state.value.map.add(
                        // 将创建的点标记添加到已有的地图实例：
                        new AMap.value.Marker({
                            position: item.location, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            title: item.name
                        })
                    );
                });
                state.value.map.setFitView();
                AMap.value.Event.addListener(placeSearch, 'markerClick', (result: any) => {
                    //经纬度
                    state.value.form.lng = result.event.lnglat.lng;
                    state.value.form.lat = result.event.lnglat.lat;
                    toGetAddress();
                });
            }
        });
    });
};

// 筛选查询
const searchCoord = (data: any) => {
    if (data) {
        //清除地图上的覆盖物
        state.value.map.clearMap();
        state.value.map.setCenter([data.records[0].longitude, data.records[0].latitude]);
        state.value.map.setZoom(11);
        let marker = [];
        for (let index = 0; index < data.records.length; index++) {
            let poi = data.records[index];
            // 其他坐标转J02坐标
            let gps = [poi.longitude, poi.latitude];
            AMap.value.convertFrom(gps, 'gps', (status: any, result: any) => {
                if (result.info === 'ok') {
                    poi.longitude = result.locations[0].lng;
                    poi.latitude = result.locations[0].lat;
                }
            });
            marker[index] = new AMap.value.Marker({
                position: [poi.longitude, poi.latitude],
                title: poi.locationName
            });
            // 将创建的点标记添加到已有的地图实例：
            state.value.map.add(marker[index]);
            let content = [];
            if (poi.personInCharge) {
                content.push('负责人: ' + poi.personInCharge + '');
            }
            marker[index].content = content;
            marker[index].title = poi.locationName;
            marker[index].on('click', showInfoWindow);
            state.value.map.off('click', clickMap);
        }
    }
};

// 自定义窗体
const showInfoWindow = (e: any) => {
    //实例化信息窗体
    let title = e.target.title,
        content = e.target.content;
    let infoWindow = new AMap.value.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: createInfoWindow(title, content.join('<br/>')),
        closeWhenClickMap: true,
        offset: new AMap.value.Pixel(16, -45)
    });
    infoWindow.open(state.value.map, e.target.getPosition());
};

//构建自定义信息窗体
const createInfoWindow = (title: any, content: any) => {
    let info = document.createElement('div');
    info.className = 'custom-info input-card content-window-card';

    //可以通过下面的方式修改自定义窗体的宽高
    info.style.width = '400px';
    // 定义顶部标题
    let top = document.createElement('div');
    let titleD = document.createElement('div');
    top.className = 'info-top';
    titleD.innerHTML = title;
    top.appendChild(titleD);
    info.appendChild(top);

    // 定义中部内容
    let middle = document.createElement('div');
    middle.className = 'info-middle';
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    let bottom = document.createElement('div');
    bottom.className = 'info-bottom';
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    // let sharp = document.createElement("img");
    // sharp.src = "https://webapi.amap.com/images/sharp.png";
    // bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
};

// 下拉选中查询
const select = (e: any) => {
    state.value.placeSearch.setCity(e.poi.adcode);
    state.value.placeSearch.search(e.poi.name); //关键字查询查询
};

// 设置标记
const setMapMarker = () => {
    if (state.value.form.lng == '' && state.value.form.lat == '') {
        return;
    }
    state.value.map.setFitView();
    state.value.marker = new AMap.value.Marker({
        map: state.value.map,
        position: [state.value.form.lng, state.value.form.lat]
    });
    toGetAddress();
    state.value.map.add(state.value.marker);
    state.value.map.setFitView();
};

// 清除标记
const removeMarker = () => {
    if (state.value.marker) {
        state.value.map.remove(state.value.marker);
    }
};

// 坐标位置转换
const regeocoder = () => {
    let lnglat = [state.value.form.lng, state.value.form.lat];
    state.value.geoCoder.getAddress(lnglat, (status: any, result: any) => {
        if (status === 'complete' && result.regeocode) {
            state.value.form.address = result.regeocode.formattedAddress; // 返回位置信息
        }
    });
};

// 获取地址
const toGetAddress = () => {
    let lnglat = [state.value.form.lng, state.value.form.lat];
    state.value.geoCoder.getAddress(lnglat, (status: any, result: any) => {
        if (status === 'complete' && result.regeocode) {
            // 此处写处理逻辑
        }
    });
};

const toGetCoordinate = () => {
    let address = state.value.form.address;
    state.value.geocoder.getLocation(address, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
            initMap([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);
            state.value.form.lng = result.geocodes[0].location.lng;
            state.value.form.lat = result.geocodes[0].location.lat;
            state.value.form.address = result.geocodes[0].formattedAddress;
        }
    });
    nextTick(() => {
        removeMarker();
        setMapMarker();
    });
};

onMounted(() => {
    //组件挂载
    initMap(props.latLng); //经度lng, 纬度lat
});
</script>

<template>
    <div class="home_div">
        <div id="search">
            <input v-model="searchValue" @keyup.enter="seachAddress" id="tipinput" placeholder="请输入要搜索的位置" style="width: 200px; margin: -1px 2px 0 12px" />
            <button @click="seachAddress">查询</button>
        </div>
        <div id="container" style="height: 100vh; width: 100%"></div>
    </div>
</template>

<style scope>
.home_div {
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;

}

#container {
    padding: 0px;
    margin: 0px;
}

html,
body,
#container {
    height: 100%;
    width: 100%;
}

.content-window-card {
    position: relative;
    box-shadow: none;
    bottom: 0;
    left: 0;
    width: auto;
    padding: 0;
}

.content-window-card p {
    height: 2rem;
}

.custom-info {
    border: solid 1px silver;
}

div.info-top {
    position: relative;
    background: none repeat scroll 0 0 #f9f9f9;
    border-bottom: 1px solid #ccc;
    border-radius: 5px 5px 0 0;
}

div.info-top div {
    display: inline-block;
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
    padding: 0 10px;
}

div.info-top img {
    position: absolute;
    top: 10px;
    right: 10px;
    transition-duration: 0.25s;
}

div.info-top img:hover {
    box-shadow: 0px 0px 5px #000;
}

div.info-middle {
    font-size: 12px;
    padding: 10px 6px;
    line-height: 20px;
}

div.info-bottom {
    height: 0px;
    width: 100%;
    clear: both;
    text-align: center;
}

div.info-bottom img {
    position: relative;
    z-index: 104;
}

span {
    margin-left: 5px;
    font-size: 11px;
}

.info-middle img {
    float: left;
    margin-right: 6px;
}
</style>
