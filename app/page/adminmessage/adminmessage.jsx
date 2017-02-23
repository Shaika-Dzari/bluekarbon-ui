import React from 'react';
import {Link, withRouter} from 'react-router';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import {doMessageFetch, doMessageFetchForEdit, doMessageEditAndNavigate, doFilterAndNavigate, doSwitchModule} from '../../actions/messageActions.js';
import {MODULE_URLS, routeToModuleCode} from '../../actions/navigationActions.js';
import {doBlogPostsAdminFetchPage, doBlogPostsFetchAndEdit} from '../../actions/blogPostActions.js';

import Table from '../../component/table/table.jsx';
import Pager from '../../component/pager/pager.jsx';

import './adminmessage.scss';

const ADMIN_PAGE_SIZE = 10;

const mapStateToProps = (state, ownProps) => {
    let messageType = ownProps.params.messageType;
    let page = ownProps.location.query.page || 0;
    let baseUrl = MODULE_URLS.admin[routeToModuleCode(messageType)];
    let modules = state.modules;

    let stateprops = {
        locale: state.language.locale,
        messageType: messageType,
        page: page,
        baseUrl: baseUrl,
        modules: modules,
        statistics: state.statistics
    };
    let items, index, loadfunc;

    // items, index and functions
    if (messageType == 'blogposts') {
        stateprops.items = state.blogposts.items;
        stateprops.index = state.blogposts.index || [];
        stateprops.statskey = 'blog_total_count';
    } // Do others

    return stateprops;
}

const funcs = {
    blogposts: {
        load: doBlogPostsAdminFetchPage,
        edit: doBlogPostsFetchAndEdit
    }
}

const FilterMenu = ({modules, callback, locale}) => {
    let filters = [];
    if (modules) {
        modules.index.forEach(i => {
            let m = modules.items[i];
            if (m.enablemodule) {
                filters.push(<a href="#" onClick={callback} data-bk-module-code={m.code} className="link" key={'filter-' + m.code}>{m.name}</a>);
            }
        });
    }

    return (
        <div className="right filtermenu">
            Filters: {filters}
        </div>
    );
}

const CreateMenu = ({modules, callback, locale}) => {
    let creators = [];

    if (modules) {

        modules.index.forEach(i => {
            let m = modules.items[i];

            if (m.enablemodule) {
                creators.push(<button className="btn" onClick={callback} data-bk-module-id={m.id} key={'creator-' + m.code}>{'New ' + m.name}</button>)
            }
        });
    }

    return (
        <div>
            {creators}
        </div>
    );
}

class AdminMessage extends React.Component {

    constructor(props) {
        super(props);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.onMessageClick = this.onMessageClick.bind(this);
        this.onFilterClick = this.onFilterClick.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        const { dispatch, index } = this.props;
        if (!index || index.length == 0) {
            dispatch(funcs[this.props.messageType].load(0, ADMIN_PAGE_SIZE, null, true, ['published=all']));
        }
    }

    onNewMessage(event) {
        let target = event.target;
        event.preventDefault();
        const { dispatch } = this.props;

        let moduleid = target.dataset.bkModuleId;

        dispatch(funcs[this.props.messageType].edit('new', moduleid));
        dispatch(push(this.props.baseUrl + '/new'));
    }

    onMessageClick(messageId) {
        const { dispatch } = this.props;
        dispatch(funcs[this.props.messageType].edit(messageId));
        dispatch(push(this.props.baseUrl + '/' + messageId));
    }

    onFilterClick(e) {
        let mc = e.currentTarget || e.target;
        e.preventDefault();
        const { dispatch } = this.props;

        let messageType = mc.dataset.bkModuleCode;

        // messageType
        let url = MODULE_URLS.admin[routeToModuleCode(messageType.toLowerCase())];

        dispatch(push(url));
    }

    onChangePage(page) {
        const { dispatch } = this.props;
        dispatch(funcs[this.props.messageType].load(page, ADMIN_PAGE_SIZE, null, true, ['published=all']));
    }

    render() {
        const { moduleid } = this.props;
        let index = this.props.index;
        let msgs = this.props.items;
        let total = this.props.statistics.tables.message[this.props.statskey] || 1;
        let nbPage = Math.min(ADMIN_PAGE_SIZE, Math.round(total / ADMIN_PAGE_SIZE));


        let rows = index.map(i => {
            let m = msgs[i];
            return (
                <a href={'/dashboard/messages/' + this.props.messageType + '/' + m.id} key={'ad-msg-' + m.id} className="message-link row" onClick={(e) => { e.preventDefault(); this.onMessageClick(m.id);}}>
                    <div className="col-1">{m.id}</div>
                    <div className="col-7"><span className="link">{m.title}</span></div>
                    <div className="col-4">{m.createdat} - {m.published ? 'Published' : 'Unpublished'}</div>
                </a>
            );
        });

        return (
            <div>
                <div className="box bluebox">
                    <div className="heading">
                        <div className="row">
                            <div className="col-6">
                                <h4>Messages</h4>
                            </div>
                            <div className="col-6 right">
                                <CreateMenu modules={this.props.modules} callback={this.onNewMessage} locale={this.props.locale} />
                            </div>
                        </div>
                    </div>
                    <div className="body">

                        <FilterMenu modules={this.props.modules} callback={this.onFilterClick} locale={this.props.locale} />

                        <div className="message-table">
                            <div className="row header">
                                <div className="col-1"><span>ID</span></div>
                                <div className="col-7"><span>Title</span></div>
                                <div className="col-4"><span>Informations</span></div>
                            </div>
                            {rows}
                        </div>

                    </div>
                    <div className="footer">
                        <Pager callback={this.onChangePage} currentPage={this.props.page + 1} nbPage={nbPage} />
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps)(withRouter(AdminMessage));
