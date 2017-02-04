import React, {PropTypes} from 'react';

const Table = ({cdef, items, linkTo}) => {

    var rows = null;
    var cdef = cdef;

    if (Array.isArray(items)) {
        rows = items.map((v, i) => {

            let name = null;
            let id = v[cdef.id];

            if (linkTo) {
                //let link = linkTo + "/" + v[cdef.id];
                name = <a href="#" onClick={(e) => { e.preventDefault(); linkTo(id);}}>{v[cdef.name]}</a>
                //name = <Link to={link}>{v[cdef.name]}</Link>;
            } else {
                name = v[cdef.name];
            }

            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{v[cdef.rowdate]}</td>
                </tr>
            );
        });
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
};

Table.propTypes = {
    cdef: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        rowdate: PropTypes.string,
        link: PropTypes.string
    }).isRequired,
    items: PropTypes.array,
    linkTo: PropTypes.func
};

export default Table;