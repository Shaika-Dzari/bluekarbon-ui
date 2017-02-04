import React from 'react';
import { connect } from 'react-redux';
import CategoryList from '../../component/categorylist/categorylist.jsx';
import MessageList from '../../component/messagelist/messagelist.jsx';
import LinkPager from '../../component/pager/linkpager.jsx';
import Remarkable from 'remarkable';
import PagingParam from '../../utils/PagingParam.js';
import { scrollToTopPage } from '../../utils/HtmlUtils.js';

//import {doMessageFetchAndGo, doSwitchModule} from '../../actions/messageActions.js';
import {doCategoryFetch} from '../../actions/categoryActions.js';
import {doBlogPostsFetchPage} from '../../actions/blogPostActions.js';

import './blogpage.scss';

const mapStateToProps = (state, ownProps) => {

    return {
        blogposts: state.blogposts.items,
        index: state.blogposts.index,
        page: ownProps.location.query.page || 0,
        categories: state.categories.items,
        categoriesindex: state.categories.moduleindex[blogmoduleid]
    }
}

class BlogPage extends React.Component {

    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageParam) {
        const { dispatch } = this.props;
        dispatch(doMessageFetchAndGo(pageParam));
        scrollToTopPage();
    }

    componentDidMount() {
        const { dispatch } = this.props
        // this.onChangePage(this.props.page);
        dispatch(doCategoryFetch());

        if (!this.props.index || this.props.index.length == 0) {
            dispatch(doBlogPostsFetchPage(this.props.page));
        }
    }

    render() {

        let msgs = this.props.blogposts && this.props.index ? <MessageList messages={this.props.blogposts} index={this.props.index} /> : null;

        // <LinkPager size={5} prevdate={prevdate} nextdate={nextdate} callback={this.onChangePage} />

        return (
                <div className="row">
                    <div className="col-10">
                        <div className="list-ctn">
                            {msgs}
                        </div>
                        <div className="list-ctn">

                        </div>
                    </div>
                    <div className="col-2">
                        <div className="list-ctn">
                            <div className="info-element">
                                <h3>Catégories</h3>
                                <CategoryList categories={this.props.categories} index={this.props.categoriesindex} />
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}

export default connect(mapStateToProps)(BlogPage);
