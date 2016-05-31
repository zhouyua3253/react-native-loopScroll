/**
 * Created by zhou on 16/5/29.
 */

import React, {Component, PropTypes} from 'react';
/**
 * https://github.com/zbtang/React-Native-ViewPager
 */
import IndicatorViewPager from './IndicatorViewPager'
import PagerDotIndicator from './PagerDotIndicator'

const LOOP_INTERVAL = 4500; // 滚动间隔

export default class LoopScrollView extends Component {

    static propTypes = {
        ...IndicatorViewPager.propTypes,
        dataSource: PropTypes.array.isRequired,
        renderPage: PropTypes.func.isRequired // (data: any: index: number) => <View>...</View>
    };

    constructor(props) {
        super(props);

        this.dataSource = this.props.dataSource;
        this.subViewCount = this.dataSource.length;
        if (this.subViewCount > 1) {
            this.dataSource.push(this.dataSource[0]); // 末尾添加第一个元素
            this.dataSource.unshift(this.dataSource[this.subViewCount - 1]); // 开头添加原来最后的元素
        }
    }

    render() {
        const subViews = this.dataSource.map((data, index) => this.props.renderPage(data, index));

        return (
            <IndicatorViewPager
                {...this.props}
                ref={view => this._viewPager = view}
                indicator={this._renderDotIndicator()}
                initialPage={this.subViewCount > 1 ? 1 : 0}
                onPageSelected={event => this._onPageChanged(event)}
                onPageScroll={() => this._onPageScroll()}
            >
                {subViews}
            </IndicatorViewPager>
        )
    }

    _renderDotIndicator() {
        return this.subViewCount > 1 ? <PagerDotIndicator pageCount={this.subViewCount}/> : null;
    }

    componentDidMount() {
        const position = this.subViewCount > 1 ? 1 : 0;
        this._onPageChanged({position});
    }

    /**
     * android 的onPageChanged回调在onPageScroll回调之前
     * android 的onPageChanged回调在onPageScroll回调之后
     */
    _onPageChanged(event) {
        if (this.subViewCount <= 1) {
            return;
        }

        const index = event.position;
        const isFirst = index === 0;
        const isLast = index + 1 >= this.dataSource.length;
        this.nextIndex = isLast ? 2 : index + 1;

        if(isFirst) {
            this._viewPager.setPageWithoutAnimation(this.dataSource.length - 2);
            this._viewPager.setPageDotIndicatorActivity(this.subViewCount - 1);
        }
        else if(isLast) {
            setTimeout(() => {
                this._viewPager.setPageWithoutAnimation(1);
                this._viewPager.setPageDotIndicatorActivity(0);
            }, 80);
        }
        else {
            this._viewPager.setPageDotIndicatorActivity(index - 1);
        }
    }

    _onPageScroll() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => this._viewPager.setPage(this.nextIndex), LOOP_INTERVAL);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
}