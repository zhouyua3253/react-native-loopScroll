# react-native-loopScroll
### react-native的轮播组件


### Examples

export default class App extends Component {

    render() {
        const IMGS = [
            'http://static.cnbetacdn.com/article/2016/0530/6615a26af8f5894.jpg',
            'http://static.cnbetacdn.com/thumb/article/2016/0530/93d62b4fcec5b8b.jpg_600x600.jpg',
            'http://static.cnbetacdn.com/article/2016/0530/66a98088343fb41.jpg',
            'http://static.cnbetacdn.com/thumb/article/2016/0530/fda245475d93736.jpg_600x600.jpg'
        ];

        return (
            <View style={styles.container}>
                <LoopScrollView
                    style={{width: WIDTH, height: 200}}
                    dataSource={IMGS}
                    renderPage={(data, index) => this._renderImage(data, index)} />
            </View>
        );
    }


    _renderImage(data, index) {
        return (
            <View key={`${index}`}>
                <Image style={{flex: 1}} source={{uri: data}} />
            </View>
        );
    }
}

