import React from 'react';
import { connect } from 'react-redux';
import CategoryList from '../../component/categorylist/categorylist.jsx';
import MessageList from '../../component/messagelist/messagelist.jsx';
import Pager from '../../component/pager/pager.jsx';
import Remarkable from 'remarkable';
import PagingParam from '../../utils/PagingParam.js';
import { scrollToTopPage } from '../../utils/HtmlUtils.js';

import {doCategoryFetch} from '../../actions/categoryActions.js';
import {doBlogPostsFetchPage} from '../../actions/blogPostActions.js';

import './blogpage.scss';

const BASE_NB_PAGE = 3;

const mapStateToProps = (state, ownProps) => {
    let blogmoduleid = state.modules.codeindex['BLOG'];
    console.log('blog', state.statistics);
    return {
        blogposts: state.blogposts.items,
        index: state.blogposts.index,
        page: ownProps.location.query.page || 0,
        categories: state.categories.items,
        categoriesindex: state.categories.moduleindex[blogmoduleid],
        statistics: state.statistics,
        blogmoduleid: blogmoduleid
    }
}

class BlogPage extends React.Component {

    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(page) {
        const { dispatch } = this.props;
        dispatch(doBlogPostsFetchPage(page, null, null, true));
        scrollToTopPage();
    }

    componentDidMount() {
        const { dispatch } = this.props
        // this.onChangePage(this.props.page);
        dispatch(doCategoryFetch(this.props.blogmoduleid));

        if (!this.props.index || this.props.index.length == 0) {
            dispatch(doBlogPostsFetchPage(this.props.page));
        }
    }

    render() {

        let msgs = this.props.blogposts && this.props.index ? <MessageList messages={this.props.blogposts} index={this.props.index} /> : null;
        let total = (this.props.statistics.tables.message ? (this.props.statistics.tables.message.blog_total_count) : 1) || 1;
        let nbPage = Math.min(BASE_NB_PAGE, Math.round(total / 3) + 1);

        return (
                <div className="row">
                    <div className="col-10">
                        <div className="list-ctn">
                            {msgs}
                        </div>
                        <div className="list-ctn">
                            <Pager callback={this.onChangePage} currentPage={this.props.page + 1} nbPage={nbPage} />
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
