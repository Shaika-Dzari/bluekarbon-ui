import React, {PropTypes} from 'react';

import './pager.scss';

const PagerButton = ({callback, page, isselected, children}) => {

    // pager-btn-page-select
    let className = isselected ? 'pager-btn-page pager-btn-page-select' : 'pager-btn-page';

    return (
        <button onClick={() => callback(page)} className={className}>
            {children}
        </button>
    );
}

const Pager = ({callback, currentPage, nbPage}) => {

    let startPage = Math.max(currentPage - 3, 1);
    let endPage = startPage + nbPage;
    let btns = [];
    for (let i = startPage; i <= endPage; i++) {
        btns.push(<PagerButton key={'pager-btn-' + i} callback={callback} page={i} isselected={currentPage == i}>{i}</PagerButton>);
    }

    return (
        <div className="pager">
            {btns}
        </div>
    );
}

Pager.propTypes = {
    callback: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    nbPage: PropTypes.number
};


export default Pager;