import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '../../component/alertbox/alertbox.jsx';
import Editor from '../../component/editor/editor.jsx';
import CategoryEditor from '../../component/categoryeditor/categoryeditor.jsx';
import Clipboard from '../../component/clipboard/clipboard.jsx';

import {doMessageEditorTitleChange, doMessageEditorTitleBlur,
        doMessageEditorPrettyUrlChange, doMessageEditorTextChange,
        doMessageEditorPublishedCheck, doMessageEditorCategoryCheck,
        doMessageEditorCategoryUnCheck,
        doMessageEditorSave} from '../../actions/messageActions.js';

import {doBlogPostsSave, doBlogPostsEdrTextChange, doBlogPostsEdrTitleChange,
        doBlogPostsEdrTitleBlur, doBlogPostsEdrPrettyUrlChange,
        doBlogPostsEdrPublishedCheck, doBlogPostsEdrCategoryCheck} from '../../actions/blogPostActions.js';

import './messageeditor.scss';

const MESSAGE_URL = '/api/messages';

const mapStateToProps = (state, ownProps) => {
    let id = ownProps.params.messageId;
    let messageType = ownProps.params.messageType;

    let clipboards = [];
    let buffer = state.files.buffer;

    if (buffer) {
        clipboards = buffer.map(b => {
            let el = state.files.items[b];
            return {
                id: b,
                name: el.name,
                value: el.filepath
            };
        });
    }

    // State to return
    let stateprops = {
        entityId: id,
        messageType: messageType,
        error: state.messages.error,
        clipboardElements: clipboards
    };

    // items, index and functions
    if (messageType == 'blogposts') {

        stateprops.entity = state.blogposts.items[id];
        stateprops.module = state.modules.codeindex['BLOG'];

        // Funcs
        stateprops.savefunc = doBlogPostsSave;
        stateprops.textChangeFunc = doBlogPostsEdrTextChange;
        stateprops.titleChangeFunc = doBlogPostsEdrTitleChange;
        stateprops.titleBlurFunc = doBlogPostsEdrTitleBlur;
        stateprops.prettyUrlChangeFunc = doBlogPostsEdrPrettyUrlChange;
        stateprops.publishedCheckFunc = doBlogPostsEdrPublishedCheck;
        stateprops.categoryCheckFunc = doBlogPostsEdrCategoryCheck;

    } // Do others


    return stateprops;

};

class MessageEditor extends React.Component {

    constructor(props) {
        super(props);
        this.onEditorChange = this.onEditorChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTitleBlur = this.onTitleBlur.bind(this);
        this.onPrettyUrlChange = this.onPrettyUrlChange.bind(this);
        this.onPublishedClick = this.onPublishedClick.bind(this);
        this.onCategorySelect = this.onCategorySelect.bind(this);
        this.onCategoryUnSelect = this.onCategoryUnSelect.bind(this);
    }

    onEditorChange(value) {
        const { dispatch } = this.props;
        dispatch(this.props.textChangeFunc(value));
    }

    onTitleChange(event) {
        let v = event.target.value;
        const { dispatch } = this.props;
        dispatch(this.props.titleChangeFunc(v));
    }

    onPrettyUrlChange(event) {
        let v = event.target.value;
        const { dispatch } = this.props;
        dispatch(this.props.prettyUrlChangeFunc(v));
    }

    onTitleBlur(event) {
        let v = event.target.value;
        const { dispatch } = this.props;
        dispatch(this.props.titleBlurFunc(v));
    }

    onPublishedClick(event) {
        let target = event.target;
        event.preventDefault();
        let pub = target.dataset.n4Value;
        const { dispatch } = this.props;
        dispatch(this.props.publishedCheckFunc(pub == 'true'));
    }

    onCategorySelect(category) {
        const { dispatch } = this.props;
        dispatch(this.props.categoryCheckFunc(category));
    }

    onCategoryUnSelect(category) {
        const { dispatch } = this.props;
        dispatch(this.props.categoryCheckFunc(category));
    }

    onSave(event) {
        const { dispatch } = this.props;
        dispatch(this.props.savefunc());
    }

    render() {

        return (
            <div className="message-editor-ctn box bluebox">
                <div className="heading">
                    <div className="row">
                        <div className="col-6">
                            <h4>#{this.props.entityId} - {this.props.entity.title} - {this.props.module.name}</h4>
                        </div>
                        <div className="col-6 right">
                            {this.props.entity.published ? <button className="btn" onClick={this.onPublishedClick} data-n4-value="false">Retirer</button> :
                                                    <button className="btn" onClick={this.onPublishedClick} data-n4-value="true">Publier</button>
                            }

                            <button className="btn" onClick={this.onSave}>Sauvegarder</button>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <AlertBox message={this.props.error} />
                    <div className="row">
                        <div className="col-9">
                            <div className="box">
                                <div className="body">
                                    <div className="frm">
                                        <label htmlFor="msg-title">Titre</label>
                                        <input type="text" value={this.props.entity.title} onChange={this.onTitleChange} onBlur={this.onTitleBlur} id="msg-title" />
                                        <label htmlFor="msg-url">URL</label>
                                        <input type="text" value={this.props.entity.prettyurl} onChange={this.onPrettyUrlChange} id="msg-url" />
                                        <label htmlFor="msg-text">Message</label>
                                        <Editor value={this.props.entity.body} onEditorChange={this.onEditorChange} id="msg-text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="box">
                                <div className="body">
                                    {this.props.module.enablecategory ?
                                        <CategoryEditor onComponentSelect={this.onCategorySelect}
                                                        onComponentUnSelect={this.onCategoryUnSelect}
                                                        selectedItems={this.props.entity.categories}
                                                        moduleid={this.props.module.id} />
                                        :
                                        null
                                    }
                                    <Clipboard elements={this.props.clipboardElements} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps)(MessageEditor);