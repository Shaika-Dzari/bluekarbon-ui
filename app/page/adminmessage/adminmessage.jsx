import React from 'react';
import {Link, withRouter} from 'react-router';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import {doMessageFetch, doMessageFetchForEdit, doMessageEditAndNavigate, doFilterAndNavigate, doSwitchModule} from '../../actions/messageActions.js';
import {MODULE_URLS} from '../../actions/navigationActions.js';
import {doBlogPostsAdminFetchPage, doBlogPostsFetchAndEdit} from '../../actions/blogPostActions.js';

import Table from '../../component/table/table.jsx';
import PagingParam from '../../utils/PagingParam.js';
import LinkPager from '../../component/pager/linkpager.jsx';

import './adminmessage.scss';

const ADMIN_PAGE_SIZE = 10;

const mapStateToProps = (state, ownProps) => {
    let messageType = ownProps.params.messageType;
    let page = ownProps.location.query.page || 0;
    let baseUrl = MODULE_URLS.admin[messageType];
    let modules = state.modules;

    let stateprops = {
        messageType: messageType,
        page: page,
        baseUrl: baseUrl,
        modules: modules
    };
    let items, index, loadfunc;

    // items, index and functions
    if (messageType == 'blogposts') {
        stateprops.items = state.blogposts.items;
        stateprops.index = state.blogposts.index || [];
        stateprops.loadfunc = doBlogPostsAdminFetchPage;
        stateprops.editfunc = doBlogPostsFetchAndEdit;
    } // Do others

    return stateprops;
}

class AdminMessage extends React.Component {

    constructor(props) {
        super(props);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.onMessageClick = this.onMessageClick.bind(this);
        this.onFilterClick = this.onFilterClick.bind(this);
    }

    componentDidMount() {
        const { dispatch, index } = this.props;
        if (!index || index.length == 0) {
            dispatch(this.props.loadfunc(0, ADMIN_PAGE_SIZE, null, true, ['published=all']));
        }
    }

    onNewMessage(event) {
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(this.props.editfunc('new'));
        dispatch(push(this.props.baseUrl + '/new'));
    }

    onMessageClick(messageId) {
        const { dispatch } = this.props;
        dispatch(this.props.editfunc(messageId));
        dispatch(push(this.props.baseUrl + '/' + messageId));
    }

    onFilterClick(e) {
        let mc = e.currentTarget || e.target;
        let messageType = mc.dataset.bkMessageType;
        e.preventDefault();
        const { dispatch } = this.props;

        // messageType
        let url = MODULE_URLS.admin[messageType];

        dispatch(push(url));

    }

    render() {
        const { moduleid } = this.props;
        let index = this.props.index;
        let msgs = this.props.items;

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

        let filters = [];
        let creators = [];

        this.props.modules.index.forEach(i => {
            let m = this.props.modules.items[i];

            if (m.enablemodule) {
                filters.push(<a href="#" onClick={this.onFilterClick} data-n4-module-id={m.id} className="link" key={'filter-' + m.code}>{m.name}</a>);
                creators.push(<button className="btn" onClick={this.onNewMessage} data-n4-module-id={m.id} key={'creator-' + m.code}>{'New ' + m.name}</button>)
            }

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
                                {creators}
                            </div>
                        </div>
                    </div>
                    <div className="body">

                        <div className="right filtermenu">
                            Filters: {filters}
                        </div>

                        <div className="message-table">
                            <div className="row header">
                                <div className="col-1"><span>ID</span></div>
                                <div className="col-7"><span>Title</span></div>
                                <div className="col-4"><span>Informations</span></div>
                            </div>
                            {rows}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps)(withRouter(AdminMessage));
