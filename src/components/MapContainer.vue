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
        plugins: ['AMap.ToolBar', 'AMap.ControlBar', 'AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.Marker', 'AMap.Geolocation', 'AMap.CitySearch'] // 地图插件 根据需求从高德开放平台添加
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
            const geolocation = new Map.Geolocation({
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
            geolocation.getCurrentPosition((status: string, result: any) => {
                if (status === 'complete') {
                    const { lng, lat } = result.position;
                    console.log('Latitude:', lat);
                    console.log('Longitude:', lng);
                } else {
                    console.log('Geolocation failed:', result.message);
                }
            });
            state.value.map.on('click', clickMap);
            state.value.map.addControl(toolBar);// 放大缩小
            state.value.map.addControl(controlBar); //旋转
            state.value.map.addControl(geolocation);
        })
        .catch(err => {
            console.error(err, '加载错误提示'); //加载错误提示
        })
        .finally(() => {
            console.log("state.value.", state.value)
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

onMounted(() => {
    //组件挂载
    initMap(props.latLng); //经度lng, 纬度lat
});
</script>

<template>
    <div class="home_div">
        <div id="container"></div>
    </div>
</template>

<style scope lang="scss">
.home_div {
    height: 50vh;
    width: 100%;
    padding: 0px;
    margin: 0px;

    #container {
        height: 100%;
        width: 100%;
    }

}

#container {
    padding: 0px;
    margin: 0px;
}

html,
body,

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
